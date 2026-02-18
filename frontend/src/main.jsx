import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Login from "./components/login/Login";

import UrlShortener from "./components/UrlShortner";
import ProtectedRoute from "./routes/protectedRoute";

import "./index.css";
import PricingPage from "./components/pricing/PricingPage";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<App />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      <Route
        path="/dashbaord"
        element={
          <ProtectedRoute>
            <UrlShortener />
          </ProtectedRoute>
        }
      />
    </Routes>
    <Footer />
  </BrowserRouter>,
);
