import { Link, useNavigate } from "react-router-dom";


const Welcome = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Welcome to URL Shortener</h1>
      <p>Create short links easily</p>
  
    </div>
  );
};

export default Welcome;
