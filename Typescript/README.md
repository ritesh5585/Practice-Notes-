TypeScript samajhna mushkil nahi hai, bas ek-ek concept clear hona chahiye pehle aage badhne se.

## Sabse pehla sawaal: TypeScript hai kya, aur JavaScript se alag kyun hai?

JavaScript mein tum kuch bhi likh sakte ho, browser usse chalane ki koshish karega chahe woh galat ho:

```javascript
let age = 25;
age = "twenty five"; // JS isse allow kar dega, koi error nahi
age.toFixed(2);       // ab yeh crash karega, kyunki string ke paas toFixed nahi hota
```

Yeh error tumhe tab pata chalega jab **app chal raha hoga** (runtime pe) — matlab user ke saamne crash hoga.

TypeScript ek "checker" hai jo isi code ko **likhte waqt hi** pakad leta hai, run karne se pehle:

```typescript
let age: number = 25;
age = "twenty five"; // TypeScript yahin chilla dega: "Type 'string' is not assignable to type 'number'"
```

**Bas itna hi hai TypeScript ka core idea:** "har variable/function bata do ki woh kis type ka data expect karta hai, main (compiler) usko check kar dunga taaki tumhe pata chale galti hone se pehle, baad mein nahi."

## Pehla real concept: Variables aur Types

JS mein tum `let` ya `const` se variable banate ho. TypeScript mein tum uske aage `: type` likh dete ho:

```typescript
let username: string = "Ritesh";
let age: number = 21;
let isLoggedIn: boolean = true;
```

- `string` → text
- `number` → koi bhi number (integer ho ya decimal, TS mein alag nahi hote)
- `boolean` → true/false

Interesting cheez: agar tum type nahi bhi likho, TypeScript **khud guess kar leta hai** value dekh ke:

```typescript
let username = "Ritesh"; // TS khud samajh gaya yeh string hai
username = 5; // error dega, kyunki pehle se decide ho chuka string hai
```
Isse kehte hain **type inference**.

Sahi jawab — line 2 error degi kyunki `pincode` ko `number` declare kiya hai, lekin `"400001"` quotes mein hai matlab woh **string** hai, number nahi. TypeScript sirf value nahi dekhta, type ka **match** dekhta hai.

## Aage kya-kya aana hai (roadmap, taaki pata rahe hum kahan ja rahe hain)

1. **Functions** — parameters aur return value ko type karna (abhi yeh karenge)
2. **Arrays & Objects** — list of data aur structured data ko type karna
3. **Interfaces** — apna khud ka "shape" define karna (jaise Signature, Placeholder)
4. **Union types** — "yeh ya to X hoga ya Y" (jaise `"draw" | "type" | "upload"`)
5. **Generics** — function jo kisi bhi type ke saath kaam kare, safely
6. **Optional/nullable values** — `undefined`/`null` ko handle karna bina crash kiye

Ek-ek karke jayenge, jaldi nahi karni. Ab **Functions** samjho:

## Functions mein Types

JS mein function aisa likhte ho:

```javascript
function add(a, b) {
  return a + b;
}
```

Problem: koi bhi `add("5", "3")` call kar sakta hai aur JS use "53" bana dega (string concatenation), crash nahi hoga lekin **galat result** aayega — yeh sabse kharab type of bug hai kyunki error dikhta hi nahi.

TypeScript mein:

```typescript
function add(a: number, b: number): number {
  return a + b;
}

add(5, 3);      // ✅ theek hai, return hoga 8
add("5", "3");  // ❌ TypeScript yahin rok dega, function call karne se pehle
```

Yahan teen jagah type likha:
- `a: number` → pehla parameter number hona chahiye
- `b: number` → dusra parameter bhi number
- `: number` (function ke bahar) → yeh function **return** bhi number karega

Agar function kuch return nahi karta (sirf kaam karta hai, jaise console.log), to return type hota hai `void`:

```typescript
function greet(name: string): void {
  console.log("Hello " + name);
}
```

---

### Ab tumhara task

Yeh function likho aur mujhe bhejo:

```
Ek function banao "calculateArea" jo ek rectangle ka area nikale.
- Do parameters lo: length aur width, dono number type ke
- Return type number hona chahiye
- Andar bas length * width return karo
```

## Ab agla concept: Arrays with Types

JS mein array aisa hota hai:

