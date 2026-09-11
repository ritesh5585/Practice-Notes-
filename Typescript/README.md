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