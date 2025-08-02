import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT" },
    { to: "/services", label: "SERVICE" },
    { to: "/products", label: "PRODUCT" },
    { to: "/quotation/master", label: "QUOTATION MASTER" },
    { to: "/contact", label: "CONTACT" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        background: "#3BB149",
        padding: "0",
      }}
      className="print:hidden"
    >
      {navLinks.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            style={{
              padding: "15px 25px",
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "none",
              textTransform: "uppercase",
              backgroundColor: isActive ? "#FFA534" : "transparent",
              transition: "background-color 0.3s",
            }}
            className="print:hidden"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FFA534";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.target.style.backgroundColor = "transparent";
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
