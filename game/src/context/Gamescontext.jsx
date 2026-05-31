import React, { createContext } from "react";

export const GamesDataContext = createContext();

const GamesProvider = ({ children }) => {
  return (
    <GamesDataContext.Provider value={{}}>
      {children}
    </GamesDataContext.Provider>
  );
};

export default GamesProvider;
