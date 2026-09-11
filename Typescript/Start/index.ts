function area(length: number, width: number): number {
  return length * width;
}
// console.log(area(2, 6));

function sumArrayloop(num: number[]) {
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    // sum += num[i];
  }
  return sum;
}

function sumArrayReduce(nums: number[]): number {
  return nums.reduce((sum, curr) => sum + curr, 0);
}

// console.log(sumArrayReduce([10, 20, 30]), sumArrayloop([10, 20, 30]));

interface Book {
  title: string;
  pages: number;
  isAvailable: boolean;
}

let myBook: Book = {
  title: "Atomic",
  pages: 320,
  isAvailable: true,
};

function printBook(book: Book) {
  console.log(
    `${book.title} has ${book.pages} and is ${book.isAvailable ? "available" : "not available"}`,
  );
}
// printBook(myBook);

function getMethod(method: "draw" | "sign" | "type"): string {
  if (method === "draw") return "draw hua he";
  else if (method === "sign") return "sign hua he";
  else return "type hua he";
}
// console.log(getMethod("type"))

type paymentStatus = "pending" | "success" | "rejected";

function getStatus(status: paymentStatus): string {
  if (status == "pending") return "Your payment is being processed";
  else if (status == "success") return "Payment successful!";
  else if (status == "rejected") return "Payment failed, please try again";
  else return "Payment failed, please try again";
}

// console.log(getStatus("pending"));

type student = {
  name: string;
  remarks?: string;
  marks: number;
  age: number;
};

const students: student[] = [
  {
    marks: 99,
    name: "Rahul Sharma",
    age: 20,
    remarks: "Excellent performance in exams.", // Isme remarks diya hai
  },
  {
    marks: 20,
    name: "Priya Patel",
    age: 21,
  },
  {
    marks: 80,
    name: "Amit Verma",
    age: 19,
  },
];

function getSTudent(student2: student[]){
 return student2.filter((stud) => stud.marks <= 90);
}
console.log(getSTudent(students));
