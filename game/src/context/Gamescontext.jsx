import React, { createContext, useState, useEffect } from "react";

export const GamesDataContext = createContext();

const GamesProvider = ({ children }) => {

  const [favourite, setFavourite] = useState(() => {
    const saved = localStorage.getItem("favourite_games");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favourite_games", JSON.stringify(favourite));
  }, [favourite]);

  const addToFav = (game) => {
    setFavourite((prev) => {
      const exists = prev.find((item) => String(item.id) === String(game.id));
      if (exists) return prev;
      return [...prev, game];
    });
  };

  const removeFromFav = (id) => {
    setFavourite((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  return (
    <GamesDataContext.Provider value={{ favourite, addToFav, removeFromFav }}>
      {children}
    </GamesDataContext.Provider>
  );
};

export default GamesProvider;
