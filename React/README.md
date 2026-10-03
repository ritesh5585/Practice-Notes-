# React — The Complete Basics
### Part 1 of 3 · "What does everything *mean*?"

| File | Question it answers | Level |
|---|---|---|
| **01 — Basics (this file)** | What is each thing? Why does it exist? Tiny example. | Beginner → comfortable |
| **02 — Intermediate: Connecting Everything** | How do the pieces fit? Where do problems appear? How do I fix them? Rendering, performance, flow. | Intermediate developer |
| **03 — Senior: Internals** | What is React actually doing underneath, and why was it designed that way? | Engineer-level |

> **How to read this file:** don't memorize. For each concept ask three things: **What is it? What problem does it solve? What breaks without it?** Everything in React is an answer to a problem someone actually had.

> **Running example:** an Amazon-style store called E-Commerce. The code below is *illustrative*, not your actual project code.

---

## 0. React in two minutes

React is a JavaScript library for building user interfaces. You break the screen into **components**, give them **data**, and React keeps the screen matching that data.

**The whole of React fits on one card:**

| Word | Plain meaning | Real-life picture |
|---|---|---|
| **Component** | A reusable piece of UI, written as a function | A LEGO brick |
| **JSX** | The HTML-looking syntax you write inside components | The brick's blueprint |
| **Props** | Inputs a parent gives to a child | An order slip handed to a chef |
| **State** | A component's own memory that affects the screen | A whiteboard in the kitchen |
| **Event** | Something the user does (click, type) | A customer ringing the bell |
| **Render** | React calling your component to find out what the UI should look like now | The chef re-reading the slip and the whiteboard |

**The loop that runs every React app, forever:**

```
User does something (event)
        ↓
State changes
        ↓
React runs your components again (render)
        ↓
React updates only what changed on screen
        ↓
User sees the result → does something again
```

If you remember nothing else, remember this loop. Every other topic in all three files is a detail of one of these arrows.

---

## 1. Why React exists

Imagine E commerce shows the **cart count** in four places: header, product page, cart page, checkout. In plain JavaScript, every time the cart changes *you* must remember to update all four places by hand. Forget one and the screen contradicts itself.

```js
// Plain JS: YOU update every place
cart.push(item);
document.querySelector("#header-count").textContent = cart.length;
renderCartPage();
renderCheckoutSummary();   // forgot this one? bug.
```

React flips this. You write what the UI should look like **for the current data**, and React does the updating:

```jsx
function Header({ cartCount }) {
  return <span>Cart: {cartCount}</span>;
}
```

| Plain JS (imperative) | React (declarative) |
|---|---|
| "Find that element, change its text" | "This is what it should show for this data" |
| You track what needs updating | React tracks it |
| Bugs: "I forgot to update X" | Bugs: "My description of X was wrong" |

> **Not the reason:** "plain JS can't update the DOM" (it can) or "DOM is slow" (not inherently). The reason is **keeping a big, changing UI consistent without human bookkeeping.**

**DOM in one line:** the browser turns your HTML into a tree of objects in memory (the Document Object Model). JavaScript can read and change it. React's job is to change it *for you*, correctly.

---

## 2. How a React app actually starts

The browser only understands HTML, CSS, and JavaScript. Not JSX. So there's a build step.

```
Your code (JSX, imports, npm packages)
      ↓  build tool (Vite)
Plain JavaScript bundle
      ↓
Browser runs it → React builds the page
```

- **Bundler (Vite):** gathers all your files and packages into files the browser can load.
- **Compiler (Babel/SWC):** turns JSX into plain JavaScript.
- **Vite vs Create React App:** CRA is deprecated by the React team. Use **Vite** (or a framework like Next.js) for new projects.

**Two packages, two jobs:**
- `react` → components, hooks, the core ideas (works for web *and* mobile).
- `react-dom` → connects React to the browser's DOM. (Mobile uses `react-native` instead.)

**The entry point:**

```html
<!-- index.html: the only HTML page. React fills the empty div. -->
<div id="root"></div>
```
```jsx
// main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
// "React, take over #root and show <App /> inside it."
```

