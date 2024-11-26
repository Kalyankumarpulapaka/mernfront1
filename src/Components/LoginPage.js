import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Ensure this imports the provided CSS
import Navbar from './Navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mernback1.netlify.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const goToRegisterPage = () => {
    navigate('/register');
  };

  return (
   <>
   <Navbar/>
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleLogin}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="email"
                className="login__input"
                placeholder="User name / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                required
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                required
              />
            </div>
            <button type="submit" className="button login__submit">
              <span className="button__text">Log In Now</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>

            {/* Sign Up Button */}
            <button
              type="button"
              className="button signup__submit"
              onClick={goToRegisterPage} // Navigate to Sign Up page
            >
              <span className="button__text">Sign Up</span>
              <i className="button__icon fas fa-user-plus"></i>
            </button>
          </form>

         
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
   </>
  );
}

export default LoginPage;
