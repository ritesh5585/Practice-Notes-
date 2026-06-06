

// const arr = [1,2,3,2,1,5,1,2,6,3,2,1,7,4,3,7,5]
// const filterArray = []

// for(let i of arr){
//   if(!filterArray .includes(i)){
//     filterArray .push(i)
//   }
// }
// console.log(filterArray);



// // with set 
// const mySet = new Set(arr)
// const myArray = [...mySet]
// console.log(myArray);








// const arr = [34,10, 5,101, 8, 20, 3];
// let largest = 0;
// let second_largest = 0;

// for(let i of arr){
//  if(largest<=i){
//   second_largest = largest
//   largest = i
//  }
//  else{
//   if(second_largest<=i){

//     second_largest=i
//   }
//  }

// }

// console.log(largest);
// console.log(second_largest);









//left rotation
// const arr=[1,2,3,4,5]
// let k=2;
// while(k!==0){
//   let re = arr.shift()
//   arr.push(re)
//   k--;
// }
// console.log(arr);


//right rotation
// const arr=[1,2,3,4,5]
// let k=2;
// while(k!==0){
//   let re = arr.pop();
//   arr.unshift(re)
//   k--;
// }

// console.log(arr);







// const a = [1, 2, 3, 4];
// const b = [3, 4, 5, 6];

// const inter = []


// for(let i of a){
//   if(b.includes(i)){
//     inter.push(i)
//   }
// }

// console.log(inter);





// const arr = [1, 2, 2, 3, 3, 3];
// const obj = {}


// for(let i of arr){
//   if(String(i) in obj){
//     obj[i] = obj[i]+1
//   }
//   else{
//     obj[i] = 1
//   }
// }

// console.log(obj);






// const arr = [1, 2, 3, 4, 5,3];
// const target = 6;
// const newArray = []

// for(let i=0;i<arr.length;i++){
//   for(let j=i+1;j<arr.length;j++){
//     if(arr[i]+arr[j]===target){
//       newArray.push([arr[i],arr[j]])
//     }
//   }
// }

// console.log(newArray);






// const users = [
//   { name: "Sourav", age: 25 },
//   { name: "Amit", age: 22 },
//   { name: "Riya", age: 28 }
// ];


// const result = users.sort((a,b)=>a.age-b.age)
// console.log(result);





//rever a string
// Example: "hello" → "olleh"


// let str = "rupa roy kapporrrrr";
// let result =""
// for(let i=str.length-1;i>=0;i--){
//   result+=str[i]
// } 
// console.log(result);









// Count vowels and consonants in a given string.
// Example: "Sourav" → vowels = 3, consonants = 3

// let str = "umbrella";
// let vowels = 0;
// let consonents = 0 
// for(let i of str.trim()){
//   i = i.toLowerCase()
//   if(i ==="a" || i==="e" || i==='i' || i==='o' || i==='u'){
//     vowels++;
//   }
//   else if(i.charCodeAt()>=97 && i.charCodeAt()<=122){
//     consonents++;
//   }
// }


// console.log(`vowels = ${vowels}`);
// console.log(`consonents = ${consonents}`);














// Check if two strings are anagrams (same letters, different order).
// Example: "listen" and "silent" → true

// let str1 = "acbd"
// let str2 = "abbc"


// if(str1.trim().length === str2.trim().length){

//   str1 = str1.toLowerCase()
//   str2 = str2.toLowerCase()

//   if(str1.split("").sort().join("") === str2.split("").sort().join("")){
//     console.log("true");
//   }
//   else{
//     console.log("false");
//   }

// }
// else{
//   console.log("false");
// }









// Find the first non-repeating character in a string.
// Example: "aabbcddee" → "c"

// const str = "aabbcddee";

// for(let i of str){
//   if(str.indexOf(i) === str.lastIndexOf(i)){
//     console.log(i);
//     break;
//   }
// }








// Flatten a nested array without using .flat().
// Example: [1, [2, [3, 4], 5]] → [1, 2, 3, 4, 5]








let num = [1,2,3];
let cpy = num;

console.log(num,cpy);


num.push(12) 
console.log(num,cpy);