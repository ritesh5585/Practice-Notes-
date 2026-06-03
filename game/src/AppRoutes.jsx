import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Favourite from "./pages/Favourite";
import Games from "./pages/Games";
import MainLayout from "./layout/MainLayout";
import { gameDetails, gameLoader } from "./service/GameLoader";
import GameDetails from "./pages/GameDetails";
import Loader from "./Components/Loader";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    hydrateFallbackElement: <Loader />,

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
        loader:gameLoader
      },
      {
        path: "gamesDetails/:id",
        element: <GameDetails />,
        loader: gameDetails,
      },
    ],
  },
]);
