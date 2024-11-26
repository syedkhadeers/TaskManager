import React from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white flex justify-between p-4">
      <div className="text-lg">My Application</div>
      <div className="flex items-center gap-2">
        <a
          className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white"
          href="#"
        >
          <MdOutlineDarkMode />
        </a>
        <a
          className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white"
          href="#"
        >
          <IoMdLogOut />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
