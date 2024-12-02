import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const ComptenotValide = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Function to perform logout
  const performLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    alert("Session expired. Redirecting to the login page.");
    navigate("/sign-in");
  };

  // Handle token expiration
  const handleTokenExpiry = () => {
    const accessToken =
      localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const expiryTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (expiryTime > currentTime) {
          setTimeout(() => performLogout(), expiryTime - currentTime);
        } else {
          performLogout();
        }
      } catch (error) {
        console.error("Error decoding the token:", error);
        performLogout();
      }
    } else {
      performLogout();
    }
  };

  // Handle inactivity
  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setSessionExpired(true);
        performLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
    };
  }, []);

  // Load users from the API
  useEffect(() => {
    if (!sessionExpired) {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      if (!token) {
        alert("Invalid session. Please log in again.");
        navigate("/sign-in");
        return;
      }

      axios
        .get("http://localhost:8084/Users/activeusers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error loading users:", error));
    }
  }, [sessionExpired, navigate]);

  const changeUserStatus = (id) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  
    if (!token) {
      alert("You must be logged in to change the user's status.");
      navigate("/sign-in");
      return;
    }
  
    if (window.confirm("Are you sure you want to change this user's status?")) {
      axios
        .put(`http://localhost:8084/Users/changerDesactivateUser/${id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("User status has been successfully changed.");
          // Optionally, update the local state
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === id ? { ...user, isActive: false } : user // Assuming you want to deactivate
            )
          );
        })
        .catch((error) => {
          console.error("Error changing the user's status:", error);
          alert("Failed to change the user's status. Please try again later.");
        });
    }
  };

  // Render the user table
  return (
    <div>
      <h2>User List</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => changeUserStatus(user.id)}>
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComptenotValide;
