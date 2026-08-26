
- # Introduction to React JS  01--

#### Javascript prequisite
  - Basics of JS
       -var,let,const
       - datatype
       - Operators
       - Console statement
       - conditionals
       - loops

  - Array & Object
      - Methods of Array(push,pop,shift,unshift,length)
      - HOF(forEach,map,filter,reduce,some,find)
      - Use of objects
      - Arrays of objects
      - basics level question with array and objects


   - destructuring
      - of array
      - of objects
      - spread operator
      - rest operators
     
   - Functions
      - arrow functions
      - basics function
      - return satement
      - parameter
      - arguments

   - Promises, async-await , fetch-api
   - Import,export
   - error-handling 



#### 🔥History of react 

-- history of react 
fackbook ke ek engineeer 2013 mein react banaya tha.facebook mein jo notification hai wo real time update nahi ho raha tha. uske liye page ko reload karna padta tha kynki facebook mein ssr mein php ka include tha isiliye .React ko Facebook ne faster UI rendering ke liye banaya tha, taki page ko baar-baar reload na karna pade.



--DOM (Document Object Model)its a tree-like structure that browser create after parsing an html page . that structure represent document's element in object format., which can be manupulate by javascript

--what is react
react is a javascript library used to make complex frontend UI.
react is made by facebook (facebook ke enginner ne banaya hai.)- 2013.
2015 - Open source. 


--what is library and what is framework
--difference b/w library and framework
-- example of library : gsap,react,lenis,shery
-- example of framework: nextJS,express js etc.


--Why we use react ,instead of using normal html,css and javascript?
not because HTML, CSS, and JavaScript cannot update the DOM.but managing large and changing complex ui with plain javascrpt becomes difficults.
React makes it simple and structured.provide modularity,reusibility,maintainability,scalibiltiy.Directly manipulating the realDOM with plain js can be slow and inefficient.react do it in most efficient way through react-reconcialtion process.


--Chahe Virtual DOM (React) ho ya Real DOM (plain JS), browser sirf wahi part repaint / reflow karta hai jahan change aaya ho, poori DOM nahi.

-virtual DOM is a copy of real DOM
-react used component based architecture

--what is spa(single page application) and mpa multi page application)
“A Single Page Application loads one HTML page and updates content dynamically without page reload, while a Multi Page Application reloads a new page for each navigation.”

--How react work behind the scene 
-- what is react fiber

-- Browser can understand only html,css and js at the end of the day, then how does react work.

--what is babel

-- what is client side rendering , what is server side rendering.
“Client-side rendering builds the UI in the browser using JavaScript, while server-side rendering sends ready HTML from the server.”
in react does client side rendering.
next JS does server side rendering.


-- react allow unidirectional data flow
Unidirectional data flow means data flows in one direction — from parent to child components, not the other way around.







#### ✅:system setup and basics 04: ---
vite vs cra(create react app) 


bundler: a bundler a tool that collects all your projects file , combined them and prepare them to run in the browser. ex Popular bundlers: Webpack, Vite, Parcel.

cra : CRA (Create React App) is a tool that sets up a ready-to-use React project with Webpack and Babel, requiring zero configuration.

vite:is a bundler

##### difference b/w vite & CRA
```
Feature 	CRA	         Vite
Speed	  Slow startup & build	⚡ Super fast (instant startup)
Bundler	  Webpack	         ESBuild (dev) + Rollup (build)
Hot Reload    Slower	       Fast and smooth
Config	   Hidden & hard to customize	Easy to customize
Output Size	Larger	         Smaller, optimized
```


why max people vite instaed of cra?
CRA is old and slow. Vite is modern, fast, and developer-friendly—that’s why people prefer Vite.


--Use react by Cdn(content delivery network: its a distributed network of a server that distribute your content geographycally with low latecy, better performance and fast delivery).

Note : always script file should be type="module" hona chayiye.
React web app create karne ke liye : 1.react and 2. ReactDOM chayiye 
Mobile app ke liye: 1.React 2. ReactNative chayiye.

react is used to build complex frontend ui
reactDom is used to connect the react UI with realDOM.

create a root element in body, (body could not be your root element)
root element ke upor poora website ka structure khada hoga.

**how to create react elemnt: React.createElement(elem,attribute,child);
React.createElement("div",{className:"container"},[h1,p]);


--using vite for pure react: bundler used to create folder
-- understanding folder structure
-- clear folder structure



--public folder mein static files(imges,fonts,icon,assets etc.) rahte hai.

<hr/>
<hr/>


#### ✅JSX (JavaScript XML)
###### What is JSX?
JSX is a syntax extension of JavaScript used in React to describe UI.


