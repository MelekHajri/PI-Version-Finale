import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8084/calls/add"; // API endpoint for adding calls

const AddCall = () => {
  const navigate = useNavigate();
  const [callData, setCallData] = useState({
    date: "",
    duration: "",
    description: "",
  });
  const [error, setError] = useState(null);

  // Retrieve the user data and token from localStorage or sessionStorage
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const isAuthenticated = Boolean(user);
  const role = user ? user.role : null;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCallData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthenticated && role === "EMPLOYEE") {
      try {
        const response = await axios.post(API_URL, callData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Call added successfully:", response.data);
        navigate("/call_list"); // Navigate to call list after successful addition
      } catch (err) {
        setError("Failed to add call. Please try again.");
      }
    } else {
      navigate("/sign-in"); // Redirect to sign-in if not authenticated
    }
  };

  // Render the form
  return (
    <div className="add-call-container">
      <h2>Add New Call</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="add-call-form">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={callData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={callData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={callData.duration}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Call
        </button>
      </form>
    </div>
  );
};

export default AddCall;
