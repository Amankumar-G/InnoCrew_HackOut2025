import React, { useState, useEffect, useRef } from "react";
import { Upload, Check, Send } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../context/AppContext"; // to get theme

// Typing Animation Component
const TypingAnimation = () => (
  <div className="flex gap-2">
    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300"></span>
  </div>
);

const Pdf = () => {
  const { theme } = useAppContext();
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleFileUpload = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    setUploadProgress("Uploading...");

    axios
      .post("http://localhost:5000/upload/one", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(`Uploading: ${percent}%`);
        },
      })
      .then(() => setUploadProgress("Upload complete!"))
      .catch(() => setUploadProgress("Upload failed!"));
  };

  const handleFileChange = (e) => handleFileUpload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleSend = () => {
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setQuestion("");
    setIsTyping(true);

    axios
      .post("http://localhost:8000/api/chat", { withCredentials: true, userQuery: question })
      .then((res) => {
        const botResponse = res.data.message || "No response";
        setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
      })
      .finally(() => setIsTyping(false));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`min-h-screen p-8 flex w-full gap-6 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
     
      {/* Chat Section */}
      <div className="ml-[15%] w-[75%] flex flex-col">
        <div
          className={`flex flex-col p-4 rounded-xl shadow-lg h-[70vh] overflow-y-auto space-y-3 mb-6 ${
            theme === "dark"
              ? "bg-gray-800/60 border border-gray-700"
              : "bg-white/80 border border-gray-200"
          }`}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-xl max-w-[70%] text-sm leading-relaxed ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 self-end text-white"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}

          {isTyping && <TypingAnimation />}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask about your PDF..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={`flex-1 p-3 rounded-lg text-sm focus:outline-none ${
              theme === "dark"
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-100 text-gray-800"
            }`}
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-105 transition-transform"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pdf;
