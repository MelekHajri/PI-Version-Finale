import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthDate: "",
    role: "", // Assuming role is part of the data, but not editable
    isActive: "", // Assuming isActive is part of the data, but not editable
    password: "", // Assuming password is part of the data, but not editable
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch user data on component mount or when ID changes
  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const response = await axios.get(`http://localhost:8084/Users/allid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          birthDate: response.data.birthDate ? response.data.birthDate.split("T")[0] : "",
          role: response.data.role || "", // Keep role as-is
          isActive: response.data.isActive || "", // Keep isActive as-is
          password: response.data.password || "", // Keep password as-is
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors({ fetch: "Failed to fetch user data. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    // Prepare the data to send by excluding unchanged fields
    const updatedData = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "") {
        updatedData[key] = formData[key];
      }
    });

    // Optionally exclude specific fields (e.g., 'role', 'isActive', 'password') if you want to make sure they are not included in the PUT request
    const { roles, isActive, password, ...fieldsToUpdate } = updatedData;

    try {
      setLoading(true);
      await axios.put(`http://localhost:8084/Users/update/${id}`, fieldsToUpdate, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({ submit: "Failed to update the user. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      {errors.fetch && <p className="error">{errors.fetch}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Birth Date:
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </label>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </button>
        {errors.submit && <p className="error">{errors.submit}</p>}
      </form>
    </div>
  );
};

export default EditUserForm;
