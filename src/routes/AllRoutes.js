import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import About from "../pages/About.js";
import Contact from "../pages/Contact.js";
import Form1 from "../components/Form1.js";
import ProductList from "../pages/ProductList.js";
import QuatationGen from "../pages/QuatationGen.js";
import QuotationMaster from "../pages/QuotationMaster.jsx";
import QuotationBill from "../pages/QuotationBill.js";
import ScheduleBill from "../pages/ScheduleBill.js";
import ScheduleBillView from "../components/ScheduleBilView.js";
import ScheduleView from "../pages/ScheduleView.js";
import CropList from "../pages/CropList.js";
import BillsPage from "../pages/BillsPage.js";
import GalleryPage from "../pages/GalleryPage.js";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/form1" element={<Form1 />} />
      {/* <Route path="/products" element={<ProductList />} /> */}
      <Route path="/schedule/:cropId" element={<ScheduleView />} />
      <Route path="/schedule/quotation/:quatationId" element={<QuatationGen />} />

      <Route path="/croplists" element={<CropList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/quotation/master" element={<QuotationMaster />} />
      <Route path="/bills" element={<BillsPage />} />

      {/* <Route path="/quotation/master" element={<QuotationMaster />} /> */}
      <Route path="/bill/:billId" element={<QuotationBill />} />
      <Route path="/scheduleBill/:scheduleId" element={<ScheduleBill />} />
      <Route path="/scheduleBill/view/:scheduleId" element={<ScheduleBillView />} />
      <Route path="/quotationBill/view/:quotationId" element={<QuotationBill />} />
      <Route path="/gallery" element={<GalleryPage />} />
      {/* <Route path="/quotation/edit/:id" element={<EditQuotationPage />} />
      <Route path="/quotation/add" element={<AddQuotationPage />} />
      <Route path="/schedule/quatation/:quatationId" element={<CoatationPage />} /> */}
    </Routes>
  );
};

export default AllRoutes;