This makes your app a **SPA (Single Page Application)**: one HTML page loads once, and JavaScript swaps the content as you navigate (no full reload). The opposite, **MPA**, loads a new HTML page per click.

---

## 3. Component

### What is it?
A **component** is a reusable piece of UI. In modern React it's just a **function that returns JSX**.

### Why does it exist?
A big website in one file is unmaintainable. Components let you split the UI into small named pieces, build each once, and reuse it everywhere.

### Picture it: E-Commerce as components

```
App
├── Header
│   ├── Logo
│   ├── SearchBar
│   └── CartIcon
├── ProductGrid
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── Footer
```

This is the **component tree**. Every React app is one. Data flows *down* it.

### The smallest component
```jsx
function ProductCard() {
  return (
    <div className="card">
      <h3>Wireless Headphones</h3>
      <p>$59</p>
    </div>
  );
}

// use it like an HTML tag:
<ProductCard />
<ProductCard />   // same design, reused
```

### Rules
1. **Name starts with a capital letter** (`ProductCard`, not `productCard`). Lowercase means "plain HTML tag" to React.
2. **Returns JSX** (or `null` to render nothing).
3. **Returns one root** (wrap in a `<div>` or a Fragment `<>…</>`).
4. **Don't define a component inside another component.** It gets recreated every render and loses its state.
5. Keep it **pure**: given the same props/state, return the same JSX. No sneaky changes to outside variables during render.

> **Class components** (`class X extends React.Component`) are the old way. They still work, but all new code uses functions + Hooks.

### The chain you should know
```
Component (function)  →  returns JSX  →  becomes React elements (plain objects)  →  React updates the DOM
```

---

## 4. JSX

### What is it?
JSX is a syntax that lets you write UI markup **inside JavaScript**. It *looks* like HTML but **is not HTML**.

### Why does it exist?
UI logic and UI markup are tightly linked (what to show depends on data). JSX keeps them together in one place instead of splitting them across files.

### What it really is
```jsx
<h1 className="title">Hi</h1>
```
is compiled into a plain function call that makes a plain object, a **React element**:
```js
{ type: "h1", props: { className: "title", children: "Hi" } }
```
JSX is **syntactic sugar**. The element is just a *description* of UI. It's not a DOM node.

### The rules (differences from HTML)

| HTML | JSX | Why |
|---|---|---|
| `class="x"` | `className="x"` | `class` is a reserved JS word |
| `for="id"` | `htmlFor="id"` | same reason |
| `onclick="..."` | `onClick={fn}` | camelCase, passes a function |
| `<img>` | `<img />` | every tag must close |
| `style="color:red"` | `style={{ color: "red" }}` | style takes an object |
| multiple roots OK | one root, or `<>…</>` | a function returns one thing |

### `{ }` = "JavaScript goes here"
```jsx
<h1>Total: {price * qty}</h1>           // expression ✅
<img src={product.image} alt="" />       // attribute value ✅
```
Only **expressions** (things that produce a value) go inside `{}`. `if` and `for` are *statements*, so use ternaries or `&&` instead:

```jsx
{isLoggedIn ? <Profile /> : <LoginButton />}   // either/or
{items.length > 0 && <CartBadge />}             // show only if true
```
> **Trap:** `{count && <X />}` renders a literal `0` when `count` is 0. Write `{count > 0 && <X />}`.

### Lists
```jsx
<ul>
  {products.map(p => (
    <ProductCard key={p.id} product={p} />
  ))}
</ul>
```
- Use **`map`**, not `forEach` (`forEach` returns nothing, so it renders nothing).
- **`key`** tells React *which item is which* between renders. Use a **stable unique id**. Avoid array index when the list can reorder, insert, or delete.

### Fragments
`<>…</>` groups siblings without adding an extra `<div>` to the DOM.

---

## 5. Props

### What are they?
**Props** (properties) are the **inputs** to a component, passed from parent to child.

### Why do they exist?
A component with hard-coded content is useless to reuse. A function has parameters; a component has props.

```js
function add(a, b) { return a + b; }        // a, b = inputs
<ProductCard product={p} />                  // product = input
```

