import React, { useState } from 'react';
import { FaUserTie, FaVideo, FaMicrophoneAlt, FaDesktop, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';

const InterviewCenter = () => {
  const [activeTab, setActiveTab] = useState('system-design');

  const questions = {
    'system-design': [
      'Design a URL shortener like bit.ly',
      'Design Netflix or YouTube (Video Streaming)',
      'Design a Rate Limiter',
      'Design Twitter / News Feed System'
    ],
    'hr': [
      'Tell me about a time you had a conflict with a teammate.',
      'Why do you want to join our company?',
      'What is your biggest weakness?',
      'Describe a challenging project you worked on.'
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-white/5 pb-5 flex items-start space-x-4">
        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <FaUserTie className="text-4xl text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Mock Interview Center</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
            Practice System Design and HR Behavioral questions. Coming soon: AI-powered interactive mock video interviews.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Question Bank */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab('system-design')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'system-design' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              System Design
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hr' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              HR / Behavioral
            </button>
          </div>

          <div className="space-y-4">
            {questions[activeTab].map((q, idx) => (
              <div key={idx} className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                <span className="text-white font-medium">{q}</span>
                <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: AI Video Interview Placeholder */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest animate-pulse">
              Beta
            </span>
          </div>

          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center relative shadow-2xl">
            <FaVideo className="text-3xl text-gray-400" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-slate-950 flex items-center justify-center">
              <FaCheckCircle className="text-white text-xs" />
            </div>
          </div>

          <div className="space-y-2 z-10">
            <h3 className="text-xl font-bold text-white">AI Mock Interviewer</h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              Simulate a real video interview. Our AI will analyze your speech, facial expressions, and technical answers.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full max-w-xs justify-center text-gray-500 text-lg z-10">
            <div className="p-3 bg-slate-800 rounded-xl"><FaMicrophoneAlt /></div>
            <div className="p-3 bg-slate-800 rounded-xl"><FaDesktop /></div>
          </div>

          <button className="w-full max-w-xs py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all z-10">
            <FaPlayCircle />
            <span>Start Session</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default InterviewCenter;