###### JSX vs HTML
`<h1>Hey</h1>  `      // HTML
`<h1>Hey</h1>  `      // JSX (looks same)
`<h1>Hey {2+2}</h1> ` // JSX (superpower)

> JSX allows JavaScript expressions inside {}.

###### JSX Reality (VERY IMPORTANT)
* JSX only looks like HTML
* Actually converted to:
> React.createElement()
> JSX is syntactic sugar for React.createElement().


###### JSX Rules (MEMORIZE)
* Whatever is written inside return is JSX
* JSX must return one parent element
* Components are used as:
<App />
App()


###### JSX Expressions

* Calculations allowed inside {}
* Statements (if, loops) are not allowed directly

###### React Fragments
>  `<><h1>Hello</h1>`
 ` <p>World</p>`
`</>`

* Used to wrap multiple elements
* No extra DOM node
* Acts like a container



<hr/>
<hr/>

## 🔥 React Components
###### What is a Component?
A React component is a reusable function that returns JSX to build UI.
###### Types of Components
* Functional Components (current standard)
* Class Components (old, rarely used now)


###### First React Component
>`import React from "react";`
`const App = () => {`
  `return <h1>Hello World</h1>;`
`};`
`export default App;`
* JSX looks like HTML
* Internally converts to React.createElement()

###### Why Components?
* UI ko small parts mein todna
* Reusable elements: Navbar, Card, Footer
* Clean and maintainable code

###### Component Rules (VERY IMPORTANT)
1. File name & function name must start with Capital letter
> `App.js → function App()`
2. Component is used like HTML tag
> `<Home />`
3. JSX must return one parent element
4. Use Fragments if needed
5. Component must return JSX
6. Return is mandatory

##### React Fragments
> `<>`
  `<h1>Hello</h1>`
  `<p>World</p>`
`</>`
* Wraps multiple elements
* No extra `<div>` in DOM


##### Dynamic Data in JSX
JavaScript inside JSX using {}
> `<h1>{2 + 2}</h1>`
* You can write JS before return
* Expressions only (no statements)


#### Rendering Lists in React
❌ forEach
* Does not return anything
* Cannot be used in JSX
✅ map
* Returns elements
* Perfect for JSX
> `const data = ["harsh", "sourav", "nishi"];`
`return (`
  `<>`
    `{data.map(name => <h1>{name}</h1>)}`
  `</>`
`);`



#### Key Prop (INTERVIEW FAVORITE)
* React needs to identify each element
* key must be unique
> `{data.map((name, index) =>`
  `<h1 key={index}>{name}</h1>`
`)}`

> Key helps React identify which items changed, added, or removed.

#### Returning JSX from map
Multiple lines → wrap in ()
>`{data.map(item => (`
  `<div key={item.id}>`
    `<h1>{item.name}</h1>`
 ` </div>`
`))}`


###### Fragments Summary
* Used to wrap multiple elements
* No extra DOM node
* Cleaner structure

###### Must-Remember Interview Lines (MEMORIZE)
* Component = function returning JSX
* JSX must have one parent
* Components are reusable
* Functional components are standard
* map is used instead of forEach
* key must be unique
* Fragments avoid extra div



<hr/>
<hr/>


## 🔥 Props Drilling
#### ✅1. What are Props?
Props (properties) are used to pass data from parent component to child component.

> Props make components reusable by allowing dynamic data to be passed from parent to child.

#### ✅2. What is Props Drilling?
Props Drilling means passing data from a top-level parent component to deeply nested child components through multiple intermediate components.even if those middle components do not need the data.

> Hum data App component mein rakhte hain aur us data ko parent se child, phir child se uske child ko props ke through pass karte hain — is process ko props drilling kehte hain.



#### ✅3. Direction of Data Flow
* React follows unidirectional data flow
* Data flows top → bottom
* Parent → Child only
* Child cannot directly modify parent data(lifting state up)
> Props follow unidirectional (top-down) data flow in React.

#### ✅4. Why Props Are Used?
* To make components reusable
* To avoid hard-coded values
* To control UI from parent component

###### Example Use Case
You want the same button in multiple places but with different text and color.


#### ✅5. How Props Are Passed
> `<Card text="Know More" color="bg-teal-500" num={34} />`

Rule (Very Important)
 * Strings → ""
 * Numbers, booleans, arrays, objects, functions → {}




#### ✅6. How Props Are Received
Props are received as an object.
> `const Card = ({ text, color }) => {
  return (
    <button className={`${color} px-2 py-2 rounded-md`}>
      {text}
    </button>
  );
};`

>Props are read-only and received as an object in the child component.

#### ✅7. Where Data Lives (IMPORTANT)
  * Actual data/state usually lives in the App component
  * App → Parent → Child → Sub-child (via props)



