import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestionnaire } from '@/ai/flows/generate-questionnaire';
import { evaluateAnswer } from '@/ai/flows/evaluate-answer';

const UploadPage = () => {
  const navigate = useNavigate();
  const [pdfContent, setPdfContent] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [questions, setQuestions] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState([]); // Tracks evaluation state per question
  const [showResults, setShowResults] = useState(false); // To show results after "Calculate Score"
  const fileInputRef = useRef(null);

  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      minHeight: 'calc(100vh - 70px)', // Adjust based on NavBar height
      marginTop: '90px', // Space for NavBar
    },
    title: {
      fontSize: '2.5rem',
      color: '#6C21DC',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '700px',
      marginBottom: '25px',
      textAlign: 'center',
    },
    cardHeader: {
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#4A00E0', // A slightly different purple for card titles
      marginBottom: '5px',
    },
    cardDescription: {
      fontSize: '0.95rem',
      color: '#555',
      marginBottom: '15px',
    },
    inputGroup: {
      marginBottom: '20px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#444',
    },
    input: {
      width: 'calc(100% - 22px)',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
      boxSizing: 'border-box',
    },
    fileInput: {
      border: '2px dashed #6C21DC',
      padding: '30px',
      textAlign: 'center',
      cursor: 'pointer',
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: '#f9f6ff',
    },
    pdfIcon: {
      width: '50px',
      height: '50px',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: '#6C21DC',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      padding: '12px 25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.1s ease',
      margin: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      color: '#6C21DC',
      border: '2px solid #6C21DC',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    buttonHover: {
      backgroundColor: '#5a1ab8',
    },
    buttonActive: {
        transform: 'scale(0.98)',
    },
    loadingText: {
      marginTop: '15px',
      fontSize: '1rem',
      color: '#555',
    },
    questionCard: {
      marginTop: '20px',
      textAlign: 'left',
      padding: '20px',
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    radioItemContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #eee',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    radioInput: {
      marginRight: '10px',
      cursor: 'pointer',
    },
    radioLabel: {
      fontSize: '0.95rem',
      flex: 1,
      cursor: 'pointer',
    },
    resultSection: {
      marginTop: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    correctAnswer: {
      color: 'green',
      fontWeight: 'bold',
    },
    incorrectAnswer: {
      color: 'red',
      fontWeight: 'bold',
    },
    finalScoreCard: {
        marginTop: '30px',
        backgroundColor: '#e8f5e9', // Light green background for score
        borderLeft: '5px solid #4CAF50' // Green accent
    },
     errorMessage: {
      color: 'red',
      marginTop: '10px',
      fontSize: '0.9rem',
    },
  };

// Helper: Save quiz state to localStorage
const saveQuizState = (state) => {
  try {
    localStorage.setItem('uploadQuizState', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save quiz state', e);
  }
};

// Helper: Load quiz state from localStorage
const loadQuizState = () => {
  try {
    const state = localStorage.getItem('uploadQuizState');
    return state ? JSON.parse(state) : null;
  } catch (e) {
    console.error('Failed to load quiz state', e);
    return null;
  }
};

  // Restore quiz state on mount
  useEffect(() => {
    const saved = loadQuizState();
    if (saved) {
      setPdfContent(saved.pdfContent || null);
      setPdfFileName(saved.pdfFileName || '');
      setQuestions(saved.questions || null);
      setUserAnswers(saved.userAnswers || []);
      setIsPdfUploaded(saved.isPdfUploaded || false);
      setEvaluationResults(saved.evaluationResults || []);
      setQuestionCount(saved.questionCount || 5);
      setScore(saved.score || 0);
      setIsLoading(false);
      setIsEvaluating(saved.isEvaluating || []);
      setShowResults(saved.showResults || false);
    }
  }, []);

  // Save quiz state on every relevant change
  useEffect(() => {
    saveQuizState({
      pdfContent,
      pdfFileName,
      questions,
      userAnswers,
      isPdfUploaded,
      evaluationResults,
      questionCount,
      score,
      isLoading,
      isEvaluating,
      showResults,
    });
  }, [pdfContent, pdfFileName, questions, userAnswers, isPdfUploaded, evaluationResults, questionCount, score, isLoading, isEvaluating, showResults]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setPdfContent(null);
    setQuestions(null);
    setUserAnswers([]);
    setEvaluationResults([]);
    setShowResults(false);
    setScore(0);
    setIsPdfUploaded(false);
    setPdfFileName(file.name);


    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arr = new Uint8Array(e.target?.result).subarray(0, 4);
        let header = "";
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        if (header !== "25504446") { // %PDF signature
          alert("This does not appear to be a valid PDF file.");
          handleClear();
          return;
        }

        const textReader = new FileReader();
        textReader.onload = (ev) => {
          const content = ev.target?.result;
          if (!content || content.trim().length < 10) {
            console.warn("Extracted text content seems very short or empty.");
            // Potentially alert user if content is very short.
          }
          setPdfContent(content);
          setIsPdfUploaded(true);
          setIsLoading(false);
        }
        textReader.onerror = () => {
          alert('Error reading PDF file as text.');
          handleClear();
        }
        textReader.readAsText(file);

      } catch (error) {
        console.error("Error processing PDF:", error);
        alert('Error processing PDF file.');
        handleClear();
      }
    };
    reader.onerror = () => {
      alert('Error reading PDF file.');
      handleClear();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGenerateQuestions = async () => {
    if (!pdfContent) return;
    setIsLoading(true);
    setQuestions(null);
    setUserAnswers([]);
    setEvaluationResults([]);
    setShowResults(false);
    setScore(0);
    // Save pending state
    saveQuizState({
      pdfContent,
      pdfFileName,
      questions: null,
      userAnswers: [],
      isPdfUploaded,
      evaluationResults: [],
      questionCount,
      score: 0,
      isLoading: true,
      isEvaluating: [],
      showResults: false,
    });
    try {
      const questionnaire = await generateQuestionnaire({ pdfContent, questionCount: Number(questionCount) });
      if (!questionnaire || !questionnaire.questions || questionnaire.questions.length === 0) {
        throw new Error("No questions were generated. The PDF might be empty, contain only images, or the content might not be suitable for question generation.");
      }
      setQuestions(questionnaire.questions);
      setUserAnswers(Array(questionnaire.questions.length).fill(''));
      setEvaluationResults(Array(questionnaire.questions.length).fill(null));
      setIsEvaluating(Array(questionnaire.questions.length).fill(false));
      // Save finished state
      saveQuizState({
        pdfContent,
        pdfFileName,
        questions: questionnaire.questions,
        userAnswers: Array(questionnaire.questions.length).fill(''),
        isPdfUploaded,
        evaluationResults: Array(questionnaire.questions.length).fill(null),
        questionCount,
        score: 0,
        isLoading: false,
        isEvaluating: Array(questionnaire.questions.length).fill(false),
        showResults: false,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      const errorMessageText = error instanceof Error ? error.message : String(error);
      if (errorMessageText.includes("429") || errorMessageText.includes("Too Many Requests") || errorMessageText.includes("QuotaFailure")) {
           alert("API rate limit exceeded while generating questions. Please wait a moment and try again, or reduce the number of questions. Check your Google AI plan for details.");
       } else {
           alert(`Failed to generate questions: ${errorMessageText}. Please try again.`);
       }
      setQuestions(null);
      saveQuizState({
        pdfContent,
        pdfFileName,
        questions: null,
        userAnswers: [],
        isPdfUploaded,
        evaluationResults: [],
        questionCount,
        score: 0,
        isLoading: false,
        isEvaluating: [],
        showResults: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (index, answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleSubmitAnswerAndEvaluate = async (index) => {
    if (!pdfContent || !questions?.[index] || !userAnswers[index] || evaluationResults[index] !== null) {
      return; 
    }

    const newIsEvaluating = [...isEvaluating];
    newIsEvaluating[index] = true;
    setIsEvaluating(newIsEvaluating);

    try {
      const evaluation = await evaluateAnswer({
        question: questions[index].question,
        userAnswer: userAnswers[index],
        correctAnswer: questions[index].answer,
        pdfContent: pdfContent,
      });

      const newEvaluationResults = [...evaluationResults];
      newEvaluationResults[index] = evaluation; 
      setEvaluationResults(newEvaluationResults);

    } catch (error) {
      console.error(`Error evaluating answer for question ${index + 1}:`, error);
      const errorMessageText = error instanceof Error ? error.message : String(error);
       if (errorMessageText.includes("429") || errorMessageText.includes("Too Many Requests") || errorMessageText.includes("QuotaFailure")) {
           alert("API rate limit exceeded while evaluating answer. Please wait a moment and try again. Check your Google AI plan for details.");
       } else {
           alert(`Failed to evaluate answer: ${errorMessageText}. Please check the console for details.`);
       }
    } finally {
      const finalIsEvaluating = [...isEvaluating];
      finalIsEvaluating[index] = false;
      setIsEvaluating(finalIsEvaluating);
    }
  };

  const handleShowScore = async () => {
    setIsLoading(true); 
    let newScore = 0;
    const updatedEvaluationResults = [...evaluationResults];

    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] && updatedEvaluationResults[i] === null) { 
        try {
          const newIsEvaluating = [...isEvaluating];
          newIsEvaluating[i] = true;
          setIsEvaluating(newIsEvaluating);

          const evaluation = await evaluateAnswer({
            question: questions[i].question,
            userAnswer: userAnswers[i],
            correctAnswer: questions[i].answer,
            pdfContent: pdfContent,
          });
          updatedEvaluationResults[i] = evaluation;
          
          if (evaluation && evaluation.score === 1) {
            newScore++;
          }
          
          newIsEvaluating[i] = false;
          setIsEvaluating(newIsEvaluating);

        } catch (error) {
          console.error(`Error evaluating answer for question ${i + 1} during final calculation:`, error);
           const errorMessageText = error instanceof Error ? error.message : String(error);
           if (errorMessageText.includes("429") || errorMessageText.includes("Too Many Requests") || errorMessageText.includes("QuotaFailure")) {
               alert("API rate limit exceeded during final score calculation. Some answers might not be evaluated. Please wait and try again.");
           } else {
               alert(`Failed to evaluate some answers: ${errorMessageText}.`);
           }
           break; 
        }
      } else if (updatedEvaluationResults[i] && updatedEvaluationResults[i].score === 1) {
        newScore++; 
      }
    }
    setEvaluationResults(updatedEvaluationResults);
    setScore(newScore);
    setShowResults(true);
    setIsLoading(false);

    // Save quiz summary to localStorage
    try {
        const quizSummary = {
            id: Date.now().toString(),
            pdfName: pdfFileName || `Quiz from ${new Date().toLocaleDateString()}`,
            dateTaken: new Date().toLocaleDateString(),
            score: `${newScore} / ${questions.length}`,
            percentage: questions.length > 0 ? ((newScore / questions.length) * 100).toFixed(0) : 0,
            questionsAndAnswers: questions.map(q => ({ question: q.question, correctAnswer: q.answer })),
        };
        const existingSummaries = JSON.parse(localStorage.getItem('quizSummaries')) || [];
        localStorage.setItem('quizSummaries', JSON.stringify([...existingSummaries, quizSummary]));

        // Update hours studied in localStorage
        const currentHoursStudied = parseFloat(localStorage.getItem('hoursStudied')) || 0;
        localStorage.setItem('hoursStudied', (currentHoursStudied + 0.25).toString()); // Add 15 mins for now

    } catch (e) {
        console.error("Error saving quiz summary or hours studied to localStorage:", e);
        alert("There was an issue saving your quiz results. Please check console for details.");
    }
  };


  const allQuestionsAttempted = () => {
    if (!questions || questions.length === 0) return false;
    return userAnswers.every(answer => answer !== '');
  };

  const handleClear = () => {
    setPdfContent(null);
    setPdfFileName('');
    setQuestions(null);
    setUserAnswers([]);
    setIsPdfUploaded(false);
    setEvaluationResults([]);
    setShowResults(false);
    setScore(0);
    setIsLoading(false);
    setIsEvaluating([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Remove quiz state from localStorage
    try { localStorage.removeItem('uploadQuizState'); } catch (e) {}
  };
  
  const getButtonStyles = (disabled) => ({
    ...styles.button,
    ...(disabled ? styles.buttonDisabled : {}),
  });
  
  const getOutlineButtonStyles = (disabled) => ({
    ...styles.button,
    ...styles.buttonOutline,
    ...(disabled ? styles.buttonDisabled : {}),
  });


  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>PDF Quiz Generator</h1>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <img src="/Images/pdf.png" alt="PDF Upload" style={styles.pdfIcon} data-ai-hint="document script" />
          <h2 style={styles.cardTitle}>Upload Your PDF</h2>
          <p style={styles.cardDescription}>
            Select a text-based PDF file to automatically generate a multiple-choice quiz.
          </p>
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="pdf-upload" style={styles.label}>PDF File</label>
          <input
            id="pdf-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="questionCount" style={styles.label}>Number of Questions (1-20)</label>
          <input
            id="questionCount"
            type='number'
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            min="1"
            max="20"
            disabled={isLoading || questions !== null}
            style={styles.input}
          />
        </div>
        <button 
            onClick={handleGenerateQuestions} 
            disabled={!isPdfUploaded || isLoading}
            style={getButtonStyles(!isPdfUploaded || isLoading)}
            onMouseOver={e => { if (!(!isPdfUploaded || isLoading)) e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor; }}
            onMouseOut={e => { if (!(!isPdfUploaded || isLoading)) e.currentTarget.style.backgroundColor = styles.button.backgroundColor; }}
            onMouseDown={e => { if (!(!isPdfUploaded || isLoading)) e.currentTarget.style.transform = styles.buttonActive.transform; }}
            onMouseUp={e => { if (!(!isPdfUploaded || isLoading)) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isLoading && !questions ? 'Reading PDF...' : isLoading ? 'Generating...' : 'Generate Questions'}
        </button>
        {(isPdfUploaded || questions) && (
          <button 
            onClick={handleClear} 
            disabled={isLoading}
            style={getOutlineButtonStyles(isLoading)}
            onMouseOver={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(108, 33, 220, 0.1)'; }} /* Light purple hover */
            onMouseOut={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'transparent'; }}
            onMouseDown={e => { if (!isLoading) e.currentTarget.style.transform = styles.buttonActive.transform; }}
            onMouseUp={e => { if (!isLoading) e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Clear All
          </button>
        )}
        {isLoading && <p style={styles.loadingText}>Processing, please wait...</p>}
      </div>

      {questions && questions.map((question, index) => (
        <div key={index} style={{...styles.card, ...styles.questionCard}}>
          <h3 style={styles.cardTitle}>{`Question ${index + 1}`}</h3>
          <p style={styles.cardDescription}>{question.question}</p>
          
          {!question.options || !Array.isArray(question.options) || question.options.length !== 4 ? (
            <p style={styles.errorMessage}>Error: Invalid question options. Expected 4 choices.</p>
          ) : (
            <div style={styles.radioGroup}>
              {question.options.map((option, optionIndex) => (
                <div 
                  key={optionIndex} 
                  style={styles.radioItemContainer}
                  onClick={() => !showResults && handleAnswerChange(index, option)}
                  onMouseEnter={e => { if(!showResults) e.currentTarget.style.backgroundColor = '#f0f0f0';}}
                  onMouseLeave={e => { if(!showResults) e.currentTarget.style.backgroundColor = 'transparent';}}
                >
                  <input
                    type="radio"
                    name={`q${index}`}
                    id={`q${index}-opt${optionIndex}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    disabled={showResults || isEvaluating[index]}
                    style={styles.radioInput}
                  />
                  <label htmlFor={`q${index}-opt${optionIndex}`} style={styles.radioLabel}>{option}</label>
                </div>
              ))}
            </div>
          )}

          {!showResults && (
             <button
                onClick={() => handleSubmitAnswerAndEvaluate(index)}
                disabled={!userAnswers[index] || evaluationResults[index] !== null || isEvaluating[index] || !question.options || !Array.isArray(question.options) || question.options.length !== 4}
                style={{...getButtonStyles(!userAnswers[index] || evaluationResults[index] !== null || isEvaluating[index]), marginTop: '15px' }}
             >
                {isEvaluating[index] ? 'Evaluating...' : (evaluationResults[index] ? 'Answer Submitted' : 'Submit Answer')}
             </button>
          )}

          {showResults && evaluationResults[index] && typeof evaluationResults[index].score === 'number' && (
            <div style={styles.resultSection}>
              <p>Your Answer: <span style={evaluationResults[index].score === 1 ? styles.correctAnswer : styles.incorrectAnswer}>{userAnswers[index]}</span></p>
              {evaluationResults[index].score !== 1 && <p>Correct Answer: <span style={styles.correctAnswer}>{question.answer}</span></p>}
              <p>Status: <span style={evaluationResults[index].score === 1 ? styles.correctAnswer : styles.incorrectAnswer}>{evaluationResults[index].score === 1 ? 'Correct ✅' : 'Incorrect ❌'}</span></p>
            </div>
          )}
           {showResults && evaluationResults[index] && typeof evaluationResults[index].score !== 'number' && (
             <div style={{...styles.resultSection, borderColor: 'red', backgroundColor: '#ffebee'}}>
                <p style={{color: 'red', fontWeight: 'bold'}}>Evaluation Error</p>
                <p>Could not determine the result for this question.</p>
             </div>
           )}
        </div>
      ))}

      {questions && questions.length > 0 && !showResults && allQuestionsAttempted() && (
        <div style={styles.card}>
           <button 
            onClick={handleShowScore} 
            disabled={isLoading}
            style={getButtonStyles(isLoading)}
            onMouseOver={e => { if (!isLoading) e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor; }}
            onMouseOut={e => { if (!isLoading) e.currentTarget.style.backgroundColor = styles.button.backgroundColor; }}
          >
            {isLoading ? 'Calculating...' : 'Calculate Final Score'}
          </button>
        </div>
      )}

      {showResults && questions && questions.length > 0 && (
        <div style={{...styles.card, ...styles.finalScoreCard}}>
          <div style={styles.cardHeader}>
            <h2 style={{...styles.cardTitle, color: '#388E3C'}}>Quiz Completed!</h2>
          </div>
          <p style={{fontSize: '1.2rem', marginBottom: '10px'}}>
            You got <span style={{fontWeight: 'bold', color: '#1B5E20'}}>{score}</span> correct answers out of <span style={{fontWeight: 'bold', color: '#1B5E20'}}>{questions.length}</span> questions.
          </p>
          <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32'}}>
            Overall Score: {questions.length > 0 ? ((score / questions.length) * 100).toFixed(0) : 0}%
          </p>
          <button 
            onClick={handleClear} 
            style={{...styles.button, marginTop: '20px', backgroundColor: '#4CAF50'}}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#388E3C'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            Start New Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;

