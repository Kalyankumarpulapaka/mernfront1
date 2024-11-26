// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import LandingPage from './LandingPage';

function Dashboard() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:5000/api/dashboard', {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="ai-dashboard">
      {/* Navbar Section */}
      <header className="ai-dashboard__navbar">
        <div className="ai-dashboard__brand">Ai Interviewer</div>

        <p onClick={handleLogout} className="ai-dashboard__logout">
          Logout
        </p>
      </header>

      {/* Main Content Section */}
      <div className="ai-dashboard__content">
        <LandingPage/>
        {/* Add more content here */}
      </div>
    </div>
  );
}

export default Dashboard;
