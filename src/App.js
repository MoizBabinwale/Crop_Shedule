import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <Router>
      <Navbar />
      <AllRoutes />
      <ToastContainer />
    </Router>
  );
}

export default App;
