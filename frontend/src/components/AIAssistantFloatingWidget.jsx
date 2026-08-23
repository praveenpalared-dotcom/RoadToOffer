import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaRobot, FaTimes, FaPaperPlane, FaCommentDots, FaStar } from 'react-icons/fa';

const AIAssistantFloatingWidget = () => {
  const { token, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! Quick question about DSA or your study plan? Ask me anytime!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isAuthenticated) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/study-assistant/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'Here is your quick study answer!' }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl shadow-blue-500/40 border border-blue-400/30 transition-all transform hover:scale-105 group flex items-center space-x-2"
        title="AI Companion Assistant"
      >
        <FaRobot className="text-2xl animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold pl-1">
          AI Companion
        </span>
      </button>

      {/* Slide-over Chat Drawer Overlay */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
          
          {/* Header */}
          <div className="p-4 bg-brand-primary/20 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-brand-primary/30 rounded-lg border border-brand-accent/30 text-brand-accent">
                <FaRobot className="text-lg" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">AI Study Assistant</h4>
                <p className="text-[10px] text-brand-accent font-semibold">Active & Context Aware</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-xl ${
                  m.sender === 'user'
                    ? 'bg-brand-primary text-white rounded-tr-none'
                    : 'bg-slate-800 text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line font-medium">{m.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-gray-400 p-2.5 rounded-xl rounded-tl-none border border-white/5 text-[11px] flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
                  <span>AI Assistant thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-950 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask a quick question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-brand-primary text-white rounded-xl disabled:opacity-50 hover:bg-blue-600 transition-all text-xs"
            >
              <FaPaperPlane />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default AIAssistantFloatingWidget;
