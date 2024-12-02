import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from 'react-chartjs-2';
import { jwtDecode } from "jwt-decode";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './dashboard.css';  // Make sure the styles are loaded
import Logout from "../logout";
// Register chart elements
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 1 minute

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
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

  // -------------------- React Hooks -------------------- //
  
  // Monitor token expiry on component mount
  useEffect(() => {
    handleTokenExpiry();
  }, []); // Run once when the component is mounted

  // Handle session timeout due to inactivity
  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setSessionExpired(true);
        onLogout();
        alert("Your session has expired due to inactivity. Redirecting to login...");
        navigate("/sign-in");
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [onLogout, navigate]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
      } else {
        navigate("/sign-in");
      }
    };
    fetchUser();
  }, [navigate]);

  // ---------------------------------------------------- //

  // Redirect if session has expired
  if (sessionExpired) return null;

  if (loading) {
    return <div>Loading...</div>;
  }

  // Data for the first chart: Payments Over Time
  const paymentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Payments Over Time',
        data: [800, 980, 1200, 1580, 1850, 2000],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the payment chart
  const paymentOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Payments Overview',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Payments (dt)',
        },
        beginAtZero: true,
      },
    },
  };

  // Data for the second chart: Number of Phone Calls per Month
  const phoneCallsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Phone Calls Made',
        data: [200, 400, 510, 620, 730, 800],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the phone calls chart
  const phoneCallsOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Phone Calls Made per Month',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Phone Calls',
        },
        beginAtZero: true,
      },
    },
  };

  // Define navigation links based on the user's role
  let navigationLinks;
  const id = user.id;
  if (user.role === "MANAGER") {
    navigationLinks = (
      
      <>
        <a href="#">Dashboard</a>
        <a href="/add">Add an Account</a>
        <a href={`/edit-user/${id}`}>Edit My Account</a>
        <a href="/bloque">Activated Accounts</a>
        <a href="/users">Account List</a>
        <a href="/Tovalidate">Deactivated Accounts</a>


      </>
    );
  } else if (user.role === "EMPLOYEE") {
    navigationLinks = (
      <>
        <a href="#">Dashboard</a>
        <a href={`/edit-user/${id}`}>Edit My Account</a>
        <a href="/call_list">CALLS</a>

      </>
    );
  } else if (user.role === "CONTROLLER") {
    navigationLinks = (
      <>
        <a href="#">Dashboard</a>
        <a href="/add">Add an Account</a>
        <a href={`/edit-user/${id}`}>Edit My Account</a>
        <a href="/users">Accounts List</a>
      </>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-logo">
          <div className="logo">
            <span className="logo-icon">
              <img src="https://www.entreprises-magazine.com/wp-content/uploads/2023/01/texte-logo11853.png" width="50px" alt="Logo"/>
            </span>
            <h1 className="logo-title">
              <span>SoMezzo</span>
            </h1>
          </div>
        </div>
        <div className="app-header-navigation">
          <div className="tabs">
            {navigationLinks}
          </div>
        </div>
        <div className="app-header-actions">
          <div className="app-header-actions-buttons">
            <button className="icon-button large"><i className="ph-magnifying-glass"></i></button>
            <button className="icon-button large"><i className="ph-bell"></i></button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <div className="app-body-navigation">
          <nav className="navigation">
            {navigationLinks}
          </nav>
          <footer className="footer">
            <h1>SoMezzo<small>©</small></h1>
            <div>SoMezzo © All Rights Reserved 2024</div>
          </footer>
        </div>

        <div className="app-body-main-content">
          <section className="service-section">
            <h2>{user.first_name} {user.last_name} Dashboard</h2>
            <div className="tiles">
              <article className="tile">
                <div className="tile-header">
                  <i className="ph-lightning-light"></i>
                  <h3>
                    <span>Performance Objectives</span>
                    <span>Revenue Target Achievement:</span>
                  </h3>
                </div>
                <a href="#">View Details</a>
              </article>

              <article className="tile">
                <div className="tile-header">
                  <i className="ph-fire-simple-light"></i>
                  <h3>
                    <span>Monthly Sales</span>
                    <span>Target Reached: 75%</span>
                  </h3>
                </div>
                <a href="#">View Details</a>
              </article>

              <article className="tile">
                <div className="tile-header">
                  <i className="ph-file-light"></i>
                  <h3>
                    <span>Team Performance</span>
                    <span>Team A: 85% of the target</span>
                  </h3>
                </div>
                <a href="#">View Details</a>
              </article>
            </div>
          </section>

          <section className="service-section">
            <h2>Performance Dashboard</h2>
            <div className="tiles">
              <article className="tile">
                <div className="tile-header">
                  <i className="ph-folder-light"></i>
                  <h3>
                    <span>Project Tracking</span>
                    <span>Ongoing Projects: 5</span>
                  </h3>
                </div>
                <a href="#">View Details</a>
              </article>

              <article className="tile">
                <div className="tile-header">
                  <i className="ph-users-light"></i>
                  <h3>
                    <span>Team Objectives</span>
                    <span>Completion Rate: 80%</span>
                  </h3>
                </div>
                <a href="#">Analyze Progress</a>
              </article>

              <article className="tile">
                <div className="tile-header">
                  <i className="ph-bell-light"></i>
                  <h3>
                    <span>Notifications</span>
                    <span>Upcoming Meetings: 2</span>
                  </h3>
                </div>
                <a href="#">View Notifications</a>
              </article>
            </div>
          </section>

          {/* Only display charts for EMPLOYEE */}
          {user.role === 'EMPLOYEE' && (
            <>
              <section className="charts-section">
                <h3>{user.first_name} {user.last_name} Performance</h3>
                <div className="chart-container">
                  <h4>Payments Over Time</h4>
                  <Bar data={paymentData} options={paymentOptions} />
                </div>

                <div className="chart-container">
                  <h4>Phone Calls Made per Month</h4>
                  <Bar data={phoneCallsData} options={phoneCallsOptions} />
                </div>
              </section>
            </>
          )}
        </div>

        {/* User Information Panel */}
        <div className="user-info-panel">
          <h3>{user.first_name} {user.last_name}</h3>
          <div className="user-info-item">
            <p><strong>Email:</strong> <span>{user.email}</span></p>
          </div>
          <div className="user-info-item">
            <p><strong>Birth Date:</strong> <span>{user.birthDate ? user.birthDate : "Not provided"}</span></p>
          </div>
          <div className="user-info-item">
            <p><strong>Role:</strong> <span>{user.role}</span></p>
          </div>
          <div style={{ marginTop: "20px" }}>
        <Logout />
      </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
