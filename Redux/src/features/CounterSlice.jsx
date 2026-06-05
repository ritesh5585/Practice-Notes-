import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "Alok",
  initialState: {
    value: 0,
  },
  reducers: {
    // niche jo increment h usko hi action kehte h
    increment: (state) => {
      state.value += 1;
    },
    decrement : (state) => {
      state.value -= 1;
    }
  },
});

export const { increment } = counterSlice.actions
export const { decrement} = counterSlice.actions
export default counterSlice.reducer;
 