```javascript
let numbers = [1, 2, 3];
numbers.push("hello"); // JS allow kar dega — ab array mein mixed types hain, bug ka source
```

TypeScript mein tum bata dete ho array ke **andar kis type ke elements** honge:

```typescript
let numbers: number[] = [1, 2, 3];
numbers.push("hello"); // ❌ error — string push nahi kar sakte number[] mein
numbers.push(4);       // ✅ theek hai
```

Syntax do tarike se likh sakte ho, dono same hain:
```typescript
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Ritesh", "Rahul"];
```

Agar array mein **mixed types allow karne hain jaanbujh kar**, to union type array ke andar likh sakte ho:

```typescript
let mixed: (number | string)[] = [1, "two", 3];
```

---

### Ab tumhara task (thoda logic bhi hai isme)

```
Ek function banao "sumArray" jo:
- Ek parameter le: numbers, jo number[] type ka ho
- Sabhi numbers ko add karke total return kare (return type number)
- Andar loop use karna hai (for loop ya for...of, jo bhi aata ho)

sumArray([1, 2, 3, 4]) call karne pe 10 aana chahiye
```

Loop yaad nahi hai to bhi try karo, jo bhi galat likho woh bhej do — hum wahin se seekhenge.

Ab agla concept: Objects & Interfaces

Ab tak humne simple values (number, string, array) type kiye. Real projects mein data structured hota hai — jaise ek "Signature" mein multiple fields hote hain (id, type, createdAt). Iske liye TypeScript mein interface use karte hain.

JS mein object aisa hota hai:

javascript
let user = { name: "Ateeksh", age: 21 };

TypeScript mein pehle uska shape (blueprint) define karte ho:

typescript
interface User {
  name: string;
  age: number;
}

let user: User = { name: "Ateeksh", age: 21 };

user.age = "twenty one"; // ❌ error — age hamesha number hona chahiye
user.email = "x@x.com";  // ❌ error — User interface mein email hai hi nahi

Mental model: interface ek contract hai — "koi bhi variable jo User type ka hai, uske paas exactly name (string) aur age (number) hone chahiye, na kam na zyada (jab tak optional na ho)."

Tumhara task
Ek interface banao "Book" jisme:
- title: string
- pages: number
- isAvailable: boolean

Phir ek function banao "printBookInfo" jo:
- ek parameter le: book, jo Book type ka ho
- console.log kare kuch aisa: "Atomic Habits has 320 pages and is available"
  (isAvailable false ho to "is not available" print ho)

Ek Book object banao aur function ko call karke test karo.

Poora code likh ke bhejo — interface, function, aur call teeno.

Union Types — "yeh field sirf inn fixed values mein se ek ho sakta hai"

Abhi tak humne string, number, boolean type use kiye — yeh generic types hain (koi bhi string chalega). Lekin real projects mein kai baar field ki value sirf kuch fixed options mein se ek honi chahiye — jaise InkSeal mein signature kaise banaya gaya: "draw", "type", ya "upload" — bas yeh teen, kuch aur nahi.

Iske liye union type use karte hain — | (pipe) symbol se options jodte hain:

typescript
type SignatureMethod = "draw" | "type" | "upload";

let method: SignatureMethod = "draw";     // ✅ theek
method = "scan";                          // ❌ error — "scan" allowed options mein hai hi nahi

Yeh string se zyada safe hai — agar tum string use karte, toh koi bhi galat spelling ("Draw", "drawn") bhi chal jaati bina error ke, aur bug sirf runtime pe pakda jaata. Union type se woh galti likhte waqt hi pakdi jaati hai.

Union types objects ke andar bhi use hote hain
typescript
interface Signature {
  id: string;
  method: "draw" | "type" | "upload";
}

let sig: Signature = { id: "1", method: "upload" };
sig.method = "photo"; // ❌ error
Function mein union type ke saath "narrowing" (check karke decide karna)

Jab kisi variable ka type union hota hai, tumhe pehle check karna padta hai woh kaunsa wala hai, tabhi uske hisaab se kaam karo:

typescript
function getMethodLabel(method: "draw" | "type" | "upload"): string {
  if (method === "draw") {
    return "Hand-drawn signature";
  } else if (method === "type") {
    return "Typed signature";
  } else {
    return "Uploaded signature";
  }
}

