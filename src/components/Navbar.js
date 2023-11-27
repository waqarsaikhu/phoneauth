import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link to="userList">User List</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
