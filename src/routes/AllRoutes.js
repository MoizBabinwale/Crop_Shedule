import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Contact from "../pages/Contact.js";
import Form1 from "../components/Form1.js";
import ProductList from "../pages/ProductList.js";
import CoatationPage from "../pages/CoatationPage.js";
import QuatationGen from "../pages/QuatationGen.js";
import QuotationMaster from "../pages/QuotationMaster.jsx";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/form1" element={<Form1 />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/schedule/:cropId" element={<CoatationPage />} />
      <Route path="/schedule/quotation/:quatationId" element={<QuatationGen />} />

      <Route path="/quotation/master" element={<QuotationMaster />} />
      {/* <Route path="/quotation/edit/:id" element={<EditQuotationPage />} />
      <Route path="/quotation/add" element={<AddQuotationPage />} />
      <Route path="/schedule/quatation/:quatationId" element={<CoatationPage />} /> */}
    </Routes>
  );
};

export default AllRoutes;
