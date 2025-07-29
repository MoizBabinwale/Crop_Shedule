import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <AllRoutes />
    </Router>
  );
}

export default App;