Yeh if/else chain hi narrowing kehlata hai — matlab "possibility ko narrow (kam) karte jaana jab tak exact type na pata chal jaaye."

Tumhara task
1. Ek type banao "PaymentStatus" jo sirf teen values le sake:
   "pending" | "completed" | "failed"

2. Ek function banao "getStatusMessage" jo:
   - ek parameter le: status, jo PaymentStatus type ka ho
   - if/else use karke return kare:
     - "pending"   → "Your payment is being processed"
     - "completed" → "Payment successful!"
     - "failed"    → "Payment failed, please try again"
   - return type string honi chahiye

3. Function ko teeno values ke saath call karke console.log se test karo

Likh ke bhejo, phir uske baad Optional properties (?) aur Arrays of Objects pe jayenge — yeh dono InkSeal ke Placeholder[] jaisi cheezon mein direct kaam aayenge. 

Ab agla concept: Optional Properties (?)

Kabhi-kabhi object ka koi field hona zaroori nahi hota. Jaise ek user ka email hona chahiye, lekin phone number optional ho sakta hai. Iske liye ? lagate hain field name ke baad:

typescript
interface User {
  name: string;
  email: string;
  phone?: string;   // yeh field ho bhi sakta hai, nahi bhi
}

let u1: User = { name: "Ateeksh", email: "a@x.com" };              // ✅ phone nahi diya, chalega
let u2: User = { name: "Rahul", email: "r@x.com", phone: "9999" }; // ✅ yeh bhi chalega

Bina ? ke, phone field har object mein dena zaroori hota — nahi doge to TypeScript error dega.

Important gotcha: Jab tum optional field ko use karte ho, TypeScript tumhe warn karega ki woh undefined bhi ho sakta hai:

typescript
function printPhone(user: User) {
  console.log(user.phone.length); // ❌ error — phone undefined bhi ho sakta hai, uska .length crash karega
}

Fix — pehle check karo woh exist karta hai ya nahi:

typescript
function printPhone(user: User) {
  if (user.phone) {
    console.log(user.phone.length); // ✅ ab safe hai, TS ko pata hai yahan phone zaroor exist karta hai
  }
}
Arrays of Objects — yeh InkSeal mein directly kaam aata hai

Ek array jisme har element ek pura object ho:

typescript
interface Todo {
  title: string;
  isDone: boolean;
}

let todos: Todo[] = [
  { title: "Buy milk", isDone: false },
  { title: "Learn TS", isDone: true },
];
Tumhara task
1. Ek interface banao "Student" jisme:
   - name: string
   - marks: number
   - remarks?: string   (optional)

2. Ek array banao "students" jo Student[] type ka ho, usme 3 students daalo
   (kisi ek student mein remarks do, baaki mein mat do)

3. Ek function banao "getToppers" jo:
   - students: Student[] parameter le
   - sirf unhi students ko return kare jinke marks >= 90 (return type Student[])
   - .filter() use karna hai isme

4. Function call karke result console.log karo

Yeh thoda bada task hai — sab concepts mila ke (interface + optional + array + filter). Jitna bhi aaye likho, jahan atko wahi bata dena.

Generics — "yeh function/type kisi bhi type ke saath kaam kare, lekin type-safe reh kar"

Socho tumhe ek function chahiye jo array ka pehla element nikale — chahe number ka array ho, string ka ho, ya Student ka ho. Bina generics ke tumhe alag-alag function banane padte:

typescript
function firstNumber(arr: number[]): number {
  return arr[0];
}
function firstString(arr: string[]): string {
  return arr[0];
}

Yeh repetitive hai. Generics se ek hi function ban jaata hai jo kisi bhi type ke saath kaam kare:

typescript
function first<T>(arr: T[]): T {
  return arr[0];
}

first([1, 2, 3]);          // T yahan number ban gaya, return bhi number
first(["a", "b"]);         // T yahan string ban gaya, return bhi string
first(students);           // T yahan Student ban gaya, return bhi Student

Mental model: <T> ek placeholder hai type ke liye — jab function call hota hai, TypeScript khud dekh leta hai ki T is baar kya hai (array mein jo bhi type hai), aur poore function mein consistently wahi type use hoti hai. Tumhe har type ke liye alag function nahi banana padta, aur phir bhi type-safety poori milti hai (kyunki TS ko pata hai ki T ek fixed type hai, any nahi).

