// QuestionPage.js
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { GoogleGenerativeAI } from '@google/generative-ai';
import Feedback from './Feedback'; // Import the Feedback component
import './QuestionPage.css';

const QuestionPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState([]);

    const previousQuestionsRef = useRef(new Set()); // Use a ref to track previously generated questions

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const jobRole = searchParams.get('jobRole');
    const experience = searchParams.get('experience');
    const difficulty = searchParams.get('difficulty');
    const numberOfQuestions = parseInt(searchParams.get('numberOfQuestions'), 10);


    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true); // Set loading to true when fetching starts
            const maxRetries = 200;
            const baseDelay = 200;
    
            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
                    const prompt = `Generate exactly ${numberOfQuestions} multiple-choice technical interview questions for a ${jobRole} position. Each question must be unique, non-repetitive, and formatted as follows:
                    1. Question text
                    A. Option A
                    B. Option B
                    C. Option C
                    D. Option D
                    (Correct Answer: A)
                    
                    Do not repeat previous questions or provide coding-related questions. Ensure that each question is distinct from the others, and check for repetition before generating.don't genarate the ** before or after the questions.`;
    
                    const result = await model.generateContent(prompt);
    
                    if (!result || !result.response || typeof result.response.text !== 'function') {
                        throw new Error('Invalid API response');
                    }
    
                    const responseText = await result.response.text();
                    if (!responseText) {
                        throw new Error('Empty API response');
                    }
    
                    // Log the raw response to help with debugging
                    console.log('Raw API Response:', responseText);
    
                    // Split the response into individual questions
                    const questionsArray = responseText.trim().split('\n\n').map(q => {
                        const lines = q.split('\n');
                        const questionText = lines[0]?.trim();
                        const options = lines.slice(1, 5)?.map(option => option.trim());
                        const correctAnswer = lines[5]?.split(': ')[1]?.trim();
    
                        // Validate the format
                        if (!questionText || options.length !== 4 || !correctAnswer) {
                            console.error('Malformed question:', q); // Log the specific malformed question
                            return null; // Return null for malformed questions
                        }
    
                        return { questionText, options, correctAnswer };
                    });
    
                    // Filter out null (malformed) questions and previously generated questions
                    const validQuestions = questionsArray.filter(q => q !== null && !previousQuestionsRef.current.has(q.questionText));
    
                    // Check if there are enough valid questions
                    if (validQuestions.length === numberOfQuestions) {
                        // Update the previous questions set
                        validQuestions.forEach(q => previousQuestionsRef.current.add(q.questionText));
                        setQuestions(validQuestions);
                        setLoading(false);
                        return; // Break out of the retry loop as we now have valid questions
                    }
    
                    console.warn(`Valid questions count (${validQuestions.length}) is less than requested (${numberOfQuestions}). Retrying...`);
                } catch (error) {
                    console.error('Error fetching questions:', error);
                    if (error.message.includes('429')) {
                        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, retries)));
                    } else {
                        setError(`Error fetching questions: ${error.message}`);
                        setLoading(false);
                        return;
                    }
                }
            }
    
            setError('Too many requests. Please try again later.');
            setLoading(false);
        };
    
        fetchQuestions();
    }, [jobRole, experience, difficulty, numberOfQuestions]);
    
    
    
    
    const handleAnswerChange = (e) => {
        setAnswers({ ...answers, [currentQuestionIndex]: e.target.value });
    };
    
    const handleNext = () => {
        if (!answers[currentQuestionIndex]) {
            setError('Please select an answer before proceeding.');
            return;
        }
        setError('');
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };
    
    // New function to handle "Forward" (previous) button click
    const handleForward = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);

        try {
            let totalCorrectAnswers = 0;
            const feedbackArray = await Promise.all(questions.map(async (question, index) => {
                const selectedAnswer = answers[index];
                const correctAnswer = question.correctAnswer;

                const normalizeAnswer = (answer) => answer.replace(/[^\w]/g, '').toUpperCase();
                const normalizedSelectedAnswer = normalizeAnswer(selectedAnswer);
                const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);

                const isCorrect = normalizedSelectedAnswer === normalizedCorrectAnswer;

                // Prepare feedback messages
                const selectedAnswerText = selectedAnswer
                    ? question.options[selectedAnswer.charCodeAt(0) - 65]
                    : 'No answer selected';

                const correctAnswerText = `${correctAnswer} ${question.options[correctAnswer.charCodeAt(0) - 65]}`;
                const feedbackMessage = await fetchFeedback(question, selectedAnswerText, isCorrect);
                
                if (isCorrect) {
                    totalCorrectAnswers += 1;
                }

                return {
                    questionText: question.questionText,
                    selectedAnswer: selectedAnswerText,
                    correctAnswer: correctAnswerText,
                    explanation: feedbackMessage[0] || 'No explanation available.',
                    Improve: feedbackMessage.slice(1).join(' ') || 'Correct Answer You done Well.Focus Core topics for better understanding :)',
                    isCorrect,
                };
            }));

            const totalScore = (totalCorrectAnswers / questions.length) * 100;
            setScore(totalScore.toFixed(2));
            setFeedback(feedbackArray);
        } catch (error) {
            console.error('Error generating feedback:', error);
            setError('Error generating feedback. Please try again later.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Check if we have feedback to display
    if (score !== null) {
        return <Feedback score={score} feedback={feedback} />;
    }

    // Loading state check for question fetching
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading questions...</p>
            </div>
        );
    }

    // Loading state check for feedback submission
    if (submitLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Submitting your answers and generating feedback...</p>
            </div>
        );
    }

    return (
        <>
      
        <div className="question-page">
            
        <h2>
    Test Your Knowledge of : <span style={{  fontWeight: 'bold' }}>{jobRole.charAt(0).toUpperCase() + jobRole.slice(1)}</span>
     </h2>

            <hr />
            <div className="question-container">
                <div className="question-wrapper">
                    <div className="question-text">{questions[currentQuestionIndex]?.questionText}</div>
                    <div className="options-container">
                        {questions[currentQuestionIndex]?.options.map((option, index) => (
                            <div
                                key={index}
                                className={`option-button ${answers[currentQuestionIndex] === String.fromCharCode(65 + index) ? 'selected' : ''}`}
                                onClick={() => handleAnswerChange({ target: { value: String.fromCharCode(65 + index) } })}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                    <div className="button-group">
                        <button className="forward-btn" onClick={handleForward} disabled={currentQuestionIndex === 0}>Forward</button>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        ) : (
                            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                        )}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
        </>
    );
};

