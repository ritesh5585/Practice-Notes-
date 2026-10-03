# React — Connecting Everything
### · "Why did that happen, and how do I fix it?"

**The mindset shift**

| Beginner asks | Intermediate asks |
|---|---|
| "Which Hook do I use?" | "Who owns this data?" |
| "Why isn't it updating?" | "What exactly caused (or didn't cause) a render?" |
| "How do I make it faster?" | "What's the actual bottleneck, and did my fix prove itself?" |

> The ONYX examples are *illustrative or proposed architecture*, not your real code. Share your files and I'll swap in the real ones.

---

## 1. Follow one click through the whole app

Everything in React is a piece of this journey. Let's follow **"Add to Cart"** in ONYX from finger to pixel.

```
 1. USER           clicks "Add to cart"
 2. EVENT          onClick handler runs (in ProductCard)
 3. DISPATCH       handler calls dispatch(addToCart(...))      ← store / state update
 4. SERVICE        thunk calls cartService.addItem(...)         ← API logic lives here
 5. NETWORK        POST /cart/items  →  server validates, saves, replies with new cart
 6. RESPONSE       thunk returns the server's cart
 7. STATE UPDATE   reducer stores the new cart in the store
 8. NOTIFY         React is told: "subscribers of cart changed"
 9. RENDER         Header (reads count), CartPage (reads items) run again
10. RECONCILE      React diffs new JSX against previous
11. COMMIT         only the badge text / list rows change in the real DOM
12. PAINT          browser draws → user sees "Cart: 3"
13. EFFECTS        any effects whose dependencies changed run (e.g., toast timer)
```

### The same flow in code *(proposed architecture)*

```jsx
// services/cartService.js        ← only place that knows the URL & HTTP details
export const addItem = (productId, qty) => api.post("/cart/items", { productId, qty });

// features/cart/cartSlice.js
export const addToCart = createAsyncThunk("cart/add", async ({ productId, qty }) => {
  const { data } = await addItem(productId, qty);
  return data;                                  // server is the source of truth
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => b
    .addCase(addToCart.pending,   (s) => { s.status = "loading"; })
    .addCase(addToCart.fulfilled, (s, a) => { s.status = "idle"; s.items = a.payload.items; })
    .addCase(addToCart.rejected,  (s, a) => { s.status = "error"; s.error = a.error.message; }),
});

// components/ProductCard.jsx
function AddToCartButton({ productId }) {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(addToCart({ productId, qty: 1 }))}>Add to cart</button>;
}

// components/Header.jsx
function CartBadge() {
  const count = useSelector((s) => s.cart.items.length);   // select a primitive: cheap & precise
  return <span>Cart: {count}</span>;
}
```

### Who played which role?

| Concept | Role in the click |
|---|---|
| **Component / props** | `ProductCard` receives `productId`; `CartBadge` shows the count |
| **Event** | Starts everything |
| **Store (Redux)** | Holds cart so Header, CartPage, Checkout all agree |
| **Service layer** | Hides URL/headers/auth from components |
| **Server** | Source of truth (price, stock, validation) |
| **Selector** | Lets `CartBadge` re-render *only* when the count changes |
| **Render → commit** | Turns new state into minimal DOM changes |

### Design smells hidden in this tiny flow
- **One global `status`** disables *every* Add button while one is loading. Track pending per item, or let a mutation library handle it.
- **Waiting for the server** feels slow. **Optimistic update**: update the UI first, roll back on failure. (React 19 has `useOptimistic`; TanStack Query has `onMutate`.)
- **No auth?** The request will fail. Who handles that? (Section 7.)

---

## 2. "Who owns this data?" The most important question

Most React pain comes from **state in the wrong place or the wrong kind of tool for the data**. Classify first, choose second.

| Kind of data | Example (ONYX) | Natural home |
|---|---|---|
| **UI state** (one component) | Is dropdown open? Hover? | `useState` inside that component |
| **Form state** | Checkout address fields | Local state or `react-hook-form` |
| **Shared client state** | Cart, wishlist, theme, auth user | Context / Redux Toolkit / Zustand |
| **Server state** | Product list, order history | TanStack Query / RTK Query (cache + refetch + dedupe) |
| **URL state** | Search term, filters, page, selected tab | Router (`useSearchParams`, route params) |
| **Derived data** | Cart total, filtered list, item count | **Calculated during render**, not stored |

