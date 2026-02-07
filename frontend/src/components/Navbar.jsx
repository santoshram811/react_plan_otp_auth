import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-gray-200 text-black px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <b>
          <div className="text-xl font-bold">
            <NavLink to="/">Url</NavLink>
          </div>
        </b>

        <button
          onClick={() => navigate("/pricing")}
          className="px-4 py-2 bg-emerald-500 text-black rounded-lg"
        >
          Pricing
        </button>

        <div className="hidden md:flex space-x-6">
          <NavLink to="/" className="hover:text-blue-400">
            Home
          </NavLink>
          <NavLink to="/about" className="hover:text-blue-400">
            About
          </NavLink>
          <NavLink to="/services" className="hover:text-blue-400">
            Services
          </NavLink>
          <NavLink to="/contact" className="hover:text-blue-400">
            Contact
          </NavLink>
          {!token ? (
            <div style={{ marginTop: "20px" }}>
              <Link to="/login">
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  Login
                </button>
              </Link>
            </div>
          ) : (
            <button
              className="   bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => navigate("/dashbaord")}
            >
              Profile
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 px-4">
          <NavLink to="#" className="block hover:text-blue-400">
            Home
          </NavLink>
          <NavLink to="#" className="block hover:text-blue-400">
            About
          </NavLink>
          <NavLink to="#" className="block hover:text-blue-400">
            Services
          </NavLink>
          <NavLink to="#" className="block hover:text-blue-400">
            Contact
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
