# Redux Toolkit Notes

## What is Redux?

Redux is a state management library that stores application data in a centralized store.

Instead of passing data through multiple components (Prop Drilling), components can directly access and update shared state from the Redux Store.

---

## Why Redux?

### Without Redux

Parent
 ↓
Child
 ↓
GrandChild
 ↓
Deep Child
```

Passing props through many levels becomes difficult in large applications.

### With Redux

```text
Component
    ↓
 Redux Store
    ↑
Component
```

Any component can access shared data directly.

---

## Why Redux Toolkit (RTK)?

Redux Toolkit is the official way to write Redux.

### Benefits

* Less boilerplate
* Built-in DevTools
* Built-in middleware
* Easy async handling
* Better developer experience

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

---

## Core Concepts

| Concept  | Purpose                    |
| -------- | -------------------------- |
| Store    | Holds application state    |
| Slice    | State + Reducers + Actions |
| Reducer  | Updates state              |
| Action   | Describes what happened    |
| Dispatch | Sends action               |
| Selector | Reads state                |

---

## Redux Flow

```text
User Action
     ↓
Dispatch
     ↓
Reducer
     ↓
Store Update
     ↓
UI Re-render
```

Example:

```js
dispatch(addToCart(product))
```

---

## Common Hooks

### Read State

```js
const user = useSelector(
  state => state.user
)
```

### Update State

```js
const dispatch = useDispatch()

dispatch(login(userData))
```

---

## Async Operations

Use:

```js
createAsyncThunk()
```

For:

* API Calls
* Authentication
* Server Requests

States:

```text
Pending
Success
Rejected
```

---

## Context API vs Redux

| Context API        | Redux Toolkit         |
| ------------------ | --------------------- |
| Small Apps         | Medium/Large Apps     |
| Simple Setup       | Scalable              |
| No DevTools        | DevTools Support      |
| Manual Async Logic | Better Async Handling |

---

## TypeScript Setup

```ts
export type RootState =
  ReturnType<typeof store.getState>

export type AppDispatch =
  typeof store.dispatch
```

Typed Hooks:

```ts
export const useAppDispatch =
  () => useDispatch<AppDispatch>()

export const useAppSelector =
  useSelector.withTypes<RootState>()
```

---

## Recommended Structure

```text
src
├── app
│   └── store.ts
│
├── features
│   ├── user
│   │   └── userSlice.ts
│   │
│   └── cart
│       └── cartSlice.ts
│
└── hooks
    └── reduxHooks.ts
```

Feature-based structure keeps related code together and scales better.

---

## Interview Questions

**What problem does Redux solve?**
Centralized state management and prop drilling.

**What is a Store?**
Central container holding application state.

**What is a Slice?**
Feature module containing state, reducers, and actions.

**What is Dispatch?**
Method used to trigger actions.

**What is Selector?**
Method used to read data from the store.

**Why Redux Toolkit?**
Reduces Redux boilerplate and improves developer experience.

**Why createAsyncThunk?**
Handles asynchronous operations such as API requests.

**Why does state.count++ work?**
Redux Toolkit uses Immer internally to maintain immutability.

---

## Mental Model

```text
Store     → Database
State     → Data
Action    → Request
Dispatch  → Send Request
Reducer   → Update Logic
Selector  → Read Data
```

Redux = Centralized State Management for React Applications.
