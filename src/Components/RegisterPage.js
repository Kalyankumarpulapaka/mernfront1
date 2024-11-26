import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mernback1.netlify.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
   <>
   <Navbar/>
   <div className="register-page-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>

      {/* Internal CSS */}
      <style jsx="true">{`
        /* General reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Body styling */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }

        /* Register page container */
        .register-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 20px;
        }

        /* Register title */
        .register-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        /* Form styling */
        .register-form {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 400px;
          padding: 20px;
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        /* Input field styling */
        .register-input {
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        /* Submit button styling */
        .register-button {
          padding: 12px;
          background-color: #5a67d8;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        /* Button hover effect */
        .register-button:hover {
          background-color: #434190;
        }
      `}</style>
    </div>
   </>
  );
}

export default RegisterPage;
