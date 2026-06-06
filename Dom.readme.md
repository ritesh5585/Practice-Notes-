# The DOM : the fundamentals

## Teach:
- DOM Tree structure : node,element , text,comment

>Dom :
 dom also known is document object model , its a tree like structure that browser create after parsing the html page. its represent the document's element in object format,which can be manipulate through javascript 

>Nodes :

there are different kind of node, element node,text node and one is comment node.
node is a generic term for any unit of the dom tree (element,text,comment,etc)
element: a specific kind of node that represent an HTML tag(div,h1,p etc) 

>< div id="demo"> → Element Node 

>"Hello " → Text Node 

><!-- greeting message --> → Comment Node 


- Selecting elements: getElementById,getElementSByClassName,getElementByTagname, querySelector,querySelectorAll;

1. Methods available only on document:

document.getElementById()

document.getElementsByClassName()

document.getElementsByTagName()

. Methods available on both document and any element (container, div, span, etc.):

querySelector()

querySelectorAll()

>with the help of these , we can select any html element.

>getElementsByClassName return HTML collection , its a array like object.

>querySelectorAll return node list its also an array like objects.






- Text/content access: innerText,textContent,innerHtml

> innerText,textContent used to manipulate text in an html element.
> innerHTML used to manipulate html in an html element.





- Attribute manipulation: getAttribute,setAttrubute,removeAttribute

> you can get the value of any attribute of that html element. - element.getAttribute("attributeName")

> you can modify the attribute value of any element. - element.setAttribute("attributeName","value")

> you can also remove the attrubute from any html element. - element.removeAttribute("attributeName")






- Dynamic DOM manipulation: createElement, appendChild,removeChild,prepend

> Create any html element from scratch : const h1 =  document.createElement("h1")

> element.append(element) : add in last

> element.prepend(element) : add in first

> elemenet.remove() : remove the element
> parent.removeChild(childNode)





- Style updates via .style and classList(add,remove,toggle)
element.style.color = "red"
element.classList.add("heading","another")
element.classList.remove("heading","another")
element.classList.toggle("heading","another")




- Difference between innerText vs textContent vs innerHtml
> textContent is more faster than innerText. textContent display none wale element ko nikal ke dega, innerText only visible part ko nikal ke dega
>inenerHtml put html inside it


- Live HTML collection vs static nodeList
live means html collection update automatically when the dom changes
static means node list is not update automaticaaly when the dom is changes

const div = document.getElementsByClassName("divider");
console.log(div.length);


const node = document.createElement("div");
node.className = "divider"
node.textContent  = "code c"

document.body.appendChild(node);
console.log(div.length);



## questions
- what is DOM ? How does it represent the HTML structure ?

- Name the types of nodes in dom tree?

- what's the defference between an element node and a text node ?

- Inspect the following HTML, in the browser and indentify each node:

- what is the difference between getElementById and querySelector ?

- what does getElementsByClassNmae return ? Is it an array ?

-Use querySelectorAll to select all buttons with class ".buy-now"

- Select the heading of a page by Id and chnage its text to "welcome to Sheriyans"

- Select all <li> elements and print their text using a loop?

- what's the difference between innerText,textContent and innerHTML

- when should you use textContent instead of innerText?

- Select a paragraph and replace its content with: "<b>update</b> by javascript"

- How do you get the src of an image using Javascript?

- what does setAttribute() do?

- Select a link and update its href to point to https://sheriyans.com.

- Add a tittle attribute to a div dynamically

- remove a disable attribute from a button?

- what does createElement() do? what's returned?

- what's the difference between appendChild() and prepend()

- can you remove an element using removeChild()?

- Create a new list item <li>new task </li> and add it to the end of ul.

- create a new image element with a placeholder source and add it at the top of a div.

- select the first item in a list and delete it from the DOM.

- How do you change the background color of an element ?

- what's the difference between .classList().add() and .classList.toggle()?

- Add a "highlight" class to every even item in a list ?

- Toggle a class  "active" on a button when clicked (Hint ues classList.toggle())

- Set the font size of all <p> elements to 18px using .style







>#  Events & Event Handling

>Event :An event is an action or occurance that happen  whenever we try to perform any action on browser like click,hover,doubleclick,etc...
> Event Object : whenever event happen in browser , event related all infor we get as a form of object that is called event object
> Event Listener : These events act as signals that allow JavaScript to execute specific functions, making web pages dynamic and interactive. 

- Common events : click,input, change,submit,mouseover,keyup,keydown
- Event Object : target,type,preventDefault.
target wo element hai jiske upor event fire hua.
type and preventDeafult form mein hota hai ;

 
the big difference b/w input event and change event is input event fire on every input on the element, chage event tab trigger hoga fab focus bhar hoga input ke

element.addEventListener("eventName",(e)=>{

})
---remove eventListener
let func = function;
element.removeEventListener("eventName",func)




- Event bubbling and event capturing


