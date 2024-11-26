import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './Components/RegisterPage';
import Dashboard from './Components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Components/LoginPage';

import LandingPage from './Components/LandingPage'; // Assuming you have a LandingPage component
import QuestionPage from './Components/QuestionPage'; // Assuming you have a QuestionPage component
import Feedback from './Components/Feedback'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Quiz" element={<LandingPage/>} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/feedback" element={<Feedback />} /> 
      </Routes>
    </Router>
  );
}

export default App;
