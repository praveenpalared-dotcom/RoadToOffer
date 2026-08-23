import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaRobot, FaComments, FaCalendarAlt, FaBrain, FaQuestionCircle, 
  FaVolumeUp, FaVolumeMute, FaPaperPlane, FaLightbulb, FaCheckCircle, 
  FaSync, FaStar, FaPlay, FaClone, FaClock, FaBookOpen
} from 'react-icons/fa';

const AIMentor = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'schedule' | 'socratic' | 'quiz'

  // --- 1. CHAT STATE ---
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your AI Companion & Study Assistant. How can I help you excel in your DSA and technical placement prep today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef(null);

  // --- 2. SCHEDULE STATE ---
  const [dailyHours, setDailyHours] = useState(3);
  const [targetCompany, setTargetCompany] = useState('Google / Top Tier Product');
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [generatingSchedule, setGeneratingSchedule] = useState(false);

  // --- 3. SOCRATIC HINTS STATE ---
  const [socraticTopic, setSocraticTopic] = useState('');
  const [socraticResult, setSocraticResult] = useState(null);
  const [socraticLoading, setSocraticLoading] = useState(false);

  // --- 4. QUIZ & FLASHCARDS STATE ---
  const [quizList, setQuizList] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    fetchQuizAndFlashcards();
  }, [token]);

  // Audio Speech Synthesis Toggle
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Chat Send Handler
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const newMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/study-assistant/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply || 'I am ready to assist your study sprint!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  // Schedule Generator Handler
  const handleGenerateSchedule = async () => {
    setGeneratingSchedule(true);
    try {
      const res = await fetch('/api/study-assistant/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dailyHours, targetCompany })
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedSchedule(data.schedule || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingSchedule(false);
    }
  };

  // Socratic Hint Handler
  const handleFetchSocratic = async (e) => {
    e.preventDefault();
    if (!socraticTopic.trim()) return;
    setSocraticLoading(true);
    try {
      const res = await fetch('/api/study-assistant/socratic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ problemTitle: socraticTopic })
      });
      const data = await res.json();
      if (res.ok) {
        setSocraticResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSocraticLoading(false);
    }
  };

  // Quiz & Flashcards Fetcher
  const fetchQuizAndFlashcards = async () => {
    if (!token) return;
    try {
      const [quizRes, cardsRes] = await Promise.all([
        fetch('/api/study-assistant/quiz', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/study-assistant/flashcards', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const quizData = await quizRes.json();
      const cardsData = await cardsRes.json();
      if (quizRes.ok) setQuizList(quizData.quiz || []);
      if (cardsRes.ok) setFlashcards(cardsData.flashcards || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectQuizAnswer = (qId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCalculateQuizScore = () => {
    let score = 0;
    quizList.forEach(q => {
      if (userAnswers[q.id] === q.answerIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  const toggleFlashcard = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
            <FaRobot className="text-3xl text-brand-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">AI Companion & Study Assistant</h1>
            <p className="text-sm text-gray-400 mt-1">
              Your 24/7 personal tutor for Socratic DSA guidance, custom study schedules, and practice quizzes.
            </p>
          </div>
        </div>

        {/* Audio Speech Synthesis Toggle */}
        <button
          onClick={() => speakText(messages[messages.length - 1]?.text || '')}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 ${
            isSpeaking 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
              : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
          }`}
        >
          {isSpeaking ? <FaVolumeMute className="text-sm" /> : <FaVolumeUp className="text-sm" />}
          <span>{isSpeaking ? 'Stop Voice Assistant' : 'Read AI Response Aloud'}</span>
        </button>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'chat' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaComments />
          <span>Interactive Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'schedule' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaCalendarAlt />
          <span>Study Schedule Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('socratic')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'socratic' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaLightbulb />
          <span>Socratic DSA Explainer</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
            activeTab === 'quiz' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaBrain />
          <span>Quizzes & Flashcards</span>
        </button>
      </div>

      {/* --- TAB 1: INTERACTIVE CHAT --- */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Quick Prompt Chips Sidebar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Study Prompts</h4>
            {[
              "Generate a 7-day study plan for DP",
              "Explain Dijkstra's Algorithm in simple terms",
              "Give me a Socratic hint for Two Sum",
              "How to structure STAR method for behavioral round?",
              "What are the top 5 graph patterns in interviews?"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="w-full text-left p-3 bg-slate-900/60 hover:bg-brand-primary/10 rounded-xl border border-white/5 hover:border-brand-primary/30 text-xs text-gray-300 hover:text-white transition-all font-medium flex items-center justify-between group"
              >
                <span>{prompt}</span>
                <span className="text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-brand-card/50 glass-panel rounded-2xl border border-white/5 flex flex-col h-[580px]">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 space-y-1 shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-none'
                      : 'bg-slate-900 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                      <span className="font-bold uppercase">{msg.sender === 'user' ? 'You' : 'AI Companion'}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line font-medium">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-white/10 rounded-2xl rounded-tl-none p-3 flex items-center space-x-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-brand-accent rounded-full animate-ping" />
                    <span>AI Assistant is analyzing query...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-white/5 bg-slate-900/60 rounded-b-2xl">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-3"
              >
                <input
                  type="text"
                  placeholder="Ask any DSA question, bug fix, or study tip..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-950 text-white text-xs font-medium rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-3 bg-brand-primary hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-brand-primary/20 transition-all text-xs font-bold flex items-center space-x-2"
                >
                  <span>Send</span>
                  <FaPaperPlane />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* --- TAB 2: STUDY SCHEDULE GENERATOR --- */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Daily Available Study Hours</label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full p-3 bg-slate-950 text-white text-xs rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
              >
                <option value="1">1 Hour / Day (Light)</option>
                <option value="2">2 Hours / Day (Moderate)</option>
                <option value="3">3 Hours / Day (Recommended)</option>
                <option value="5">5 Hours / Day (Intensive Boot Camp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Target Placement Track</label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full p-3 bg-slate-950 text-white text-xs rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
              >
                <option value="Google / Top Product Tier">Google / Top Product Tier</option>
                <option value="Amazon / Microsoft / MAANG">Amazon / Microsoft / MAANG</option>
                <option value="Fintech & High Frequency Trading">Fintech & High Frequency Trading</option>
                <option value="Service Based & Core Campus Drive">Service Based & Core Campus Drive</option>
              </select>
            </div>

            <button
              onClick={handleGenerateSchedule}
              disabled={generatingSchedule}
              className="py-3 px-6 bg-brand-primary hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <FaSync className={generatingSchedule ? 'animate-spin' : ''} />
              <span>{generatingSchedule ? 'Generating Plan...' : 'Generate 7-Day Strategy'}</span>
            </button>
          </div>

          {generatedSchedule && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedSchedule.map((item, idx) => (
                <div key={idx} className="p-5 bg-brand-card/50 glass-panel rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">{item.day}</span>
                    <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10 font-semibold">{item.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.topic}</h3>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {item.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="flex items-start space-x-2 text-xs text-gray-300">
                        <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0 text-[10px]" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: SOCRATIC DSA EXPLAINER --- */}
      {activeTab === 'socratic' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FaLightbulb className="text-amber-400" />
              <span>Socratic Progressive Hint Engine</span>
            </h3>
            <p className="text-xs text-gray-400">
              Stuck on a problem? Enter the problem title to get step-by-step guidance without spoiling full code solutions!
            </p>

            <form onSubmit={handleFetchSocratic} className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="e.g. Longest Palindromic Substring, 3Sum, Course Schedule..."
                value={socraticTopic}
                onChange={(e) => setSocraticTopic(e.target.value)}
                className="flex-1 p-3 bg-slate-950 text-white text-xs font-medium rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                disabled={socraticLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                {socraticLoading ? 'Analyzing...' : 'Get Socratic Hints'}
              </button>
            </form>
          </div>

          {socraticResult && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Hints for: {socraticResult.problemTitle}</h4>
              
              {socraticResult.hints.map((h) => (
                <div key={h.level} className="p-5 bg-brand-card/50 glass-panel rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      Stage {h.level}
                    </span>
                    <h5 className="text-sm font-bold text-white">{h.title}</h5>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pl-2 border-l-2 border-amber-400/40">
                    {h.hint}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: QUIZZES & FLASHCARDS --- */}
      {activeTab === 'quiz' && (
        <div className="space-y-8">
          
          {/* Section A: Practice Quiz */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <FaBrain className="text-brand-accent" />
                <span>DSA Concept Practice Quiz</span>
              </h3>
              {quizScore !== null && (
                <span className="text-xs font-black bg-brand-success/20 text-brand-success px-4 py-1.5 rounded-full border border-brand-success/30">
                  Your Score: {quizScore} / {quizList.length}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {quizList.map((q) => (
                <div key={q.id} className="p-5 bg-brand-card/50 glass-panel rounded-2xl border border-white/5 space-y-3">
                  <h4 className="text-sm font-bold text-white">{q.id}. {q.question}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                            isSelected
                              ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                              : 'bg-slate-900/60 text-gray-300 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizScore !== null && (
                    <p className="text-xs text-gray-400 pt-2 border-t border-white/5 italic">
                      💡 Explanation: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleCalculateQuizScore}
              className="px-6 py-2.5 bg-brand-primary hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Submit & Grade Quiz
            </button>
          </div>

          {/* Section B: Digital Flashcards */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FaBookOpen className="text-indigo-400" />
              <span>Active Recall Digital Flashcards</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {flashcards.map((card) => {
                const isFlipped = flippedCards[card.id];
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleFlashcard(card.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 min-h-[160px] flex flex-col justify-between ${
                      isFlipped 
                        ? 'bg-gradient-to-br from-indigo-900/60 to-slate-900 border-indigo-500/40 shadow-xl' 
                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {card.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-3">{card.concept}</h4>
                    </div>

                    {isFlipped ? (
                      <p className="text-xs text-gray-200 mt-2 leading-relaxed animate-fadeIn">
                        {card.summary}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-4">
                        Click card to flip definition 🔄
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AIMentor;
