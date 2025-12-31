import React from "react";
import { NavLink } from "react-router-dom";
import { IMAGES } from "../../assets";

const Logo = () => {
  return (
    <NavLink to="/">
      <div className="flex items-center ml-4 mt-1">
        <img 
          src={IMAGES.supLogo} 
          alt="Supply Chain Logo" 
          className="h-12 w-auto object-contain"
        />
      </div>
    </NavLink>
  );
};

export default Logo;
