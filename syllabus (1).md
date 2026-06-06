# 🔥Javascript , Everything about Everything Syllabus - Phase 1 : Fundamentals


## 1. 📦Variables & Declarations
* ✅Teach:
   * var,let,conts - line-by-line comaparison
   * Scope (global,block,functional)
   * Reassignment, redeclaration
   * Temporal Dead Zone
   * Hoisting impact per type
* ⚠️Common Confusion:
   * Why var leaks outside block but let doesn't;
   * Why const allows changing object properties;

* 🧠Mindeset: 
   * Think of variables as containers scoped by purpose

* ✏️Practise:
   * Guess the output tasks(based on hoisting)
   * Block-level counter using let/const

* 🥍Usage:
   * Base of all JS, mandatory in function, loops, API logic




## 2. 📦Data Types+Type System

* ✅Teach:
   * Primitive types(string,number,boolean,null,undefined,symbol,bigint)
   * Reference types(arrays,objects,functions)
   * Dynamic typing
   * typeof quirks (e.g. typeof null=== 'object')
   * type coercion (== vs ===)
   * Truthy vs falsy values

* ⚠️Common Confusion:
   * Why NaN is a number
   * undefiend vs null
   * "5"+1 vs "5"-1

* 🧠Mindeset: 
   * Think about types like expected input/output

* ✏️Practise:
   * predict the result : true + false, null+1, 5+"5",!!undefined

* 🥍Usage:
   * API validation, form handling , state checks




## 3. 📦Operators
   * ✅Teach:

      * Arithmetic,comaparison,logical,assignment,unary,ternary
      * typeof,instanceof

   *  ⚠️Common Confusion:
      * !!value for truthiness
      * pre/post increment
   
   * ✏️Practise:
      * Logic condition quizzes
      * Scoring logic with ternary



## 4. 📦Control Flow
   * ✅Teach:
      * if,else if,else,switch-case, early return pattern
   
   *  ⚠️Common Confusion:
      * Fallthrough in switch-case
   
   * ✏️Practise:
      * Student grade categorizer
      * Rock-paper-scissors logic


## 5. 📦Loops
   *  ✅Teach:
      * for,while,do-while
      * break,continue,
      * for-of,forEach for arrays
      * for-in,Object.entries for objects

   *  ⚠️Common Confusion:
      * for-in vs for-of

   * 🧠Mindeset: 
      * Loop is for proecessing data
   
   * ✏️Practise:
      * Print pattern question
      * Reverse a string using loop
      * Sum of even/odd numbers from array


## 6. 📦Functions
   *  ✅Teach: 
      * Function declarations, expressions, and arrow functions
      * Parameters vs arguments
      * Default, rest, and spread parameters
      * Return values and early returns
      * First-class functions(assign to variables, pass as arguments, return form other functions)
      * Higher-order functions
      * Pure vs impure functions
      * closures and lexical scoping
      * IIFE (Immediately invoked Functions Expression)
      * Hoisting differeces between declaration and expression
   
   * ⚠️Common Confusion:
      * Arrow vs regular functions : this context
      * Functions hoisting and TDZ
      * Scope chains and closures traps

   * 🧠Mindeset: 
      * Functions = logic blocks + memory holders(closures)
   
   * ✏️Practise:
      * write a BMI calculator
      * Create a reusalble discount calculator(HOF)
      * Build a counter using closure
      * Create a pure functions to transform a value
      * Use IIFE to isolate(private) varialbes
   
   * 🥍Usage:
      * Reusability, event handlers, API logic, array operations
   


## 7. 📦Arrays
   
   *  ✅Teach: 
      * Create, access, modify arrays
      * Array methods: <mark>push</mark>,pop,shift,unshift,splice,slice,reverse,sort
      * map,filter,reduce,find,some,every(intro level)
      * Destructuring,spread operator

   * ⚠️Common Confusion:
      * splice vs slice
      * map vs forEach
      * sort behavior without compareFn

   * 🧠Mindeset:
      * Arrays = organized, trasnsformable data

   * ✏️Practise:
      * User filtering logic
      * Salary reducer
      * Top 3 products based on rating


## 8. 📦Objects
   *  ✅Teach: 
      * key-value structure
      * Dot vs bracket notation
      * Nesting and deep access
      * Object destructuring
      * Looping : for-in , Object.keys, Object.entries
      * Copying objects: spread, Object.assign, deep clone
      * Optional chaining, computed properties

   * ⚠️Common Confusion:
      * Reference copy vs deep clone
    
    
   * 🧠Mindeset: 
      * Objects = structured, readable state
   
   * ✏️Practise:
      * Student manager app
      * Address book with optional chaining
      * Object flattener(streah goal)