import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/ui/button";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

// Reusable NavLink component
const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="nav-link inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 transition-all duration-300 ease-in-out relative after:content-[''] after:absolute after:-bottom-1 after:left-1 after:w-full after:h-[2px] after:bg-cyan-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:text-cyan-500 hover:after:scale-x-90"
    >
      {children}
    </a>
  </li>
);

// Main Header component
const LandingHeader = () => {
  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-300 p-4 fixed top-0 w-full z-10">
      <div className="flex items-center justify-between">
        {/* Navbar brand/logo */}
        <a href="/" className="flex items-center">
          Logo
        </a>

        {/* Navbar toggler for mobile */}
        <button
          className="md:hidden"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Navbar links (hidden on mobile, shown on larger screens) */}
        <div className="hidden md:flex">
          <ul className="flex space-x-6">
            {navItems.map((navItem, index) => (
              <NavLink key={index} href={navItem.href}>
                {navItem.label}
              </NavLink>
            ))}
          </ul>
        </div>
        <div>
          <Button
            variant={"ghost"}
            className="h-10 bg-cyan-500 hover:bg-cyan-500/90 text-white  hover:text-white rounded-full px-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate("/login")}
          >
            Signin
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
