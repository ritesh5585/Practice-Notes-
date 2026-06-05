import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/CounterSlice"

const store = configureStore({
    reducer: {
        count: counterReducer
    }
})

export default store