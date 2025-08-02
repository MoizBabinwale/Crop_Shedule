import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <Link to="/" style={{ marginRight: "15px" }}>
        Home
      </Link>
      <Link to="/products" style={{ marginRight: "15px" }}>
        Product List
      </Link>
      <Link to="/quotation/master" style={{ marginRight: "15px" }}>
        Generated Cotation
      </Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
};

export default Navbar;