T sirf ek naam hai — koi bhi letter/word chal sakta hai (T, Item, Data), lekin convention hai single capital letter (T) chhote generic functions ke liye.

Tumhara task
Ek generic function banao "getLast<T>" jo:
- kisi bhi type ke array ko parameter le (arr: T[])
- array ka last element return kare (return type T)

Test karo teen tarah se:
1. getLast([1, 2, 3])           → 3 aana chahiye
2. getLast(["a", "b", "c"])     → "c" aana chahiye
3. getLast(students)            → last student object aana chahiye

Hint: array ka last index nikalne ka formula arr.length - 1 hota hai.

## Null/Undefined Handling — sabse zyada real bugs isi se aate hain

JS/TS mein data kabhi missing ho sakta hai — API se field na aaye, array khaali ho, user ne kuch fill na kiya ho. `undefined` (kabhi define hi nahi hua) aur `null` (jaanbujh kar "kuch nahi hai" bataya gaya) — dono "empty" values hain, lekin inhe access karne ki koshish karo toh app crash ho jaata hai:

```typescript
interface User {
  name: string;
  address?: { city: string };  // optional — ho bhi sakta hai, nahi bhi
}

let user: User = { name: "Ateeksh" };
console.log(user.address.city); // 💥 CRASH — "Cannot read properties of undefined"
```

TypeScript yeh crash hone se pehle hi compile-time pe pakad lega **agar** field optional (`?`) declare kiya hai — but crash se bachne ke liye tumhe khud handle karna padega. Iske liye 3 tools hain:

### 1. Simple `if` check (jo humne pehle kiya tha)
```typescript
if (user.address) {
  console.log(user.address.city); // yahan safe hai, TS ko pata chal gaya address exist karta hai
}
```

### 2. Optional Chaining `?.` — shortcut for nested checks
```typescript
console.log(user.address?.city); // agar address undefined hai, poora expression undefined ban jaata hai, crash nahi
```
Mental model: `?.` ka matlab hai "agar isse pehle wali cheez exist karti hai tabhi aage jao, warna turant ruk jao aur `undefined` de do." Chain mein kitni bhi lagaye ja sakti hain: `user.address?.city?.length`.

**Fark `if` se:** `if` check karta hai aur decision leta hai (kuch action). `?.` sirf **crash rokta hai**, result `undefined` ban jaata hai — usko aage handle karna phir bhi tumhara kaam hai.

### 3. Nullish Coalescing `??` — "agar yeh missing hai toh default use karo"
```typescript
let city = user.address?.city ?? "City not provided";
console.log(city); // agar city undefined/null hai, "City not provided" print hoga
```
Mental model: `a ?? b` ka matlab "agar `a` null ya undefined hai, `b` use karo, warna `a` hi use karo."

**Important gotcha — `??` vs `||` mein farak:**
```typescript
let marks = 0;
let displayMarks = marks || "No marks"; // ❌ "No marks" print hoga! kyunki 0 ko JS "falsy" maanta hai
let displayMarks2 = marks ?? "No marks"; // ✅ 0 hi print hoga — sahi behavior
```
`||` sirf value ki "truthiness" dekhta hai (0, "", false — sab falsy hain). `??` sirf **specifically** null/undefined check karta hai. Isliye numbers/booleans ke saath default value dete waqt hamesha `??` use karo, `||` nahi.

---

### Tumhara task

```typescript
interface Placeholder {
  id: string;
  label?: string;       // optional
  boundSignature?: {    // optional
    imageUrl: string;
  };
}

let field1: Placeholder = { id: "p1", label: "Sign here", boundSignature: { imageUrl: "sig1.png" } };
let field2: Placeholder = { id: "p2" }; // label aur boundSignature dono missing
```

Ek function `describeField` banao jo:
- `field: Placeholder` parameter le, return type `string`
- Agar `boundSignature` exist karta hai, return kare: `` `${field.id}: signed with sig1.png` `` (image url use karke)
- Agar nahi, `??` use karke `field.label` ko fallback dedo default value `"Unlabeled field"` ke saath, aur return karo: `` `${field.id}: ${label}` ``

`field1` aur `field2` dono ke saath call karke console.log se test karo. Optional chaining (`?.`) aur nullish coalescing (`??`) dono use karne ki koshish karo isme.