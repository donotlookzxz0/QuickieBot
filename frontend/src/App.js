import React, { useState } from "react";
import PopUp from "./components/PopUp";
import { FaRobot } from "react-icons/fa";
import "./App.css"; // Floating icon style

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div className="chatbot-icon" onClick={() => setShowChat(!showChat)}>
        <FaRobot />
      </div>

      {/* Chat Popup */}
      <PopUp isOpen={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}

export default App;