### Example
```jsx
// Parent
<ProductCard title="Headphones" price={59} inStock={true} />

// Child: receives one object, usually destructured
function ProductCard({ title, price, inStock }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>${price}</p>
      {!inStock && <span>Sold out</span>}
    </div>
  );
}
```
- Strings use `""`. Everything else (numbers, booleans, arrays, objects, functions) uses `{}`.
- Defaults: `function Btn({ label = "Click" })`.

### Three laws of props
1. **Read-only.** A child never modifies its props. (Reason: if children could change what parents gave them, you could never tell who changed what.)
2. **One-way flow.** Data goes **parent → child**, never upward directly.
3. **Props can be anything**, including **functions**. That's how children talk back (see below).

### `children`: content between the tags
```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Anything goes in here</h2>
</Card>
```
`children` is a special prop. It makes **composition** possible: building bigger things by nesting.

### How does a child "talk back"? (Lifting state up)
A child can't change the parent's data. So the parent passes down a **function**, and the child **calls** it.

```jsx
function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (p) => setCart(prev => [...prev, p]);   // parent owns data + the changer

  return <ProductCard product={p} onAdd={addToCart} />;
}

function ProductCard({ product, onAdd }) {
  return <button onClick={() => onAdd(product)}>Add to cart</button>;
}
```
```
Parent owns state ──props (data + function)──▶ Child
Child calls function ──▶ Parent state updates ──▶ React re-renders
```
This is **"lifting state up"**: put the state in the closest parent that all interested children share.

### Props drilling (the problem that comes next)
```
App → Layout → Sidebar → Menu → MenuItem
```
If only `MenuItem` needs `user`, but `Layout`, `Sidebar`, and `Menu` must pass it along anyway, that's **prop drilling**. Fixes: **composition** (`children`), **Context**, or a **state library**. Covered in section 12 and in file 02.

### Props vs State, one table
| | Props | State |
|---|---|---|
| Who owns it | The parent | The component itself |
| Can this component change it? | No | Yes, through its setter |
| Purpose | Configure a component | Remember something that changes |

---

## 6. Events

### What are they?
Things the user does: click, type, submit, hover. You attach a **handler function**.

```jsx
function handleClick() { alert("Added!"); }

<button onClick={handleClick}>Add</button>
```

### The classic trap: pass the function, don't call it
```jsx
<button onClick={handleClick}>        // ✅ pass the function (React calls it on click)
<button onClick={handleClick()}>      // ❌ calls it NOW during render
<button onClick={() => add(id)}>      // ✅ wrap when you need arguments
```

### Handy to know
- Handlers receive an **event object**: `e.target.value`, `e.preventDefault()`.
- `e.preventDefault()` stops the browser's default action (e.g., a form reloading the page).
- React wraps native events for consistency (**synthetic events**). Internally it uses **event delegation** (one listener near the root rather than one per element).
- Common events: `onClick`, `onChange`, `onSubmit`, `onKeyDown`, `onMouseEnter`.

---

## 7. State

### What is it?
**State** is data **a component remembers between renders**, and when it changes, **the screen updates**.

### Why does it exist? The key experiment

```jsx
function Counter() {
  let count = 0;                       // ordinary variable

  return (
    <button onClick={() => { count++; console.log(count); }}>
      Clicked {count}
    </button>
  );
}
```
Click it: the console shows 1, 2, 3, but **the button always says 0**. Two reasons:

1. **React doesn't know the variable changed.** It only re-renders when told, via state.
2. Even if it re-rendered, the function would run again and reset `count` to `0`. A normal variable **dies when the function finishes**.

State fixes both: it **lives outside the function call** (React stores it) and **tells React to re-render** when changed.

> *"React sirf state change par react karta hai."*

### `useState`
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  //     ↑ current value  ↑ setter     ↑ initial value (only used on first render)

  return <button onClick={() => setCount(count + 1)}>Clicked {count}</button>;
}
```
`useState` returns a 2-item array: **the current value** and **a function to request a change**.

### What happens when you call the setter?
```
setCount(1)
   ↓
React is told: "this component's state changed"
   ↓
React schedules a re-render (does NOT change the variable instantly)
   ↓
Component function runs again → useState now returns 1
   ↓
