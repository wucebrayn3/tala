import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase"; // Import auth and db
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

function DashBoard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
      console.error("Error loading tasks from localStorage", e);
      return [];
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [activityName, setActivityName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  const [firstName, setFirstName] = useState(""); // State to store the first name
  const [loadingGreeting, setLoadingGreeting] = useState(true); // State to handle loading state

  const [createdFlashcardSets, setCreatedFlashcardSets] = useState(() => {
    try {
      const savedSets = localStorage.getItem("createdFlashcardSets");
      return savedSets ? JSON.parse(savedSets) : [];
    } catch (e) {
      console.error(
        "Dashboard: Error initializing createdFlashcardSets from localStorage",
        e
      );
      return [];
    }
  });

  const [quizSummaries, setQuizSummaries] = useState(() => {
    try {
      const savedSummaries = localStorage.getItem("quizSummaries");
      return savedSummaries ? JSON.parse(savedSummaries) : [];
    } catch (e) {
      console.error(
        "Dashboard: Error initializing quizSummaries from localStorage",
        e
      );
      return [];
    }
  });

  const [hoursStudied, setHoursStudied] = useState(() => {
    try {
      const savedHours = localStorage.getItem("hoursStudied");
      return savedHours ? parseFloat(savedHours) : 0;
    } catch (e) {
      console.error(
        "Dashboard: Error initializing hoursStudied from localStorage",
        e
      );
      return 0;
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingGreeting(true);
      try {
        if (auth.currentUser) {
          const userDocRef = doc(firestore, "users", auth.currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstName || "User"); // Use 'User' as a default if firstname is not found
          } else {
            console.log("No such document!");
            setFirstName("User"); // Default if user data not found
          }
        } else {
          setFirstName("User"); // Default if no user is logged in
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFirstName("User"); // Default in case of an error
      } finally {
        setLoadingGreeting(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Dashboard: Error saving tasks to localStorage", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "createdFlashcardSets",
        JSON.stringify(createdFlashcardSets)
      );
    } catch (e) {
      console.error(
        "Dashboard: Error saving createdFlashcardSets to localStorage",
        e
      );
    }
  }, [createdFlashcardSets]);

  useEffect(() => {
    try {
      localStorage.setItem("quizSummaries", JSON.stringify(quizSummaries));
    } catch (e) {
      console.error("Dashboard: Error saving quizSummaries to localStorage", e);
    }
  }, [quizSummaries]);

  useEffect(() => {
    try {
      localStorage.setItem("hoursStudied", hoursStudied.toString());
    } catch (e) {
      console.error("Dashboard: Error saving hoursStudied to localStorage", e);
    }
  }, [hoursStudied]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "tasks") {
        try {
          setTasks(event.newValue ? JSON.parse(event.newValue) : []);
        } catch (e) {
          console.error(
            "Dashboard: Error updating tasks from storage event",
            e
          );
        }
      }
      if (event.key === "createdFlashcardSets") {
        try {
          setCreatedFlashcardSets(
            event.newValue ? JSON.parse(event.newValue) : []
          );
        } catch (e) {
          console.error(
            "Dashboard: Error updating createdFlashcardSets from storage event",
            e
          );
        }
      }
      if (event.key === "quizSummaries") {
        try {
          setQuizSummaries(event.newValue ? JSON.parse(event.newValue) : []);
        } catch (e) {
          console.error(
            "Dashboard: Error updating quizSummaries from storage event",
            e
          );
        }
      }
      if (event.key === "hoursStudied") {
        try {
          setHoursStudied(event.newValue ? parseFloat(event.newValue) : 0);
        } catch (e) {
          console.error(
            "Dashboard: Error updating hoursStudied from storage event",
            e
          );
        }
      }
    };

    const refreshData = () => {
      try {
        const savedTasksData = localStorage.getItem("tasks");
        setTasks(savedTasksData ? JSON.parse(savedTasksData) : []);

        const savedFlashcardSets = localStorage.getItem("createdFlashcardSets");
        setCreatedFlashcardSets(
          savedFlashcardSets ? JSON.parse(savedFlashcardSets) : []
        );

        const savedQuizSummaries = localStorage.getItem("quizSummaries");
        setQuizSummaries(
          savedQuizSummaries ? JSON.parse(savedQuizSummaries) : []
        );

        const savedHours = localStorage.getItem("hoursStudied");
        setHoursStudied(savedHours ? parseFloat(savedHours) : 0);
      } catch (e) {
        console.error(
          "Error refreshing data from localStorage on focus/visibility",
          e
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", refreshData);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    });

    refreshData();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", refreshData);
      document.removeEventListener("visibilitychange", refreshData);
    };
  }, []);

  const addTask = () => {
    if (subject && activityName && teacher && deadlineDate && deadlineTime) {
      const newTask = {
        id: Date.now().toString(), // Added an ID for tasks as well
        subject,
        activityName,
        teacher,
        deadlineDate,
        deadlineTime,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setSubject("");
      setActivityName("");
      setTeacher("");
      setDeadlineDate("");
      setDeadlineTime("");
      setShowForm(false);
    } else {
      alert("Please fill in all fields for the task.");
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const totalFlashcards = createdFlashcardSets.reduce((sum, set) => {
    const count = set.cardCount || (set.cards ? set.cards.length : 0) || 0;
    return sum + count;
  }, 0);

  const averageQuizScore =
    quizSummaries.length > 0
      ? (
          quizSummaries.reduce(
            (sum, quiz) => sum + parseFloat(quiz.percentage || 0),
            0
          ) / quizSummaries.length
        ).toFixed(0)
      : 0;

  return (
    <>
      <style>
        {`
                    .dashboard-container {
                        background-color: #f7f9f9;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 20px;
                        padding-top: 80px; /* For Navbar */
                        min-height: 100vh; 
                        height: 100vh; 
                        width: 100vw;
                        box-sizing: border-box;
                        font-family: Arial, sans-serif;
                        gap: 20px; 
                    }
                    .greeting-section {
                        width: 80%;
                        text-align: left;
                        padding: 0 10px; 
                        box-sizing: border-box;
                        flex-shrink: 0; 
                    }
                    .greeting-h1 {
                        font-size: 36px;
                        color: #333;
                        margin-bottom: 10px;
                    }
                    .greeting-p {
                        font-size: 18px;
                        color: black;
                        line-height: 1.6;
                    }
                    .greeting-span {
                        color: #6C21DC;
                    }

                    .dashboard-content-row {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        gap: 20px; 
                        width: 80%;
                        align-items: stretch; 
                        flex-grow: 1; 
                        min-height: 0; 
                    }

                    .task-container {
                        background: linear-gradient(135deg, #6C21DC, #21DC6C);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        color: white;
                        flex: 1; 
                        min-height: 0; 
                    }

                    .task-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        flex-shrink: 0; 
                    }

                    .task-title {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .add-task-button {
                        background-color: white;
                        color: #6C21DC;
                        border: none;
                        border-radius: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease, color 0.3s ease;
                        white-space: nowrap;
                    }
                    .add-task-button:hover {
                        background-color: #f0f0f0; 
                        color: #5a1ab8;
                    }
                    .form-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .form-container {
                        background-color: white;
                        padding: 30px;
                        height: auto;
                        width: 90%;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        max-width: 500px;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    .form-container input {
                        padding: 10px;
                        width: 100%;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        font-size: 16px;
                        box-sizing: border-box;
                    }
                    .form-buttons-container {
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                        margin-top: 10px;
                    }
                    .form-container button {
                        background-color: #6C21DC;
                        color: white;
                        border: none;
                        border-radius: 29px;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    .form-container button:hover {
                        background-color: #5a1ab8;
                    }

                    .task-list {
                        flex-grow: 1; 
                        border-radius: 10px;
                        overflow-y: auto; 
                        min-height: 0; 
                    }
                    .task-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background-color: #f9f9f9;
                        color: #333;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .delete-task-button {
                        background-color: #ff4d4d;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        padding: 5px 10px;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    .delete-task-button:hover {
                        background-color: #e60000;
                    }

                    .right-panel {
                        display: flex;
                        flex-direction: column;
                        gap: 20px; 
                        flex: 1; 
                        min-height: 0; 
                    }

                    .top-cards-row {
                        display: flex;
                        flex-direction: row;
                        gap: 20px; 
                        width: 100%;
                        flex-shrink: 0; 
                    }

                    .card { 
                        background-color: white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        padding: 20px;
                        flex: 1; 
                        min-height: 120px; 
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .card:nth-child(1) {
                        border-left: 5px solid #6C21DC;
                    }
                    .card:nth-child(2) {
                        border-left: 5px solid #21DC6C;
                    }
                    .card:nth-child(3) {
                        border-left: 5px solid #DC6C21;
                    }
                    .card-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                    }
                    .card-description {
                        font-size: 16px;
                        color: #555;
                        margin-top: 8px;
                    }

                    .bottom-large-cards-row {
                        display: flex;
                        flex-direction: row;
                        gap: 20px; 
                        width: 100%;
                        flex-grow: 1; 
                        min-height: 0; 
                    }
                    
                    .flashcard-sets-container, .quiz-summaries-container {
                        background-color: white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 10px;
                        padding: 20px;
                        color: #333;
                        flex: 1; 
                        display: flex; 
                        flex-direction: column; 
                        box-sizing: border-box;
                        min-height: 0; 
                    }

                    .flashcard-sets-container h2, .quiz-summaries-container h2 {
                        font-size: 20px; 
                        font-weight: bold;
                        color: #6C21DC;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #eee;
                        padding-bottom: 10px;
                        flex-shrink: 0;
                    }

                    .scrollable-content-area {
                        flex-grow: 1;
                        overflow-y: auto;
                        min-height: 0; 
                        padding-right: 5px; 
                    }
                    
                    .flashcard-set-item, .quiz-summary-item {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        transition: background-color 0.2s ease, box-shadow 0.2s ease;
                    }
                    .flashcard-set-item:hover {
                        background-color: #f0e6ff; /* Light purple on hover */
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        cursor: pointer;
                    }


                    .flashcard-set-item h3, .quiz-summary-item h3 {
                        font-size: 18px;
                        margin-top: 0;
                        margin-bottom: 8px;
                        color: #4A00E0;
                    }

                    .flashcard-set-item p, .quiz-summary-item p {
                        font-size: 14px;
                        margin-bottom: 5px;
                        line-height: 1.5;
                    }
                    
                    .create-set-button {
                        background-color: #21DC6C;
                        color: white;
                        border: none;
                        border-radius: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        margin-top: auto; 
                        align-self: flex-start; 
                        display: inline-block;
                        flex-shrink: 0; 
                    }
                    .create-set-button:hover {
                        background-color: #1aa854;
                    }

                    .quiz-question-answer-list {
                        margin-top: 10px;
                        padding-left: 0;
                        list-style-type: none;
                    }

                    .quiz-question-answer-pair {
                        margin-bottom: 12px;
                        padding-left: 15px;
                        border-left: 3px solid #6C21DC;
                    }
                    .quiz-question-answer-pair .question {
                        font-weight: bold;
                        display: block;
                        margin-bottom: 3px;
                        color: #333;
                    }
                    .quiz-question-answer-pair .answer {
                        color: #555;
                        display: block;
                    }
                    
                    .placeholder-text {
                        color: #777;
                        font-style: italic;
                        text-align: center;
                        padding: 20px 0;
                        flex-grow: 1; 
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    @media (max-width: 992px) { 
                        .dashboard-container {
                           height: auto; 
                           min-height: 100vh;
                        }
                        .dashboard-content-row {
                            flex-direction: column;
                            align-items: center; 
                            flex-grow: 0; 
                        }
                        .task-container {
                            order: 1; 
                            width: 100%;
                            max-width: 700px; 
                            flex: none; 
                            height: auto; 
                            min-height: 400px; 
                        }
                        .right-panel {
                            order: 2; 
                            width: 100%;
                            max-width: 700px; 
                            flex: none; 
                            height: auto; 
                            min-height: 400px; 
                        }
                        .top-cards-row {
                            flex-wrap: wrap; 
                        }
                        .card { 
                           min-width: calc(50% - 10px); 
                           flex-grow: 1;
                           min-height: 100px; 
                        }
                         .bottom-large-cards-row {
                            flex-direction: column; 
                         }
                         .flashcard-sets-container, .quiz-summaries-container {
                             width: 100%; 
                             min-height: 200px; 
                             height: auto; 
                         }
                         .scrollable-content-area {
                             max-height: 250px; 
                         }
                    }
                     @media (max-width: 576px) { 
                        .greeting-h1 {
                           font-size: 28px;
                        }
                        .greeting-p {
                           font-size: 16px;
                        }
                        .task-title, 
                        .flashcard-sets-container h2, 
                        .quiz-summaries-container h2 {
                           font-size: 20px;
                        }
                        .card { 
                            min-width: 100%;
                        }
                        .top-cards-row, .bottom-large-cards-row {
                            gap: 15px; 
                        }
                        .task-container, .right-panel {
                            min-height: 300px;
                        }
                     }
                `}
      </style>
      <div className="dashboard-container">
        <div className="greeting-section">
          <h1 className="greeting-h1">
            Hi{" "}
            <span className="greeting-span">
              {loadingGreeting ? "Loading..." : firstName}
            </span>
            , Welcome to Tala
          </h1>
          <p className="greeting-p">
            Your smart study buddy! Let’s make learning easier, faster, and more
            fun. Ready to get started?
          </p>
        </div>

        <div className="dashboard-content-row">
          <div className="task-container">
            <div className="task-header">
              <h2 className="task-title">Today's Task</h2>
              <button
                className="add-task-button"
                onClick={() => setShowForm(true)}
              >
                Add Task
              </button>
            </div>
            <div className="task-list">
              {tasks.length === 0 && (
                <p
                  className="placeholder-text"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  No tasks for today. Add a new task!
                </p>
              )}
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div>
                    <strong>Subject:</strong> {task.subject} <br />
                    <strong>Activity:</strong> {task.activityName} <br />
                    <strong>Teacher:</strong> {task.teacher} <br />
                    <strong>Deadline:</strong> {task.deadlineDate} at{" "}
                    {task.deadlineTime}
                  </div>
                  <button
                    className="delete-task-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="right-panel">
            <div className="top-cards-row">
              <div className="card">
                <h3 className="card-title">No of Flashcards</h3>
                <p className="card-description">{totalFlashcards}</p>
              </div>
              <div className="card">
                <h3 className="card-title">Avg. Quiz Score</h3>
                <p className="card-description">
                  {quizSummaries.length > 0 ? `${averageQuizScore}%` : "0%"}
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">Hours Studied</h3>
                <p className="card-description">{hoursStudied.toFixed(2)}h</p>
              </div>
            </div>
            <div className="bottom-large-cards-row">
              <div className="flashcard-sets-container">
                <h2>My Flashcard Sets</h2>
                <div className="scrollable-content-area">
                  {createdFlashcardSets.length === 0 ? (
                    <p className="placeholder-text">
                      No flashcard sets created yet. Create one to get started!
                    </p>
                  ) : (
                    createdFlashcardSets.map((set) => (
                      <div
                        key={set.id}
                        className="flashcard-set-item"
                        onClick={() => navigate(`/flashcard-set/${set.id}`)}
                      >
                        <h3>{set.title}</h3>
                        <p>
                          Cards:{" "}
                          {set.cardCount ||
                            (set.cards ? set.cards.length : 0) ||
                            0}
                        </p>
                        <p>Created: {set.dateCreated || "N/A"}</p>
                      </div>
                    ))
                  )}
                </div>
                <button
                  className="create-set-button"
                  onClick={() => navigate("/create-flashcard")}
                >
                  Create New Set
                </button>
              </div>

              <div className="quiz-summaries-container">
                <h2>Recent Quiz Summaries</h2>
                <div className="scrollable-content-area">
                  {quizSummaries.length === 0 ? (
                    <p className="placeholder-text">
                      No quiz summaries available yet. Take a quiz!
                    </p>
                  ) : (
                    quizSummaries.map((summary) => (
                      <div key={summary.id} className="quiz-summary-item">
                        <h3>{summary.pdfName || "Quiz"}</h3>
                        <p>Date: {summary.dateTaken || "N/A"}</p>
                        <p>
                          Score: {summary.score || "N/A"} (
                          {summary.percentage || "0%"})
                        </p>
                        <h4>Questions & Answers:</h4>
                        {summary.questionsAndAnswers &&
                        summary.questionsAndAnswers.length > 0 ? (
                          <ul className="quiz-question-answer-list">
                            {summary.questionsAndAnswers
                              .slice(0, 2)
                              .map((qa, index) => (
                                <li
                                  key={index}
                                  className="quiz-question-answer-pair"
                                >
                                  <span className="question">
                                    {index + 1}. {qa.question}
                                  </span>
                                  <span className="answer">
                                    Answer: {qa.correctAnswer}
                                  </span>
                                </li>
                              ))}
                            {summary.questionsAndAnswers.length > 2 && (
                              <li
                                style={{
                                  fontSize: "12px",
                                  color: "#777",
                                  marginTop: "5px",
                                }}
                              >
                                ...and {summary.questionsAndAnswers.length - 2}{" "}
                                more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p>No question details available.</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <input
              type="text"
              placeholder="Subject Name"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name of the Activity"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
            <input
              type="date"
              placeholder="Deadline Date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
            />
            <input
              type="time"
              placeholder="Deadline Time"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
            />
            <div className="form-buttons-container">
              <button
                onClick={() => setShowForm(false)}
                style={{ backgroundColor: "#aaa" }}
              >
                Cancel
              </button>
              <button onClick={addTask}>Submit Task</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashBoard;
