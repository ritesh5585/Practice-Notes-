// module patterns
// Module pattern ek design pattern hai jisme hum apna code ek self executing function
//(IIFE) ke andar likhte hain, taki variables aur functions private rahen.

// Iske andar se hum sirf wahi cheezein return karte hain jo bahar use karni hai.


// Is Pattern ka main fayda hai data hiding (encapsulation) aur clean structure , taaki 
// code secure , resuable aur managable ban sake 


// MyNotes : module pattern, mein jo vi hum banayenge wo iife ke andar banayenge and jo
// vi hamein bahar use karna hai usko hum return kar denge .



let func = (
  function(){
    let currentBalance = 10000
     return {
      checkBalance:function(){
        return currentBalance
      },

      deposit:function(amount){
        if(amount>0){
          currentBalance+=amount
        }
        else{
          alert("balance could not be negative")
        }
      },

      withdrawl:function(amount){
        if(amount>0 && currentBalance>=amount){
          currentBalance-=amount;
          return currentBalance
        }
        else{
          alert("something is wrong")
        }
      }
     }
  }
)()

// console.log(func.checkBalance())
// func.deposit(2300);
// console.log(func.checkBalance())
// func.withdrawl(5000);
// console.log(func.checkBalance())



// Note:Reaveling module pattern is same to same like module pattern the only difference is that normal module pattern mein function ke name se object mein se return
// kar sakte ho but revealing module pattern mein se hum koi sa vi name object se vej sakte hai. 







// Factory Function Pattern
// EK function banate ho jo objects create karta hai (factory = object banane ki maching)

// Factory Function Pattern ek aisa design pattern hai jismein hum ek simple function
// likhte hain jo naye objects banakar return karta hai.bina classs ya new keyword use kiye.

// Is pattern ka main idea hai - object creation ko ek function ke through control karna.

// Har baar jab tum factory function call karte ho, tumhe ek naya object milta hai
// jisme apne mehtods aur(agar chaho to) private data ho sab hai.

// Yeh pattern specially useful hai jab tumhe ek hi type ke bohot saare objects
// chahiye , jaise users, products , tasks etc 




// function createProduct(name,price){
//   let stock = 10;
//   return {
//     name,
//     price,
//     checkStock:function(){
//       console.log(`total stock now : ${stock} piece available`);
//     },
//     buy:function(qty){
//       if(stock>=qty){
//         stock-=qty
//         console.log(`${qty} pieces booked - ${stock} pieces left`);
//       }
//       else{
//         console.error("insufficient stock");
//       }
//     },

//     refil:function(qty){
//       stock+=qty;
//       console.log(`refilled the stock - current stock ${stock}`);
//     }
//   }
// }

// const product1 = createProduct("iron rod",1200)








//observer pattern (class based - pub sub)


// class YoutubeChannel{
//   constructor(){
//     this.subscribers = [];
//   }
//   subscribe(user){
//     this.subscribers.push(user);
//     user.update(`${user.name} have subscribe the channel.`)
//   }
//   unsubscribe(user){
//      this.subscribers.splice(user,1);
//      user.update(`${user.name} have unsubscribe the channel.`)
//   }

//   notify(message){
//     this.subscribers.forEach(item=>{
//       item.update(`${item.name} `+message)
//     })
//   }
// }


// class User{
//   constructor(name){
//     this.name = name;
//   }
//   update(data){
//     console.log(data)
//   }
// }


// const sheryians = new YoutubeChannel();


// const user1 = new User("sourav giri");
// const user2 = new User("harsh")
// const user3= new User("avi gupta")
// const user4 = new User("rahul tripati")
// const user5 = new User("saloni")


// sheryians.subscribe(user1)
// sheryians.subscribe(user2)
// sheryians.subscribe(user3)
// sheryians.subscribe(user4)
// sheryians.subscribe(user5)

// // sheryians.unsubscribe(user3)

// sheryians.notify("new video is out")












// Performance Optimization

// debouncing : aap koi action kar rahe ho , aap e nahi chayeto ho ki every action mein kuch event perform ho, you want ki jab user pause lele 1 sec ke liye tab 
// us evernt or callback ko chalado.


// function debouncing(fn,delay){
//  let timer;
//  return function(...args){
//   clearTimeout(timer)
//   timer = setTimeout(function(){
//     fn(args)
//   },delay)
//  }
// }

