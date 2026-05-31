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
    <div className="mt-20 flex gap-5">
      {title.map((items, idx) => (
        <button
          key={idx}
          className="p-1 active:bg-blue-600 hover:bg-[#3a3a3a] transition-colors cursor-pointer px-6 rounded-full bg-[#262626]"
        >
          {items}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
