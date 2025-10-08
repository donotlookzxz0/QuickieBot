import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";
import PopUp from "./components/PopUp";
import { FaRobot } from "react-icons/fa";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResourceList from "./components/ResourceList";
import "./App.css";

function App() {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("user"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <nav>
        {!user ? (
          <>
            <Link to="/login">User Login</Link> {" "}
            <Link to="/register">User Register</Link>
          </>
        ) : (
          <>
            <span>Welcome, {user}!</span>{" "}
            <Link to="/">Home</Link> {" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        {/* Home – shows ResourceList + Chatbot */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <div className="home-container">
                {/* Main Home Page Content */}
                <ResourceList />

                {/* Floating Chatbot Icon */}
                <div
                  className="chatbot-icon"
                  onClick={() => setShowChat(!showChat)}
                >
                  <FaRobot />
                </div>

                {/* Chatbot Pop-up */}
                <PopUp
                  isOpen={showChat}
                  onClose={() => setShowChat(false)}
                />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Login – public only */}
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login />
            </PublicRoute>
          }
        />

        {/* Register – public only */}
        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
