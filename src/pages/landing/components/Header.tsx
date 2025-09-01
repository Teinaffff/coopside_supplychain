import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
};

// Reusable NavLink component with smooth scrolling
const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove the # from href
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    
    // Close mobile menu after clicking a link
    if (onClick) {
      onClick();
    }
  };

  return (
    <li>
      <a
        href={href}
        onClick={handleClick}
        className="nav-link inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 transition-all duration-300 ease-in-out relative after:content-[''] after:absolute after:-bottom-1 after:left-1 after:w-full after:h-[2px] after:bg-cyan-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:text-cyan-500 hover:after:scale-x-90 cursor-pointer"
      >
        {children}
      </a>
    </li>
  );
};

// Main Header component
const LandingHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#features", label: "Features" },
    { href: "#about", label: "About Us" },
    { href: "#statistics", label: "Statistics" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact-us", label: "Contact" },
  ];

  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-300 p-4 fixed top-0 w-full z-10">
      <div className="flex items-center justify-between">
        {/* Navbar brand/logo */}
        <a href="/" className="flex items-center">
          Logo
        </a>

        {/* Navbar toggler for mobile */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={faBars} className="text-gray-700" />
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
        
        {/* Desktop Sign In Button */}
        <div className="hidden md:block">
          <motion.span
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:cursor-pointer text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/login")}
          >
            Signin
          </motion.span>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden mt-4 pb-4 border-t border-gray-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col space-y-2 mt-4">
            {navItems.map((navItem, index) => (
              <NavLink key={index} href={navItem.href} onClick={closeMobileMenu}>
                {navItem.label}
              </NavLink>
            ))}
          </ul>
          
          {/* Mobile Sign In Button */}
          <div className="mt-4">
            <motion.span
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:cursor-pointer text-white px-6 py-3 rounded-full text-sm font-medium inline-block shadow-lg w-full text-center"
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                navigate("/login");
                closeMobileMenu();
              }}
            >
              Signin
            </motion.span>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default LandingHeader;
