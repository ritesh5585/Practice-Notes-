import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "./features/CounterSlice";

const App = () => {
  const data = useSelector((state) => state.count.value);
  console.log(data);
  // data hume mil raha h Provider se jo humne main jsx me use kiya th wrap karne ko

  const dispatch = useDispatch();
  // koi action ko trigger karne ke liye ye use karna h

  const handleIncrement = () => {
    dispatch(increment());
  };
  const handleDecrement = ()=> {
    dispatch(decrement())
  }

  return (
    <div className="Redux">
      <div>{data}</div>
      <span className="plus" onClick={handleIncrement}>Add</span>
      <span className="Minus" onClick={handleDecrement}>Less</span>
    </div>
  );
};

export default App;
