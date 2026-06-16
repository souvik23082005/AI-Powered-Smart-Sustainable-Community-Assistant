import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaSpinner, FaFileAlt, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [report, setReport] = useState(null);
  
  const chatEndRef = useRef(null);

  const quickQuestions = [
    "How can I save water?",
    "How can I reduce my carbon footprint?",
    "What goes in the recycling bin?",
    "How can cities become more sustainable?"
  ];

  // Fetch chat history on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/api/chat-history", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Map history to chat format (reverse it so oldest is first, or just map if API sorts DESC)
      // Actually API returns DESC (newest first). Let's reverse it to chronological.
      const history = res.data.data.slice().reverse();
      const mapped = history.flatMap(c => [
        { sender: "user", text: c.question },
        { sender: "ai", text: c.answer }
      ]);
      setChat(mapped);
    })
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async (overrideMessage = null) => {
    const txt = overrideMessage || message;
    if (!txt.trim()) return;

    setChat(prev => [...prev, { sender: "user", text: txt }]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/api/chat", { message: txt }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChat(prev => [...prev, { sender: "ai", text: res.data.reply }]);
    } catch (error) {
      console.error(error);
      const serverError = error.response?.data?.error;
      const displayMsg = serverError ? `EcoAI Error: ${serverError}` : "Connection to EcoAI lost. Please try again.";
      setChat(prev => [...prev, { sender: "ai", text: displayMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const askQuickQuestion = (q) => sendMessage(q);

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/ai/report", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data.report);
    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors block mb-2">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <FaRobot className="text-primary" />
              EcoAI <span className="text-gradient">Assistant</span>
            </h1>
          </div>

          <button 
            onClick={generateReport}
            disabled={generatingReport}
            className="glow-btn bg-[rgba(255,255,255,0.05)] border border-primary/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {generatingReport ? <FaSpinner className="animate-spin" /> : <FaFileAlt />}
            Generate Impact Report
          </button>
        </div>

        {/* Quick Questions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => askQuickQuestion(q)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:border-primary px-4 py-2 rounded-full text-xs font-medium text-gray-300 hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 glass-card p-6 overflow-y-auto mb-4 space-y-6 scrollbar-hide flex flex-col">
          {chat.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <FaRobot className="text-6xl mb-4 text-primary" />
              <p className="text-xl font-bold mb-2">How can I help you be greener today?</p>
              <p className="text-sm">I'm connected to your history and can offer personalized advice.</p>
            </div>
          )}

          {chat.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-primary to-accent text-white rounded-br-sm"
                    : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-gray-200 rounded-bl-sm"
                }`}
              >
                {msg.sender === "ai" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-4 rounded-bl-sm flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            placeholder="Ask EcoAI for advice..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            className="bg-primary hover:bg-purple-600 px-6 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </div>

      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {report && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0c0c0e] border border-primary/30 w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-[rgba(255,255,255,0.1)] flex justify-between items-center bg-primary/10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaFileAlt className="text-primary" /> Monthly Impact Report
                </h2>
                <button onClick={() => setReport(null)} className="text-gray-400 hover:text-white transition-colors">
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto prose prose-invert prose-primary max-w-none">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
              <div className="p-4 border-t border-[rgba(255,255,255,0.1)] text-center text-xs text-gray-500 bg-black/50">
                Report Generated by EcoAI • +10 Sustainability Points Awarded!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}