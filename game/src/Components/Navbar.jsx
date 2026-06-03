import React, { useEffect, useState } from "react";
import { Gamepad, User, Search } from "lucide-react";
import { NavLink, useSearchParams } from "react-router";

const Navbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }

        params.set("page", 1);
        return params;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-lg border-b border-gray-800">
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-4 gap-4 md:gap-8 text-white max-w-7xl mx-auto">
        {/* LOGO & MOBILE HEADER */}
        <div className="flex w-full md:w-auto items-center justify-between">
          <NavLink
            className="text-xl md:text-2xl font-black tracking-wider hover:text-gray-300 transition-colors"
            to="/"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-white text-black p-1.5 rounded-lg">
                <Gamepad size={24} />
              </div>
              <h1>GAMELIST</h1>
            </div>
          </NavLink>
          {/* Mobile User Icon */}
          <div className="md:hidden bg-[#1c1c1c] p-2 rounded-xl border border-gray-800 cursor-pointer">
            <User size={20} />
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide text-sm md:text-base font-medium text-gray-300 px-1 md:px-0">
          <NavLink
            className={({ isActive }) =>
              `transition-colors whitespace-nowrap hover:text-white ${isActive ? "text-white font-bold" : ""}`
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `transition-colors whitespace-nowrap hover:text-white ${isActive ? "text-white font-bold" : ""}`
            }
            to="/games"
          >
            Games
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `transition-colors whitespace-nowrap hover:text-white ${isActive ? "text-white font-bold" : ""}`
            }
            to="/favourite"
          >
            Favourite
          </NavLink>
        </div>

        {/* SEARCH & USER */}
        <div className="flex items-center w-full md:w-auto gap-4">
          <div className="bg-[#1c1c1c] flex-grow md:w-64 rounded-2xl px-4 items-center gap-2 border border-gray-800 focus-within:border-gray-500 transition-colors flex h-11 md:h-12 shadow-inner">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="Search legendary titles..."
              className="bg-transparent text-white w-full outline-none text-sm placeholder-gray-500"
            />
          </div>
          <div className="hidden md:flex bg-[#1c1c1c] p-3 rounded-2xl border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors hover:text-white text-gray-300">
            <User size={22} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