whenever we have perform any event that event is comeplete in two phase.

phase 2: event raised  element se parent ki taraf ayega (event bubbling) :Event bubbling is a concept in JavaScript where an event triggered on a child element propagates (or "bubbles up") to its parent and ancestor elements in the DOM hierarchy.

phase 1: event top level element se nichhe ki taraf ayega (event capturing) :  Event capturing is also known as event trickling,is the opposite of event bubbling,where the event is fired on the  child element propogates from the root of the DOM down to the target element.


Event bubbling is the default behaviour in dom event model
bydefult captrue phase off rahta hai and we can on it,

NOte: if event capture is on then , capture done first then bubbling


- Event deligation :

Event delegation is a JavaScript technique where instead of attaching event listeners to multiple child elements, you attach a single event listener to a parent element and let the event "bubble up" (propagate) from the target (child) to the parent.

// Event propagation is the process in which an event travels through the DOM in three phases: capturing, target, and bubbling. ✅












 

># Forms & Form Validations


> inline based validation - required,minLength,maxLength etc.


  if(name.value.length<4){
     sm.style.display="block"
  }
  else{
     sm.style.display="none"
  }

- showing error messages conditionally


- pattern attribute vs custom regex

 >pattern="[a-z]{3,8}" (rarely used)

>custom regex in js (recomded)(do it from gpt always)
let regex1 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let regex2 = /^[a-zA-Z0-9._%+-]+@(gmail\.com|email\.com|outlook\.com)$/;
if(regex1.test(email.value) && regex2.test(email.value)){
  em.style.display="none"
}
else{
  em.style.display="block"
}




- Difference between value and textContent
> always remember .value used for input. like you have any div,paragraph,h1 etc tag textContent used for their value get or set



const email = document.querySelector("#email");
const password = document.querySelector("#password")


const errorEamil = document.querySelector("#emailError");
const passwordError=  document.querySelector("#passwordError")
const successError = document.querySelector("#sucess_error")


const form  = document.querySelector("form");


form.addEventListener("submit",(e)=>{
  e.preventDefault();

  
  errorEamil.style.display="none"
  passwordError.style.display="none"
  successError.style.display="none"

  let successMessage = true;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|email\.com)$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]).{8,16}$/;

 
  const emailRegexResult = emailRegex.test(email.value)
  const passwordRegexResult = passwordRegex.test(password.value)



  // console.log(emailRegexResult,passwordRegexResult);
  if(!emailRegexResult){
    errorEamil.style.display="initial"
   successMessage =false
  }

  if(!passwordRegexResult){
     passwordError.style.display="initial";
     successMessage = false
  }

  if(successMessage){
    successError.style.display="block"

  }

})













>#  Timers & Intervals
accepts function(callback) and time in miliseconds
let id = setTimeout(()=>{

},2000)
setTimeout ek bar chalta hai
clearTimeout(id)

let id = setInterval(()=>{

},2000)
clearInterval bar bar chalta hai.
clearInterval(id)


✅Task : make downloding progress bar






># LocalStorage,SessionStorage & Cookies

--LocalStorage : localstorage is a browser built in feature that let you store data in user's browser even though you close the tab window or browser.

localstorage store data in string in key value pair.(vlaue shoud be store in string)
localstorage did not delete you data until you manually remove it
it can store upto 5 mb data                                                               

ex. // Save data
in case of storing array and object you must convert it into JSON.stringyfy(object or array)
localStorage.setItem("username", JSON.stringfy({username:"Sourav"}));

// Get data
localStorage.getItem() expects a string key, not an object.
const name = JSON.parse(localStorage.getItem("username")); // "Sourav"

// Remove specific data
localStorage.removeItem("username");

// Clear everything
localStorage.clear();





>Session storage : its a browser built in storage, that let you sotre data for temporary purpose,the data will be vanished or deleted after you close the window tab.data store upto 5MB
sessionStorage.setItem("name","souravg iri")
console.log(JSON.parse(sessionStorage.getItem("data")));
usage: for store temporary auth token,or something whcih store temporary 



> cookies: browser mein chota data store karne ke liye cookies ka istemal hota hai nearly ~4kb.
> cookies mein jo bhi data store karoge wo data page reload par automatically server par jaayega.
-how to set cookie:(set email)
document.cookie = "email=souravgiri8032@gmail.com"
Note : Cookies are automatically sent only to the same domain that created them.






closest() is a DOM method that searches upwards from the current element to find the nearest ancestor (including the element itself) that matches a given CSS selector.

element.closest("selector")




># Bonus Practise Project Ideas for Phase 2
- DOM Interactiviy

>> Todo App (create,add,delete,edit);

>> Accordian / collabsable FAQ

-Event Handling

>> Real Time search Filter

>> Custom Dropdown menu

- Form management

>>Survey forms with multiple fields and validation

- Storage Integration

>> notes app (save text to localStorage);

>> Dark mode toggle saved across sessions. 