// Function to fetch feedback
const fetchFeedback = async (question, selectedAnswer, isCorrect) => {
    try {
        const prompt = `Provide feedback for the following question and answer:
        Question: ${question.questionText}
        Your Answer: ${selectedAnswer}
        Correct Answer: ${question.correctAnswer}
        ${isCorrect
            ? `The candidate's answer is correct. Provide detailed improvement tip for the candidate. 
            The feedback should follow these guidelines:
            
            - Use simple and Short (3 lines), clear language, avoiding jargon or overly complex terminology.
            - Keep the tone professional and approachable without special characters .remove ** before and after every line or word.
            - Focus on one specific area for improvement.
            - Avoid unnecessary symbols or punctuation, ensuring a clean format.` 
            : `The candidate's answer is incorrect. Provide detailed explanation on why the selected answer is wrong, and mention two specific areas where the candidate should improve. 
                The feedback should follow these guidelines:
                - Use simple, avoid headings and sideheadings and clear language, avoiding jargon or overly complex terminology.
            - Keep the tone professional and approachable without special characters.
            - Focus on one specific area for improvement.
            - Avoid unnecessary symbols or punctuation, ensuring a clean format.`}`; 
        
        const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        if (!result || !result.response || typeof result.response.text !== 'function') {
            throw new Error('Invalid API response for feedback');
        }

        const feedbackText = await result.response.text();
        return feedbackText.split('\n').filter(line => line.trim() !== ''); // Return non-empty lines
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return ['No feedback available.']; // Fallback message
    }
};

export default QuestionPage;