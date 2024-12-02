import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Ensure jwt-decode is imported for decoding tokens

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

function AddForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthDate: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Perform logout and redirect
  const performLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/sign-in");
  };

  // Handle token expiration logic
  const handleTokenExpiry = () => {
    const accessToken =
      localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (expiryTime > currentTime) {
          setTimeout(performLogout, expiryTime - currentTime);
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

  // Monitor token expiry on component mount
  useEffect(() => {
    handleTokenExpiry();
  }, []);

  // Handle session timeout due to inactivity
  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setSessionExpired(true);
        performLogout();
        alert("Your session has expired due to inactivity. Redirecting to login...");
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
    };
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = () => {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user")
      );
      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
      } else {
        navigate("/sign-in");
      }
    };
    fetchUser();
  }, [navigate]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First Name required";
    if (!formData.last_name) newErrors.last_name = "Last Name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.birthDate) newErrors.birthDate = "Birth Date required";
    if (!formData.role) newErrors.role = "Position required";
    if (!formData.password) newErrors.password = "Password required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const token =
        localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      if (!token) {
        alert("You need to be logged in to add a user.");
        navigate("/sign-in");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8084/Users/addWithApproval",
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            birthDate: formData.birthDate,
            role: formData.role,
            password: formData.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("User added successfully!");
          navigate("/users");
        }
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add the user. Please try again.");
      }
    }
  };

  if (sessionExpired) return null;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="registration-form">
      <h2 className="form-title">Add User</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields */}
        <div>
          <label>First Name :</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>

        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
          {errors.birthDate && <p className="error">{errors.birthDate}</p>}
        </div>

        <div>
          <label>Position:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Position</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="CONTROLLER">Controller</option>
          </select>
          {errors.role && <p className="error">{errors.role}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddForm;
