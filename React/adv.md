# React Advanced

# PART I — THINK LIKE AN INTERMEDIATE DEVELOPER

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

> **The sentence this whole document is built for:** *"User ne ye action kiya → event fire hua → state/store update hua → React ko update mila → render hua → reconciliation hui → commit hua → browser ne paint kiya → UI change hua."* Every section plugs into one arrow of it.

**Rule you must never break:** *Render ≠ DOM update. Render ≠ browser paint.* A render just produces a **description** of the UI. Reconciliation decides what differs. **Commit** is the only phase that touches the real DOM. **Paint** is the browser's job, not React's.

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
- **No auth?** The request will fail. Who handles that? (See section 7.2.)

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
TRIGGER → RENDER (call your functions) → COMMIT (touch DOM) → [browser paints] → effects
```
- A component "rendering" = its function ran. Cheap-ish, but not free.
- The DOM is touched only in **commit**, and only where something changed.
- A render that produces identical output changes **nothing** on screen, but it still **cost CPU**. Unnecessary renders are a *performance* topic, not a *correctness* bug.

**Initial render vs update render**
```
INITIAL:  createRoot(el).render(<App />) → App() runs → element tree → Fiber tree built
          → COMMIT creates real DOM nodes → paint → effects
UPDATE:   setCount(...) → React schedules update (DOM not touched yet) → component re-runs
          → new tree diffed against previous → COMMIT changes only differences → paint
          → effects whose deps changed: old cleanup, then new setup
```

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
Since React 18, batching also happens inside promises, timeouts, and native handlers (before 18 it stopped at React's own event handlers).

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

> **Interview line:** *"Keys let React track element identity across renders, independent of position, so reconciliation can correctly reuse, move, or discard the right DOM nodes and component instances."*

### 3.7 Pure rendering
Rendering must be **pure**: no mutating outside variables, no network calls, no random values in the body. Why? React may render a component **more than once** (StrictMode, concurrent rendering) or **throw a render away**. Side effects belong in event handlers or `useEffect`.

### 3.8 Reference equality: the idea under half of this document
```js
10 === 10                 // true   primitives compare by VALUE
"a" === "a"               // true
{} === {}                 // false  objects compare by REFERENCE (memory address)
[] === []                 // false
(() => {}) === (() => {}) // false  functions too
const a = {}; const b = a; a === b   // true: same reference
```
A new object/array/function literal created during render is **always a new reference**. React compares with `Object.is` (reference equality) in many places:

| Where React compares | What happens if reference changed |
|---|---|
| `setState(next)` vs current | Same reference → React may skip the re-render |
| `React.memo` props | Any prop changed by reference → child renders |
| Hook dependency arrays | Any dep changed → effect/memo re-runs |
| Context `value` | Changed → every consumer re-renders |
| Redux `useSelector` / Zustand selector result | Changed → component re-renders |

> If you remember one debugging question about re-renders, make it: **"Which reference changed?"**

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
**Fix:** colocate input state in its own component; debounce the value you pass up; or `useDeferredValue` / memoize the list. (Sections 5 and 6.)

### 4.8 "Theme toggle re-renders the entire app"
```jsx
<ThemeContext.Provider value={{ theme, setTheme }}>   {/* new object every render */}
```
**Cause:** new `value` reference → every consumer re-renders.
**Fix:** `const value = useMemo(() => ({ theme, setTheme }), [theme]);` and **split contexts** (theme vs user vs cart) so unrelated changes don't touch each other.
**Note:** `React.memo` does **not** block context-triggered renders; context bypasses props (why: section 18.1).

### 4.9 "State resets when it shouldn't (or doesn't when it should)"
- **Defined a component inside another component** → new component *type* every render → state wiped. Define components at module level.
- **Want a reset** → change `key` (see 3.5).

### 4.10 "Hook order error / 'rendered more hooks than previous render'"
```jsx
if (loggedIn) { const [x, setX] = useState(0); }   // ❌ conditional Hook
```
**Fix:** Hooks at the top; put the condition *inside* or *after* them. (Why: section 15.)

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

### 4.14 The re-render cheat sheet (cause → fix at a glance)

| Why did it re-render? | Fix, cheapest first |
|---|---|
| Own state changed (but only part of the UI needs it) | Split the component; move state down |
| Parent re-rendered, props identical | `memo` child; or pass as `children`; or move state down |
| Parent re-rendered, props "changed" by reference | Stabilize: hoist constants, `useCallback`/`useMemo`, pass primitives |
| Context value changed | Memoize `value`; split contexts; select with a store instead |
| Store selector returns new reference every time | Select primitives; `createSelector`; Zustand `useShallow` |
| Key changed or unstable (`Math.random()` as key) | Stable ids as keys |
| Effect sets state in a loop | Remove effect / fix deps / derive instead |
| It's *supposed* to re-render but is slow | Make the render cheaper, virtualize, or lower its priority (section 17) |

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

| | Remembers |
|---|---|
| `useMemo` | a value |
| `useCallback` | a function (`useCallback(fn, deps)` ≈ `useMemo(() => fn, deps)`) |

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

Debounce reduces **how often** work happens. Transitions reduce **how urgent** it is. They solve different problems. (Full treatment in section 6.)

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

> **React Compiler** (build-time tool) can add memoization automatically, reducing hand-written `useMemo`/`useCallback`. It can't fix bad architecture (state too high, too many nodes), so the concepts above still matter. (More in section 20.)

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

### 5.6 Responsiveness and Web Vitals (the user-facing scoreboard)

| Metric | What the user feels | React-side levers |
|---|---|---|
| **LCP** (Largest Contentful Paint) | "When does the main content appear?" | Smaller bundle, code splitting, image optimization, SSR/streaming, avoid fetch waterfalls |
| **INP** (Interaction to Next Paint) | "When I click or type, how fast does the screen react?" | Fewer/cheaper renders, colocation, `useTransition`/`useDeferredValue`, debounce, break up long tasks |
| **CLS** (Cumulative Layout Shift) | "Did things jump around?" | Reserve image/skeleton sizes, avoid inserting content above existing content |

> **Long task:** any JavaScript running >50 ms blocks the main thread; the browser can't respond to clicks or paint during that time. Most "React is janky" problems are long tasks. Fix by *doing less*, *splitting the work* (pagination, virtualization), or *lowering its priority* (transitions).

---

## 6. Debounce, throttle and friends: taming rapid events

### 6.1 The problem, in plain words
Some events fire **a lot**: typing (every key), scrolling (dozens of times per second), `mousemove` (hundreds), window resize. If each event triggers expensive work (an API call, a heavy render, a layout calculation), the app chokes or you spam your server.

You need a way to say: *"don't do the work for every single event."* There are two classic answers.

### 6.2 The two ideas, with pictures

**Debounce = "wait until they stop."**
> Like an elevator door: every time someone steps in, the timer restarts. The door only closes after nobody has entered for a few seconds.

**Throttle = "at most once per interval."**
> Like a security guard who checks the building every 10 minutes no matter how many people walk past in between.

```
Events (each | is one event):   | | | |  | | | | | |        | |
                                time ─────────────────────────────▶

DEBOUNCE (300 ms) runs ONCE, after quiet:
                                                          ▲ runs here (300ms after last event)

THROTTLE (300 ms) runs REGULARLY while events keep coming:
                                ▲     ▲     ▲     ▲     ▲   (at most once per 300 ms)
