import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Contact from "../pages/Contact.js";
import Form1 from "../components/Form1.js";
import ProductList from "../pages/ProductList.js";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/form1" element={<Form1 />} />
      <Route path="/products" element={<ProductList />} />
    </Routes>
  );
};

export default AllRoutes;
