import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const UserTable = ({ onLogout }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Handle token expiry and automatic logout
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
        console.error("Error decoding token:", error);
        performLogout();
      }
    } else {
      performLogout();
    }
  };

  const performLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    alert("Session expired. Redirecting to login.");
    navigate("/sign-in");
  };

  // Inactivity logout logic
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

  //---------------- Load Users -----------------------//
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

  //---------------- Delete User -----------------------//
  const deleteUser = (id) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (!token) {
      alert("You need to be logged in to delete a user.");
      navigate("/sign-in");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:8084/Users/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("Failed to delete the user. Please try again later.");
        });
    }
  };

  //---------------- Redirect to Edit ----------------//
  const handleEditClick = (id) => {
    navigate(`/edit-user/${id}`);
  };

  //---------------- Render -----------------------//
  if (sessionExpired) {
    return null; // Render nothing if the session is expired
  }

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
                  <button onClick={() => handleEditClick(user.id)}>Edit</button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
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

export default UserTable;