```

| | Debounce | Throttle |
|---|---|---|
| Runs when | After events **stop** for N ms | At most **once every** N ms, during the burst |
| During continuous events | Never runs (keeps resetting) | Runs regularly |
| Best for | Search-as-you-type, autosave, validation, "resize ended" | Scroll, drag, live resize, mousemove, analytics pings |
| Feels like | "Wait for me to finish" | "Keep up, but not too often" |

### 6.3 Plain JavaScript versions (so you understand them)

```js
function debounce(fn, delay) {
  let timer;                                   // lives in the closure, shared by all calls
  return function (...args) {
    clearTimeout(timer);                       // restart the countdown every time
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {              // enough time passed since the last run?
      last = now;
      fn.apply(this, args);
    }
  };
}
```
- **Leading vs trailing:** a debounce can fire at the *start* of a burst (leading), at the *end* (trailing, the default), or both. Throttle usually fires at the start of each interval, and good implementations also fire a final trailing call so the last value isn't lost. Libraries (`lodash.debounce`, `lodash.throttle`, `use-debounce`) handle these options and give you `.cancel()` and `.flush()`.

### 6.4 The React gotchas (where people get this wrong)

**Gotcha 1: creating the debounced function inside the component body.**
```jsx
function Search() {
  // ❌ A NEW debounced function (with a NEW timer) is created on every render.
  const onChange = debounce((e) => fetchResults(e.target.value), 300);
  return <input onChange={onChange} />;
}
```
Each render throws away the old timer's closure, so nothing is ever actually debounced (and with state updates, it re-renders on each key).

**Gotcha 2: stale closures.** If the debounced function captured an old `props`/`state`, it will call with old values. Use a ref to hold the *latest* callback.

**Gotcha 3: no cleanup.** A pending timer can fire **after** the component unmounted. Clear it in cleanup.

**Gotcha 4: debouncing the thing the user sees.** The input must update **immediately** (controlled input). Debounce only the **derived work** (the API call), never the text box itself.

### 6.5 The clean React patterns

**Pattern A (best default): debounce the *value*.**
```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);          // cleanup restarts the timer on every change
  }, [value, delay]);
  return debounced;
}

