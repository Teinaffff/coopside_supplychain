import React from "react";
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to="/">
      <div className="flex items-center ml-4 mt-1">POC</div>
    </NavLink>
  );
};

export default Logo;
