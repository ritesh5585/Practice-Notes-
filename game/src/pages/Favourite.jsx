import React, { useContext } from "react";
import { GamesDataContext } from "../context/Gamescontext";
import Card from "../Components/Card";

const Favourite = () => {
  const { favourite } = useContext(GamesDataContext);

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">My Favourite Games</h1>
      
      {favourite.length === 0 ? (
        <p className="text-gray-400">No favourite games added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favourite.map((game) => (
            <Card items={game} key={game.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourite;