#### ✅8. Props Drilling with Event Handling (VERY IMPORTANT)
Core Rule
> React sirf state change par react karta hai.
* UI change chahiye → state change karna padega
* State can only be modified where it is defined



#### ✅9. Lifting State Up (Interview Favorite)
Problem
> Child button click par kuch change karna hai, but state App mein hai.
Solution
* Function App component mein banaye
* Function ko props ke through pass kare
* Child component mein function call kare

>// App component
`const handleAddFriend = () => {
  alert("Friend Added");
};
<Card onAddFriend={handleAddFriend} />`

> // Child component
`<button onClick={onAddFriend}>Add Friend</button>`

>Note ; Passing a function as props to change parent state from child is called lifting state up.




#### ✅10. Props Are Read-Only
* Child component cannot modify props
* Props ko sirf use kiya ja sakta hai
* Change ke liye state + function chahiye
> Props are immutable and read-only.



#### ✅11. Why Props Drilling Is a Problem?
* Too many intermediate components
* Code becomes messy
* Hard to maintain
* Poor scalability
> Props drilling makes code less readable and harder to maintain in deeply nested components.



#### ✅12. How to Avoid Props Drilling?
* Context API
* Redux / Zustand
* Component composition




#### ✅13. Props Drilling vs State (One-Line Difference)
Props	                              State
Passed from parent	            Managed inside component
Read-only	                      Mutable via setter
Used for data sharing	          Used for UI change




#### ✅14. Must-Remember Interview Lines (MEMORIZE)
* Props make components reusable
* Props follow unidirectional flow
* Props are read-only
* State lives in parent
* Functions passed via props = lifting state up
* React reacts only to state change
* Props drilling causes maintainability issues


<hr/>
<hr/>



## 🔥React Styling: CSS & Tailwind — Interview Ready Notes

## 1) Normal CSS (Global CSS)
- All styles in one file (`index.css`) ❌
- Code becomes messy
- **Class-name clash** problem

**Interview line:**  
> Global CSS causes maintainability issues and class name conflicts.

---

## 2) Component-wise CSS
- Separate CSS file for each component
- Better than global CSS
- Still suffers from **class-name clash**

---

## 3) CSS Modules (Recommended)

**What is CSS Module?**  
- CSS scoped to a component
- Prevents class-name collision
- Generates unique class names automatically

**Interview line:**  
> CSS Modules provide locally scoped styles to avoid class name clashes.

### How to Use CSS Modules
1. Create file:
>css
style.module.css
2. Define classes:
>.a { color: red; font-size: 3rem; }
.b { background: orange; }

3. Import in component:
>import styles from "./style.module.css";

4. Use in JSX:
> "<h2 className={`${styles.a} ${styles.b}`}>Orange</h2>"


##### 4) UI Libraries (Utility / Component Based)
* Tailwind CSS
* Material UI
* Bootstrap
* Chakra UI

> UI libraries speed up development and reduce custom CSS.







<hr/>
<hr/>




## 🔥-Conditional Rendering 07--- :
* mean we can render an component element based on condition using ternary or if else.

 `{item.explore ? "Explore" : "Not Explore"} ` --> in jsx conditional rendering.
 
`{item.explore && <button>}`

`{isLoading ? <Loader /> : null}`

> "{${item.explore ? "bg-teal-500" : "bg-red-600"} px-2 py-2 rounded-md  mt-3 text-sm`}" --> tailwind ke andar condtional rendering.



<hr/>
<hr/>

## 🔥--Handling Events :
jis element ke upor aapko event listener lagana hai, us elment pe jao
and preset event listener lagado like onclick , onmousemove,onmouseover, etc. har ek event listener age on lagado.
every event listener ek callback accept karta hai.
--onClick={()=>{alert('downloaded')}} 

>const downloadEventHandle = (name)=>{alert('start download')}

> -- <button onClick={downloadEventHandle} // function ko call nahi karna just
likh dena hai.

> <button onClick={()=>downloadEventHandle("sourav")}

> ❌<button onClick={downloadEventHandle()}
> ❌ <button onClick={()=>{function(){console.log("hello")}}}




<hr/>
<hr/>


## 🔥 UseState --> State Management

#### ✅1. What is State?

State is a data object that represents the current condition of a component.
React controls and tracks state, and whenever state changes, React re-renders the UI.
Key line for interview:
> React state should not be mutated directly; it must be updated using the state updater function.


#### ✅ 2. State Management: HTML/JS vs React
In Normal HTML, CSS, JS
* We directly manipulate the Real DOM
* Example: document.getElementById().innerText = 10
* Browser updates immediately

In React
* You cannot directly manipulate the Real DOM
* React uses Virtual DOM
* You must update state using React APIs

Your desi line (corrected):
> React mein hum directly DOM ko bypass nahi kar sakte. State ko sirf React ke through change karna hota hai.





