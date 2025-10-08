import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "../styles/PopUp.css";
import "katex/dist/katex.min.css";

export default function PopUp({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]); // multiple files
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, files]);

  const sendMessage = async () => {
    if (!input.trim() && files.length === 0) return;

    const newMessages = [
      ...messages,
      {
        from: "user",
        text: input || (files.length > 0 ? files.map(f => f.name).join(", ") : ""),
      },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("message", input);

        const res = await fetch("http://localhost:5000/chat/file", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setMessages([...newMessages, { from: "bot", text: data.reply }]);
        setFiles([]); // clear files after sending
      } else {
        const res = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        setMessages([...newMessages, { from: "bot", text: data.reply }]);
      }
    } catch (err) {
      setMessages([...newMessages, { from: "bot", text: "Error connecting to backend." }]);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <strong>QuickieBot</strong>
        <button onClick={onClose} className="close-btn">✖</button>
      </div>

      <div className="chat-messages">
        {/* Render file previews at the top */}
        {files.map((file, index) => (
          <div key={index} className="chat-message user file-preview">
            <strong>Uploaded: </strong>
            {file.name}
            <span className="remove-file" onClick={() => removeFile(index)}>✖</span>
          </div>
        ))}

        {/* Render chat messages */}
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

        {/* Typing indicator */}
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

        {/* Reference div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
        />

        <div className="file-upload-container">
          <label className="file-upload-label">
            Upload Files
            <input
              type="file"
              className="file-input"
              multiple
              onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
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