New JSX → React updates the screen
```
**Important:** the setter doesn't change the `count` you're currently holding. Each render has its own fixed **snapshot** of state.

```jsx
setCount(count + 1);
console.log(count);     // still the OLD value in this render
```

### Rule 1: update from the previous value with a function
```jsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);       // result: +1 (all three use the same snapshot)

setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);   // result: +3
```
Use `prev => …` whenever the new value depends on the old one.

### Rule 2: never mutate. Always create a new copy
React detects a change by checking whether the **reference** is different. Mutating in place keeps the same reference, so React may skip the update.

```jsx
// Object
setUser(prev => ({ ...prev, age: 22 }));

// Array: add / remove / update
setItems(prev => [...prev, newItem]);
setItems(prev => prev.filter(i => i.id !== id));
setItems(prev => prev.map(i => i.id === id ? { ...i, done: true } : i));

// ❌ items.push(x); setItems(items);   same array, React sees nothing
```

### Rule 3: don't store what you can calculate (derived data)
```jsx
const [items, setItems] = useState([]);
const count = items.length;                              // ✅ derive
const total = items.reduce((s, i) => s + i.price, 0);    // ✅ derive
// ❌ separate useState for count and total can drift out of sync
```

### Where should state live?
Put it in the **lowest component that needs it, or the closest common parent** of those that do. Needed by 1 component → keep local. Needed by siblings → lift to their parent. Needed far across the app → Context or a store (sections 12 and 15).

### State examples in E-Commerce
Quantity selector, search text, modal open/close, selected filter, loading and error flags, wishlist toggle.

---

## 8. Rendering

### What does "render" mean?
> **Render = React calls your component function to find out what the UI should look like.**

That's it. **Render does not mean "draw on screen" and does not mean "change the DOM."** It's just React *asking your function a question*.

### The three steps (memorize this)

```
1. TRIGGER   something causes a render
2. RENDER    React calls your component functions → gets new JSX (descriptions)
3. COMMIT    React compares with the previous result and applies ONLY the differences to the real DOM
                    ↓
            Browser paints the pixels
```

| | Does it touch the DOM? |
|---|---|
| Render | No. Just runs functions. |
| Commit | Yes, only the changed parts. |
| Paint | Browser's job, not React's. |

### What triggers a re-render?
1. The component's **own state** changes.
2. Its **parent re-renders** (children re-render by default, even if their props are identical).
3. A **Context** value it uses changes.

### Does React rebuild the whole DOM on every render?
**No.** It re-runs functions (cheap), compares old vs new descriptions (**reconciliation**), and touches only the DOM nodes that differ. If you change one price, only that text node changes.

### The story: "what happens when I click *Add to Cart*?"

```
1. User clicks the button
2. onClick handler runs
3. Handler calls setCart(...)        ← state update requested
4. React schedules a re-render
5. RENDER: components run again with the new cart → new JSX
6. React compares new vs old output (reconciliation)
7. COMMIT: only the cart badge text is updated in the real DOM
8. Browser paints → user sees "Cart: 3"
9. Effects run (section 11)
```

### Batching
Several state updates in one event → **one** re-render, not several. (React 18+ does this everywhere: handlers, timeouts, promises.)

### Initial render
The first time, there's nothing to compare, so React creates all the DOM nodes. That's the *initial render*.

### StrictMode
In development, `<StrictMode>` deliberately runs components and effects twice to expose impure code and missing cleanup. Production doesn't do this. If you see double logs in dev, that's why.

---

## 9. Forms: controlled vs uncontrolled

**Problem:** submitting a form reloads the page by default, and React apps shouldn't reload.

**Controlled:** React state is the single source of truth, updated on every keystroke.
```jsx
const [name, setName] = useState("");
<input value={name} onChange={e => setName(e.target.value)} />
```
Use when you need live validation, formatting, or fields reacting to each other. Most real forms.

**Uncontrolled:** the DOM holds the value; you read it when needed through a ref.
```jsx
const nameRef = useRef(null);
<form onSubmit={e => { e.preventDefault(); console.log(nameRef.current.value); }}>
  <input ref={nameRef} />
