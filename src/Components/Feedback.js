import React from 'react';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';
import "./Feedback.css";

const Feedback = ({ feedback, score }) => {
    const downloadPDF = () => {
        const element = document.getElementById("feedback-content");
    
        // Clone the element to apply PDF-specific styles
        const clonedElement = element.cloneNode(true);
    
        // Apply PDF-specific styles (increase font size, line height)
        clonedElement.style.fontSize = '18px';  // Adjust this value to increase font size in the PDF
        clonedElement.style.lineHeight = '2';
        clonedElement.style.color="black";

          // Adjust line height for better readability
    
        // Add custom styles directly into the cloned element
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: Arial, sans-serif;
            }
            h4.question-title {
                font-size: 18px;  // Increase question title size
                margin-bottom: 10px;
                color: #333;
            }
            .feedback-card {
                border: 1px solid #ccc;
                margin-bottom: 20px;
                padding: 10px;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            .feedback-card strong {
                font-weight: bold;
            }
            .score-box h2 {
                color: red;
                font-size: 26px;  // Increase score font size
            }
            .download-btn {
                background-color: green;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                text-align: center;
                cursor: pointer;
            }
            .user-answer, .correct-answer, .improvement-area, .explanation-text {
                font-size: 18px;  // Increase the font size for answers and explanation
            }
        `;
        clonedElement.prepend(style);  // Add styles at the beginning of the cloned content
    
        // PDF generation options
        const options = {
            margin: 6,
            filename: 'scorecard.pdf',
            image: { type: 'jpeg', quality: 2.5 },
            html2canvas: { scale: 2 },  // Increase scale for better quality
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
    
        // Generate and download the PDF
        html2pdf().from(clonedElement).set(options).save();
    };
    

    return (
        <>
   
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: '100vh',
                paddingTop: '30px'
            }}>
                <div className="feedback-container" id="feedback-content">
                    <div className="score-box">
                        <h2>Your Score: {Math.round(score)}%</h2>
                    </div>
                    <div className="download-btn" onClick={downloadPDF}>
                        <span>Download your Scorecard</span>
                    </div>
                    <div className="section-divider" />
                    <div className="feedback-items">
                        {feedback.map((item, index) => {
                            const {
                                questionText,
                                selectedAnswer,
                                correctAnswer,
                                Improve,
                                explanation,
                                isCorrect,
                            } = item;

                            const answerStyle = {
                                backgroundColor: isCorrect ? 'green' : 'rgba(255, 0, 0, 0.625)',
                                color: 'white',
                                padding: '8px',
                                borderRadius: '4px',
                            };

                            return (
                                <div className="feedback-card" key={index}>
                                    <div className="card-body">
                                        <h4 className="question-title">{questionText}</h4>
                                        <hr />
                                        <p className="user-answer" style={answerStyle}>
                                            <strong>Your Answer:</strong> {selectedAnswer}
                                        </p>
                                        <p className="correct-answer" style={{
                                            backgroundColor: 'green',
                                            color: 'white',
                                            padding: '8px',
                                            borderRadius: '4px',
                                        }}>
                                            <strong>Correct Answer:</strong> {correctAnswer}
                                        </p>
                                        <p className="improvement-area">
                                            <strong>Areas to Improve:</strong> {Improve}
                                        </p>
                                        <p className="explanation-text">
                                            <strong>Explanation:</strong> {explanation}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feedback;
