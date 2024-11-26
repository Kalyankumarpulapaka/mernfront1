import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Ensure this includes styles for .error-message


const LandingPage = () => {
  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    if (savedName) setName(savedName);
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
    localStorage.setItem("name", e.target.value);
  };

  const validateInput = () => {
    const nameRegex = /^[A-Za-z\s]+$/; // Allow letters and spaces for name
    const jobRoleRegex = /^[A-Za-z\s]+$/; // Allow letters and spaces for job role
    const skillsRegex = /^[A-Za-z\s,]*$/; // Allow letters, spaces, and commas for skills

    if (!nameRegex.test(name)) {
      setError("Please enter a valid name using only letters and spaces.");
      return false;
    }

    if (!jobRoleRegex.test(jobRole)) {
      setError("Please enter a valid job role using only letters and spaces.");
      return false;
    }

    if (!skillsRegex.test(skills)) {
      setError("Please enter valid technical skills using only letters, spaces, and commas.");
      return false;
    }

    if (numberOfQuestions < 1) {
      setError("Please enter a valid number of questions.");
      return false;
    }

    if (isNaN(experience) || experience < 0) {
      setError("Please enter valid years of experience.");
      return false;
    }

    setError(""); // Clear any previous errors
    return true; // All validations passed
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return; // Stop the submission if validations fail
    }

    navigate(
      `/questions?jobRole=${jobRole}&experience=${experience}&difficulty=${difficulty}&numberOfQuestions=${numberOfQuestions}`
    );

    // Reset the form
    setName("");
    setJobRole("");
    setSkills("");
    setExperience("");
    setDifficulty("easy");
    setNumberOfQuestions(5);
  };

  return (
    <div>
      
       
      
      
      <div className="sec1">
      <h2 class="gradient-border">Explore the New AI Quiz Platform</h2>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-7 own"></div>
          <div className="col-12 col-md-5 own1">
            <div className="landing-form-container">
              <form onSubmit={handleSubmit} className="landing-form">
                <div className="brand">
                <h2 class="gradient-borders">Let's Unlock Your Potential</h2>

                {/* <h5>Let's Unlock Your Potential </h5> */}
                  {/* <p className="line"></p> */}
                </div>
                <input 
                  type="text" 
                  placeholder="Enter Your Name :" 
                  value={name} 
                  onChange={handleNameChange} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Enter Your JobRole :" 
                  value={jobRole} 
                  onChange={(e) => setJobRole(e.target.value)} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Technical Skills:(comma separated)" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                />
                <input 
                  type="number" 
                  placeholder="Years of Experience" 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)} 
                  required 
                />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="tough">Tough</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Enter number of questions (min: 1)" 
                  value={numberOfQuestions} 
                  onChange={(e) => setNumberOfQuestions(e.target.value)} 
                  min="1" 
                  required 
                />
                {error && <p className="error-message">{error}</p>} {/* Error message display */}
                <button type="submit" className="start-btn">Start Quiz</button>
              </form>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
