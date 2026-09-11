# TypeScript — Complete Notes & Interview Prep Sheet

*Beginner → Advanced concepts, rapid-fire Q&A, coding problems, and HR round prep — built for revision before an interview, not for first-time learning.*

---

## Table of Contents
1. [Why TypeScript Exists](#1-why-typescript-exists)
2. [Beginner — Core Syntax](#2-beginner--core-syntax)
3. [Intermediate — Type System Tools](#3-intermediate--type-system-tools)
4. [Advanced — What Separates Junior from Senior](#4-advanced--what-separates-junior-from-senior)
5. [TypeScript with React](#5-typescript-with-react)
6. [tsconfig & Compiler Behavior](#6-tsconfig--compiler-behavior)
7. [Rapid-Fire Interview Q&A (Beginner → Staff Level)](#7-rapid-fire-interview-qa-beginner--staff-level)
8. [Coding Round Problems](#8-coding-round-problems)
9. [Common Mistakes That Get You Rejected](#9-common-mistakes-that-get-you-rejected)
10. [HR / Behavioral Round Prep](#10-hr--behavioral-round-prep)
11. [One-Page Cheat Sheet](#11-one-page-cheat-sheet)

---

## 1. Why TypeScript Exists

**One-line answer interviewers want:** "TypeScript adds a static type system on top of JavaScript, so type errors are caught at compile time instead of at runtime — which matters most in large, multi-contributor codebases where a function's caller and its definition are far apart."

| JavaScript | TypeScript |
|---|---|
| Errors surface at runtime, often in production | Errors surface while typing, in the editor |
| No contract between function and caller | Function signature IS the contract |
| Refactoring is risky — nothing tells you what broke | Refactoring is safer — compiler tells you every broken call site |
| Great for prototypes | Great for prototypes **and** for codebases with many contributors |

TypeScript compiles ("transpiles") down to plain JavaScript — **types do not exist at runtime**. This is one of the most-asked "gotcha" facts in interviews (see Q&A section).

---

## 2. Beginner — Core Syntax

### Variables & primitive types
```typescript
let username: string = "Ritesh";
let age: number = 21;          // no separate int/float — just `number`
let isLoggedIn: boolean = true;
```
If you don't annotate, TypeScript infers the type from the assigned value (**type inference**) and locks it in — you can't reassign a different type later.

### Functions
```typescript
function add(a: number, b: number): number {
  return a + b;
}
function greet(name: string): void {   // void = returns nothing
  console.log(`Hello ${name}`);
}
```

### Arrays
```typescript
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["A", "B"];     // equivalent syntax
let mixed: (number | string)[] = [1, "two"]; // union inside array
```

### Objects & Interfaces
```typescript
interface Book {
  title: string;
  pages: number;
  isAvailable: boolean;
}
let b: Book = { title: "Atomic", pages: 320, isAvailable: true };
```
**Mental model:** an interface is a contract — any variable of that type must have exactly those fields (unless marked optional).

### Union Types
```typescript
type SignatureMethod = "draw" | "type" | "upload";
let m: SignatureMethod = "draw";   // only these 3 strings allowed
```
Safer than `string` — a typo like `"drawn"` is caught at compile time instead of silently passing through.

### Optional Properties (`?`)
```typescript
interface User {
  name: string;
  phone?: string;   // may or may not exist
}
```

### Optional Chaining (`?.`) and Nullish Coalescing (`??`)
```typescript
console.log(user.address?.city);            // stops safely if address is undefined
let city = user.address?.city ?? "Unknown"; // fallback only if null/undefined
```
**Interview trap:** `??` differs from `||` — `0 || "default"` gives `"default"` (0 is falsy), but `0 ?? "default"` gives `0` (0 is not null/undefined). Always use `??` for numeric/boolean defaults.

### Arrays of Objects + `.filter()` / `.map()` / `.reduce()`
```typescript
interface Student { name: string; marks: number; }
const students: Student[] = [ /* ... */ ];
const toppers = students.filter((s) => s.marks >= 90);
const names = students.map((s) => s.name);
const total = students.reduce((sum, s) => sum + s.marks, 0);
```

---

## 3. Intermediate — Type System Tools

### `type` vs `interface`
```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }   // extends

type Status = "loading" | "success" | "error";     // interface CANNOT do this
type ID = string | number;                          // interface CANNOT do this
type DogType = Animal & { breed: string };           // intersection
```
**Interview answer:** "Functionally almost identical for object shapes. `interface` supports declaration merging and reads better for public API shapes; `type` is required for unions, intersections, and primitive aliases. Most teams pick a convention and enforce it via lint rule rather than debating it per-PR."

### Utility Types (built-in, no import needed)
| Utility | What it does | Example |
|---|---|---|
| `Partial<T>` | every field optional | `Partial<Book>` → all fields `?` |
| `Required<T>` | every field mandatory (opposite of Partial) | strips existing `?` |
| `Pick<T, K>` | keep only listed keys | `Pick<Book, "title">` |
| `Omit<T, K>` | remove listed keys | `Omit<Book, "isAvailable">` |
| `Record<K, V>` | object type with controlled key/value types | `Record<string, Book[]>` |
| `Readonly<T>` | fields become non-reassignable | `Readonly<Book>` |
| `ReturnType<F>` | extracts a function's return type | `ReturnType<typeof getUser>` |
| `Parameters<F>` | extracts a function's parameter tuple | `Parameters<typeof add>` |

### Enums vs Union Types
```typescript
enum SignatureMethod { Draw = "draw", Type = "type", Upload = "upload" }
```
**Interview answer:** "I know enums, but I default to union-of-string-literals in modern code — enums emit actual runtime JS objects and have inconsistent behavior between numeric and string enums, whereas literal unions are purely compile-time and tree-shake cleanly."

### Type Assertions (`as`)
```typescript
const canvas = document.getElementById("pad") as HTMLCanvasElement;
```
Escape hatch — tells the compiler "trust me." Never use it to silence an error you don't actually understand; that reintroduces the exact runtime risk TS is meant to prevent.

### Destructuring, Spread, Rest
```typescript
const { title, pages } = book;               // object destructuring
const [first, second] = [10, 20];             // array destructuring
const updated = { ...book, pages: 350 };      // spread — new object, no mutation
function logAll(first: string, ...rest: string[]) {}  // rest params
```

### Classes
```typescript
class Signature {
  private method: string;       // only accessible inside the class
  readonly createdAt: Date;     // settable once, in constructor only
  constructor(public id: string, method: string) {  // "public id" = shorthand property
    this.method = method;
    this.createdAt = new Date();
  }
}
```

### Async/Await
```typescript
async function computeHash(text: string): Promise<string> { /* ... */ }
```
Any `async` function's return type is automatically wrapped in `Promise<T>` — even a plain `return value` inside it becomes `Promise<typeof value>`.

### Try/Catch with `unknown`
```typescript
try { JSON.parse(bad); }
catch (error) {
  if (error instanceof Error) console.log(error.message);  // narrow before use
}
```
`catch` variables are typed `unknown` by default in modern TS — you must narrow before accessing properties.

### Modules
```typescript
export function add(a: number, b: number) { return a + b; }
import { add } from "./utils";
```

---

## 4. Advanced — What Separates Junior from Senior

This is the section that actually gets tested at mid/senior interviews. Know these cold.

### `any` vs `unknown` (asked in nearly every interview)
```typescript
let a: any = fetchData();
a.whatever.you.want();    // compiles — no safety at all, defeats TypeScript's purpose

let u: unknown = fetchData();
u.name;                    // ❌ error — must narrow first
if (typeof u === "object" && u !== null && "name" in u) {
  console.log((u as { name: string }).name);
}
```
**Interview answer:** "`any` opts a value out of type checking entirely. `unknown` is the type-safe counterpart — you can assign anything to it, but you must narrow it before using it. I use `unknown` for anything coming from outside the program boundary (API responses, `JSON.parse`, user input) and treat `any` as a last resort or a sign the types need fixing."

### Type Narrowing techniques
```typescript
// typeof — for primitives
function fmt(x: string | number) {
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(2);
}

// instanceof — for classes
function handle(e: Error | string) {
  if (e instanceof Error) console.log(e.message);
}

// "in" operator — for checking object shape
type Cat = { meow: () => void };
type Dog = { bark: () => void };
function speak(a: Cat | Dog) {
  if ("meow" in a) a.meow(); else a.bark();
}

// discriminated unions — the most important pattern in real codebases
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
  }
}
```
**Discriminated unions are the #1 "senior-level" pattern.** The shared literal field (`kind`) lets TypeScript narrow the exact shape inside each branch automatically — no casting needed.

### `keyof` and `typeof` operators
```typescript
interface Book { title: string; pages: number; }
type BookKeys = keyof Book;        // "title" | "pages"

const config = { retries: 3, timeout: 1000 };
type Config = typeof config;       // { retries: number; timeout: number }
```
Used constantly for writing generic, reusable functions (e.g., a `getField<T, K extends keyof T>(obj: T, key: K): T[K]`).

### Mapped Types
```typescript
type Optional<T> = { [K in keyof T]?: T[K] };   // this is literally how Partial<T> is implemented
type ReadonlyBook = { readonly [K in keyof Book]: Book[K] };
```

### Conditional Types + `infer`
```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;
type A = ElementType<number[]>;   // number

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type B = UnwrapPromise<Promise<string>>;   // string
```
**Interview answer:** "`infer` lets you extract a type from within another type during a conditional check — it's how library-level utility types like `ReturnType<T>` are implemented internally. I rarely write these from scratch in application code, but I need to read them when working with typed libraries."

### `never` type
```typescript
function fail(msg: string): never { throw new Error(msg); }

// exhaustiveness checking — a genuinely useful senior-level pattern
function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    default:
      const _exhaustive: never = s;  // compiler error if a new Shape variant is added and not handled here
      return _exhaustive;
  }
}
```

### Function Overloads
```typescript
function getValue(key: "age"): number;
function getValue(key: "name"): string;
function getValue(key: string): any {
  return key === "age" ? 21 : "Ateeksh";
}
```
Lets a single function have multiple precise call signatures, instead of one loose union signature.

### Index Signatures
```typescript
interface Dictionary {
  [key: string]: number;   // any string key maps to a number value
}
```

### Tuples & Readonly Arrays
```typescript
let point: [number, number] = [10, 20];            // fixed-length, fixed-type-per-position
let ids: readonly string[] = ["a", "b"];            // cannot push/mutate
```

### Strict Null Checks (why "strict mode" matters)
Without `strictNullChecks`, `null`/`undefined` are silently assignable to everything — the #1 source of runtime crashes in loosely-typed codebases. **Every serious company enables `strict: true`.** Know this — "do you use strict mode" is a real screening question, and "yes, always" is the only good answer.

### Encoding invalid states as unrepresentable (staff-level talking point, 2026 interview trend)
The current senior/staff-level framing (per 2026 interview guides) has shifted from "what is `Partial<T>`" to **designing types so invalid combinations can't compile**:
```typescript
// Weak: allows invalid states like { status: "loading", data: {...}, error: "x" } simultaneously
interface State {
  status: "idle" | "loading" | "success" | "error";
  data?: Book;
  error?: string;
}

// Strong: each state carries only the fields that make sense for it
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Book }
  | { status: "error"; error: string };
```
This is the single most valuable advanced pattern to demonstrate in a mid/senior interview — it shows you use the type system to model the domain, not just to silence red squiggly lines.

---

## 5. TypeScript with React

```typescript
// Props typing
interface ButtonProps {
  label: string;
  onClick: () => void;
  children?: React.ReactNode;   // for anything JSX can render as children
}
function Button({ label, onClick, children }: ButtonProps) { /* ... */ }

// useState with generics
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);   // common pattern for "not loaded yet"

// useRef for DOM access
const canvasRef = useRef<HTMLCanvasElement>(null);

// Typing event handlers
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}
```
**Interview trap:** `useState<User | null>(null)` — you must narrow (`if (user) {...}`) before accessing `user.name`, same `unknown`-style discipline as anywhere else.

---

## 6. tsconfig & Compiler Behavior

| Flag | What it does |
|---|---|
| `strict: true` | Enables all strict flags below — the industry-standard baseline |
| `strictNullChecks` | `null`/`undefined` are not silently assignable to other types |
| `noImplicitAny` | Errors if TS can't infer a type and would otherwise default to `any` |
| `esModuleInterop` | Fixes default-import compatibility with CommonJS packages |
| `skipLibCheck` | Skips type-checking `.d.ts` files in `node_modules` — faster builds |
| `target` | Which JS version the output is compiled down to |

**Know this fact:** types are erased at compile time — the emitted `.js` output has zero trace of your types. TypeScript is a compile-time tool only; it adds no runtime overhead and no runtime type safety (you can't `typeof` your way to a TS interface at runtime — that requires validation libraries like `zod`).

---

## 7. Rapid-Fire Interview Q&A (Beginner → Staff Level)

**Q: What is TypeScript and why use it?**
A: A statically-typed superset of JavaScript that compiles to plain JS. It catches type errors at compile time, improves IDE tooling/autocomplete, and makes large codebases safer to refactor.

**Q: Do TypeScript types exist at runtime?**
A: No — they're fully erased during compilation. Runtime type checking requires either manual checks (`typeof`, `instanceof`) or a validation library (`zod`, `io-ts`).

**Q: `interface` vs `type` — when do you choose one over the other?**
A: Interchangeable for object shapes; `type` is required for unions/intersections/primitive aliases; `interface` supports declaration merging. Pick one convention per codebase.

**Q: `any` vs `unknown`?**
A: `any` disables type checking entirely. `unknown` is type-safe — it must be narrowed before use. Prefer `unknown` for external/untrusted data.

**Q: What is type narrowing?**
A: Using runtime checks (`typeof`, `instanceof`, `in`, discriminated union tags) so the compiler can infer a more specific type within a conditional branch.

**Q: What's a discriminated union and why is it useful?**
A: A union of object types sharing a common literal field (e.g., `kind` or `status`). TypeScript automatically narrows the full shape based on that field, eliminating unsafe casts — the standard pattern for modeling state machines, API responses, and form states.

**Q: Explain generics with an example.**
A: A way to write a function/type that works across multiple types while preserving type safety, e.g. `function first<T>(arr: T[]): T`. `T` is inferred at the call site.

**Q: What does `keyof` do?**
A: Produces a union of a type's property names as string literals — used to constrain generic functions to valid keys of an object.

**Q: What is a mapped type?**
A: A type that transforms every property of another type using `[K in keyof T]` syntax — this is how `Partial<T>`, `Readonly<T>`, etc. are implemented internally.

**Q: What does `infer` do in conditional types?**
A: Lets you extract and name a type from within a larger type being checked, e.g., pulling the resolved type out of a `Promise<T>`.

**Q: What is the `never` type used for?**
A: Represents values that never occur — functions that always throw, or exhaustiveness checks in switch statements (assigning the leftover case to a `never`-typed variable causes a compile error if a new union member isn't handled).

**Q: How do you migrate a large JS codebase to TypeScript?**
A: Enable `allowJs`, let `.js` and `.ts` coexist, convert highest-churn/highest-risk files first, ratchet strictness flags incrementally rather than all at once, keep shipping features throughout, track progress via a shrinking `any` count. Avoid a stop-the-world rewrite — that's the answer interviewers are listening for as a red flag.

**Q: What's the difference between `Partial<T>` misuse and a well-designed update type?**
A: A weak API accepts `string[]` for keys and returns a loose `Partial<T>`, losing precision about which fields are actually valid to update. A stronger design constrains the exact key union so invalid field names are caught at compile time.

**Q: `??` vs `||`?**
A: `||` falls back on any falsy value (`0`, `""`, `false`, `null`, `undefined`). `??` falls back only on `null`/`undefined` — critical when `0` or `""` are valid values.

**Q: What's declaration merging?**
A: Multiple `interface` declarations with the same name automatically merge into one combined interface — used heavily in library type definitions (e.g., extending `Window` or `Express.Request`). `type` cannot do this.

**Q: readonly vs const — what's the difference?**
A: `const` prevents variable **reassignment**. `readonly` prevents **mutation of a property** on an object/array — the object itself can still be a `const` while individual properties are `readonly`.

**Q: How would you type a function that can be called two different ways?**
A: Function overloads — multiple signatures above a single shared implementation, giving precise types per call shape instead of one loose union.

---

## 8. Coding Round Problems

Solve these with proper types — no `any`.

```typescript
// 1. Two Sum (typed)
function twoSum(nums: number[], target: number): [number, number] | null { }

// 2. Group objects by a key (generic)
function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> { }

// 3. Deep flatten an array (generic + recursion)
function flatten<T>(arr: any[]): T[] { }

// 4. Debounce (generic, preserves original function's signature)
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T { }

// 5. Merge overlapping ranges (typed tuples)
function mergeRanges(ranges: [number, number][]): [number, number][] { }

// 6. LRU Cache (generic class)
class LRUCache<K, V> {
  constructor(private capacity: number) {}
  get(key: K): V | undefined { }
  set(key: K, value: V): void { }
}

// 7. Type-safe event emitter (common "show me you understand generics" senior prompt)
class EventEmitter<Events extends Record<string, any>> {
  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void { }
  emit<K extends keyof Events>(event: K, payload: Events[K]): void { }
}
```

---

## 9. Common Mistakes That Get You Rejected

| Mistake | Why it's a red flag |
|---|---|
| Overusing `any` to "make errors go away" | Shows you're fighting the type system instead of using it |
| Using `as` to silence errors you don't understand | Same issue — defeats the purpose of TypeScript |
| Not knowing types are erased at runtime | Fundamental misunderstanding of what TS actually is |
| Confusing `interface` extension with class inheritance | Shows shaky fundamentals |
| Using `||` for numeric/boolean fallback defaults | Classic bug (`0 || "default"` → wrong) |
| Not enabling/understanding `strict` mode | Signals you haven't worked in a disciplined codebase |
| Writing `Partial<T>` everywhere instead of precise unions | Shows pattern-matching without understanding *why* |
| Can't explain a technical decision, only recite syntax | Interviewers explicitly probe for this at senior level |

---

## 10. HR / Behavioral Round Prep

Use the **STAR method** for every story-based answer: **S**ituation → **T**ask → **A**ction → **R**esult (+ one line of reflection: "what I'd do differently").

### Most commonly asked (across Google, Meta, Amazon, Microsoft, and standard fresher/HR rounds)

| Question | What they're actually testing |
|---|---|
| "Tell me about yourself" | Can you give a clear, relevant, non-rambling narrative? |
| "Walk me through a project you're proud of" | Depth of understanding — expect follow-up "why did you choose X over Y" |
| "Tell me about a time you faced a difficult technical bug" | Debugging process, not just the fix |
| "Tell me about a conflict with a teammate/manager" | Communication and self-awareness, not who was "right" |
| "How do you handle tight deadlines / competing priorities?" | Prioritization and honesty about trade-offs |
| "Tell me about a time you failed" | Self-awareness — a good answer names a real failure + a concrete lesson |
| "Why do you want to work here?" | Did you actually research the company, or is this generic? |
| "Where do you see yourself in 3–5 years?" | Realistic growth ambition, not a scripted answer |
| "How do you stay updated with new technology?" | Genuine curiosity vs. resume padding |
| "Describe a situation with an ethical trade-off (e.g., a PM asking for something that compromises user privacy)" | Judgment and integrity — increasingly common at companies handling sensitive data |
| "What's your biggest strength/weakness?" | Self-awareness — a real weakness + how you're actively addressing it beats a fake humble-brag |
| "Do you have any questions for us?" | Always have 2–3 genuine questions ready — never say "no" |

### For your specific situation (first project, self-taught)
You have two strong, concrete projects to draw from — **use them**:
- **InkSeal**: talk about the privacy-first architecture decision (why client-side over server-side), the coordinate-transform bug class, why SHA-256 fingerprinting matters for tamper-evidence. This shows *design thinking*, not just "I built a signing tool."
- **Second Brain**: talk about the ingestion-queue/async-job design, why pgvector over a heavier vector DB for a v1, and the failure-mode questions (duplicate jobs, retries, embedding cost control). This shows *systems thinking* beyond "I called the OpenAI API."

**Do not say:** "I don't have real experience, this is just a personal project." Frame it as: "I designed and built X end-to-end, including handling these specific failure modes..." — ownership language, not apology language.

---

## 11. One-Page Cheat Sheet

```
PRIMITIVES        string, number, boolean, null, undefined, void, never, unknown, any
OBJECT SHAPES      interface (extends, merges) | type (unions, intersections, primitives)
SAFETY DEFAULT     unknown > any — always narrow before use
NARROWING          typeof (primitives) | instanceof (classes) | in (object shape) | discriminated union (best)
NULL SAFETY        ?.  optional chaining   |   ??  nullish coalescing (NOT ||)
GENERICS           <T> = placeholder type, inferred at call site, keeps type safety across many types
UTILITY TYPES      Partial | Required | Pick | Omit | Record | Readonly | ReturnType | Parameters
MAPPED TYPES        { [K in keyof T]: ... }  — how Partial/Readonly are built internally
CONDITIONAL TYPES   T extends U ? X : Y   +   infer to extract a nested type
NEVER               unreachable code / exhaustiveness checks in switch statements
STRICT MODE         strict: true — non-negotiable in real codebases
RUNTIME TRUTH       types are 100% erased at compile time — zero runtime cost, zero runtime safety
SENIOR SIGNAL       model domain states as discriminated unions so invalid states can't compile
```

**Final revision tip:** Don't just re-read this file. Close it and explain the "discriminated union" section and the "any vs unknown" section out loud, from memory, in your own words. If you can't, that's the gap to drill before the interview — not the sections you already find easy.