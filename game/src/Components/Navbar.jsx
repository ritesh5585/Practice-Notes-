import React from "react";
import { Gamepad, Gamepad2, User } from "lucide-react";
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <div>
      <div className="w-full flex items-center justify-between px-8 py-2 text-white">
        <NavLink className="text-lg font-bold" to="/">
          <div className="flex items-center gap-3">
            <Gamepad size={20} />
            <h1>Gamelist</h1>
          </div>
        </NavLink>
        <div className="flex items-center gap-5">
          <NavLink className="text-lg font-bold" to="/">
            Home
          </NavLink>
          <NavLink className="text-lg font-bold" to="/games">
            Games
          </NavLink>
          <NavLink className="text-lg font-bold" to="/favourite">
            Favrouite
          </NavLink>
        </div>
        <div className="flex items-center gap-3 ">
          <div className="bg-[#111111] flex rounded-md px-4 w-60 items-center gap-2">
            <input
              type="text"
              placeholder="Search games..."
              className="bg-neutral-900 text-white px-4 py-2 rounded w-full border-1 rounded-4xl outline-0"
            />
          </div>
          <User size={20} />
        </div>
      </div>
      <div className="w-full border-[1px] mt-2 border-zinc-500  "></div>
    </div>
  );
};

export default Navbar;
