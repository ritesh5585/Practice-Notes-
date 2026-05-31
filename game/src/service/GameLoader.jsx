import React from "react";
import api from "../config/api";

export const gameLoader = async () => {
  const res = api.get("/games");

  return res;
};
