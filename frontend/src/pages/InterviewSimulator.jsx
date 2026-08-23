import React, { useState, useRef, useEffect } from 'react';
import { FaVideo, FaMicrophone, FaPaperPlane, FaUserTie } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const InterviewSimulator = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Welcome to your mock interview. Let's start with a classic problem: How would you design a rate limiter for a distributed API?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText.trim() };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        console.error('Error from AI backend:', data);
      }
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6 flex flex-col h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <FaUserTie className="text-brand-accent" />
            <span>AI Interview Simulator</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Simulate real technical interviews for any role.</p>
        </div>
        <button className="px-4 py-2 bg-brand-danger/10 text-brand-danger border border-brand-danger/20 rounded-xl font-bold text-sm hover:bg-brand-danger hover:text-white transition-all">
          End Interview
        </button>
      </div>

      {/* Main Split Screen */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pb-8">
        
        {/* Left: Video Feed */}
        <div className="w-full lg:w-1/2 bg-black rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-white font-bold">REC</span>
          </div>
          
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-5xl transition-all duration-300 ${isTyping ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-accent shadow-[0_0_30px_rgba(100,108,255,0.3)] animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-500'} mb-4`}>
            <FaUserTie />
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest">{isTyping ? 'AI is analyzing...' : 'AI Interviewer'}</p>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4 bg-black/80 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <button className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-full text-white transition-all"><FaVideo /></button>
            <button className="p-3 bg-brand-primary hover:bg-brand-primary/80 rounded-full text-white shadow-[0_0_15px_rgba(100,108,255,0.4)] transition-all"><FaMicrophone /></button>
          </div>
        </div>

        {/* Right: Chat / Q&A */}
        <div className="w-full lg:w-1/2 bg-brand-card/50 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-slate-900/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interview Log</h3>
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-brand-primary/20 border border-brand-primary/30'}`}>
                  {msg.role === 'user' ? <span className="text-emerald-400 text-xs font-bold">U</span> : <FaUserTie className="text-brand-accent text-xs" />}
                </div>
                <div className={`p-4 rounded-2xl border max-w-[85%] ${msg.role === 'user' ? 'bg-brand-primary/20 rounded-tr-sm border-brand-accent/20' : 'bg-slate-800 rounded-tl-sm border-white/5'}`}>
                  <p className={`text-sm ${msg.role === 'user' ? 'text-brand-primary/90' : 'text-gray-300'}`}>{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center shrink-0">
                  <FaUserTie className="text-brand-accent text-xs" />
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-white/5 max-w-[85%] flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/5 bg-slate-900/80 shrink-0">
            <div className="flex items-center space-x-3 bg-black/40 border border-white/10 rounded-xl p-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response or speak..." 
                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 px-3 outline-none" 
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg text-white"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
