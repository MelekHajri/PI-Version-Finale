import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct: named import

const DeleteCall = () => {
  const [calls, setCalls] = useState([]);
  const [error, setError] = useState("");

  const fetchCalls = async () => {
    try {
      const response = await axios.get("http://localhost:8084/calls/getcalls", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setCalls(response.data);
    } catch (err) {
      console.error("Failed to fetch calls:", err);
      setError("Failed to fetch calls.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete this call?")) {
      try {
        await axios.delete(`http://localhost:8084/calls/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setCalls((prevCalls) => prevCalls.filter((call) => call.id !== id));
        alert("Call deleted successfully!");
      } catch (err) {
        console.error("Failed to delete call:", err);
        setError("Failed to delete the call.");
      }
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  return (
    <div>
      <h1>Call List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {calls.map((call) => (
          <li key={call.id}>
            <p>
              <strong>Date:</strong> {new Date(call.date).toLocaleString()} <br />
              <strong>Description:</strong> {call.description}
            </p>
            <button onClick={() => handleDelete(call.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteCall;