### The decision tree
```
Does only ONE component use it?                → useState in that component
Do a few nearby components share it?           → lift to their closest common parent
Is it deep in the tree but changes rarely?     → Context
Many unrelated places, frequent updates,
  need debugging/middleware?                   → Redux Toolkit (or Zustand for lighter)
Does it come from a server?                    → server-state library, NOT hand-rolled useEffect + useState
Should it survive refresh / be shareable?      → URL
Can I compute it from other state?             → don't store it
```

> **Server state ≠ client state.** The server owns it; you're holding a *cached copy that can go stale*. That's why it needs caching, refetching, and invalidation, features Redux alone doesn't give you.

### Why the "derived data" rule matters (with a bug)
```jsx
// ❌ three sources of truth that must stay in sync
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);
const [total, setTotal] = useState(0);
// Add an item, forget setTotal in ONE code path → UI lies.

// ✅ one source of truth
const [items, setItems] = useState([]);
const count = items.length;
const total = items.reduce((s, i) => s + i.price * i.qty, 0);
```

---

## 3. Rendering, properly understood

### 3.1 The three-phase rule (recap with teeth)
```
TRIGGER → RENDER (call your functions) → COMMIT (touch DOM) → [browser paints]
```
- A component "rendering" = its function ran. Cheap-ish, but not free.
- The DOM is touched only in **commit**, and only where something changed.
- A render that produces identical output changes **nothing** on screen, but it still **cost CPU**. Unnecessary renders are a *performance* topic, not a *correctness* bug.

### 3.2 Why children re-render when the parent does
React doesn't ask "did this child's props change?" by default. It asks "did the parent render? Then render the children too."

```jsx
function Parent() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <ExpensiveList />        {/* re-renders on every click, even with no props */}
    </>
  );
}
```
Three ways to stop it (cheapest first):
1. **Move state down** so the parent isn't the one holding it (*state colocation*).
2. **Pass it as `children`** (see 5.3).
3. **`React.memo`** the child *and* keep its props stable.

### 3.3 The snapshot rule (the key to stale-state bugs)
> **Each render is a snapshot.** Every variable inside that render (state, props, functions) keeps the values it had for *that* render.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setTimeout(() => alert(count), 3000);   // alerts the count from THIS render, not the latest
  }
  ...
}
```
Click once, click again quickly, the alert from click #1 still says `0`. The function **closed over** that render's `count`. This is a **stale closure**, and it explains most "why is my state old?" bugs.

**Fixes:** updater form `setCount(c => c + 1)`; refs for "latest value" needs; correct effect dependencies.

### 3.4 Batching
```jsx
function onClick() {
  setA(1); setB(2); setC(3);   // ONE re-render, not three (React 18+, everywhere)
}
```
Great for performance, but remember: after `setA(1)`, the `a` you hold is **still the old snapshot**.

### 3.5 Identity: how React decides "same component or new one?"
React matches by **type + position (+ key)**.

```jsx
{isAdmin ? <Panel /> : <Panel />}      // same type, same slot → state is PRESERVED
{isAdmin ? <AdminPanel /> : <UserPanel />}  // different type → state is DESTROYED
```
Useful trick: **force a reset with `key`**.
```jsx
<ProfileForm key={userId} />   // new userId → new key → fresh form state, no reset code needed
```

### 3.6 Keys: the index bug, shown
```jsx
{todos.map((t, i) => <TodoRow key={i} todo={t} />)}   // each row has an <input> with its own state
```
Delete the first todo. Keys shift: row 0's key now belongs to what *was* row 1. React reuses DOM/state **by key**, so the typed text in the inputs ends up attached to the **wrong rows**. Use `key={t.id}`.

> Index keys are only safe for lists that are **static** (never reordered, inserted, or removed from the middle).

### 3.7 Pure rendering
Rendering must be **pure**: no mutating outside variables, no network calls, no random values in the body. Why? React may render a component **more than once** (StrictMode, concurrent rendering) or **throw a render away**. Side effects belong in event handlers or `useEffect`.

---

## 4. The bug catalog: Symptom → Cause → Fix

Read these as detective stories. Each is a real mistake with a real explanation.

### 4.1 "I changed the state but the UI didn't update"
```jsx
items.push(newItem); setItems(items);       // ❌ same reference
```
**Cause:** React compares references; same array = "nothing changed."
**Fix:** `setItems(prev => [...prev, newItem])`.

### 4.2 "My counter only goes up by one"
```jsx
setCount(count + 1); setCount(count + 1);   // both use the same snapshot
```
**Fix:** `setCount(c => c + 1)` twice.

### 4.3 "My effect runs forever"
```jsx
useEffect(() => { setCount(count + 1); }, [count]);   // writes to its own trigger
```
**Cause:** effect changes the state that re-triggers it.
**Fix:** question *why* you need an effect; usually it's derived data or belongs in an event handler.

Related loop: **an object/array/function in the dependency array** that's recreated every render.
```jsx
const options = { roomId };
useEffect(() => connect(options), [options]);   // new object each render → re-runs each render
// ✅ depend on primitives: [roomId], and build the object inside the effect
```

### 4.4 "My effect uses an old value"
```jsx
useEffect(() => { fetchUser(userId); }, []);   // userId missing from deps
```
**Cause:** stale closure; effect captured the first `userId` forever.
**Fix:** include `userId`. Trust `react-hooks/exhaustive-deps`.

### 4.5 "It fires twice in development"
**Cause:** `<StrictMode>` intentionally runs setup → cleanup → setup to expose effects that aren't resilient.
**Fix:** don't remove StrictMode. Fix the effect: add proper cleanup so running twice is harmless.

### 4.6 "Old search results appear after new ones" (race condition)
```
type "ip"  → request A (slow)
type "iph" → request B (fast) → shows B
request A returns last         → overwrites B with stale results ❌
```
**Fix:** cancel or ignore stale responses.
```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/search?q=${q}`, { signal: controller.signal })
    .then(r => r.json()).then(setResults)
    .catch(e => { if (e.name !== "AbortError") setError(e); });
  return () => controller.abort();     // cleanup cancels the previous request
}, [q]);
```
(Server-state libraries handle this for you.)

