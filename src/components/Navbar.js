import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <Link to="/" style={{ marginRight: "15px" }}>
        Home
      </Link>
      <Link to="/about" style={{ marginRight: "15px" }}>
        About
      </Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
};

export default Navbar;
