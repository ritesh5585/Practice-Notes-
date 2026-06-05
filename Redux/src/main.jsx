import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.js";

// yaha Provider => App ko wrap krta h and store se sabko direct data bhejta h jisko hum koi bhi file se excess kar skte h
createRoot(document.getElementById("root")).render(
  <Provider store={store}> 
    <App /> 
  </Provider>, 
);

// to use redux start with

// Store > Provide on main jsx > createSlice  