### 4.7 "Typing in one input lags the whole page"
**Cause:** the input's state lives in a parent that also renders a big list → every keystroke re-renders the list.
**Fix:** colocate input state in its own component; debounce the value you pass up; or `useDeferredValue` / memoize the list. (Section 5.)

### 4.8 "Theme toggle re-renders the entire app"
```jsx
<ThemeContext.Provider value={{ theme, setTheme }}>   {/* new object every render */}
```
**Cause:** new `value` reference → every consumer re-renders.
**Fix:** `const value = useMemo(() => ({ theme, setTheme }), [theme]);` and **split contexts** (theme vs user vs cart) so unrelated changes don't touch each other.
**Note:** `React.memo` does **not** block context-triggered renders; context bypasses props.

### 4.9 "State resets when it shouldn't (or doesn't when it should)"
- **Defined a component inside another component** → new component *type* every render → state wiped. Define components at module level.
- **Want a reset** → change `key` (see 3.5).

### 4.10 "Hook order error / 'rendered more hooks than previous render'"
```jsx
if (loggedIn) { const [x, setX] = useState(0); }   // ❌ conditional Hook
```
**Fix:** Hooks at the top; put the condition *inside* or *after* them.

### 4.11 "`{count && <Badge />}` shows a 0"
`0` is falsy but renderable. **Fix:** `{count > 0 && <Badge />}`.

### 4.12 "Memoized child still re-renders"
```jsx
<MemoCard product={p} style={{ margin: 8 }} onAdd={() => add(p)} />
```
**Cause:** inline `{}` and `() => {}` are new every render → props "changed" by reference.
**Fix:** stable props: hoist constants outside the component, `useCallback` the handler, or pass `p` and the id and let the child build the handler.

### 4.13 "Too many props passed through too many layers"
**Fix ladder:** composition (`children`) → Context → store. Don't jump to Redux for a 3-level chain.

---

## 5. Performance: from "feels slow" to a proven fix

### 5.1 The method (never skip it)
```
1. Is it actually slow? (feel, or measure)
2. MEASURE   → React DevTools Profiler, "Highlight updates", "Record why each component rendered"
3. FIND      → which components render, how often, how long, WHY
4. FIX       → smallest change that addresses that cause
5. MEASURE AGAIN → did it improve? if not, undo it
```
**Measure in a production build** (`vite build && vite preview`). Development is slower and StrictMode doubles renders, so dev numbers lie.

