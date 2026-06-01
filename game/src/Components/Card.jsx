import React from "react";
import { Star } from "lucide-react";

const Card = ({ items }) => {
  console.log(items);
  return (
    <div>
      <div className="w-60 mt-20 h-72 bg-[#111111] rounde-lg overflow-hidden">
        <div className="w-full h-1/2 ">
          <img
            className="w-full h-full object-cover"
            src={items.background_image}
            alt=""
          />
        </div>
        <div className="px-2 py-1">
          <div className="flex  justify-between w-full">
            <div className="flex items-center gap-2">
              <h1>{items.name}</h1>
              <div className="flex items-center">
              <Star size={14} color="yellow" className="m-2" />
              <h5 className="text-lg">{items.rating}</h5>
              </div>
            </div>
          </div>
          <p className="text-[0.9vw] mt-2 leading-none opacity-90"></p>
          <button className="w-[99%] mt-6 px-10 py-2 rounded-2xl text-black bg-white text-sm font-bold">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