#### ✅3. Why useState?
* React needs to know when data changes
* Direct variable update does not trigger re-render
* useState tells React:
  * State changed
  * Re-render the component

Important note (interview):
> React does not detect manual variable changes. Only state updates trigger re-render.


#### ✅4. useState Basics
> const [value, setValue] = useState(initialValue);

* useState always returns an array
* 1st value → current state
* 2nd value → function to update state


>const ans = useState(0);
ans[0] // state value
ans[1] // state updater function



#### ✅5. State is Immutable
* You cannot modify state directly
* Always create a new value

>❌ Wrong: count = count + 1;

>✅ Correct: setCount(count + 1);


#### ✅6. State Update using Callback (VERY IMPORTANT)
>setCounter(prev => prev + 10);

Why callback?
 * React batches state updates
 * Callback gives latest state value

Interview line:
> setState(prev => ...) is safer when the new state depends on the old state.


#### ✅7. State Update is Asynchronous
>setVal(10);
console.log(val); // old value

* State does not update immediately
* React updates state after function execution
* Improves performance


#### ✅8. Re-render Rules
* State change → re-render
* Same state value → no re-render
* JSX is re-evaluated on every re-render

> `{[<h1>Hello</h1>, <h1>Hey</h1>]}`
> JSX accepts arrays and renders them.




#### ✅9. useState with Boolean (Practice Pattern)
> const [val, setVal] = useState(true);
`{val ? <h1>Bahar jao</h1> : <h1>Mat bahar jao</h1>}`
`<button onClick={() => setVal(prev => !prev)}>`


#### ✅10. useState with Object
>`const [details, setDetails] = useState({
  name: 'Sourav',
  isBanned: true
}); `

##### Update Object State (Correct Way)

>`setDetails(prev => ({
  ...prev,
  isBanned: !prev.isBanned
}));
`

Rule:
> Object update = spread old object + change required field


#### ✅11. useState with Array
##### Delete Last Item
> setVal(prev => prev.filter((_, i) => i < prev.length - 1));
##### Add New Item
> setVal(prev => [...prev, prev[prev.length - 1] + 1]);




#### ✅12. Array of Objects Update
>setVal(prev =>
  prev.map(item =>
    item.name === "Priya"
      ? { ...item, age: 45 }
      : item
  )
);

Rule:
> Never mutate array/object directly. Always return new copy.



#### ✅13. React Batching State Updates (IMPORTANT)
##### Problem Case
setVal(val + 1);
setVal(val + 1);
setVal(val + 1);

* React uses same old snapshot
* Result → +1 only

##### Correct Way
setVal(prev => prev + 1);
setVal(prev => prev + 1);
setVal(prev => prev + 1);

* Each update gets latest state
* Result → +3

> Note : React batches state updates. Use callback form to avoid stale state.



#### ✅14. setState Rules Summary
Method	Uses
setState(value)	           Old snapshot
setState(prev => value)	 Latest state (safe)


#### ✅15. Key Interview Points (Must Memorize)
* State is immutable
* useState returns array
* State updates are asynchronous
* React batches updates
* Callback form avoids stale state
* Object/Array → always use spread
* State change triggers re-render
* Same state → no re-render



<hr/>
<hr/>




## 🔥-- From Handling in React  JS : Lecture -13


 form handling => form submission par website reload ho jati hai by defult ,aur react ka main focus hai page reload nahi hona chiye.
there are three way to stop reloading form of submission.

a) useRef
b) controlled components/two way binding
c) react hook form

a) useRef : in this way we select all the inputs elements and unki value
tab nikaalte hai jab form submit hota hai.

definition: useRef is a react hook. used to store a value or reference  that does not cause re-renders when it changes

usage: 1. To access DOM elements (input, button, video, etc.)
2. To store values that change but should not re-render the component

useRef ke through hum kisivi html ko select kar sakte hai.
useRef mein initially null pass karte hai.

useRef ek reference deta hai , usko hum ek varialbe ke andar store kar karte hai.and us varaible ko jis html element ke saath bind karde to elem us element ko target karta hai

import React, { useRef } from 'react'

`const Card = () => {`
 `const elem =  useRef(null)`
 `console.log(elem);`
 ` return (`
    `<div>`
      `<h1 ref={elem}>Hello world</h1>`
    `</div>`
  `)`
`}`

export default Card.
Note : jab hamara function component poora chal jayega tab elem ke andar h1 aa jayega.

import React from 'react'
import { useRef } from 'react';

