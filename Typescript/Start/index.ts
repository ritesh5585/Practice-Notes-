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

interface book {
  title: string;
  pages: number;
  isAvailable: boolean;
}

let myBook: book = {
  title: "Atomic",
  pages: 320,
  isAvailable: true,
};

function printBook(book: book) {
  console.log(
    book.title,
    " has ",
    book.pages,
    "pages & is",
    book.isAvailable == true ? "available" : "not available",
  );
}
printBook(myBook);