</form>
```
Use for quick forms or non-React integration.

**Form libraries:** `react-hook-form` (less re-rendering, easy validation) + `zod`/`yup` (validation schemas). In React 19, `<form action={fn}>` and Actions exist too.

---

## 10. Hooks: the big idea

### What is a Hook?
A **Hook** is a function starting with `use` that lets a function component use React features: memory (state), side effects, shared data, and more.

### Why do they exist?
Function components run top to bottom and **forget everything** after each run. Hooks give them memory and abilities, without needing class components.

### The two rules (and the real reason)
1. **Call Hooks only at the top level**: never inside `if`, loops, or nested functions.
2. **Call Hooks only from components or custom Hooks.**

*Why?* React tracks Hooks **by call order**, not by name. If the order differs between renders, React hands back the wrong stored value.

### Each Hook = a problem + a solution

| Problem you have | Hook | One-line meaning |
|---|---|---|
| "I need to remember a value and update the UI when it changes." | `useState` | Component memory that triggers renders |
| "State logic with many related transitions." | `useReducer` | State changes via named actions |
| "I need to sync with something outside React (API, timer, event listener)." | `useEffect` | Run code after render to sync with the outside |
| "I need to keep a value without re-rendering, or grab a DOM element." | `useRef` | A persistent box; changing it doesn't render |
| "Lots of components need the same data; no drilling." | `useContext` | Read shared data from a Provider above |
| "An expensive calculation shouldn't rerun every render." | `useMemo` | Cache a calculated **value** |
| "I need the same function reference between renders." | `useCallback` | Cache a **function** |
| "I must measure/adjust the DOM before the browser paints." | `useLayoutEffect` | Like `useEffect`, but before paint |
| "I need a unique, stable id for accessibility." | `useId` | Generated id for label/input pairs |
| "A heavy update is blocking typing." | `useTransition` | Mark an update as non-urgent |
| "A value should lag behind during heavy rendering." | `useDeferredValue` | A lower-priority copy of a value |
| "Subscribe to a store outside React safely." | `useSyncExternalStore` | Library-level external-store subscription |

### 10.1 `useEffect`: syncing with the outside world

**Meaning:** run code *after React updates the screen*, to synchronize with something that isn't React.

```jsx
useEffect(() => {
  // setup: runs after render
  const id = setInterval(tick, 1000);

  return () => clearInterval(id);   // cleanup: runs before next setup / on unmount
}, [dependencies]);                  // controls WHEN it re-syncs
```

**The dependency array is a contract, not a speed knob:**

```jsx
useEffect(fn);            // after every render
useEffect(fn, []);        // after first render (no reactive values used)
useEffect(fn, [userId]);  // first render + whenever userId changes
```
Rule: **if the effect reads a value from the component, list it.** (The ESLint rule `react-hooks/exhaustive-deps` helps.)

**Cleanup** undoes setup: clear timers, remove listeners, close sockets. Skipping it causes leaks and "it fires twice" bugs.

**Fetching data (basic form):**
```jsx
useEffect(() => {
  let ignore = false;                     // guards against stale responses
  fetch(`/api/products/${id}`)
    .then(r => r.json())
    .then(data => { if (!ignore) setProduct(data); });
  return () => { ignore = true; };
}, [id]);
```

**Classic mistakes**
```jsx
useEffect(() => { setCount(count + 1); }, [count]);   // ❌ infinite loop: effect changes its own trigger
useEffect(() => { setFull(first + last); }, [first, last]);  // ❌ don't need an effect:
const full = first + last;                                    // ✅ just compute it
```
> **Ask first:** "What *external system* am I syncing with?" If the answer is "nothing," you probably don't need an effect.

### 10.2 `useRef`: a box that doesn't trigger renders
```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>
```
Use for: DOM elements, timer IDs, previous values. **Don't** use it for anything the screen must show (changing `.current` won't re-render).

### 10.3 `useReducer`: state with rules
```jsx
function reducer(state, action) {
  switch (action.type) {
    case "add":    return [...state, action.item];
    case "remove": return state.filter(i => i.id !== action.id);
    default:       return state;
  }
}
const [cart, dispatch] = useReducer(reducer, []);
dispatch({ type: "add", item });
```
```
UI → dispatch(action) → reducer(oldState, action) → newState → render
```
Use when many updates are related. For a simple boolean, `useState` is enough.

### 10.4 `useMemo` and `useCallback`: remembering things
```jsx
const sorted = useMemo(() => [...products].sort(byPrice), [products]);   // remembers a VALUE
const onAdd  = useCallback((p) => addToCart(p), []);                     // remembers a FUNCTION
```
**Why would you ever need this?** In JS, `{} === {}` is `false` and `(() => {}) === (() => {})` is `false`. Every render creates *new* objects and functions. That matters only when something compares them: `React.memo` children or Hook dependency arrays.

> **They are not "go-faster buttons."** Memoizing cheap work adds overhead for nothing. Measure first (file 02).

### 10.5 `useLayoutEffect`, `useId`, `useTransition`, `useDeferredValue`
- **`useLayoutEffect`:** runs after DOM changes but *before* paint. Use only for measuring layout (e.g., tooltip position). Default to `useEffect`.
- **`useId`:** stable unique id for `label htmlFor` ↔ `input id`. Never for list keys or database ids.
- **`useTransition`:** `startTransition(() => setResults(...))` marks a heavy update as low-priority so typing stays responsive.
- **`useDeferredValue`:** gives you a version of a value that updates later, letting urgent UI render first.

### 10.6 Custom Hooks: reuse *logic*, not UI
**Meaning:** a function starting with `use` that combines other Hooks, so you don't copy-paste the same state + effect logic.

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Anywhere:
const debouncedQuery = useDebounce(searchText);
```
Each component that calls it gets its **own separate copy of state**. You share the *logic*, not the data. E-Commerce candidates: `useAuth`, `useCart`, `useFetch`, `useTheme`.

