import React from "react";
import Card from "../Components/Card";
import { useLoaderData } from "react-router";

const Games = () => {
  const { data } = useLoaderData();

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 pb-10">
      {data.results.map((items) => (
        <Card items={items} key={items.id} />
      ))}
    </div>
  );
};

export default Games;