### 5.2 What actually makes a React app slow?

| Cause | Symptom |
|---|---|
| Too many renders (state too high, unstable props) | Typing/hovering lags |
| One render is expensive (heavy calculation in render) | Single interaction freezes |
| Huge DOM (thousands of nodes) | Slow initial paint, slow scrolling |
| Big JS bundle | Slow first load |
| Too many/duplicate API calls | Network waterfall, flicker |
| Unnecessary effects & derived state in state | Extra render passes |
| Large images | Slow load, layout shift |
| Long synchronous work on main thread | Janky input |

### 5.3 The toolbox, in the order you should reach for it

**① State colocation (free, powerful).** Keep state as low as possible.
```jsx
// ❌ search text in Page → whole page re-renders each keystroke
// ✅ SearchBox owns the text; passes up only a debounced/committed value
```

**② The `children` pattern (free).** A component that holds state and renders `{children}` doesn't re-render those children, because they're elements created by *its* parent.
```jsx
function Mouse({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });   // changes constantly
  return <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>{children}</div>;
}
<Mouse><ExpensiveTree /></Mouse>    {/* ExpensiveTree is skipped */}
```

**③ `React.memo` + stable props.** Skips a child when props are reference-equal.
```jsx
const ProductCard = memo(function ProductCard({ product, onAdd }) { ... });
```
Only helps if props are actually stable (see 4.12). Cost: a comparison on every render.

**④ `useMemo`: expensive calculations or stable object identity.**
```jsx
const visible = useMemo(() => products.filter(match).sort(byPrice), [products, match]);
```
Not for cheap work. Memoizing `a + b` is pure overhead.

**⑤ `useCallback`: stable function for memoized children / dependency arrays.** Useless alone; it pays off only when something downstream compares the reference.

**⑥ Context & store precision.**
- Split Contexts by update frequency.
- Redux: `useSelector(s => s.cart.items.length)`, select **primitives or stable references**. Selecting a freshly built object/array every call causes needless renders; use `createSelector` (reselect) for derived data.
- Zustand: select small slices; if a selector returns a new object/array, use `useShallow`.

**⑦ Lists.**
- Stable `key`s; `memo` on row components.
- **10,000 products?** The bottleneck is DOM size, not calculation. Order of attack: **server-side pagination** → **virtualization** (render only visible rows: `react-window`, TanStack Virtual) → memoized rows. Also `loading="lazy"` on images.

**⑧ Loading cost.**
- **Code splitting:** `lazy(() => import("./Checkout"))` + `<Suspense>`: ship checkout code only when someone goes to checkout. Typically split **per route**.
- Optimize images (sizes, modern formats, lazy loading).
- Analyze the bundle for heavy dependencies.

**⑨ Taming rapid input.**

| Tool | What it does | Use when |
|---|---|---|
| **Debounce** | Wait until the user stops, then run once | Search-as-you-type API calls |
| **Throttle** | Run at most once per interval | Scroll/resize handlers |
| **`useDeferredValue`** | React renders the urgent UI first, the heavy part later | Expensive *rendering* that follows an input |
| **`useTransition`** | Mark a state update as non-urgent | Tab switches, filtering large data |

Debounce reduces **how often** work happens. Transitions reduce **how urgent** it is. They solve different problems.

**⑩ Request efficiency.** Cache, dedupe, and cancel requests, ideally via TanStack Query / RTK Query. Don't refetch the same product list in five components.

### 5.4 Every optimization has a price

| Technique | You pay with |
|---|---|
| `memo` | Comparison cost; breaks silently when props are unstable |
| `useMemo`/`useCallback` | Memory, dependency bugs, harder-to-read code |
| Virtualization | Complexity (scroll position, dynamic row heights, accessibility) |
| Code splitting | Loading states to design, possible waterfall |
| Debounce | Intentional delay |
| Global store | Boilerplate, indirection |

> **React Compiler** (build-time tool) can add memoization automatically, reducing hand-written `useMemo`/`useCallback`. It can't fix bad architecture (state too high, too many nodes), so the concepts above still matter.

### 5.5 Two worked cases

**Case A: "Search box is laggy."**
```
Symptom : each keystroke freezes UI for ~200 ms
Measure : Profiler → <ProductGrid> (2,000 cards) re-renders on every keystroke
Cause   : `query` state lives in <Page>, which renders the grid
Fix     : (1) move `query` into <SearchBox>; (2) debounce and pass the committed term up;
          (3) memo(ProductCard) with stable props
Verify  : Profiler → grid renders once per pause, not per keystroke
```