---

## 11. Context & prop drilling

**Problem:** `user` or `theme` is needed deep in the tree. Passing it through every level is painful.

**Context = a tunnel:** a Provider puts a value in, any descendant reads it directly.

```jsx
// 1. Create
const ThemeContext = createContext("light");

// 2. Provide (wrap the part of the tree that needs it)
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consume (any depth)
function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>{theme}</button>;
}
```
(In React 19 you can write `<ThemeContext value={...}>` directly. `.Provider` still works.)

**Good for:** theme, language, logged-in user, app config. **Not magic:** every component using a Context re-renders when its value changes. Context is a *delivery mechanism*, not a full state manager.

---

## 12. Data fetching & APIs

- **API:** a URL where the backend gives or accepts data, usually as **JSON**.
- **HTTP methods:** `GET` read · `POST` create · `PUT/PATCH` update · `DELETE` remove.
- **fetch:** built into the browser. Returns a Promise. You call `res.json()` yourself, and it **does not throw on 404/500**. Check `res.ok`.
- **Axios:** a library. Auto-parses JSON, throws on non-2xx, supports interceptors (e.g., auto-attach auth tokens), timeouts, and instances. Not "better," just more convenient for bigger apps.

```jsx
const res = await fetch("/api/products");
if (!res.ok) throw new Error("Failed");
const data = await res.json();
```

**Every fetch has 3 states:** loading, success (data), error. Always design all three.

**At scale:** use a **server-state library** (TanStack Query, RTK Query, SWR) rather than hand-writing `useEffect` + loading + errors + caching for every call. *Server state* (data that lives on a backend) is a different problem from *UI state* (is this modal open?).

---

## 13. Routing

**Meaning:** show different components for different URLs, **without reloading the page**.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

| Need | Tool |
|---|---|
| Navigate without reload | `<Link to="/cart">` (not `<a>`) |
| Highlight the active link | `<NavLink>` |
| Read `/products/:id` | `useParams()` |
| Navigate after a click/logic | `useNavigate()` |
| Redirect during render | `<Navigate to="/login" />` |
| Read `?category=phones` | `useSearchParams()` |
| Where am I now? | `useLocation()` |
| Render nested child routes | `<Outlet />` |

**Memory trick:** `useNavigate` → *user did something*. `<Navigate />` → *a condition became true while rendering*.

