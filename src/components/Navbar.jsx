import React from "react";

const Navbar = ({ setView, cartCount }) => (
  <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
    <h1
      className="text-xl font-black text-green-700 cursor-pointer"
      onClick={() => setView("items")}
    >
      VEGGIE-GO
    </h1>
    <button
      onClick={() => setView("cart")}
      className="relative p-2 bg-gray-100 rounded-full"
    >
      🛒
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  </nav>
);

export default Navbar;