function ProductSearch() {
  const [text, setText] = useState("");              // updates instantly → input stays responsive
  const debounced = useDebounce(text, 300);          // updates 300 ms after typing stops

  useEffect(() => {
    if (!debounced) return;
    const controller = new AbortController();         // cancel stale requests (race-safe)
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, { signal: controller.signal })
      .then(r => r.json()).then(setResults)
      .catch(e => { if (e.name !== "AbortError") setError(e); });
    return () => controller.abort();
  }, [debounced]);

  return <input value={text} onChange={e => setText(e.target.value)} />;
}
```
Three tools, three jobs: **`text`** keeps typing instant, **debounce** limits request *frequency*, **AbortController** kills requests that are already outdated.

**Pattern B: debounce a *callback* (autosave, resize handler).**
```jsx
function useDebouncedCallback(fn, delay) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });            // always the latest function → no stale closure
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);   // cleanup on unmount
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);                                          // stable identity unless delay changes
}
```

**Pattern C: throttle a callback (scroll, drag).**
```jsx
function useThrottledCallback(fn, interval) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });
  const last = useRef(0);
  return useCallback((...args) => {
    const now = Date.now();
    if (now - last.current >= interval) {
      last.current = now;
      fnRef.current(...args);
    }
  }, [interval]);
}
```

### 6.6 Better tools than throttling scroll by hand

| Need | Prefer |
|---|---|
| Animations / position updates tied to scroll | `requestAnimationFrame` (runs once per frame, ~16 ms) |
| "Load more when near the bottom", lazy images | **`IntersectionObserver`** (no scroll handler at all) |
| Size changes of an element | **`ResizeObserver`** |
| Scroll listeners you must keep | Add `{ passive: true }` so scrolling isn't blocked |

### 6.7 Debounce vs throttle vs transitions vs memo vs abort: which one?

| Tool | Reduces… | Doesn't help with… | Typical use |
|---|---|---|---|
| **Debounce** | How *often* work runs (CPU **and** network) | Slow rendering once it does run | Search API calls, autosave |
| **Throttle** | How *often* work runs during a stream | Final accuracy (may skip values) | Scroll/drag/resize |
| **`useDeferredValue`** | How *urgent* a heavy **render** is | Number of API calls (it doesn't reduce them) | Filtering a big list as you type |
| **`useTransition`** | How *urgent* a state update's render is | Network spam | Tab switch, big filter |
| **`AbortController`** | Stale responses and wasted bandwidth | Event frequency | Cancel previous request |
| **`memo` / colocation** | Needless re-renders | Expensive calculations that must run | Stable lists |
| **Virtualization** | DOM size | Event frequency | Long lists |

**Combine them.** A great search box: controlled input (instant) + debounce (fewer requests) + AbortController (no stale results) + `useDeferredValue` or `useTransition` (heavy results list doesn't block typing) + `memo` rows.

### 6.8 Pitfalls checklist
- Debounce delay too long → app feels broken. 250–400 ms is typical for search.
- **Enter key / submit button should skip the wait** (call `flush()` or fire immediately).
- Double-submit protection is a *throttle/disable-button* problem, not a debounce one.
- Always clear timers on unmount.
- Test with fake timers (`vi.useFakeTimers()` / `jest.useFakeTimers()`), never real `setTimeout` waits.
- In StrictMode dev, effects run twice; your cleanup must make that harmless.

---

## 7. Real flows in an ONYX-style store *(proposed architecture)*

### 7.1 Search + filter + pagination (URL state)
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

### 7.2 Login → protected route → logout
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
```jsx
function ProtectedRoute({ children }) {
  const { isAuth, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <FullPageLoader />;                    // avoid flash-redirect on refresh
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
```
`<Navigate />` is a **component** returned during render (declarative redirect). `useNavigate()` is for imperative moves after a click. **Memory trick:** *`useNavigate` → user did something. `Navigate` → a condition became true during render.*

**Hard truths**
- **A protected route is a UX feature, not security.** Anyone can read your JS bundle. The **server must enforce** authorization on every request.
- **Token storage is a trade-off:** `localStorage` survives refresh but any injected script (XSS) can read it; `httpOnly` cookies are hidden from JS but need CSRF protection. Choose from your threat model, not habit.
- **Auth "loading" state:** on page refresh, auth isn't known for a moment. Render a loader, or the protected route briefly flashes a redirect to `/login`.
- **Refresh races:** if five requests get a 401 simultaneously, refresh **once** and queue the rest.
- **Multi-tab logout:** listen to the `storage` event, or use a cookie/session check.
- **Logout vs in-flight requests:** a slow "fetch user" can repopulate state after logout. Cancel with `AbortController` or ignore stale results.
- **RBAC:** a second check on top of "is authenticated"; a route can be reachable but still gated by role (and again, the server enforces).

### 7.3 Theme toggle
```
Click → state: "dark" → Context/store updates → set data-theme="dark" on <html>
      → CSS variables change → browser restyles → paint
```
- **FOUC (flash of wrong theme):** if you read `localStorage` inside `useEffect`, the page paints light first. Fix: set `data-theme` from an inline `<script>` in `<head>` *before* React loads (or server-render the value).
- Default from the OS: `matchMedia("(prefers-color-scheme: dark)")`.

### 7.4 Toast notifications
```
Anything calls notify("Added to cart") → toast store pushes {id, msg}
→ <ToastContainer> (rendered via a portal at the root) maps toasts → auto-dismiss timers
```
Clean up timers on unmount. Use stable ids as keys.

### 7.5 All 16 flows on one page

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

## 8. Data fetching architecture

### 8.1 Why not "just `fetch` in every component"?
- URLs, headers, and error handling duplicated everywhere.
- Auth token changes → edit 40 files.
- No shared caching → same data fetched repeatedly.

### 8.2 The layers
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
Why API calls start in `useEffect` when hand-rolled: fetching is a **side effect** (syncing state with an external system), so it's tied to the component's lifecycle and dependencies. At scale, hand-rolled loading/error/cache/retry/race logic doesn't hold up; use a server-state layer.

### 8.3 `fetch` vs Axios, decided by needs

| Need | `fetch` | Axios |
|---|---|---|
| Simple GETs, small app | ✅ enough | overkill |
| Parse JSON automatically | manual `res.json()` | automatic |
| Throw on 4xx/5xx | **No**, check `res.ok` | Yes |
| Interceptors (attach token, refresh on 401, global errors) | write a wrapper | built in |
| Timeouts | `AbortSignal.timeout()` | built in |
| Upload progress | limited | easier |

Neither is "better." Axios earns its keep when you need **interceptors and shared config**.

### 8.4 Always design four states
```
loading  →  error  →  empty (data = [])  →  success
```
The *empty* state is the one people forget.

---

## 9. Debugging method

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
- **Performance tab:** find long tasks (>50 ms) and what ran inside them.

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

**"Theme toggle works, but the whole app re-renders."**
1. Hypothesis: the Context `value` is a new object every Provider render.
2. Evidence: Profiler "why did this render" says *Context changed*; `value === prevValue` is `false`.
3. Root cause: `value={{ theme, setTheme }}` inline.
4. Fix: `useMemo` the value; split contexts. Trade-off: one more dependency array to keep correct.

### Quick checklist for any "why is this rendering / not updating" bug
1. **Identify the render:** log at the top of the suspect component. Is it rendering at all?
2. **Inspect state/props:** which one changed?
3. **Inspect effect dependencies:** which changed, and should it have?
4. **Check identity:** `prev === next` for objects/arrays/functions.
5. **Check cleanup:** log in setup and cleanup to see mount/unmount/re-run order.

---

## 10. Architecture thinking: reading an unfamiliar app

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

### State management: no winner, only fit

| | Context | Redux Toolkit | Zustand |
|---|---|---|---|
| Boilerplate | Low | Moderate (low with RTK) | Very low |
| Fine-grained subscriptions | No (whole value) | Yes (selectors) | Yes (selectors) |
| DevTools / time travel | No | Excellent | Optional middleware |
| Built into React | Yes | No | No |
| Best fit | Bounded subtree, infrequent changes | Large app, complex/async state, team conventions | Small-to-medium app, global store without ceremony |

> **Do not reach for Redux/Zustand because it's popular.** Reach for it when `useState` + composition + Context genuinely becomes unmaintainable.

---

# PART II — THINK LIKE A SENIOR ENGINEER (REACT INTERNALS)

> **How to read Part II:** you don't need this to build apps. You need it to **predict** React's behavior, debug the weird cases, and answer senior interview questions. Each section starts with a plain-words picture, then the technical detail.
>
> **Running analogy: a restaurant kitchen.**
> - **Elements** = order tickets (descriptions of what's wanted).
> - **Fibers** = the kitchen's work cards (one per dish, tracking its progress).
> - **Scheduler** = the head chef deciding which ticket is cooked first (a VIP order jumps the queue).
> - **Commit** = serving all finished plates at once, so diners never see a half-plated table.

---

## 11. The big picture: React is a machine with four parts

```
 Your code ──(JSX)──▶ ELEMENTS  (plain-object descriptions)
                          │
                          ▼
                 ┌──────────────────┐        ┌───────────────┐
                 │   RECONCILER     │◀──────▶│   SCHEDULER   │  "when, and in what priority?"
                 │ (Fiber work loop)│        └───────────────┘
                 └────────┬─────────┘
                          │ a finished list of changes (flags on fibers)
                          ▼
                 ┌──────────────────┐
                 │    RENDERER      │  react-dom: createElement, appendChild, setAttribute…
                 └────────┬─────────┘
                          ▼
                       real DOM  ──▶  browser paints
```

| Part | Package | Job |
|---|---|---|
| **API** | `react` | Components, Hooks, `createElement`. Knows nothing about the DOM. |
| **Reconciler** | `react-reconciler` (inside react-dom) | The algorithm: render components, diff, decide what changed. Platform-independent. |
| **Renderer** | `react-dom`, `react-native`, `react-three-fiber` | Knows how to actually create/modify things on its platform |
| **Scheduler** | `scheduler` | Decides when work runs and yields to the browser |

**Why split it like this?** The reconciler is the hard part and is shared. Swap the renderer and the same React runs on web, mobile, 3D, or the terminal. That's why `react` and `react-dom` are separate packages.

> **Version history, corrected:** React was created at Facebook (first used around 2011) and open-sourced in **2013**. The **Fiber** rewrite of the reconciler shipped with **React 16 (2017)**, replacing the old "stack" reconciler of React ≤15. Fiber was the *foundation*; the user-facing **concurrent features** (transitions, `useDeferredValue`, Suspense improvements) arrived with **React 18**. (An earlier doc said "open-sourced 2015": that was React Native's year.)

---

## 12. Elements and Fibers

### 12.1 React element: the "order ticket"
```jsx
<h1 className="title">Hi</h1>
```
compiles to a call that returns a tiny, **immutable** plain object:

```js
{
  $$typeof: Symbol(react.element),   // security tag: a JSON-injected fake can't have a Symbol
  type: "h1",                        // string for DOM tags, function/class/memo/etc. for components
  key: null,
  ref: null,
  props: { className: "title", children: "Hi" }
}
```
Creating elements is **cheap**. It's just allocating objects. A component "rendering" mostly means "creating a new tree of these tickets."

### 12.2 Fiber: the "work card"
React keeps **one fiber per component instance** (and per DOM node). A fiber is a long-lived JavaScript object tracking everything React needs to know about that spot in the tree.

```js
// Simplified. Real fibers have more fields.
FiberNode = {
  type,            // the component function or "div"
  key,             // for list identity
  stateNode,       // the real DOM node (for host fibers) or class instance

  // Tree shape (a linked list, NOT nested arrays):
  return,          // parent fiber
  child,           // first child
  sibling,         // next sibling

  pendingProps,    // new props for this render
  memoizedProps,   // props used in the last completed render
  memoizedState,   // for function components: the LINKED LIST OF HOOKS
  updateQueue,     // pending updates / effects

  flags,           // "what must happen at commit": Placement, Update, Deletion, Passive, Ref…
  subtreeFlags,    // summary of flags below, so React can skip subtrees quickly
  lanes,           // priority of pending work on this fiber
  childLanes,      // priority of pending work somewhere below

  alternate        // the "other" version of this fiber (see double buffering)
}
```

```
        App
         │ child
       Header ──sibling──▶ Main ──sibling──▶ Footer
         │ child             │ child
        Logo            ProductList
   (every fiber also has `return` pointing up to its parent)
```

### 12.3 Why a linked list instead of recursion? (The key Fiber insight)
The old reconciler (React ≤15) walked the tree with **recursion**. Recursion's state lives on the JavaScript call stack, and **you cannot pause a call stack** and come back later. A big update would freeze the page.

Fiber rewrote that walk as a **loop over a linked list** (`child` → `sibling` → `return`). Now the "where am I?" state is just **one pointer** (`nextUnitOfWork`). React can stop after any fiber, let the browser handle a click or paint, then resume from that pointer, or throw everything away and restart.

```
Recursion:   call stack = hidden state → can't pause
Fiber loop:  one pointer = explicit state → pause, resume, abandon, prioritize
```

### 12.4 Double buffering: two trees
React keeps **two fiber trees**:

| Tree | Meaning |
|---|---|
| **`current`** | What's on screen right now |
| **`workInProgress`** | The draft React is building for the next screen |

Each fiber's `alternate` points to its twin in the other tree. React builds the draft **without touching** the current tree or the DOM. When the draft is complete and committed, React flips one pointer (`root.current = workInProgress`) and the draft **becomes** the current tree. The old tree is recycled for the next draft.

> **Why this matters:** React can abandon a half-built draft at any time with zero visible effect, because the screen was never modified. That is what makes interruptible rendering safe.

---

## 13. The render phase

### 13.1 What the work loop does
```js
// Heavily simplified
function workLoop() {
  while (nextUnitOfWork && !shouldYield()) {        // shouldYield: "has my ~5ms time slice run out?"
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) commitRoot();                 // whole draft finished → commit
  else scheduleCallback(workLoop);                   // out of time → continue in the next slice
}

function performUnitOfWork(fiber) {
  const next = beginWork(fiber);          // going DOWN: run the component, reconcile its children
  if (next) return next;                  // it has a child → process that next

  let f = fiber;
  while (f) {                             // no child → going UP and sideways
    completeWork(f);                      // build/prepare the DOM node (off-screen), bubble up flags
    if (f.sibling) return f.sibling;
    f = f.return;
  }
  return null;                            // reached the root: done
}
```

```
      ① beginWork(App) ↓
      ② beginWork(Header) ↓
      ③ beginWork(Logo)  (no child) → completeWork(Logo)
      ④ sibling? no → completeWork(Header) → sibling Main …
```
**beginWork** = "do this fiber's job and create/update its children" (going down).
**completeWork** = "this subtree is done; prepare DOM, collect flags" (going up).

### 13.2 What `beginWork` does for a function component
1. **Bail-out check:** can I skip this component entirely? (below)
2. Call your function with **Hooks wired to this fiber** (`renderWithHooks`). This is where `useState` finds its slot.
3. You return **new elements**. Run **`reconcileChildren`**: compare those elements with the existing child fibers.
4. Reuse, update, create, or mark-for-deletion fibers. Set `flags` accordingly.

### 13.3 Bail-outs: when React skips work
React skips re-rendering a component's function when **all** are true:
- its props are **the same reference** as last time (`oldProps === newProps`),
- it has **no pending state update** itself,
- **no Context** it reads changed,

and it can often skip the **whole subtree** if `childLanes` says nothing below has pending work.

**But:** when a parent re-renders, it creates *new* props objects for every child, so by default **no child's props are `===`**, and nothing bails out. That's the real reason children re-render with their parent. **`React.memo`** adds a shallow prop comparison *before* rendering, so if every prop is `Object.is`-equal React reuses the old result and skips the subtree.

```
Parent renders → new element {type: Child, props: {a:1}} (NEW object)
   ├─ plain Child:   props object !== old → render
   └─ memo(Child):   shallow compare {a:1} vs {a:1} → all equal → SKIP
```
(This is also why the `children` pattern works: the `children` element objects were created by a component that **didn't** re-render, so they're the *same references* and bail out.)

### 13.4 The diffing rules (reconciliation)
Comparing any two trees optimally is O(n³). React uses two **heuristics** to make it O(n):

1. **Different `type` at the same position → throw away the old subtree, build a new one.** (`<div>` → `<span>`, or `<A>` → `<B>`: all state below is destroyed.)
2. **Same `type` → reuse the fiber/DOM node, update only changed props.** Then recurse into children.
3. **For lists, `key` is the identity.** Matching by key means moved items are *moved*, not destroyed and rebuilt.

```
Old: <div><Counter/></div>        New: <span><Counter/></span>
     type changed (div → span) → entire subtree unmounted → Counter's state is LOST
```
**Lists (a bit deeper):** React first walks old and new children together by position while keys match. At the first mismatch it builds a map of the remaining old fibers **by key**, then places each new child, reusing the matching old fiber and tracking a `lastPlacedIndex` to decide which nodes actually need to be *moved* in the DOM. Without keys it falls back to index, which is why index keys misattribute state when items reorder.

For DOM elements (host fibers), `completeWork` compares old and new props and records only what changed (e.g., just `className`, or just the text).

### 13.5 Why render must be pure (the senior reason)
The render phase can be:
- **paused** and resumed (time slicing),
- **restarted** from scratch (a higher-priority update arrived),
- **thrown away** completely (e.g., a Suspense/transition discards the draft),
- **run twice** deliberately (StrictMode, development).

If your render mutated a global, made a request, or incremented a counter, those side effects would happen an unpredictable number of times. **Purity is what lets React be free to schedule.**

---

## 14. The commit phase

### 14.1 Plain words
Rendering built an invisible draft. **Commit is the moment React applies it to the real DOM**, in one uninterrupted go, so the user never sees a half-updated screen.

### 14.2 The exact sequence
```
RENDER PHASE  (can be interrupted for transitions)   ← pure, no DOM changes
      │  draft finished
      ▼
COMMIT PHASE  (synchronous, cannot be interrupted)
  ① Before-mutation   snapshot reads (class getSnapshotBeforeUpdate)
  ② Mutation          apply DOM changes: insert / update / delete nodes
                      run useLayoutEffect CLEANUPS, detach old refs, unmount deleted components
      ── root.current = workInProgress  (draft becomes the on-screen tree) ──
  ③ Layout            run useLayoutEffect SETUPS, attach refs, componentDidMount/Update
      │
      ▼
BROWSER PAINT   (the browser draws; React isn't involved)
      │
      ▼
PASSIVE EFFECTS     useEffect: ALL cleanups first, then ALL setups
```

### 14.3 What this teaches you
| Fact | Consequence |
|---|---|
| `useLayoutEffect` runs after DOM changes but **before paint** | You can measure the DOM and adjust synchronously; the user never sees the un-adjusted frame |
| `setState` inside `useLayoutEffect` triggers a synchronous re-render **before paint** | No flicker, but it **blocks** painting |
| `useEffect` runs **after paint** | Doesn't delay what the user sees. But `setState` inside it causes a *second* render after the user already saw the first (possible flicker) |
| Effects run **children before parents** | A child's effect sees its own DOM; a parent's setup runs after all children's |
| All cleanups run before any new setups (in one commit) | Teardown of the old world is complete before building the new one |
| Refs are attached in the layout step | `ref.current` is set by the time layout effects run, not during render |

> **Nuance (React 18):** if the update came from a **discrete user event** like a click or keypress, React flushes passive effects **synchronously before the browser paints**, so effects triggered by a click feel immediate. For other updates (timers, network responses), they run after paint. "Effects always run after paint" is the *usual* case, not a guarantee.

### 14.4 Why commit can't be interrupted
Mutating the DOM half-way and pausing would let the browser paint an inconsistent screen (new header, old list). Rendering is *free to pause* because it touches nothing visible; committing is *not* free to pause because it does. **Interruptible draft, atomic delivery.**

---

## 15. How Hooks actually work

### 15.1 The idea
A function component's local variables vanish when it returns. Yet `useState` "remembers." Where? **On the component's fiber**, in `fiber.memoizedState`, which is a **linked list** with one node per Hook call, in call order.

```
fiber.memoizedState
   │
   ▼
 [Hook 1: useState]  ──next──▶  [Hook 2: useEffect]  ──next──▶  [Hook 3: useRef]  ──▶ null
   state: 0                       effect: {create, deps}           { current: null }
   queue: pending updates
```

### 15.2 A toy `useState` (to feel why order matters)
```js
// NOT real React. A model of the idea.
let hooks = [];     // the "linked list", simplified to an array
let i = 0;          // which Hook call are we on during this render?

function useState(initial) {
  const idx = i;                                // this call's slot, decided purely by ORDER
  if (hooks[idx] === undefined) hooks[idx] = initial;
  const setState = (v) => {
    hooks[idx] = typeof v === "function" ? v(hooks[idx]) : v;
    rerender();
  };
  i++;
  return [hooks[idx], setState];
}

function render() { i = 0; Component(); }       // reset the pointer before each render
```
Now break it with a conditional Hook:

```js
function Component() {
  if (flag) { const [a] = useState("A"); }   // renders 1: slot 0 = "A"
  const [b] = useState("B");                  // renders 1: slot 1 = "B"
}
// render 2 with flag=false: the only useState is now slot 0 → b receives "A"'s value ❌
```
**That's the entire reason for the Rules of Hooks.** React has no names to look Hooks up by, only order.

### 15.3 The real mechanics
- **Dispatcher switching:** React sets a global "current dispatcher." During **mount**, `useState` means "create a hook node." During **update**, it means "read the existing hook node." Calling a Hook outside a component render finds no dispatcher: *"Invalid hook call."*
- **`useState` is `useReducer`** with a built-in reducer (`(s, a) => typeof a === "function" ? a(s) : a`).
- **Calling the setter** creates an *update object*, appends it to the hook's **queue** (tagged with a priority **lane**), and tells React to schedule a render. It does **not** change the value in your current snapshot.
- **During the next render**, React processes the queue **in order**, applying each update to produce the new state. That's why `setCount(c => c + 1)` ×3 gives +3: three queued updater functions run one after another.
- **Eager bail-out:** if the fiber has no pending work, React can compute the new state immediately. If it's `Object.is`-equal to the current state, it skips scheduling (mostly). Hence "same value → no re-render."
- **`useRef`** stores `{ current }` in the hook node; it's never touched by renders, so no updates are scheduled.
- **`useMemo` / `useCallback`** store `[value, deps]`. On update, compare new deps to old with `Object.is`; if all equal, return the stored value.
- **`useEffect`** stores an *effect object* `{ create, destroy, deps }`. On each render React compares `deps`; if changed, it flags the fiber `Passive` so the effect runs at commit time, and the previous `destroy` (your cleanup) runs first.
- **`useContext`** doesn't occupy a list slot the same way; it reads the nearest Provider's value directly and records a dependency on the fiber (section 18.1).

### 15.4 Why `[]`, deps, and stale closures behave the way they do
Your effect function is created **during a specific render**, so it closes over *that* render's props and state (the snapshot). React stores that function. If deps haven't changed, React keeps the **old** function (with the old snapshot) and doesn't run the new one. Missing a dependency therefore means *running a function that captured outdated values*. It isn't a React bug; it's closures plus "skip if deps equal."

---

## 16. Scheduling, priorities, and concurrent rendering

### 16.1 Plain words
Not all updates are equally urgent. A keystroke must feel instant. Filtering 10,000 products can wait a few milliseconds. React lets you say so, and the **scheduler** then works on the urgent thing first, even if that means pausing the less urgent one.

### 16.2 Lanes: how React labels urgency
Every update is tagged with a **lane** (a bit in a bitmask). Simplified, highest priority first:

| Lane (priority) | Where it comes from | Rendered how |
|---|---|---|
| **Sync** | Discrete events: click, keypress, `flushSync` | Immediately, **not** time-sliced |
| **Input continuous** | `mousemove`, scroll, drag | High priority |
| **Default** | `setState` in timeouts, promises, effects | Normal; also not time-sliced in React 18 |
| **Transition** | Updates inside `startTransition` / `useTransition` | **Time-sliced, interruptible** |
| **Retry** | Suspense retrying after data arrives | Low |
| **Idle / Offscreen** | Hidden or prefetch work | Lowest |

React picks the **highest-priority lane with pending work**, renders **only that lane's updates**, and leaves lower ones for later. Low-priority work that waits too long **expires** and gets bumped up so it can't starve forever.

> **Important nuance:** in React 18, only **transition-type** work (and deferred values/Suspense retries) is rendered in the **time-sliced, interruptible** way. An ordinary `setState`, once its render starts, runs to completion. "Concurrent" capability is *opt-in per update* via transitions. It isn't a magic global speed-up.

### 16.3 The Scheduler and time slicing
- The `scheduler` package keeps a priority queue of tasks and runs them via **`MessageChannel`** (a macrotask) so the browser regains control between slices.
- Each slice is about **5 ms** (`shouldYield()` checks the clock). When time's up, React stops after the current fiber, **yields** to the browser (input, paint), then continues from the saved pointer.

```
Without yielding:  [───────── 400 ms render ─────────]   ← page frozen, clicks ignored
With time slicing: [5ms]·browser·[5ms]·browser·[5ms]…   ← page stays responsive
```
(Remember: time slicing needs the *render* to be interruptible, which is why only transitions use it.)

### 16.4 What an interrupted transition looks like
```
t0  keystroke "a"    → URGENT update (setQuery): render input, commit immediately
t1  transition       → setResults(...) starts rendering in ~5 ms slices
t2  keystroke "ab"   → new URGENT update arrives
t3  React PAUSES/DISCARDS the half-built transition draft (screen was never touched)
t4  render input for "ab", commit (typing stays smooth)
t5  RESTART the transition draft using the latest query
t6  transition commits → results appear
```
The user never sees stale or half-rendered results, and typing never stutters.

### 16.5 Batching, internally
Updates are not rendered one by one. They are **queued with lanes**; React processes all pending updates of the chosen lane in **one render**. For the sync lane, React schedules the flush in a **microtask**, so everything your handler does synchronously gets batched before React renders. `flushSync(() => setX(1))` forces an immediate synchronous render (rarely needed: e.g., read DOM layout right after an update).

### 16.6 Tearing and `useSyncExternalStore`
If a render is paused and an **external store** changes in the middle, one half of the tree could show old data and the other half new: **tearing**. `useSyncExternalStore(subscribe, getSnapshot)` reads the store's snapshot consistently and **forces such updates to render synchronously**, trading some concurrency for correctness. Redux, Zustand and similar libraries use it for exactly this reason.

---

## 17. Transitions, deferred values, and Suspense

### 17.1 `useTransition` vs `useDeferredValue`: same goal, different handle

```jsx
// useTransition: YOU control the state update
const [isPending, startTransition] = useTransition();
function onChange(e) {
  setQuery(e.target.value);                         // urgent: input updates now
  startTransition(() => setFilter(e.target.value)); // non-urgent: heavy render can wait/interrupt
}

// useDeferredValue: React gives you a lagging copy of a VALUE
const deferredQuery = useDeferredValue(query);      // you don't own the setState (e.g., it's a prop)
const results = useMemo(() => filter(products, deferredQuery), [deferredQuery]);
```

| | `useTransition` | `useDeferredValue` |
|---|---|---|
| You wrap | the **state update** | a **value** |
| Use when | you own the `setState` | value comes from props/elsewhere |
| Gives you | `isPending` flag | a lagging value (compare to the current one to know it's stale) |
| Mechanism | update gets a transition lane | React renders old value first, then schedules a transition-lane re-render with the new value |

**How `useDeferredValue` works:** render 1 (urgent) uses the *old* deferred value, so the UI responds instantly. React then schedules a second, low-priority render with the *new* value, which is interruptible. If you keep typing, the in-progress low-priority render is discarded and restarted.

> **They don't make slow code fast.** A transition still has to finish the heavy render eventually. They keep *urgent* interactions smooth meanwhile. If the render is truly too heavy, reduce the work (virtualize, paginate). Also, transitions can't wrap controlled-input `setState` (the input must update synchronously) and can't be used for updates from `useSyncExternalStore`.

### 17.2 Suspense: how "wait for it" works
**Plain words:** a component says *"I'm not ready yet,"* and React shows a fallback from the nearest `<Suspense>` boundary until it is.

**Mechanically:** the component **throws a promise** during render (this is the classic mechanism behind `lazy()` and Suspense-enabled data libraries; React 19's `use(promise)` is the sanctioned way to do it). React catches it at the nearest `<Suspense>`, renders the `fallback`, **attaches a `.then`** to the promise, and **retries the render** when it resolves (Retry lane).

```jsx
const Checkout = lazy(() => import("./Checkout"));          // code loads on demand

<Suspense fallback={<Spinner />}>
  <Checkout />                                               // throws a promise until its code is loaded
</Suspense>
```
**Key behaviors**
- **Boundaries nest.** The *nearest* ancestor Suspense catches. Design them so one slow widget doesn't blank the whole page.
- **With a transition**, React **keeps showing the old UI** (with `isPending`) instead of swapping already-visible content for a fallback. This is why navigation inside a transition doesn't flash spinners.
- **Streaming SSR** uses Suspense boundaries to send HTML in chunks: shell first, slow parts later (section 20).
- **Errors are separate:** a rejected promise/thrown error goes to the nearest **Error Boundary**, not Suspense.
- `SuspenseList` (coordinate reveal order of several boundaries) exists only as an **experimental** API; don't rely on it in production.

---

## 18. Context, memo, and events under the hood

### 18.1 Context: why `memo` can't stop it
- The Provider's current `value` is stored on the **Provider's fiber**. A component that calls `useContext(X)` records a **dependency** on that context in its own fiber.
- When the Provider re-renders and `value` is **not `Object.is`-equal** to the old one, React **walks the subtree below the Provider**, finds every fiber that depends on that context, and **marks them as having pending work**, regardless of props, regardless of `memo`.

```
Provider value changes (new reference)
   ↓ React walks descendants
   ↓ marks every consumer fiber "needs update"
   ↓ those consumers re-render even if wrapped in memo()
```
**Consequences you can now predict:**
- `memo(Child)` doesn't help if `Child` itself calls `useContext`.
- An inline `value={{...}}` re-renders **all** consumers every time the Provider renders.
- A single big context re-renders everything that reads *any* of its fields. Split by update frequency, or move fast-changing data into a store with selectors.
- Consumers in the *middle* that don't use the context are skipped (bailed out) while React passes through to deeper consumers.

### 18.2 `React.memo` and `PureComponent`
`memo(Component)` wraps it so that, before rendering, React shallow-compares props key-by-key with `Object.is`. All equal → reuse the previous output and skip the subtree. **Shallow** means a nested object that's a new reference counts as changed even if its contents are identical. `PureComponent` is the class version (shallow compares props **and** state). `memo` never blocks the component's **own** state or context updates. You can pass a custom comparator as the second argument, but that's rarely worth the bug risk.

### 18.3 Events: how clicks reach your handler
- React attaches **one listener per event type at the root container** (since React 17; earlier at `document`). That's **event delegation**. React figures out which fiber the event came from and calls the matching handlers, simulating capture and bubble phases.
- Handlers receive a **SyntheticEvent**, a cross-browser wrapper (event pooling was removed in 17, so no more `e.persist()`).
- **The native event type sets the update's priority:** `click`, `keydown`, `input` → discrete (Sync lane); `scroll`, `mousemove`, `drag` → continuous; others → default. That's how React decides "this `setState` is urgent."
- **Portals** bubble synthetic events through the **React tree**, not the DOM tree: a click in a modal rendered via `createPortal` still bubbles to its React parent.
- `e.stopPropagation()` in React stops React-level propagation; it can interact surprisingly with native listeners added elsewhere on `document`.

---

## 19. Strict Mode, error boundaries, refs, portals, and the less common Hooks

### 19.1 StrictMode (development only)
It exists to **expose impurity and missing cleanup** by being deliberately annoying:
- Calls component bodies, `useState`/`useMemo`/reducer initializers **twice**.
- On mount, runs **setup → cleanup → setup** for effects (simulates unmount+remount) and re-runs ref callbacks (React 19).
- Has **no effect in production builds** and renders no UI. Never remove it to "fix" double logs; fix the effect.

### 19.2 Error boundaries
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }   // render fallback
  componentDidCatch(error, info) { logToService(error, info); }       // side effect: report
  render() { return this.state.hasError ? <Fallback /> : this.props.children; }
}
```
**How it works:** when a component **throws during render** (or in lifecycle/effect setup), React unwinds up the fiber tree to the nearest boundary and re-renders it with the fallback.
**Does NOT catch:** errors in **event handlers**, **async code** (promises, `setTimeout`), **server rendering**, or errors thrown **in the boundary itself**. Use `try/catch` for those. Function-component alternative: the `react-error-boundary` library (still uses a class inside). React 19 adds root options `onCaughtError` / `onUncaughtError` for centralized reporting.

**Best practices:** several small boundaries (per widget/route) instead of one around the whole app; provide a **reset** (`key` change or `resetErrorBoundary`); log to a service; don't swallow errors silently.

### 19.3 Refs
| Thing | Meaning |
|---|---|
| `useRef(initial)` | One `{current}` object that persists for the component's life (stored in the hook node) |
| `createRef()` | Creates a **new** ref object every call, so it's right for class components, wrong for function components (it resets each render) |
| Callback ref | `ref={node => ...}` called with the node on attach and `null` on detach |
| `forwardRef` | Lets a parent pass a `ref` through a function component to an inner DOM node |
| `ref` as a prop | **React 19+:** function components receive `ref` as a normal prop; `forwardRef` is no longer needed in new code |
| `useImperativeHandle(ref, () => ({ focus }))` | Exposes a **limited API** instead of the raw DOM node. Use sparingly; it works against declarative flow |

Refs are attached in the **layout** step of commit, so `ref.current` is `null` during the first render.

### 19.4 Portals
`createPortal(children, domNode)` renders children into a **different DOM node** while keeping them in the **same React tree** (context, events, state all behave as if they were in place). For modals, tooltips, dropdowns that must escape `overflow: hidden`, `z-index` stacking, or transforms.

### 19.5 The rarely used Hooks, in one line each
| Hook | When |
|---|---|
| `useInsertionEffect` | Runs **before** layout effects and before DOM mutations. **Library authors only** (CSS-in-JS injecting `<style>` rules). Can't schedule updates. |
| `useLayoutEffect` | Measure/adjust DOM before paint (tooltips, scroll restoration) |
| `useId` | Stable, SSR-safe ids for label/input pairs (never for list keys) |
| `useSyncExternalStore` | Subscribe to external stores without tearing |
| `useDebugValue` | Label custom Hooks in DevTools |
| `useImperativeHandle` | Customize the ref API a parent sees |
| `useActionState`, `useFormStatus`, `useOptimistic`, `use` | React 19 form/async primitives (verify current docs) |

**useEffect vs useLayoutEffect vs useInsertionEffect (timing):**
```
render → [useInsertionEffect] → DOM mutations → [useLayoutEffect] → paint → [useEffect]
```

---

## 20. SSR, hydration, Server Components, React 19, and the Compiler

### 20.1 Where the UI gets built

| Strategy | Who builds HTML, and when | Good for | Cost |
|---|---|---|---|
| **CSR** (client-side rendering) | Browser, after JS loads | Dashboards behind login, app-like UIs | Blank screen until JS runs; weaker SEO/first paint |
| **SSR** (server-side rendering) | Server, **per request** | Dynamic, SEO-sensitive pages | Server cost; slower TTFB if data is slow |
| **SSG** (static generation) | Server, **at build time** | Docs, marketing, blogs | Content is only as fresh as the last build |
| **ISR** (incremental static regeneration) | Static pages **rebuilt in the background** on a schedule/on demand | Large mostly-static catalogs | Framework-specific; staleness window |

> *React alone is a UI library; SSR/SSG/ISR are provided by **frameworks** (Next.js, Remix/React Router framework mode, etc.) built on React's server APIs.*

### 20.2 Hydration
**Plain words:** the server sends HTML so the user **sees** the page immediately. But it's lifeless: no click handlers. **Hydration** is React running in the browser, walking the existing HTML, **attaching event handlers and state** to it, *instead of rebuilding the DOM*.

```
Server: renderToPipeableStream(<App/>) → HTML (visible, not interactive)
Browser: shows HTML → downloads JS → hydrateRoot(el, <App/>) → React "adopts" the DOM → interactive
```
- **Hydration mismatch:** the client's first render must produce the **same output** as the server's. Things that break it: `Date.now()`, `Math.random()`, `window`/`localStorage` checks during render, locale-dependent formatting. Fix: render the same thing first, then update in an effect (or `useSyncExternalStore` with a server snapshot).
- **Streaming SSR + Suspense:** server sends the shell immediately and streams slow `<Suspense>` sections later. **Selective hydration:** React hydrates boundaries independently and prioritizes the one the user clicks on.

### 20.3 React Server Components (RSC), conceptually
- **Server Components** run **only on the server** (build or request time), can read databases/files directly, and send **zero JavaScript** for themselves to the browser. They output a serialized description (the *RSC payload*), not just HTML.
- **Client Components** (marked `"use client"`) are the interactive parts: state, effects, event handlers. They're hydrated as usual.
- **Server Functions / Actions** (`"use server"`) let client code call server logic.
- RSC needs a **framework/bundler integration** (e.g., Next.js App Router). It's an architecture choice, not something you toggle in a plain Vite SPA.
- **Mental model:** Server Components = *data + static structure*. Client Components = *interaction*. The boundary is where `"use client"` appears.

### 20.4 React 19 highlights (verify details on react.dev)
- **Actions:** async functions in transitions; `<form action={fn}>`; `useActionState`, `useFormStatus`, `useOptimistic`.
- **`use(resource)`:** read a promise or context during render (can be conditional, unlike Hooks); integrates with Suspense.
- **`ref` as a prop**, ref-cleanup functions, `<Context value>` without `.Provider`, native `<title>`/`<meta>` support.
- Better error reporting and hydration-mismatch diffs.

### 20.5 React Compiler
A **build-time** tool that analyzes your components and inserts memoization automatically, assuming you follow the **Rules of React** (pure render, immutable updates, Hooks rules). It reached a stable 1.0 release in late 2025 (check current status).
- **Helps with:** `useMemo`/`useCallback`/`memo` boilerplate; unstable-reference re-renders.
- **Doesn't fix:** state too high in the tree, giant DOM, heavy calculation, network waterfalls, or code that breaks the Rules of React (it skips those components).
- **Why you still learn manual memoization:** to understand what the compiler is doing, to read older code, and to know what *it can't* solve.

---

## 21. Why React is designed this way (the "why" table)

Senior interviews reward *reasons*, not definitions.

| Design decision | The reason |
|---|---|
| **Declarative UI** (`UI = f(state)`) | Humans are bad at tracking every DOM mutation; describing the result removes a whole class of sync bugs |
| **One-way data flow** | Every value has one owner and one direction, so you can trace who changed what |
| **Props are read-only** | A child silently mutating its inputs would make data flow untraceable |
| **State is immutable (new references)** | Change detection by cheap reference comparison (`Object.is`) instead of deep diffing; enables bail-outs, memoization, time-travel debugging |
| **Render must be pure** | Lets React pause, restart, discard and double-run renders freely |
| **Hooks by call order** | Avoids needing names/keys per Hook; cheap linked-list storage; the cost is the Rules of Hooks |
| **Effects separate from render** | Keeps render pure; side effects run at known times with explicit cleanup |
| **Virtual description + diff** | Makes the declarative model affordable: update only what changed |
| **Keys** | O(n) list diffing needs an identity hint; position alone misattributes state on reorder |
| **Fiber (linked list, two trees)** | Rendering becomes pausable, resumable and abandonable without touching the screen |
| **Render/commit split** | Interruptible drafting, atomic screen updates (no half-rendered UI) |
| **Lanes + Scheduler** | Urgent input gets priority; heavy work yields to the browser; low priority can't starve |
| **Batching** | Many updates in one event → one render, fewer wasted passes |
| **Suspense via throw** | Lets "not ready" propagate up to a boundary without every component carrying `loading` props |
| **Event delegation at root** | Fewer listeners; React controls priority and propagation |
| **Context re-renders consumers** | Correctness first: consumers must see new values; precision is your job (split, memoize, or use a store) |
| **Reconciler/renderer split** | One algorithm, many platforms |
| **Strict Mode double-invocation** | Cheapest way to reveal impurity and leaks during development |

---

# PART III — INTERVIEW AND PRACTICE

---

## 22. Interview question bank (with answers)

### Tier 1: Foundations (quick, but say the *reason*)
- **What problem does React solve?** Keeping a large, changing UI consistent with its data. Instead of manually updating every DOM location, you describe the UI as a function of state and React syncs the DOM efficiently. (Not "plain JS can't update the DOM.")
- **Is the Virtual DOM why React is fast?** Partly, but it's an oversimplification. It's a lightweight description React diffs, which makes the declarative model affordable. The main benefit is maintainability and correctness.
- **Why `key`?** Stable identity across renders so reconciliation can match, reorder, and discard the right nodes/instances instead of going by position.
- **Why map not forEach?** `map` returns an array of elements; `forEach` returns undefined.
- **When was React created / open-sourced?** Created at Facebook (used internally from ~2011), open-sourced 2013.

### Tier 2: Intermediate reasoning
- **Why are props read-only?** To keep data flow traceable; a child mutating its input would make shared data change from anywhere.
- **Why can't a child change parent state directly?** The owner controls its state; the parent hands down a callback so ownership stays clear.
- **What causes a re-render?** Own state changed; parent rendered; consumed Context changed (props changing only matters for memoized components).
- **Does re-render mean DOM change?** No. Render runs functions; commit touches only what differs.
- **Why does an object prop re-render a memoized child?** `memo` shallow-compares by reference; inline `{}`/`() => {}` is new every render.
- **Why isn't `useMemo` automatically an optimization?** It adds memory and comparison cost; it pays only for expensive work or when reference stability matters.
- **Why can `useEffect` loop forever?** The effect updates state in its own dependency chain (directly or via an unstable object/function).
- **Why does Context re-render everything?** Consumers re-render whenever the `value` reference changes. Memoize the value and split contexts.
- **Redux vs Context?** Context only delivers a value; Redux adds selectors, predictable actions, middleware, devtools. Pick by complexity and update frequency.
- **Why Zustand over Redux?** Less ceremony, no Provider, selector subscriptions: good for small/medium apps; RTK shines for large teams and strict conventions.
- **Why Axios if fetch exists?** Interceptors, auto-JSON, errors on 4xx/5xx, timeouts, shared instances. `fetch` suffices for simple cases.
- **Where does auth state live?** Global (many unrelated consumers); token storage is a separate threat-model decision (httpOnly cookie vs localStorage). Route protection is UX; the server enforces.
- **Debounce vs throttle?** Debounce runs once after events stop; throttle runs at most once per interval during a stream. Search → debounce; scroll → throttle/rAF/IntersectionObserver.
- **Debounce vs `useDeferredValue`?** Debounce reduces how *often* work runs (including API calls). `useDeferredValue` reduces *urgency* of a heavy render; it doesn't reduce request count.

### Tier 3: Advanced / internals
- **What is reconciliation?** Comparing the new element tree with the previous one to compute minimal DOM changes, using type-and-key heuristics for O(n) diffing, implemented on Fibers.
- **What is Fiber?** React's internal unit of work and data structure: a linked-list tree of fiber nodes that turns recursive rendering into a pausable, resumable loop, enabling prioritization and interruption.
- **Why linked list instead of recursion?** Recursion state lives on the uninterruptible JS call stack; a linked list keeps "where am I" in one pointer so React can yield and resume.
- **What are `current` and `workInProgress` trees?** Double buffering: the screen tree and the draft. React builds the draft off-screen and flips a pointer at commit, so abandoning a draft has no visible effect.
- **Render phase vs commit phase?** Render: pure, interruptible (for transitions), no DOM changes. Commit: synchronous, mutates DOM, runs layout effects, then passive effects after paint.
- **When do `useLayoutEffect` and `useEffect` run?** Layout: after DOM mutations, before paint, synchronously. Passive: after paint (but flushed synchronously before paint after discrete events like clicks in React 18).
- **How do Hooks work internally?** A linked list on `fiber.memoizedState`, one node per Hook call in order; dispatchers switch between mount and update behavior. Hence the Rules of Hooks.
- **Why must Hooks run in the same order?** The list has no names, only positions; changing order maps calls to the wrong stored values.
- **What is batching, and what changed in React 18?** Several updates in one tick produce one render; React 18 batches everywhere (promises, timeouts, native handlers), not just React event handlers.
- **What are lanes?** Bitmask priorities on updates (sync, continuous, default, transition, retry, idle). React renders the highest-priority pending lane first; starved work expires upward.
- **What does `useTransition` do?** Marks a state update as a low-priority transition lane: its render is time-sliced and interruptible, and urgent updates (typing) preempt it. It doesn't speed up the work itself.
- **How does Suspense work?** A component throws a promise during render; React catches at the nearest boundary, shows the fallback, and retries when the promise resolves. Transitions keep old UI instead of showing fallbacks for already-visible content.
- **Why can't `memo` stop a Context-triggered render?** Context propagation walks the tree marking consumers for update independent of props.
- **What is hydration, and what's a mismatch?** Attaching React to server-rendered HTML instead of rebuilding it; a mismatch is when client first render differs from server HTML (dates, randoms, `window` checks).
- **What are Server Components?** Components that run only on the server and ship no JS for themselves; interactivity lives in `"use client"` components.
- **What does StrictMode do and why not in production?** Double-invokes renders and effects in development to expose impurity and missing cleanup; no production effect.
- **What is `useSyncExternalStore` for?** Safely subscribing to external stores, avoiding tearing by forcing consistent, synchronous reads.
- **What does the React Compiler change?** Automatic memoization at build time, so manual `useMemo`/`useCallback` matter less; it doesn't fix architectural re-render problems.

### Tier 4: Senior debugging, performance, design
- **500+ unnecessary re-renders after toggling a sidebar: investigate.**
  1. Profile in a **production build** with "record why each component rendered."
  2. Find which components render and the reason (state, parent, context, hooks).
  3. If **Context**: is `value` an inline object? Memoize; split contexts.
  4. If **parent cascade**: move state down, use `children`, `memo` with stable props.
  5. If **store selector**: select primitives / `createSelector` / `useShallow`.
  6. Re-profile; undo changes that didn't help.
- **Optimize a 10,000-row table.** DOM size is the bottleneck. Paginate server-side or virtualize; memoize rows with stable props; avoid per-row inline objects; lazy images. Measure before and after.
- **Typing in search lags.** Colocate input state; debounce the committed value; abort stale requests; `useDeferredValue`/`useTransition` for the heavy result render; memoized rows.
- **Design state for a multi-step checkout.** Form state local to the flow (or `react-hook-form`/a reducer in a scoped provider); cart in a global store; server owns prices and totals (never trust client prices); step in the URL for back-button support; submit once with double-submit protection.
- **A teammate wraps everything in `useCallback`.** It's only useful when something downstream compares reference identity (memoized child, dependency array). Otherwise it adds overhead and noise; measure first, or enable the Compiler.
- **After logout, the old user's cart flashes for the next user.** Logout didn't clear the store/query cache/persisted storage; also in-flight requests may repopulate state: cancel and clear everything.
- **Why does my effect run twice in dev?** StrictMode simulates remount; effects must be resilient: add cleanup.
- **How do you structure a large React project?** Group by feature, service layer for API, server-state library for remote data, global store only for genuinely shared client state, URL for navigational state, error boundaries and Suspense boundaries at route/widget level, and measure performance with the Profiler.
- **Where would performance problems appear, and how do you find them?** Large lists, high-placed state, big contexts, long renders, big bundles, waterfalls. Use Profiler, Performance tab (long tasks), network waterfall, bundle analyzer.

---

## 23. Coverage map for your question-set PDF

Every topic in your PDF lives somewhere in this series. Quick finder (`01` = basics file):

| PDF topic | Where |
|---|---|
| React, components, JSX, props, state, functional vs class, Fragment, key, events, conditional/list rendering, useState, StrictMode basics | **01** |
| Controlled/uncontrolled forms, lifting state up, React Router, Context, `useEffect`, `useReducer`, custom hooks, hooks rules | **01** (meaning) + sections 4, 15 here |
| `React.memo`, pure components, shallow comparison | 5.3, 18.2 |
| `useMemo` / `useCallback` and their best practices | 5.3, 4.12, 22 |
| `useEffect` vs `useLayoutEffect` vs `useInsertionEffect` | 14, 19.5 |
| Reconciliation, keys vs index | 3.5–3.6, 13.4 |
| Fiber, concurrent mode, automatic batching, transitions, `useDeferredValue` | 12–17 |
| Suspense, lazy loading, code splitting, dynamic imports, SuspenseList | 5.3 ⑧, 17.2 |
| Error boundaries (and fallback best practices) | 19.2 |
| Portals (use cases, modal best practices) | 19.4 |
| Refs, forwardRef, `useRef` vs `createRef`, `useImperativeHandle` | 19.3 |
| SSR, CSR, SSG, ISR, hydration (and best practices) | 20 |
| Profiler, performance optimization, memoization best practices | 5, 9 |
| HOC and HOC best practices, component composition | `01` §16, 5.3 ②, 4.13 |
| Prop drilling and solutions, Context vs Redux | 4.13, 10, 18.1 |
| Redux, actions/reducers, RTK, `createAsyncThunk`, connect vs hooks | **01** §14, section 1 here |
| Event delegation | 18.3 |
| Testing Library and best practices | below |
| TypeScript integration | below |
| Lazy-loading images | 5.3 ⑧ and 6.6 |

**Testing Library, best practices (short):** test **behavior the user sees**, not implementation. Query by role/label/text (`getByRole`, `getByLabelText`), not CSS classes or component internals. Use `userEvent` for interactions, `findBy…`/`waitFor` for async, mock the network (e.g., MSW) rather than your own modules, and don't test React itself. Avoid asserting on state variables or snapshot-testing everything.

**TypeScript with React, best practices (short):** type **props** explicitly (`type Props = {...}`) and avoid `React.FC` unless you want its implicit behavior; let inference type `useState` where it can (`useState<User | null>(null)` when it can't); type events (`React.ChangeEvent<HTMLInputElement>`); use **discriminated unions** for reducer actions and loading/error/success states; avoid `any`, prefer `unknown` + narrowing at API boundaries; derive types from schemas (e.g., `z.infer<typeof schema>`); type Redux hooks once (`useAppDispatch`, `useAppSelector`).

---

## 24. Self-check

**Can I explain this?** *(aloud, without notes)*
1. Walk "Add to cart" from click to pixel, naming each arrow.
2. Why does `setCount(count + 1)` ×3 add only 1, and what's happening in the update queue when you use the updater form?
3. Render vs commit vs paint: which touches the DOM, which can be interrupted, and why?
4. Why must Hooks be called in the same order? Describe the data structure.
5. What are `current` and `workInProgress` trees and why do they exist?
6. Why can't `memo` stop a Context-triggered re-render?
7. Debounce vs throttle vs `useDeferredValue`: one sentence each, and when would you combine them?
8. What happens when a component throws a promise inside `<Suspense>`?

**Can I build this?**
1. A search box with controlled input, `useDebounce`, `AbortController`, loading/error/empty states, and a memoized results list.
2. A `ToastProvider` with a portal, auto-dismiss timers with cleanup, and a context value that doesn't re-render all consumers needlessly.
3. A tiny `useState` + `useEffect` clone (the toy from section 15) and prove the conditional-Hook bug in it.

**Can I debug this?**
1. A memoized `ProductCard` re-renders every time its parent does. Give *three* possible causes and how to verify each in the Profiler.
2. After deploying SSR, the console shows a hydration mismatch only for the "Last updated" timestamp. Why, and what are two fixes?
3. Clicking a tab freezes the UI for 400 ms. How do you find out what's slow, and which three levers do you have (reduce work, split work, lower priority)?

**Interview challenge** *(no answers: answer first)*
1. Explain Fiber to a mid-level developer in 90 seconds without using the word "reconciliation."
2. Design the loading, error, and caching behavior for a product listing page used by 50,000 users; where does each concern live?
3. "React re-renders too much." Argue both sides, then say what you'd measure before deciding.

---

## 25. The master mental model

```
                              USER
                                │
                      INTERACTION / EVENT                      (event type → priority lane)
                                │
              STATE / CONTEXT / STORE UPDATE  ── queued on the fiber's hook with a lane
                                │
                           SCHEDULER                            (which lane first? yield every ~5 ms?)
                                │
          ┌──────────────── RENDER PHASE ────────────────┐
          │  workLoop over fibers (current vs draft tree) │  pure · interruptible (transitions)
          │  beginWork: run component → new elements      │  bail out if props===, no update, no context
          │  reconcile: type + key diff → flags           │
          │  completeWork: prepare DOM, bubble flags      │
          └───────────────────────┬───────────────────────┘
                                  │ draft complete
          ┌──────────────── COMMIT PHASE ────────────────┐
          │  mutate DOM (minimal) → swap current tree     │  synchronous · atomic
          │  layout effects + refs                        │
          └───────────────────────┬───────────────────────┘
                                  │
                           BROWSER PAINT
                                  │
                       PASSIVE EFFECTS (useEffect)          cleanups → setups; may set state
                                  │
                                  └──────► back to the top
```

**The shift that marks real mastery:** from *"which Hook do I use?"* to

> *Who owns this data? What caused this render, and was it necessary? Which reference changed? What priority is this update? What's the real bottleneck, and can I prove a fix helped?*

---

## Key takeaway, mistake, self-question
- **Key takeaway:** render is a pure *description*, commit is the *only* DOM write, and the scheduler decides *when*. Almost every React behavior (re-renders, stale closures, Hook rules, effect timing, transitions) follows from those three facts plus reference equality.
- **Common mistake:** "fixing" slowness by sprinkling `useMemo`/`useCallback`/`memo` everywhere, or by debouncing the visible input, without measuring which link (renders, DOM size, network, bundle, long task) is actually the bottleneck.
- **Ask yourself:** *If React threw this render away and ran it twice, would my code still be correct, and which part of the pipeline is actually slow?*