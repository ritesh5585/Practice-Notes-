# Introduction
Brendan Eich -> work in Netscape(browser) ->(1995) Mocha(used to apply logic in client side)(15 days) -> change into Javascript --> es5/es6(web community(Ecma Script-maintain javascript))
  

## difference between scripting language and programming language, markup languae, styling language
Programming language → Used to create full-fledged applications, often compiled before execution (e.g., C, Java).
Scripting language → Used to automate tasks or control other programs, usually interpreted at runtime (e.g., Python, JavaScript).

##
compilation language: sourcecode -> compiler -> machine code(.exe file) 


interpretation language -> interperter read one line at a time -> translate into machine code(byte code depending on the interperter) -> and execute it immedietyly -> interpreter go to next line ->so on


## Note : 
 modern javascript engline like v8 or spider monkey.
use compilation and interpritation both technique for better performance which is called jit(just in time) compilation. 



## word vs keyword
- word like "sourav" "harsh" etc, javascript engine dont know about that word or have no idea
- keyword - preserved word or predefined which have meaning in javascript. word means js engine or interpreter already familier with that keyword, and know what shoud to do. ex. for, let ,const etc.




## var,let,const

## declaration and initialization
 - var a - [declaration]
 - a=34 - [initialization means , giving the first value to a variable]
 -var a = 12 [declaration & initialization]


## Scope
- global scope : variable can declare outside any block or any function and can accessaible throughout the programme.

- block scope : varible declare inside a block means curly braces {} and can be acessible within the block only.

- function scope : variable declare inside a funciton and can be accessed within its parent funciton only where it is defined .


## Reassignment  and redeclaration
 var a = 14
 var a = 19 [redclaration]

 let a = 12
 a=34 [reassignment]



## Temporal dead zone
tdz also known as temporal dead zone its a time when a variable is created(hoisted) and it is initialized , during this time , you cannot use it or get an error. 
 in let and const we can see tdz , but not var
inline: `console.log(username)`
inline: `let username = sourav giri`
>>error: username cannot  access before initialization


## Hoisting impact per type
javascript prepare the memory before running the code and varible and function declarion are moved on the top of the code that is called hoising
var, let , const all are hoisted . but let and const belongs
to tdz , rules of let and cost cannot access variable before intialization.

var -> hoist > undefined
let -> hoist -> tdz
const -> hoist -> tdz


## hoisting per type

Keyword  	Hoisted?	  Initialized at Hoisting?	TDZ Exists?
var	        ✅Yes	     ✅Yes → undefined	       ❌ No
let	        ✅Yes	     ❌ No (uninitialized)	   ✅ Yes
const       ✅Yes	     ❌ No (uninitialized)	   ✅ Yes



# Why var leaks outside block but let doesn't?
if(true){
  var a = 1;
  let b = 2;
}
console.log(a)
console.log(b)
var leaks outside block because var is a function scope varialble . var block ki respect nahi karta and we can acesses it throughout its nearest function , .
let is a block scope variable, means we can access it within the block only, 


# Why const allows changing object properties?
the rules for constant is , you cannot reassign a new value to a constant variable. but we can update the value or change the properties of an object.



# Data Types + Types System

## premitive types

## symbol data type
unique immutable value.
it is used to avoid conflict of properties in an object and it have many more usage

// let u1 = Symbol("uid")
// let u2 = Symbol("uid")


let obj = {
  uid:"1",
  name:"sourav giri",
  age:12,
  email:"test@test.com"
}

const u1 = Symbol("uid")
obj[u1] = 3433



## Bigint data types
a variable can hold till Number.MaxSafeInteger() .
if you want to store more than that then you need bigInt data type
let a = 34545459405405495459n

## reference types

## Dynamic Typing
there is no such concept of static typing in javascript, here everything is dynamic typing means you can provide any type of data to the variablae

let a = "sourav"

a=true

a=[]





## type of quirks
The typeof operator in JavaScript has some quirky behaviors that often confuse developers.that's are-
typeof null	
typeof NaN	
typeof (0 / 0);
typeof []
typeof function(){}	
typeof undefined	
typeof Symbol()	
Array.isArray([]);
typeof 10n	
typeof document.all
typeof null = 'object'
typeof NaN = 'number'


>> !!document.all - check in browser either true or false

## type coercion : concept hai jismein aapka ek type automatically convert ho
jayega dusre data type mein.
.1 + .2 = .3
[] + [] = ""
1+ "1"="11"
true+false = 1


