import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // You can use any icon package you prefer
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT" },
    { to: "/products", label: "PRODUCT" },
    { to: "/quotation/master", label: "QUOTATION MASTER" },
    { to: "/contact", label: "CONTACT" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#3BB149] text-white print:hidden">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 px-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Parnanetra Logo" className="h-14 w-auto object-contain" />
            <div className="text-white">
              <Link to={"/"}>
                <div className="text-lg md:text-xl font-bold leading-tight">
                  <span className="text-red-600">Parnanetra</span> Ayurvedic Agro System
                </div>
                <div className="text-sm italic text-[#FFD580]">... since 1988</div>
              </Link>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`px-4 py-2 rounded text-sm font-semibold uppercase transition duration-300 ${isActive(link.to) ? "bg-[#FFA534]" : "hover:bg-[#FFA534]"}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none text-white">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#3BB149] px-4 py-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded text-sm font-semibold uppercase transition duration-300 ${isActive(link.to) ? "bg-[#FFA534]" : "hover:bg-[#FFA534]"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
