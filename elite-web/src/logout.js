import React from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear tokens and remember me preference
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      // Navigate to the login page
      navigate("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally handle errors (e.g., show a message to the user)
      navigate("/sign-in"); // Redirect to login regardless
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
      Logout
    </button>
  );
};

export default Logout;
