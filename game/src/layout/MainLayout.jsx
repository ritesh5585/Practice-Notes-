import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#000]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
