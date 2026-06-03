import React, { useContext, useState } from "react";
import { useLoaderData, useParams } from "react-router";
import { Star, Calendar, Tag } from "lucide-react";
import { GamesDataContext } from "../context/Gamescontext";

const GameDetails = () => {
  const { data } = useLoaderData();
  console.log(data);

  const { favourite, addToFav, removeFromFav } = useContext(GamesDataContext);
  const [isHovered, setIsHovered] = useState(false);

  const isFavourite = favourite.some((fav) => String(fav.id) === String(data.id));

  // Toggle favorite logic
  const handleFavouriteClick = () => {
    if (isFavourite) {
      removeFromFav(data.id);
    } else {
      addToFav(data);
    }
  };

  return (
    <div className="bg-[#141414] text-white min-h-screen font-sans pb-20">
      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] mb-8 md:mb-16 shadow-2xl group border border-gray-800">
          <img
            src={data.background_image}
            alt="game"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {data.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm md:text-base text-gray-300 font-medium">
                <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700">
                  <Calendar size={16} />
                  {data.released || "Dec 10, 2020"}
                </span>
                <span className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-700">
                  <Star size={16} className="text-yellow-400" />
                  {data.rating} / 5
                </span>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-white text-black hover:bg-gray-200 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] text-sm md:text-base">
                Buy Now
              </button>
              <button
                onClick={handleFavouriteClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 rounded-full font-bold backdrop-blur-sm transition-all text-sm md:text-base cursor-pointer border ${
                  isFavourite
                    ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                    : "border-gray-500 hover:border-white hover:bg-white/10 text-white"
                }`}
              >
                {isFavourite ? (isHovered ? "Unfavourite" : "Favourited") : "Favorite"}
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* LEFT COLUMN - ABOUT & MEDIA */}
          <div className="lg:col-span-2 space-y-10 md:space-y-16">
            {/* ABOUT */}
            <section className="bg-[#1c1c1c] p-6 md:p-8 rounded-3xl border border-gray-800">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-white rounded-full"></span>
                About the Game
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {data.description_raw ||
                  "Rockstar Games went bigger, since their previous installment of the series. You get the complicated and realistic world-building from Liberty City of GTA4 in the setting of lively and diverse Los Santos, from an old fan favorite GTA San Andreas. 561 different vehicles (including every transport you can operate) and the amount is rising with every update. Simultaneous storytelling from three unique perspectives..."}
              </p>
            </section>

            {/* MEDIA */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-white rounded-full"></span>
                Media
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-2xl border border-gray-800 aspect-video group">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs219nkxpn_xE_ErEwP6hNNwko4pk2hwcux9BgaPdzwR_fiM81wnGQuernGjQh5K0dxkYRKKMb6v_DFNITCzoQhg0Yf9bqfUoJ2frw5hZm7JSJvmhhALrGYRbpgtSTyhVWALM3ILDxX3XV65MKsaVG_kju1nB6ihs0GZDcLNCEcVY7IjhniNqglLniHxc5F1-l5qx8UIKWQX6hE1epKjo1iRHuSy4ulQf7yqz_G9_X7mrkq8L_fma51859_ch-GfJ2Wu3k51stxpA"
                    alt="media 1"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-800 aspect-video group">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK4JhvPyAvMGavxCNy_HrdD6zzWgsCNDD6sWssW0olUZjXraGkA660qnqYcuGTNwS2AMiE4ypkWgjHqUPIZpnHCYzPZkfDPRcZJEyDbsJLAB_sELDaJDLtkkQhe3DNlNaGjsj6n1tP-gp69j9HnXyGwlyhulj8uWddMfse_zWhkyFLEIG8fgq00BtuI2HwOHOQS89VFpZFWilz1nCZLzO0ng_lIxCAlKPber_vT13Izh8bNMhZHRi5jFVI3dg5DXZlgNXdNM9v2LA"
                    alt="media 2"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - STATS & TAGS */}
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 md:p-8 bg-gradient-to-br from-[#1c1c1c] to-[#111111] rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <h3 className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-sm">
                Player Reviews
              </h3>
              <div className="flex items-end gap-3">
                <p className="text-5xl md:text-7xl font-black text-white">
                  {data.rating || "4.9"}
                </p>
                <p className="text-gray-500 font-medium mb-1 md:mb-2">/ 5</p>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-[#1c1c1c] rounded-3xl border border-gray-800">
              <h3 className="font-bold text-gray-400 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
                <Tag size={16} />
                Tags & Genres
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {["RPG", "Sci-fi", "Open World", "Action", "Singleplayer"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-[#2a2a2a] hover:bg-white hover:text-black transition-colors cursor-pointer rounded-xl text-xs md:text-sm font-semibold border border-gray-700"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameDetails;