**Case B: "Product page with 10,000 cards is slow to open."**
```
Symptom : 3 s blank screen, scroll stutters
Measure : DevTools → ~10,000 DOM nodes; commit phase dominates
Cause   : rendering everything at once
Fix     : server-side pagination (or infinite scroll), then virtualization if you must show all,
          lazy images
Not the fix: useMemo on the list (the calculation wasn't the problem)
```

---

## 6. Real flows in an ONYX-style store *(proposed architecture)*

### 6.1 Search + filter + pagination (URL state)
```
User types "headphones"
   ↓ SearchBox local state (instant, responsive)
   ↓ debounced 300 ms
   ↓ setSearchParams({ q: "headphones", page: 1 })      ← URL is the source of truth
   ↓ router re-renders ProductsPage
   ↓ useQuery(["products", q, filters, page]) → productService.list(...)
   ↓ GET /products?q=headphones&page=1
   ↓ response cached → component renders list
   ↓ commit → paint
```
Why URL? Refresh-safe, shareable, back button works. **Reset `page` to 1 when search/filter changes.**

### 6.2 Login → protected route → logout
```
LOGIN     form submit → authService.login(creds) → server verifies
          → token/session issued → auth store set → navigate(from || "/")
PROTECTED route renders → <Protected> reads auth state
          → not authed? <Navigate to="/login" state={{ from: location }} />
API CALLS axios instance attaches credentials / Authorization header
EXPIRY    401 → interceptor tries refresh once → retry original request
          → refresh fails? clear auth state → redirect to login
LOGOUT    call logout API → clear auth store → clear cached server data
          → clear storage → navigate("/login")
```
**Hard truths**
- **A protected route is a UX feature, not security.** Anyone can read your JS bundle. The **server must enforce** authorization on every request.
- **Token storage is a trade-off:** `localStorage` survives refresh but any injected script (XSS) can read it; `httpOnly` cookies are hidden from JS but need CSRF protection. Choose from your threat model, not habit.
- **Auth "loading" state:** on page refresh, auth isn't known for a moment. Render a loader, or the protected route briefly flashes a redirect to `/login`.
- **Refresh races:** if five requests get a 401 simultaneously, refresh **once** and queue the rest.
- **Multi-tab logout:** listen to the `storage` event, or use a cookie/session check.

### 6.3 Theme toggle
```
Click → state: "dark" → Context/store updates → set data-theme="dark" on <html>
      → CSS variables change → browser restyles → paint
```
- **FOUC (flash of wrong theme):** if you read `localStorage` inside `useEffect`, the page paints light first. Fix: set `data-theme` from an inline `<script>` in `<head>` *before* React loads.
- Default from the OS: `matchMedia("(prefers-color-scheme: dark)")`.

### 6.4 Toast notifications
```
Anything calls notify("Added to cart") → toast store pushes {id, msg}
→ <ToastContainer> (rendered via a portal at the root) maps toasts → auto-dismiss timers
```
Clean up timers on unmount. Use stable ids as keys.

### 6.5 All 16 flows on one page

| Flow | State lives in | Data comes from | Watch out for |
|---|---|---|---|
| Product listing | Server-state cache | `GET /products` | Loading / error / **empty** states |
| Product details | URL param + server cache | `GET /products/:id` | Race when `id` changes; 404 page |
| Search | Local input → URL | `GET ?q=` | Debounce; cancel stale requests |
| Filters | URL search params | Server or client | Derived, not stored; reset page |
| Add to cart | Store (+ server) | `POST /cart/items` | Per-item pending; optimistic update; auth |
| Cart quantity | Store | `PATCH` | Stale closures; min/max; debounce API |
| Wishlist | Store (+ server if logged in) | `POST/DELETE` | Guest vs logged-in merge |
| Login | Form local → auth store | `POST /login` | Token storage; error messages |
| Protected route | Auth state + router | n/a | UX gate only; auth-loading flash |
| Logout | Clear store/cache/storage | `POST /logout` | In-flight requests; other tabs |
| Theme | Context/store + localStorage | n/a | FOUC; context re-renders |
| API layer | `services/` + axios instance | n/a | One base URL, interceptors, error shape |
| Loading / error | Per-request status | n/a | Skeletons; inline errors vs error boundary |
| Pagination | URL `?page=` | `GET ?page=` | Keep previous data while loading |
| Checkout | Multi-step form + cart | `POST /orders` | **Never trust client-sent prices**; double-submit |
| Toasts | Global event store | n/a | Portal; timer cleanup |

