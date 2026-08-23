import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLaptopCode, FaArrowLeft, FaCheckCircle, FaPlayCircle, FaLock, FaBookOpen, FaCode, FaRegClock, FaTrophy } from 'react-icons/fa';

const FeatureMockView = () => {
  const { type, topic } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network fetch for the specific module
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [type, topic]);

  // Format strings for display
  const displayType = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Curriculum';
  const displayTopic = topic ? topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Module';

  // Generate dynamic curriculum based on the topic
  const generateCurriculum = () => {
    const t = topic?.toLowerCase() || '';

    if (t.includes('dsa')) {
      return [
        { id: 1, title: 'Arrays & Strings In-Depth', type: 'video', duration: '45m', completed: true },
        { id: 2, title: 'Two Pointers & Sliding Window', type: 'reading', duration: '25m', completed: true },
        { id: 3, title: 'Graph Traversal (BFS / DFS)', type: 'video', duration: '55m', completed: false },
        { id: 4, title: 'Dynamic Programming Masterclass', type: 'code', duration: '1h 30m', completed: false },
        { id: 5, title: 'Advanced Tree Operations', type: 'video', duration: '40m', completed: false, locked: true }
      ];
    }
    
    if (t.includes('cs-fund') || t.includes('os') || t.includes('dbms') || t.includes('networks')) {
      return [
        { id: 1, title: 'Operating Systems: Threading & Concurrency', type: 'video', duration: '35m', completed: true },
        { id: 2, title: 'DBMS: Normalization & ACID Properties', type: 'reading', duration: '20m', completed: false },
        { id: 3, title: 'Computer Networks: OSI Model Deep Dive', type: 'video', duration: '50m', completed: false },
        { id: 4, title: 'System Design: Scalability Patterns', type: 'quiz', duration: '30m', completed: false },
        { id: 5, title: 'Advanced OS Memory Management', type: 'reading', duration: '25m', completed: false, locked: true }
      ];
    }

    if (t.includes('aptitude') || t.includes('quant') || t.includes('logical') || t.includes('verbal')) {
      return [
        { id: 1, title: 'Quantitative: Time, Speed, Distance', type: 'video', duration: '40m', completed: true },
        { id: 2, title: 'Quantitative: Probability & Permutations', type: 'reading', duration: '30m', completed: true },
        { id: 3, title: 'Logical Reasoning: Puzzles & Seating', type: 'quiz', duration: '45m', completed: false },
        { id: 4, title: 'Verbal: Reading Comprehension strategies', type: 'video', duration: '20m', completed: false },
        { id: 5, title: 'Mock Aptitude Test Simulator', type: 'code', duration: '1h 15m', completed: false, locked: true }
      ];
    }

    if (t.includes('projects') || t.includes('dev')) {
      return [
        { id: 1, title: 'System Architecture & Tech Stack Setup', type: 'video', duration: '30m', completed: true },
        { id: 2, title: 'Building RESTful APIs with Node.js', type: 'code', duration: '1h 10m', completed: false },
        { id: 3, title: 'React State Management (Redux/Zustand)', type: 'reading', duration: '25m', completed: false },
        { id: 4, title: 'Authentication & JWT Security', type: 'video', duration: '40m', completed: false },
        { id: 5, title: 'Deploying to AWS/Vercel', type: 'video', duration: '45m', completed: false, locked: true }
      ];
    }

    if (t.includes('math') || t.includes('ct')) {
      return [
        { id: 1, title: 'Discrete Mathematics: Graph Theory', type: 'video', duration: '50m', completed: true },
        { id: 2, title: 'Number Theory & Modulo Arithmetic', type: 'reading', duration: '35m', completed: false },
        { id: 3, title: 'Combinatorics for Competitive Programming', type: 'quiz', duration: '45m', completed: false },
        { id: 4, title: 'Bit Manipulation Hacks', type: 'video', duration: '30m', completed: false, locked: true }
      ];
    }

    if (t.includes('resume') || t.includes('interview') || t.includes('comm')) {
      return [
        { id: 1, title: 'Crafting an ATS-Friendly Resume', type: 'video', duration: '25m', completed: true },
        { id: 2, title: 'STAR Method for Behavioral Interviews', type: 'reading', duration: '15m', completed: true },
        { id: 3, title: 'Mock HR Interview Simulator', type: 'quiz', duration: '30m', completed: false },
        { id: 4, title: 'Salary Negotiation Tactics', type: 'video', duration: '20m', completed: false, locked: true }
      ];
    }

    if (t.includes('ai') || t.includes('genai')) {
      return [
        { id: 1, title: 'Introduction to LLMs & Transformers', type: 'video', duration: '55m', completed: true },
        { id: 2, title: 'Prompt Engineering Techniques', type: 'reading', duration: '20m', completed: false },
        { id: 3, title: 'Building RAG Pipelines', type: 'code', duration: '1h 20m', completed: false },
        { id: 4, title: 'Fine-Tuning Open Source Models', type: 'video', duration: '1h', completed: false, locked: true }
      ];
    }

    if (t.includes('company')) {
      return [
        { id: 1, title: 'FAANG Interview Process Breakdown', type: 'video', duration: '30m', completed: true },
        { id: 2, title: 'Service Based (TCS/Infosys) Aptitude Prep', type: 'reading', duration: '20m', completed: false },
        { id: 3, title: 'Startup Engineering Assessment Guide', type: 'video', duration: '45m', completed: false },
        { id: 4, title: 'Mock Technical Round', type: 'code', duration: '1h', completed: false, locked: true }
      ];
    }

    if (t.includes('revision') || t.includes('flashcards')) {
      return [
        { id: 1, title: 'Quick Fire: Top 50 DSA Concepts', type: 'quiz', duration: '30m', completed: true },
        { id: 2, title: 'System Design Cheat Sheets', type: 'reading', duration: '15m', completed: false },
        { id: 3, title: 'Algorithm Complexity Flashcards', type: 'quiz', duration: '20m', completed: false },
        { id: 4, title: 'Language Specific (C++/Java) Core Facts', type: 'reading', duration: '25m', completed: false, locked: true }
      ];
    }

    // Default fallback
    return [
      { id: 1, title: `Introduction to ${displayTopic}`, type: 'video', duration: '15m', completed: true },
      { id: 2, title: `Core Principles of ${displayTopic}`, type: 'reading', duration: '20m', completed: false },
      { id: 3, title: `Standard Problem Patterns in ${displayTopic}`, type: 'video', duration: '45m', completed: false },
      { id: 4, title: `Interactive Assessment: ${displayTopic}`, type: 'code', duration: '1h', completed: false },
      { id: 5, title: `Advanced Topics in ${displayTopic}`, type: 'video', duration: '30m', completed: false, locked: true },
    ];
  };

  const curriculum = generateCurriculum();
  const completedCount = curriculum.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / curriculum.length) * 100);

  const getTypeIcon = (modType) => {
    switch (modType) {
      case 'video': return <FaPlayCircle className="text-blue-400" />;
      case 'reading': return <FaBookOpen className="text-emerald-400" />;
      case 'code':
      case 'quiz': return <FaCode className="text-amber-400" />;
      default: return <FaBookOpen />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
        >
          <FaArrowLeft />
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-brand-primary/20 text-brand-accent rounded border border-brand-primary/30">
              {displayType}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3 tracking-tight">
            <span>{displayTopic} Masterclass</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Comprehensive curriculum covering theoretical foundations and practical applications.</p>
        </div>
      </div>

      {loading ? (
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Course Material...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player Placeholder */}
            <div className="w-full aspect-video bg-black/60 border border-white/5 rounded-2xl overflow-hidden relative group cursor-pointer shadow-2xl">
              {/* Background abstract art for video placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-indigo-900/40 opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-brand-primary/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-primary/50 group-hover:scale-110 group-hover:bg-brand-primary/40 transition-all duration-300">
                  <FaPlayCircle className="text-5xl text-white ml-2" />
                </div>
                <h3 className="text-white font-bold text-lg mt-6 tracking-tight drop-shadow-md">
                  {curriculum.find(m => !m.completed)?.title || curriculum[0].title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 drop-shadow-md flex items-center">
                  <FaRegClock className="mr-2" /> 
                  Up Next • {curriculum.find(m => !m.completed)?.duration || curriculum[0].duration}
                </p>
              </div>
            </div>

            {/* Curriculum List */}
            <div className="bg-brand-card/50 border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Course Curriculum</h2>
              <div className="space-y-3">
                {curriculum.map((mod, idx) => (
                  <div 
                    key={mod.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      mod.completed 
                        ? 'bg-slate-900/60 border-brand-success/20 text-gray-400' 
                        : mod.locked
                          ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-white/5 border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-lg">
                        {mod.completed ? <FaCheckCircle className="text-brand-success" /> : getTypeIcon(mod.type)}
                      </div>
                      <div>
                        <h4 className={`font-semibold ${mod.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {idx + 1}. {mod.title}
                        </h4>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{mod.type} • {mod.duration}</span>
                      </div>
                    </div>
                    <div>
                      {mod.locked ? (
                        <FaLock className="text-gray-600" />
                      ) : mod.completed ? (
                        <span className="text-xs text-brand-success font-bold">Completed</span>
                      ) : (
                        <button onClick={() => navigate('/problem/two-sum')} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stats & Premium */}
          <div className="space-y-6">
            
            {/* Progress Card */}
            <div className="bg-brand-card border border-white/5 p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full -mr-10 -mt-10" />
              
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">Your Progress</h3>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-black text-white">{progressPercent}%</span>
                  <span className="text-xs text-gray-400 mb-1">{completedCount} of {curriculum.length} completed</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Total Duration</span>
                  <span className="text-white font-bold">~3.5 Hours</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Difficulty</span>
                  <span className="text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Intermediate</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">XP Reward</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><FaTrophy className="text-xs"/> +450 XP</span>
                </div>
              </div>
              
              <button onClick={() => navigate('/problem/two-sum')} className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex justify-center items-center space-x-2">
                <FaPlayCircle /> <span>Resume Learning</span>
              </button>
            </div>

            {/* Premium Upsell */}
            <div className="bg-gradient-to-br from-slate-900 to-black border border-brand-accent/20 p-6 rounded-2xl text-center space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-accent/5 backdrop-blur-sm" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto border border-brand-accent/20">
                  <FaLock className="text-xl text-brand-accent" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Premium Features Locked</h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">Upgrade to Pro to access 1-on-1 AI mentorship, detailed video breakdowns, and advanced placement tracking for this module.</p>
                </div>
                <button className="w-full py-2.5 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent text-sm font-bold rounded-lg border border-brand-accent/30 transition-all">
                  Upgrade to Pro
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default FeatureMockView;