const Form = () => {
  const name = useRef(null)
  const email = useRef(null)

  return (
    <div>
      <form className='p-10' onSubmit={(e)=>{
        e.preventDefault();
        console.log(name.current.value)

        console.log(email.current.value)

        name.current.value=""
        email.current.value=""
    
      }}>
      <input ref={name} name='username' type="text" placeholder='name goes here' className='bg-red-200 border-none outline-none px-4 py-2 rounded-md mr-4'/>
      <input ref={email} name='useremail' type="email" placeholder='email goes here' className='bg-red-200 border-none outline-none px-4 py-2 rounded-md mr-4'/>
      <input type="submit" value="submit" className='px-3 py-2 rounded-md bg-purple-400 mr-3'/>
      </form>
    </div>
  )
}

export default Form



b) controlled components/two way binding:aap jabhi input pe kuch likhe useState ke through data real time par update kar dein.


c) react hook form : its a package.
ismein jo register wala ko hum use kartenge.
register ek function hai.

serch in google react hook form and copy the code




<hr/>
<hr/>


## 🔥API Fetching in React (Axios & Fetch)
#### ✅1. What is AJAX?
AJAX (Asynchronous JavaScript and XML) is a technique that allows frontend and backend to communicate asynchronously without reloading the page.

#### ✅2. Fetch vs Axios (AJAX Implementations)

* Fetch
  * Built-in JavaScript feature
  * Returns a Promise
  * Needs manual JSON parsing

* Axios
  * Third-party library
  * Automatically parses JSON
  * Better error handling
  * Supports interceptors

#### ✅3. What is an API?
API (Application Programming Interface) is a communication bridge between frontend and backend.
* API ek link hota hai jo backend se data lekar frontend ko deta hai.
* Mostly returns JSON
* Format depends on server configuration


#### ✅4. Why API is Needed in React?
* React UI ko real data chahiye
* Backend se:
     * Data fetch karna
     * Data send karna
     * Update / delete karna


#### ✅5. Common HTTP Methods (INTERVIEW MUST)
Method	           Use
GET	              Fetch data
POST             	Send data
PUT / PATCH         	Update data
DELETE	          Remove data


#### ✅6. API Fetching using Axios (GET)
const url = "https://fakestoreapi.com/products";

> const getProducts = () => {
  axios.get(url)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err));
};

#### ✅7. Sending Data using Axios (POST)
> const postData = () => {
  axios.post(url, {
    id: 0,
    title: "string",
    price: 0.1,
    description: "string",
    category: "string",
    image: "http://example.com"
  })
  .then(res => console.log(res))
  .catch(err => console.log(err));
};


#### ✅8. Where API Call Should Happen in React?
API calls are usually made inside useEffect to avoid infinite re-renders.

#### ✅9. Why useEffect with API?
* API call = side effect
* Prevents repeated calls
* Better performance

#### ✅10. Error Handling in Axios
* .catch() handles:
  * Network errors
  * Server errors
* Axios treats HTTP status ≠ 2xx as error


#### ✅11. Axios vs Fetch (Quick Table)

#### ✅12. Key Interview Rules (MEMORIZE)
* API mostly returns JSON
* Axios uses promises
* Data is in res.data
* GET = fetch data
* POST = send data
* API calls inside useEffect
* React re-renders on state change, not API call
* Axios: HTTP client for making API requests











## 🔥React useEfeect 

#### ✅What is useEffect?
useEffect is a React Hook used to handle side effects in functional components.

useEffect allows us to control component lifecycle behavior inside functional components.

###### Side effects include:

* API calls
* data fetching
* DOM updates
* subscriptions
* timers
* event listeners

When a website opens and data loads automatically without clicking any button, that behavior is usually implemented using useEffect.


#### ✅Why useEffect is needed?
Earlier, React used lifecycle methods in class components.
Now, in functional components, we use useEffect to implement lifecycle behavior.

👉 useEffect allows us to control a component’s lifecycle.



#### ✅React Lifecycle Phases
Every React component passes through 3 phases:

1️⃣ Mounting (Component Creation)

Component is created and shown on the browser

First render happens.

API calls usually happen here.

2️⃣ Updating

Happens when:

state changes

props change

UI updates

Component re-renders.

3️⃣ Unmounting

Component is removed from the screen.

Cleanup happens (remove listeners, clear timers, etc.).




##### ✅Lifecycle Flow (Simple Language)

When component appears → mount

When data or state changes → update

When component disappears → unmount



#### ✅ UseEffect Syntax
useEffect(() => {
  // side effect logic

  return () => {
    // cleanup logic
  }
}, []);




#### ✅How useEffect Works Internally
1️⃣ Mount phase
* The callback function runs

useEffect(() => {
  console.log("Component mounted");
}, []);


2️⃣ Unmount phase
* The return function runs

useEffect(() => {
  return () => {
    console.log("Component unmounted");
  };
}, []);




#### ✅Dependency Array (Second Argument)
The dependency array controls when the effect should run.
###### Case 1: No dependency array
useEffect(() => {
  console.log("Runs on every render");
});