---

## 7. Data fetching architecture

### 7.1 Why not "just `fetch` in every component"?
- URLs, headers, and error handling duplicated everywhere.
- Auth token changes → edit 40 files.
- No shared caching → same data fetched repeatedly.

### 7.2 The layers
```
Component      "I need products" (knows nothing about HTTP)
   ↓
Hook / query   useProducts(filters): handles loading, error, cache
   ↓
Service        productService.list(filters): knows URL + params
   ↓
HTTP client    axios instance / fetch wrapper: base URL, auth header, interceptors
   ↓
Server
```

### 7.3 `fetch` vs Axios, decided by needs

| Need | `fetch` | Axios |
|---|---|---|
| Simple GETs, small app | ✅ enough | overkill |
| Parse JSON automatically | manual `res.json()` | automatic |
| Throw on 4xx/5xx | **No**, check `res.ok` | Yes |
| Interceptors (attach token, refresh on 401, global errors) | write a wrapper | built in |
| Timeouts | `AbortSignal.timeout()` | built in |
| Upload progress | limited | easier |

Neither is "better." Axios earns its keep when you need **interceptors and shared config**.

### 7.4 Always design four states
```
loading  →  error  →  empty (data = [])  →  success
```
The *empty* state is the one people forget.

---

## 8. Debugging method

```
SYMPTOM → HYPOTHESIS → EVIDENCE → ROOT CAUSE → FIX → VERIFY
```
Don't add a Hook hoping it works. **Trace the chain:**
`data → render → state update → re-render → effect → cleanup`, and find the broken link.

### Toolkit
- **React DevTools → Components:** inspect props, state, Hooks, and context values live.
- **Profiler:** record an interaction; see what rendered, how long, and (with the setting on) *why*.
- **"Highlight updates when components render":** instantly shows over-rendering.
- `console.log("render")` at the top of a component; log in effect **setup and cleanup** to see the lifecycle.
- `console.log(prev === next)` to test reference identity.
- **Network tab:** is the request even sent? What did the server return?

### Worked scenarios

**"The cart badge shows the wrong number after removing an item."**
1. Hypothesis: state mutated, or two sources of truth.
2. Evidence: Components tab shows `items` correct but `count` (separate state) stale.
3. Root cause: `count` stored separately.
4. Fix: derive `count` from `items`. Verify with add/remove/clear paths.

**"My product page keeps fetching forever."**
1. Hypothesis: effect re-triggers itself.
2. Evidence: Network tab shows a request every ~50 ms; effect deps contain an object built during render.
3. Root cause: dependency `[filters]` where `filters = { category }` is recreated each render.
4. Fix: depend on `category`, or memoize `filters`. Verify one request.

---

## 9. Architecture thinking: reading an unfamiliar app

When you open a new React codebase, answer these in order. If you can, you understand the app.

