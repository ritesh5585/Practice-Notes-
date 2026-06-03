import React from "react";
import Buttons from "../Components/Buttons";
import Card from "../Components/Card";
import { useLoaderData } from "react-router";

const Home = () => {
  const { data } = useLoaderData();

  return (
    <div className=" text-xl">
      <div className="w-full min-h-screen text-white p-5">
        <div className="">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Explore the Metaverse
          </h1>
          <p className="text-lg md:text-xl font-light w-full md:w-[60%] lg:w-[45%] text-gray-300">
            Discover your next obsession from our meticulously curated database
            of the world's most legendary titles.
          </p>
        </div>
        <Buttons />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 pb-10">
          {data.results.map((items) => (
            <Card items={items} key={items.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