## Truthy and falsy values
in javascript we can categorized any data either true or false, its depends on the nature of the data,if data is truthy then its true, if data is falsy then its false.
0,false,null,undefined,NaN,"",document.all --> all are falsy value.
rest of the data ---> truthy value


## why typeof NaN is === number
because Nan is comes from a  failed number operation  that's why typeof NaN is,  number



># Operators
- arithmetic operators : +,-,*,/,%,**
- Comparison operators : >,<,>=,<=,==,===,!=,!==
>> in javascript when you try to compare between two string it compare with ascii values of that string .
- assignment operator : =,+=,-=,*=,/=,**=,%=
- logical operator : &&,||,! [return truthy or falsy values]
- uninary operator : +,-,++,--,!,~,typeof
- Ternary operator : expression1 ? expression2:expression3

### instanceof
let a = [];

a instanceof Array //true // instaceof always used with reference data types

### typeof 
let a = 12
typeof a //used with primitive data type

Note : typeof mostly used with primitive data type, instanceof mostly works with reference data typw
for check truthy or falsy any values :  !!values



### Loops
where to use forLoop and where to use while loop?
When we know the exact number of iterations, we use a for loop.
When we only have a condition and we want to run the loop until the condition becomes false, we use a while loop.


-why we cannot use break & continue in forEach method?
forEach() is a higher-order function, not a traditional loop.
It takes a callback function and executes that callback for every element of the array — you cannot control its execution flow using break or continue.


-What happens if you use var vs let in a for loop?
using var in for loop, create one global or shared variable,so all iterations share the same value,.
Using let → creates a new block-scoped variable for each iteration, so each loop keeps its own value.
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
💡 var → function-scoped
💡 let → block-scoped




let arr = [1, 2, 3];
for (let i in arr) {
  console.log(typeof i);
}
for..in loop specially design for iterate over a inumerable properties keys in an object, in arrays keys are indexes and all object keys in javascript stored as a string
even though its look like a number.



--Solved questions from chatgpt with AI



# Functions
-what is a function?
A function in JavaScript is a block of code that performs a specific task.

-why we use functions
i] reusibility
ii] function block of code not execute immedietely, when we call the function then it execute block of code.


- how we define the function
//function declaration
function greet(){
  console.log("good morning")
}
greet()

//function expression
let func = function(){
  console.log("good morning")
}

func()

//fat arrow function
let func = ()=>{
  console.log("good morning")
}
func()


- paramters vs arguments;
arguments is the actual value that we pass during function call for dynamic
paramters is the name of the variable that hold argument's value that we pass during function definition


- Default,rest,spread parameters;
agar paramters bohot saare hai , then we go for rest paramters, rest paramters convert all your arguments to an array
 ... is known as rest parameters and also known as spread operator;
 agar ... parameter mein lage to that is rest paramters
 agar ... function call mein lage then that is spread operator



-return vs early return


### rest
function abcd(one,two,...rest){
  console.log(one)
  console.log(two)
  console.log(rest)
}

abcd(1,2,3,4,5,6)

### spread
function print([...data]){
 
  console.log(data);
 
}
print([1,2,3,4,5])


- Return values and early returns
return only possible within  a function
return ke baad wala code nahi chalega
function jaha se call kar rahe the return value use jaga pe aa jayega
early returns
function abcd(){
  if(12>3) return "hello"
}
abcd()




- First class functions
in javascript first class function means aisa function jisko value ki tarah treat karte hai, and usko ek varible ke andar store karke rakte hai.





- Higher order function
whenever a function accept a function in its parameter or return a function or both, that function is called HOF.



- Pure vs impure functions
A pure function is one that:
Always gives the same output for the same input.
Doesn’t change anything outside the function (no side effects).

✅ Example:
function add(a, b) {
  return a + b;  // only depends on inputs
}
add(2, 3) will always return 5.
It doesn’t modify anything outside — that’s why it’s pure.



🔹 Impure Function
An impure function either:
Changes something outside its scope (side effect), or
Depends on something outside (like a global variable), so it may not give the same result every time.
❌ Example:
let count = 0;
function increment() {
  count++;  // modifies external variable
  return count;
}





- closures vs lexical scoping

>closures:whenever a funciton returned an another function , a function (chid) remember its parent scope even after parent funcion has finished
child function always return with its parent function's variable
function counter(){
  let i=0
  return ()=>{
    i++;
    if(i>0){
    
           console.log(`calling ${i} time`);
    }
   
  }
}
let count = counter()
count()
count()
count()
count()




>lexical scoping :  A variable is accessible based on its placement in the source code, not from where it’s called.

