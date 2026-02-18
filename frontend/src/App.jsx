import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Welcome from "./components/Welcome";

const App = ({ children }) => {
  return (
    <>
  
      <Welcome />

      {children}

  
    </>
  );
};

export default App;