1. **What are the routes?** (Router config = the app's table of contents.)
2. **What's the component tree** for one page?
3. **Who owns each piece of data?** UI / shared client / server / URL?
4. **Where is the API called?** (service layer, query hooks, or scattered?)
5. **Where does auth live?** How does a request get its token?
6. **Where is shared state?** Context, Redux, Zustand? Why that one?
7. **How does one click flow** from event to DOM?
8. **Where could renders get expensive?** (big lists, high state, big contexts)
9. **How would I debug it?**

### Structure grows with the app
```
Small:   components/ pages/ hooks/ utils/
Medium:  + services/ context/ store/
Large:   features/cart/{components,hooks,slice,service}  ← group by feature
```
**Rule of thumb:** things that change together should live together. Start simple; restructure when pain appears.

### Where should…?
| Question | Answer |
|---|---|
| API logic live? | A service layer, consumed via hooks/queries, never raw URLs in components |
| Auth state live? | Global (Context/store); many unrelated parts need it |
| Server data live? | In a server-state cache, not duplicated into Redux by default |
| Form state live? | In the form (local/`react-hook-form`) until submit |
| Filter state live? | In the URL |

---

## 10. Intermediate interview Q&A (with the reasoning behind each)

**Why are props read-only?**
So data flow stays traceable. If a child could mutate what the parent passed, any component could change shared data silently and you couldn't tell who changed it.

**Why can't a child change the parent's state directly?**
State belongs to the component that owns it, and only its setter can request changes. The parent passes down a function so the *owner* stays in control.

**What causes a re-render?**
The component's own state changed; its parent rendered; or a Context it consumes changed. (Props "changing" matters only for memoized components.)

**Does a re-render mean the DOM changes?**
No. Render = run the function. DOM changes only happen in commit, and only where the output differs.

**Why does an object prop make a memoized component re-render?**
`memo` compares props by reference. An inline `{}` or `() => {}` is a new reference every render, so it always looks changed.

**Why is `useMemo` not automatically an optimization?**
It adds memory and comparison overhead and complexity. It only pays off for genuinely expensive calculations or when a stable reference matters.

**Why can `useEffect` cause an infinite loop?**
If the effect updates state that's in its own dependency list (directly, or via an unstable object/function), each run triggers the next.

**Why does Context sometimes re-render everything?**
Every consumer re-renders when the Provider's `value` reference changes, whether or not it uses the changed part. Fix: memoize the value and split contexts.

**Redux vs Context?**
Context is a delivery mechanism with no selectors, middleware, or devtools, and consumers re-render on any value change. Redux adds fine-grained subscriptions, predictable updates via actions, middleware, and time-travel debugging, at the price of boilerplate. Choose by complexity and update frequency.

**Why Zustand instead of Redux?**
Less ceremony, no Provider, selector-based subscriptions. Good for small-to-medium apps. Redux Toolkit still wins when you want strict conventions, rich devtools, or a big team.

**Why does Axios exist if fetch exists?**
Convenience for larger apps: auto-JSON, error-on-4xx/5xx, interceptors, timeouts, instances. For simple cases, `fetch` is enough.

**Where should auth state live?**
Global, because many unrelated parts need it (header, routes, API layer). Token storage is a separate decision (cookie vs `localStorage`) driven by your threat model.

**How would you optimize 10,000 cards?**
Identify the bottleneck: DOM size. Paginate server-side or virtualize; memoize rows with stable props; lazy-load images. Measure before and after.

**How would you design state for an e-commerce app?**
Server state (products, orders) in a query cache; URL for search/filter/page; global client store for cart/wishlist/auth/theme; local state for UI toggles; derive totals and counts.

---

## 11. Self-check

**Can I explain this?**
1. Walk through "Add to cart" from click to pixel, naming each arrow.
2. Why does `setCount(count + 1)` three times add only 1?
3. Why does `key={index}` break a list with inputs?
4. What's the difference between server state and client state?
5. Why is a protected route not real security?

**Can I build this?**
1. A product list with URL-driven search (`?q=`), debounced input, loading/error/empty states, and a `productService`.
2. A `CartContext` (or Zustand store) with add/remove/quantity, where total and count are **derived**, and the header badge re-renders only when count changes.

**Can I debug this?**
1. A memoized `ProductCard` re-renders on every parent render. Find *two* possible causes and the fix for each.
2. After logout, the previous user's cart flashes briefly on next login. What did the logout flow forget?

**Interview challenge** *(answer before checking anything)*
1. A dashboard re-renders 500 components when you toggle a sidebar. Describe your investigation step by step.
2. Design where state lives for a multi-step checkout (address → shipping → payment → review).
3. A teammate wraps every function in `useCallback` "for performance." Respond.

---

## Key takeaway, mistake, self-question
- **Key takeaway:** classify the data (UI / shared / server / URL / derived) *before* choosing a tool, and measure before optimizing.
- **Common mistake:** "fixing" a symptom (add `useMemo`, add `useEffect`, add Redux) without tracing which link of *event → state → render → commit* is actually wrong.
- **Ask yourself:** *What caused this render, and is the rendering itself the problem, or the amount of DOM, the network, or the bundle?*

---

**Next → `03-react-senior-internals.md`:** what React is doing underneath: elements, Fiber, the render and commit phases in detail, the scheduler, priorities, concurrent rendering, how Hooks are stored, effect timing, Suspense, transitions, SSR and hydration, and the design reasons behind all of it.