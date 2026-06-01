import axios from "axios";
import React, { useEffect } from "react";
import api from "../config/api";
import Buttons from "../Components/Buttons";
import Card from "../Components/Card";
import { useLoaderData } from "react-router";

const Home = () => {
  const { data } = useLoaderData();

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

  return (
    <div className=" text-xl">
      <div className="w-full min-h-screen text-white p-5">
        <div className="">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Explore the Metaverse
          </h1>
          <p className="text-xl font-light w-[45%] leading-none">
            Discover your next obsession from our meticulously curated database
            of the world's most legendary titles.
          </p>
        </div>
        <Buttons />
        <div className="w-full flex flex-wrap gap-4">
          {data.results.map((items) => (
            <Card items={items} key={items.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