function one(){
   let a =12
   function two(){
    let b=13
    function three(){
      let c=14
    }
   }
}


- IIFE(immediately involked function expression)
whenever a function is declared and immediately involked that is called iife. ()()
(function(){
  console.log("hello world")
})()


- Hoisting difference between function declaration and function expression
function declaration are hoisted
function expression are not hoisted,




>>Q1. what is the difference between function declaration and expression in terms of hoisting?
function declaration are hoisted, but function expression are not hoisted.

>>Q2. what does the ...  operator mean in paramters
it acts as a rest parameters, it takes all arguments and store it into an array

>>Q3. what does it mean when we say "functions are first-class citizens.
we can treat a function as a value and we can store it in a variable and also pass as an argument


>>Q4. in js every function return something, if it return nothing , then it return alwasy undefined

>>Q4. What is the use of IIFE? Name one real-world use case.
const shery = (function(){
  let score = 0
  return {
    getScore:function(){
      console.log(score);
    },
    setScore:function(val){
      score =  val;
    }
  }
})()
shery.getScore()
shery.setScore(45)
shery.getScore()

for make private varibles;




# Array
- Array is a built in data structure in javascript where we can store multiple data all together at once in a single variable.
- Javascript mein array dynamic hota hai,mean first value you store number, second value can be string, third value could be boolean and so on.
let arr = ["sourav",34,true]
we can create an array also like that let arr = new Array();


why index no start from zero in array?
because in low level memory , the index as refer as offset from the fist element of memory address.


what is the difference b/w unshift and push?

sort behavior without compareFn?
.sort convert each element to a string and provide an array




# Object

## Object.defineProperty
Object.defineProperty is used to add a new property or modify the exinting property in an Object
const obj = {
  name:"sourav giri",
  age:25
};

Object.defineProperty(obj,"gender",{
  value:"male", 
  writable:false, //would you modify the keys's value
  enumerable:false, // will appear in enumiration(for...in,Object.keys())
  configurable:false // cannot be reconfigured or deleted
})



## Object.fromEntries()
const entries = [
  ['firstName', 'John'],
  ['lastName', 'Doe'],
  ['age', 30]
];

const person = Object.fromEntries(entries);



## Object destructuring with defaults
const { a = 10, b = 20 } = { a: 5 };
console.log(a, b);

if a is not exits in object or undefined then it contain default nither it destructure


## Object.create()
object.create() create a new object and  it inherit all the properties and method from the object that we provide as a parameter and sets it in its proto
his parameter is mandatory.if you want to create object with no prototype,you have pass null.

const user = {
  name:"sourav giri",
  details:function(){
    console.log(`My name is ${this.name}`);
  }

}
const obj = Object.create(user)
obj.name = "akash";
obj.details()



## Ordering rules in Object.keys()

1.All integer-like keys comes first, sorted in asscending numeric order
2. all non-integer-like keys  appear in insertion order

const obj = {
  100: "x",    // integer-like
  2: "y",      // integer-like
  "01": "z",   // NOT integer-like
  name: "Sourav"
};

console.log(Object.keys(obj));

const obj = { "1": "a", "01": "b", "2": "c" };
console.log(Object.keys(obj));


## Object.preventExtension()

object.preventExtension() methods prevents from being add new property to the object

const obj = {
  name:"sourav giri",
  age:25,
  gender:"male",
  address:{
    state:"west bengal"
  }

}
Object.preventExtensions(obj)
obj["fav food"] = "biriyani"
console.log(obj);


## hasOwnProperty() check
object.hasOwnProperty() check either the property is directly define is in object itself or its inherit from other object.return true or false

const obj = {
  username:"sourav giri",
  details:function(){
    console.log(`my name ${this.name}`);
  }
 
};
const user = Object.create(obj);
obj.username = "askash khanna"
console.log(obj.hasOwnProperty('username'));
console.log(user.hasOwnProperty('username'));




## check existing of a property

const obj = {
  name:"sourav giri",
  age:25
}
console.log("age" in obj);





## what is the difference b/w normal property and getter/setter

const obj = {
  name:"sourav giri",
  age:25,


  get fullName(){
     return `my name is ${this.name} and my age is ${this.age}`
  },


  set setName(details){
       const [name,age]  =  details.split(" ")
      this.name=name;
      this.age = age
  }
}



console.log(obj.fullName);
obj.setName = "aditya 21"
console.log(obj.fullName);

🔑 Key Differences

Normal property → holds a static value.

Getter property → looks like a property but actually runs a function when accessed.

Setter property → allows you to control how a property’s value is updated.