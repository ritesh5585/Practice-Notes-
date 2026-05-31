import axios from "axios";
import React, { useEffect } from "react";
import api from "../config/api";

const Home = () => {
  const getGames = async () => {
    try {
      const response = await api.get("/games");
      console.log(response);
    } catch (error) {
      console.log("MESSAGE:", error.message);
      console.log("RESPONSE:", error.response);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  return <div className=" text-2xl">Home</div>;
};

export default Home;