// const input = document.querySelector("input");
// input.addEventListener("input",debouncing(function(dets){
//  console.log(dets);
// },500))



// app koi action perform kar rahe ho, you want during action , avery 1 sec mein kuch event ya kuch callback occur ho, jab user action karna bandh karde,tab na ho

//throttling




// function throttle(fnc,delay){
//   let timer=0;
//   return function(...args){
//      let now = Date.now()
//      if(now-timer>=delay){
//       timer=now
//       fnc(...args);

//      }
//   }

// }



// const input = document.querySelector("input");
// input.addEventListener("input",throttle(function(dets){
//  console.log(dets);
// },1000))








//  Lazy loding...with intersection observer

// concept e hai ki aapko, poori website mein jitne vi images hai sabko eksaath load karne ki jarurat nahi hai, website ka jo vi portion window mein dekhai de raha  hai, utna portion ko load kardo baki    images ko  load mat karo 


// const imgs = document.querySelectorAll("img");

// const observer = new IntersectionObserver(function(entries,observer){
//   entries.forEach(function(entry){
//     if(entry.isIntersecting){
//       let img = entry.target;
//       img.src = img.dataset.src;
//       img.classList.add("lazy-img")
//       observer.unobserve(img);
//     }
//   })
// },{
//   root:null,
//   threshold:0.1,
// });


// imgs.forEach(item=>{
 
//   observer.observe(item)
// })















//code splitting
// 2000 line code ek saath load karoge to -> heavy load badega,slow hoyega website
//  100 line code alag file mein, 300line code alag  file mein load karte hain



// const button = document.querySelector("button");
// button.addEventListener("click",async (e)=>{
//   let heavy =  await import('./heavy.js');
//   heavy.heavyCode()

// })









// Avoiding unnecessary reflows  and repaints

// const ul = document.querySelector("ul")
// const space  =document.createDocumentFragment(); //book a space in memory for me. 


// for(let i=0;i<=1000;i++){
//   let li = document.createElement("li");
//   li.textContent = i;
//   space.appendChild(li)
// }

// ul.appendChild(space)

// Note: if you not use createDocumentFragment(), instead of use normally ul ke andar append kar rahe ho then every time dom re-render hoga , ismein aapke wesite lag ho sakta hail.









//Memory leaks : timers,


// let count = 0
// const int = setInterval(()=>{
//     if(count<10){
//       count++;
//       console.log(count);
      
//     }
//     // if i not write this else part then aap ka memory leak hota rahega
//     // else{
//     //   clearInterval(int)
//     //   console.log("still chal raha hai");

//     // }
// },500)










// Seperation of concern(DOM vs logic)
// DOM ka code and logic ka code alag rehna chaiye  file mein


// const btn = document.querySelector("button")

// const ul = document.querySelector("ul")


// function randomData(){
//   let num1 = Math.floor(Math.random()*10);
//   let num2 = Math.floor(Math.random()*10);
//   return num1+num2;
// }


// btn.addEventListener("click",(e)=>{

//   let elem = document.createElement("li");
//   elem.textContent = randomData();
//   ul.appendChild(elem)
// })










// Custom utilities(e.g., own implementation of map,deep clone) ;; we can make our own map function
// map -> ek array ke top pe chalta hai and us array ke savi member us map function ke andar aate hai, and map function ek new array return karta hai
// and us new array mein jo vi map mein return kiya hoga, whi placed hota hai

// const arr = [1,2,3,4,5,6];

// function myMap(arr,callBack){
//   let newArray = []; 
//   for(let i=0;i<arr.length;i++){
//     newArray.push(callBack(arr[i],i,arr))
//   }
   
//   return newArray
// }


// let ans = myMap(arr,(num)=>num+2)
// console.log(ans);







// call Stack(Execution Stack) 
// js single threaded hai-> ek time par ek hi kaam karta hai.
// jab tum function call karte ho -> wo stack ke top pe chala jata hai.
// Function complete hone ke baad stack se nikal jata hai(pop ho jata hai.)


// web apis
// console setTimeout setINterval alert prompt js part nahi hai they are provided by browser
// thats why node js mein console setTimeout setINterval alert prompt  e kaam nahi karta because e sab js ka part nahi hai.