import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./editcall.css"
const API_URL = "http://localhost:8084/calls"; // Base API endpoint for calls

const EditCall = () => {
  const { id } = useParams(); // Retrieve call ID from the URL
  const navigate = useNavigate();
  const [callData, setCallData] = useState({
    date: "",
    duration: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve the user data and token from localStorage or sessionStorage
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const isAuthenticated = Boolean(user);
  const role = user ? user.role : null;

  useEffect(() => {
    if (isAuthenticated && role === "EMPLOYEE") {
      const fetchCall = async () => {
        try {
          const response = await axios.get(`${API_URL}/getbyid/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCallData(response.data);
        } catch (err) {
          setError("Failed to fetch call details.");
        } finally {
          setLoading(false);
        }
      };

      fetchCall();
    } else {
      navigate("/sign-in"); // Redirect to sign-in if not authenticated
    }
  }, [id, isAuthenticated, role, token, navigate]);

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

    // Filter out the user data from the call data
    const { user, ...updatedCallData } = callData;

    // Log the data being sent to the backend (for debugging purposes)
    console.log("Filtered call data before submit:", updatedCallData);

    // Ensure all fields are filled
    if (!updatedCallData.description || !updatedCallData.date || !updatedCallData.duration) {
      setError("All fields are required.");
      return;
    }

    try {
      await axios.put(`${API_URL}/update/${id}`, updatedCallData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/call_list"); // Navigate to call list after successful update
    } catch (err) {
      console.error("Error response:", err.response ? err.response.data : err.message);
      setError("Failed to update call. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading call details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Render the form
  return (
    <div className="edit-call-container">
      <h2>Edit Call</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-call-form">
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
          Update Call
        </button>
      </form>
    </div>
  );
};

export default EditCall;
