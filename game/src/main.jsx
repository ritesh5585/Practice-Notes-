import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./AppRoutes.jsx";
import GamesProvider from "./context/Gamescontext.jsx";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")).render(
  <GamesProvider>
    <RouterProvider router={AppRouter} />
  </GamesProvider>,
);
