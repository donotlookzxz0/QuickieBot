import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "../styles/PopUp.css";
import "katex/dist/katex.min.css";

export default function PopUp({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const newMessages = [
      ...messages,
      { from: "user", text: input || (file ? file.name : "") },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await fetch("https://quickiebot.onrender.com/chat/file", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("https://quickiebot.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
      }

      const data = await res.json();
      setMessages([...newMessages, { from: "bot", text: data.reply }]);
      setFile(null);
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "Error connecting to backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => setFile(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <strong>QuickieBot</strong>
        <button onClick={onClose} className="close-btn">
          ✖
        </button>
      </div>

      <div className="chat-messages">
        {file && (
          <div className="chat-message user file-preview">
            <strong>You uploaded: </strong>
            {file.name}
            <span className="remove-file" onClick={removeFile}>
              ✖
            </span>
          </div>
        )}

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
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(msg.text)}
                >
                  Copy
                </button>
              </div>
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-message bot typing">
            <strong>QuickieBot: </strong>
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask QuickieBot "
          rows={1}
        />

        <div className="file-upload-container">
          <label className="file-upload-label">
            {file ? "Change File" : "Upload File"}
            <input
              type="file"
              className="file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        <button className="chat-send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