✅ Runs on:
initial render
every state change
every re-render



###### Case 2: Empty dependency array []
useEffect(() => {
  console.log("Runs only once");
}, []);

✅ Runs:
only on mount
❌ does NOT run on updates

Used for:
API calls
initial setup



###### Case 3: Dependency inside array
useEffect(() => {
  console.log("Runs when val changes");
}, [val]);

}, [val]);
✅ Runs:
first render
whenever val changes
Used when:
effect depends on specific state or prop




❌ Myth:
“React re-renders whole component fully every time.”
✅ Truth:
Component function re-executes
React updates only changed elements using reconciliation




React Reconciliation (Interview Concept)
React works in two internal ways:
1️⃣ Update (Selective update)
Only the changed part of DOM is updated.
Uses Virtual DOM diffing.
Improves performance.
2️⃣ Re-render
Component function runs again.
JSX is recalculated.

React updates only changed nodes in real DOM.

⚠️ Even if component re-renders, React updates only changed elements, not the full DOM.




Note : ✅ If we pass an empty dependency array [], then useEffect runs only once when the component mounts.

Note : ✅ “React re-renders because state/props change; useEffect runs after every render when no dependency array is provided.”


Note: ✅If we pass a state or variable in the dependency array, then useEffect will run only when that value changes.



<hr/>

## 🔥 React Router -- Interview Ready Notes (Cheat Sheet)

## Core Idea

React Router is used for client-side routing in React. It allows
navigation without page reload.

The part of the URL after the domain is called a route.

------------------------------------------------------------------------

## Installation

npm install react-router-dom

------------------------------------------------------------------------

## Basic Setup

Wrap your App inside BrowserRouter in main.jsx.
```
<BrowserRouter>
</App>
</BrowserRouter>
```
BrowserRouter uses the HTML5 History API.

------------------------------------------------------------------------

## Core Components

### Routes

acts like a Container that holds all Route components.
```
<Routes>
   <Route path='/login' element={<Login/>}/>
   <Route path='/' element={<Home/>}/>
</Routes>
```

### Route

Maps a URL path to a component.

Example:   
 `  <Route path='/' element={<Home/>}/>`
    

------------------------------------------------------------------------

## Navigation

Do NOT use `<a>`{=html} tag (it reloads the page).

Use: `<Link to="/services">Services</Link>`

------------------------------------------------------------------------

## NavLink (Active Link)

Provides active state styling.


Active styling methods three way: - className - style - children callback

```
   <NavLink 
      style={
        (e)=>e.isActive ? {color:"red",borderBottom:"1px solid black"}:{color:"chocolate"}
        }
       className='link' to="/">Home</NavLink>
```


```
  <NavLink
       className={
        (e)=> e.isActive ? 'link active':"link"
       }
       
       to="/services">Services</NavLink>
```
```
      <NavLink className='link' to="/products">
        {(e)=>e.isActive ?  <span className='link active'>products</span>:<span className='link'>products</span>
        }
      </NavLink>

```

------------------------------------------------------------------------

## Routes Structure

```
  <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/products' element={<Product/>}/>
  </Routes>
```

------------------------------------------------------------------------

## Dynamic Routing

Example URL: /product/101

Route: `<Route path='/products/:productId' element={<ProductDetails/>}/>`

Access value: const { productId } = useParams();

------------------------------------------------------------------------

## Nested Routes

``` 
<Route path='/products' element={<Product/>}>
      <Route path='/products/:productId' element={<ProductDetails/>}>
 </Route>
 ```

------------------------------------------------------------------------

## Outlet

Used to render child routes inside parent.

`<Outlet />`{=html}

Without Outlet, child routes will not render.

------------------------------------------------------------------------

## Programmatic Navigation

useNavigate()

navigate("/login")
navigate(-1)

Used for button click based navigation or logic-based navigation.

------------------------------------------------------------------------

## Redirect Using `<Navigate/>`

`<Navigate to="/login" />`{=html}
`<Navigate />` is a react component used to redirect automatically while rendering based on condition.
👉 It works like:

“If this condition is true, immediately go to another page.”
Used for authentication or conditional redirect.

`<Navigate />` is NOT a function
It is a React component.
That’s why we return it, not call it.

`Navigate("/login") ❌`


example : 
```
 import { Navigate } from "react-router-dom";
 function Dashboard() {
   const isAuth = false;
   if (!isAuth) {
    return <Navigate to="/login" />;
    }
   return <h4>Dashboard</h4>;
}
```
👉 If user not logged in → redirected automatically.

### ✅ One-line memory trick
useNavigate → when user clicks
Navigate → when condition becomes true
used to making  protected route

------------------------------------------------------------------------

