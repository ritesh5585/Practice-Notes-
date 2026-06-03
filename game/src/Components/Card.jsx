import React, { useContext } from "react";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { GamesDataContext } from "../context/Gamescontext";

const Card = ({ items }) => {
  const navigate = useNavigate();
  const { favourite, addToFav, removeFromFav } = useContext(GamesDataContext);

  const isFavourite = favourite.some((fav) => String(fav.id) === String(items.id));

  const goToDetails = () => {
    navigate(`/gamesDetails/${items.id}`);
  };

  const handleFavouriteClick = (e) => {
    e.stopPropagation(); 
    if (isFavourite) {
      removeFromFav(items.id);
    } else {
      addToFav(items);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#1c1c1c] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 border border-gray-800 h-full group relative">
      <div className="w-full aspect-[4/3] overflow-hidden relative">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={items.background_image}
          alt={items.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent opacity-80" />
        
        {/* Floating Heart Button */}
        <button
          onClick={handleFavouriteClick}
          aria-label={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/80 backdrop-blur-md p-2 rounded-full border border-gray-700/50 text-white transition-all hover:scale-110 cursor-pointer shadow-lg"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isFavourite ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-white"
            }`}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h1 className="font-bold text-lg leading-tight line-clamp-2">{items.name}</h1>
          <div className="flex items-center bg-[#2a2a2a] px-2 py-1 rounded-lg shrink-0">
            <Star size={14} className="text-yellow-400 mr-1 fill-yellow-400" />
            <span className="text-sm font-semibold">{items.rating}</span>
          </div>
        </div>

        <button
          onClick={goToDetails}
          className="w-full mt-auto py-3 rounded-xl text-black bg-white hover:bg-gray-200 text-sm font-bold cursor-pointer transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