**Protected route:**
```jsx
function Protected({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
}
```
Why URL state matters: filters/search/page in the URL are **shareable, bookmarkable, and survive refresh**.

*(React Router v7 imports from `react-router`; `react-router-dom` still works. Check current docs.)*

---

## 14. Global state tools (the evolution)

```
useState → lift state up → composition → Context → useReducer + Context → Redux Toolkit / Zustand
```
Each step exists because the previous one started to hurt:

| Tool | The pain that led here | Meaning |
|---|---|---|
| **useState** | none yet | Local memory |
| **Lifting up** | siblings need the same data | Move state to common parent |
| **Context** | drilling through many levels | Tunnel for shared data |
| **Redux Toolkit** | many unrelated parts, frequent updates, need debugging tools | One central store, changes only through actions |
| **Zustand** | want a global store with less ceremony | Small hook-based store |

### Redux in plain words
```
Component → dispatch(action) → reducer → new state in store → components that read it re-render
```
- **Store:** the single object holding the app's global state.
- **Action:** a message saying what happened: `{ type: "cart/add", payload: item }`.
- **Reducer:** pure function `(state, action) → newState`.
- **Selector:** function that reads a slice of state.
- **Redux Toolkit (RTK):** the modern, officially recommended way to write Redux. Less boilerplate, Immer built in (so `state.count++` is safe), DevTools and thunk included.

```jsx
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    add: (state, action) => { state.items.push(action.payload); },   // Immer makes this safe
  },
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });

const items = useSelector(s => s.cart.items);
const dispatch = useDispatch();
dispatch(cartSlice.actions.add(product));
```
Async: `createAsyncThunk` (generates pending/fulfilled/rejected). **RTK Query** handles API caching.

### Zustand in plain words
```jsx
const useCart = create((set) => ({
  items: [],
  add: (p) => set(s => ({ items: [...s.items, p] })),
}));

const items = useCart(s => s.items);   // re-renders only when `items` changes
```

> **No winner.** Component-only → `useState`. Few shared values, rare changes → Context. Large app, complex flows, team conventions → Redux Toolkit. Medium app, want simplicity → Zustand. Data from a server → TanStack Query / RTK Query.

---

## 15. Performance vocabulary (meaning only; the *when* and *why* are in file 02)

| Term | Meaning |
|---|---|
| `React.memo` | Skip re-rendering a child if its props didn't change |
| `useMemo` / `useCallback` | Keep values/functions the same between renders |
| **Code splitting** | Break the JS bundle so pages load only what they need |
| `React.lazy` + `<Suspense>` | Load a component on demand and show a fallback meanwhile |
| **Virtualization** | Render only visible rows of a huge list |
| **Debounce / throttle** | Limit how often something runs during rapid events |
| **Profiler** | React DevTools tool that shows what rendered and why |
| **State colocation** | Keep state close to where it's used, so fewer components re-render |

```jsx
const Checkout = lazy(() => import("./Checkout"));
<Suspense fallback={<Spinner />}><Checkout /></Suspense>
```
**Golden rule:** make it correct → **measure** → fix the real bottleneck → measure again.

---

## 16. Other concepts you'll be asked about

| Concept | Meaning | One-liner example/use |
|---|---|---|
| **Error Boundary** | A component that catches render errors in its children and shows a fallback instead of crashing the whole app. Written as a class (or via `react-error-boundary`). Doesn't catch event-handler or async errors. | Wrap a widget so one broken card doesn't blank the page |
| **Portal** (`createPortal`) | Render a component's output in a different DOM place while staying in the same React tree | Modals/tooltips that must escape `overflow: hidden` |
| **Refs & forwarding** | Let a parent reach a child's DOM node. In React 19+ function components accept `ref` as a normal prop; older code uses `forwardRef`. | Focus an input inside a custom `<TextField />` |
| **HOC** (higher-order component) | A function that takes a component and returns an enhanced one. Mostly replaced by Hooks. | `withAuth(Dashboard)` |
| **Pure component / memo** | Re-render only if props/state changed (shallow comparison) | `PureComponent` (class) ≈ `React.memo` (function) |
| **Shallow comparison** | Compare only top-level values by reference | Why a new `{}` prop looks "changed" |
| **Fragment** | Group elements without a wrapper node | `<>…</>` |
| **SSR / SSG / ISR** | Build HTML on the server per request / at build time / rebuild static pages in background | Frameworks like Next.js |
| **Hydration** | React attaches interactivity to server-rendered HTML | Happens after SSR HTML loads |
| **Suspense** | Declarative "show a fallback while something isn't ready" | Lazy components, supported data sources |
| **Concurrent rendering** | React can pause/prioritize rendering work to keep the UI responsive | Powers `useTransition` |
| **React Compiler** | Build-time tool that can add memoization automatically | Reduces hand-written `useMemo`/`useCallback` |
| **Testing Library** | Test components the way users use them (find by text/role, click, assert) | `render`, `screen.getByRole`, `userEvent` |
| **TypeScript** | Typed JavaScript; catches wrong props at build time | `function Card({ title }: { title: string })` |