## useLocation
🔹 What is useLocation()?
useLocation() is a React Router hook used to get information about the current URL.


It tells you:
   * where you are now
   * what route is open
   * what query params exist
   * what state was passed during navigation
  
> import { useLocation } from "react-router-dom";

> const location = useLocation();


>{
  pathname: "/profile",
  search: "?tab=posts",
  hash: "",
  state: { from: "home" },
  key: "abc123"
}

1️⃣ location.pathname
2️⃣ location.search
3️⃣ location.state
👉 data passed during navigation (hidden, not in URL)
navigate("/login", { state: { from: "home" } });


import { useLocation } from "react-router-dom";
function Page() {
  const location = useLocation();

  return (
    <div>
      <p>Path: {location.pathname}</p>
      <p>Query: {location.search}</p>
    </div>
  );
}


const location = useLocation();

if (location.pathname === "/login") {
  return null;
}

Example:
hide navbar on login page


Example:
2️⃣ Conditional layout rendering
{location.pathname !== "/login" && `<Navbar />`}


3️⃣ Know where user came from (state)
Sending data:
navigate("/login", { state: { from: "/dashboard" } }); //useNavigate()
Reading data:
const location = useLocation();
location.state?.from;

// From Home.jsx
navigate('/about', { state: { fromHome: true } })

// In About.jsx
const location = useLocation();
console.log(location.state); // { fromHome: true }



5️⃣ Trigger effect when route changes
useEffect(() => {
  console.log("Route changed");
}, [location.pathname]);


Common Uses:
--Accessing query parameters.
--Checking from which page user came (location.state).
--Conditional rendering based on URL.


Used to: - get current pathname - detect route changes

------------------------------------------------------------------------

## useSearchParams

🔹 What is useSearchParams?
useSearchParams is a React Router hook used to read and update query parameters from the URL.

👉 Query parameters are the part after ?
> /products?category=mobile&page=2

🔹 Why do we need useSearchParams?
Because sometimes state should live in the URL, not inside React state.
  * ✅ 1. Product Filtering :   /products?category=mobile

  * ✅ 2. Search Feature : /search?q=iphone

  * ✅ 3. Sorting

> import { useSearchParams } from "react-router-dom";

> const [searchParams, setSearchParams] = useSearchParams();

Meaning:
   * searchParams → to READ values from the url
   * setSearchParams → to UPDATE URL


🔹 Reading values from URL

> URL : /products?category=mobile
>  const category = searchParams.get("category");

output: "mobile"


🔹 Setting query parameters
> setSearchParams({ category: "mobile" });
> URL becomes :  /products?category=mobile

------------------------------------------------------------------------

## 404 Page

`<Route path="*" element={<NotFound />`{=html}} /\>

------------------------------------------------------------------------

# MOST ASKED INTERVIEW QUESTIONS

1.  What is React Router? → Client-side routing library for React.

2.  Why not use `<a>`{=html} tag? → It reloads the entire page.

3.  Difference between Link and NavLink? → NavLink provides active
    styling.

4.  What is BrowserRouter? → Wrapper that enables routing.

5.  What does Routes do? → Groups all Route components.

6.  What is Route? → Maps path to component.

7.  What is dynamic routing? → Routes with variable params.

8.  How to access params? → useParams()

9.  What is Outlet? → Renders child route.

10. How to navigate using button? → useNavigate()

11. How to go back? → navigate(-1)

12. How to redirect? → `<Navigate to="/login" />`{=html}

13. How to highlight active link? → Using NavLink

14. How to create 404 page? → Route path="\*"

15. SPA vs Traditional routing? → SPA does not reload page.

------------------------------------------------------------------------

## One-Line Quick Revision

-   React Router enables SPA navigation
-   BrowserRouter wraps the app
-   Routes replaces Switch
-   Route maps path → component
-   Link avoids reload
-   NavLink gives active styling
-   useParams reads dynamic values
-   useNavigate redirects
-   Outlet renders child routes
-   Navigate handles redirect


<hr/>
<hr/>
<hr/>

## 🔥React Context API


#### ✅1. Props vs props.children (Very Important)
#### props : 
* An object containing all properties
* Used to pass data parent → child
> Props is an object used to pass data from parent to child component.

```
// Parent.jsx
import Greeting from "./Greeting";

function Parent() {
  return <Greeting name="Tapu" />;
}

export default Parent;

```

```
// Greeting.jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

export default Greeting;

```

#### props.children
* A special prop
* Holds content written between opening and closing tags
* Used for wrapping components
`<Context>
  <App />
</Context>`
Here, <App /> is props.children.
> props.children allows component composition by rendering wrapped elements.

```
// Parent.jsx
import Card from "./Card";

function Parent() {
  return (
    <Card>
      <h2>This is inside the Card</h2>
      <p>Children content</p>
    </Card>
  );
}

export default Parent;
```

