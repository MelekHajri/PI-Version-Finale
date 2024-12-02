import React from "react"; // Importing React library for creating the component
import './compteValide.css'; // Importing the associated CSS file for styling
import logo from '../assets/logo1.png'; // Importing the logo image

// Functional component for displaying validated accounts
const CompteValide = () => {
  return (
    <div className="app">
      {/* Header section of the application */}
      <header className="app-header">
        {/* Logo section */}
        <div className="app-header-logo">
          <div className="logo">
            <span className="logo-icon">
              <img src={logo} alt="Logo" /> {/* Display the logo */}
            </span>
            <h1 className="logo-title">SoMezzo</h1> {/* Application name */}
          </div>
        </div>

        {/* Navigation links in the header */}
        <div className="app-header-navigation">
          <div className="tabs">
            <a href="#">Overview</a>
            <a href="#">Payments</a>
            <a href="#">Cards</a>
            <a href="#" className="active">Account</a> {/* Active link for Account */}
            <a href="#">System</a>
            <a href="#">Business</a>
          </div>
        </div>

        {/* User profile section in the header */}
        <div className="app-header-actions">
          <button className="user-profile">
            <span>ghada chelli</span> {/* User name */}
            <img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" alt="User Avatar" /> {/* User avatar */}
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar navigation links */}
        <aside className="app-body-navigation">
          <nav className="navigation">
            <a href="#">Dashboard</a>
            <a href="#">Scheduled</a>
            <a href="#">Transfers</a>
            <a href="#">Templates</a>
            <a href="#">SWIFT</a>
            <a href="#">Exchange</a>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="app-body-main-content">
          {/* Section for displaying validated accounts */}
          <section className="compte-section">
            <h2>Comptes à Valider</h2> {/* Section title */}
            <table className="compte-table">
              <thead>
                {/* Table header with column titles */}
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Birth Date</th>
                  <th>Role</th>
                  <th>Password</th>
                  <th>Confirm Password</th>
                </tr>
              </thead>
              <tbody>
                {/* No data in the table currently */}
                {/* Dynamically render rows of data here */}
              </tbody>
            </table>
          </section>
        </main>

        {/* Sidebar for payments section */}
        <aside className="app-body-sidebar">
          <section className="payment-section">
            <h2>New Payment</h2> {/* Title for the payment section */}
            <div className="payment-section-header">
              <p>Choose a card to transfer money</p> {/* Instruction text */}
              <div>
                <button className="card-button mastercard">MasterCard</button> {/* Button for MasterCard */}
                <button className="card-button visa active">Visa</button> {/* Button for Visa, active by default */}
              </div>
            </div>
            <div className="payments">
              {/* Example payments rendered using a map function */}
              {[ 
                { type: "Internet", amount: "$ 2,110", cardColor: "green", expiry: "01/22", lastFour: "4012" },
                { type: "Universal", amount: "$ 5,621", cardColor: "olive", expiry: "12/23", lastFour: "2228" },
                { type: "Gold", amount: "$ 3,473", cardColor: "gray", expiry: "03/22", lastFour: "5214" }
              ].map((payment, index) => (
                <div className="payment" key={index}>
                  {/* Payment card displaying the details */}
                  <div className={`card ${payment.cardColor}`}>
                    <span>{payment.expiry}</span> {/* Card expiry date */}
                    <span>•••• {payment.lastFour}</span> {/* Last four digits of the card */}
                  </div>
                  <div className="payment-details">
                    <h3>{payment.type}</h3> {/* Payment type */}
                    <div>
                      <span>{payment.amount}</span> {/* Payment amount */}
                      <button className="icon-button">
                        <i className="ph-caret-right-bold"></i> {/* Icon for navigation */}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
};

export default CompteValide; // Export the component for use in other parts of the application