---

## 17. How a real project is organized (meaning of the folders)

```
src/
├── components/   reusable UI pieces (ProductCard, Button)
├── pages/        one component per route (Home, ProductPage, Cart)
├── hooks/        custom hooks (useAuth, useDebounce)
├── services/     functions that talk to the API (productService.js)
├── context/      Contexts/Providers (ThemeContext, AuthContext)
├── store/        Redux/Zustand setup (or features/ with slices)
├── utils/        plain helper functions (formatPrice)
└── assets/       images, fonts
```
**Why a `services` folder?** So API URLs and request logic live in **one place**, not scattered across components. Change the API once, not in 40 files.

```
ProductPage → productService.getProduct(id) → API → response → state/store → ProductCard shows it
```
> This is a *common* layout, not a law. Small apps need less. Large apps often group by **feature** (`features/cart/`, `features/auth/`), keeping each feature's components, hooks, and slice together.

---

## 18. One-line glossary

| Term | Meaning |
|---|---|
| Component | Reusable UI function |
| JSX | HTML-like syntax that becomes JS objects |
| React element | Plain object describing a UI piece |
| Props | Read-only inputs from parent |
| State | Component memory that triggers re-renders |
| Render | React calling your component to get new JSX |
| Commit | React applying the DOM differences |
| Reconciliation | Comparing old vs new descriptions |
| Virtual DOM | The lightweight description tree React diffs (not literally a "copy of the DOM") |
| Key | Identity tag for list items |
| Hook | `use…` function that gives components abilities |
| Effect | Code that syncs with the outside world after render |
| Ref | Mutable box that doesn't trigger renders |
| Context | Tunnel for shared data |
| Reducer | `(state, action) → newState` |
| Controlled input | Input whose value lives in state |
| Lifting state up | Moving state to a shared parent |
| Prop drilling | Passing props through components that don't need them |
| Memoization | Caching a result to avoid redoing work |
| SPA | One page, JS swaps content |
| Hydration | Making server HTML interactive |

---

## 19. Self-check

**Can I explain this?**
1. Why doesn't changing a normal variable update the screen?
2. Difference between props and state, and who owns each?
3. What does "render" mean, and does it touch the DOM?
4. Why can't a child directly change parent state, and what does it do instead?
5. Why must Hooks be called in the same order every render?

**Can I build this?**
1. A `ProductCard` list from an array with `key`, an "Add to cart" button, and a header showing cart count. (Hint: state lives in `App`.)
2. A search box that filters that list, using a controlled input and derived (not stored) filtered results.

**Mini-challenge:** write a `useToggle()` custom hook returning `[isOn, toggle]`, then use it in two different components.

---

## Key takeaway, mistake, self-question
- **Key takeaway:** React is a loop: *event → state change → render → minimal DOM update.* Every concept is a piece of that loop.
- **Common mistake:** reaching for `useEffect`, `useMemo`, or Redux before asking whether plain props, derived values, or local state would do.
- **Ask yourself:** *Who owns this data, and what makes the screen change when it changes?*

---

**Next → `02-react-intermediate.md`:** we connect all of this. How does a click travel through props, state, context, store, API, and back to the screen? Where do re-render problems come from, how do you measure and fix them, and how do you design state for a real app.