```
// Card.jsx
function Card(props) {
  return (
    <div style={{ border: "2px solid black", padding: "10px" }}>
      {props.children}
    </div>
  );
}

export default Card;
```



#### ✅2. What is Context API?
Context API is a way to manage global state in React and share data without props drilling.
> in context api we centralize our data so that it can accessible to all component

#### ✅3. Why Context API?
problem with props:
* Too many intermediate components
* Code becomes messy
* Hard to maintain
* Poor scalability
Context API solves this by:
* Creating central data store
* Making data accessible to any component

> Context API removes props drilling by providing centralized data access.


#### ✅4. When to Use Context API?
* Auth data (user, token)
* Theme (dark/light)
* Language
* Cart / Product data
* App-level settings


#### ✅5. Context API Workflow (MEMORIZE)
###### Step 1: Create Context (separate file)
 
 ```
 import { createContext } from "react";
`export const ProductContext = createContext();
```

###### Step 2: Create Context Provider Component
 ```import React, { useState } from "react";
import { ProductContext } from "./useContext";
const Context = (props) => {
  const [val, setVal] = useState([`
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 }
  ]);
  return (
    <ProductContext.Provider value={{ val, setVal }}>
      {props.children}
    </ProductContext.Provider>
  );
};
export default Context;
```


> Provider ke andar jo bhi hoga, usko context ka access milega.

###### Step 3: Wrap Your App with Context so that data can be accessible every part or place in app(very important)
```
<Context>
    <App />
</Context>
```


###### Step 4: Consume Context Data
```
import { useContext } from "react";
import { ProductContext } from "./useContext";`
const { val, setVal } = useContext(ProductContext);
```



#### ✅6. Important Rules (Interview Favorite)

* Context gives global access
* Data updates via state
* React reacts only to state change
* Provider value can contain data + functions


#### ✅7. Context API vs Props Drilling
Props Drilling     	    Context API
Parent →                child chain	Direct access
Hard to maintain	       Clean & scalable
Not global	             Global state
Extra boilerplate	       Centralized logic




#### ✅8. Context API vs Redux (Short)
* Context API → small to medium apps
* Redux → large apps, complex state logic



#### ✅9. Common Interview Questions (With One-Line Answers)

Q. Why not use Context everywhere?
Because it can cause unnecessary re-renders.

Q. Context API re-render kab hota hai?
When provider value changes.

Q. Can child update context data?
Yes, using function passed through provider.

Q. Context API removes props completely?
No, only reduces props drilling.




#### ✅10. Must-Remember One-Liners (MEMORIZE)

* Context API provides global state
* Removes props drilling
* Uses Provider & Consumer
* useContext consumes data
* props.children renders wrapped components
* React reacts only to state changes


<hr/>
<hr/>
<hr/>



## 🔥Extra Notes(Mislenious Topic)
So, when your JSX code runs, it's converted to JavaScript objects called React elements, which React uses to build and update the DOM efficiently.



Note : what is the difference b/w props and props.children

props: an objects containing all the properties 
       used to pass data from parent compoenent to child component


props.children : a special tag that holds the content between the opening tag and closing tag of a component useful for wraping elements                                                                                                                        



--LocalStorage : localstorage is a browser built in feature that let you store data in user's browser even though you close the tab window or browser.

localstorage store data in string in key value pair.(vlaue shoud be store in string)
localstorage did not delete you data until you manually remove it
it can store upto 5 mb data                                                               

ex. // Save data
in case of storing array and object you must convert it into JSON.stringyfy(object or array)
localStorage.setItem("username", "Sourav");

// Get data
localStorage.getItem() expects a string key, not an object.
const name = localStorage.getItem("username"); // "Sourav"

// Remove specific data
localStorage.removeItem("username");

// Clear everything
localStorage.clear();




how to handle date and time in react :
------------------------------------->
  const localDate = new Date().toLocaleDateString() //provide date
  const localTime = new Date().toLocaleTimeString() //provide time
  const localDay = new Date()

  

prefilled the form when the component loads:
------------------------------------------
useEffect(()=>{
reset(existingData)
},[reset])





what is the difference between controlled vs unctrolled form in react?
---------------------------------------------------------------------->
In a controlled form, React controls the input elements. The input value is stored in the component’s state and updated using onChange events.


In an uncontrolled form, the form data is handled by the DOM itself. You access the values using refs instead of React state.


we use controlled component most react apps specially You need validation.
You need to manipulate form data.

use uncontolled form when we need quick prototype,You are integrating with non-React code or libraries.



Form validation with zod and yup(optional)
----------------------------------------->
Zod is a TypeScript-first schema validation library.
It helps you validate form data and ensure types are correct.






