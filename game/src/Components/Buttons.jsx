import React from "react";

const Buttons = () => {
  const title = [
    "All titles",
    "Trending Now",
    "New releases",
    "RPG",
    "Actions",
  ];

  return (
    <div className="mt-10 md:mt-16 flex gap-3 overflow-x-auto pb-4 scrollbar-hide flex-wrap sm:flex-nowrap">
      {title.map((items, idx) => (
        <button
          key={idx}
          className="whitespace-nowrap px-6 py-2 active:scale-95 hover:bg-white hover:text-black transition-all cursor-pointer rounded-full bg-[#2a2a2a] border border-gray-700 text-sm font-medium"
        >
          {items}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
