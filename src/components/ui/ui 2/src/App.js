import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import EditProfile from "./components/EditProfile";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/DashBoard";
import About from "./components/About";
import Flashcard from "./components/Flashcard";
import UploadPage from "./components/UploadPage";
import CreateFlashcard from "./components/CreateFlashcard";
import FlashcardSetView from "./components/FlashcardSetView"; // Import the new component
import "@fontsource/raleway";

// Helper component to manage Navbar visibility and authentication
function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("isAuthenticated");
      return storedAuth ? JSON.parse(storedAuth) : false;
    } catch (e) {
      console.error("Could not parse stored authentication status", e);
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const hideNavBar =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {!hideNavBar && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/about"
          element={
            isAuthenticated ? <About /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/edit-profile" // For editing user profile
          element={
            isAuthenticated ? <EditProfile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/flashcard" // Main page to choose creation method
          element={
            isAuthenticated ? <Flashcard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/upload" // For generating from PDF
          element={
            isAuthenticated ? <UploadPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/create-flashcard" // For manual creation
          element={
            isAuthenticated ? (
              <CreateFlashcard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/flashcard-set/:setId" // New route for viewing a specific set
          element={
            isAuthenticated ? (
              <FlashcardSetView />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
