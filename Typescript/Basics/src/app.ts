// function greet(name: string): string {
//   return `Ts start hua ${name}`;
// }

// const username: string = "Ritesh";
// console.log(greet(username));

interface User {
  name: string;
  age: number;
  email: string;
}

function createUser(name: string, age: number, email: string): User {
  return {
    name: name,
    age: age,
    email: email,
  };
}

const user2 = createUser(
  "Rahul",
  25,
  "rahul@gmail.com"
);
console.log(user2)
