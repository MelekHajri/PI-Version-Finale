import React from "react";
import "./home.css"; // Ensure the file name matches the casing exactly
import { Link, useNavigate } from "react-router-dom";
function Homepage() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleGetStarted = () => {
    navigate("/sign-in ");
     // Navigate to the login route
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo">
          <img
            src="https://via.placeholder.com/150" // Replace with SoMezzo logo URL
            alt="SoMezzo Logo"
          />
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#tools">Tools</a></li>
            <li><a href="#profile">Profile</a></li>
          </ul>
        </nav>
      </header>

      <main className="homepage-main">
        <section className="hero">
          <h1>Welcome to SoMezzo Employee Portal</h1>
          <p>Streamline your tasks and enhance productivity with our centralized tools and dashboards.</p>
          <Link to="/sign-in">
            <button className="cta-button">Log in</button>
          </Link> 
          <Link to="/Registration">
            <button className="cta-button">Register</button>
          </Link>
        </section>

        <section id="dashboard" className="dashboard-section">
          <h2>Dashboard Overview</h2>
          <p>Access real-time performance metrics, task updates, and operational reports in one place.</p>
        </section>

        <section id="tools" className="tools-section">
          <h2>Employee Tools</h2>
          <ul>
            <li>Task Management</li>
            <li>Shift Scheduling</li>
            <li>Performance Analytics</li>
            <li>Communication Hub</li>
          </ul>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>© 2024 SoMezzo Employee Portal. All Rights Reserved.</p>
        <p>
          Follow company updates on:
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a> |
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"> LinkedIn</a>
        </p>
      </footer>
    </div>
  );
}

export default Homepage;