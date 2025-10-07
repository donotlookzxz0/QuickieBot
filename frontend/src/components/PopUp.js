import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "../styles/PopUp.css";
import "katex/dist/katex.min.css";

export default function PopUp({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { from: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { from: "bot", text: "Error connecting to backend." }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <strong>QuickieBot</strong>
        <button onClick={onClose} className="close-btn">✖</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.from}`}>
            <strong>{msg.from === "user" ? "You: " : "QuickieBot: "}</strong>
            {msg.from === "bot" ? (
              <div className="bot-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask QuickieBot..."
        />
        <button className="chat-send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
