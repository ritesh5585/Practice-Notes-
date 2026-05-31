import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Favourite from "./pages/Favourite";
import Games from "./pages/Games";
import MainLayout from "./layout/MainLayout";
import { gameLoader } from "./service/GameLoader";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    hydrateFallbackElement: <p>Loading....</p>,

    children: [
      {
        index: true,
        element: <Home />,
        loader: gameLoader,
      },
      {
        path: "favourite",
        element: <Favourite />,
      },
      {
        path: "games",
        element: <Games />,
      },
    ],
  },
]);
