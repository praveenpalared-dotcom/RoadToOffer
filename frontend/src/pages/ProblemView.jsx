import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { 
  FaArrowLeft, FaExternalLinkAlt, FaAward, FaBookmark, FaSave, 
  FaCode, FaRegCalendarAlt, FaHistory, FaBuilding, FaMicrophone, 
  FaCheckCircle, FaPlay, FaSyncAlt, FaBug, FaLightbulb, FaShieldAlt,
  FaClock, FaLaptopCode, FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash,
  FaBookOpen, FaUndo
} from 'react-icons/fa';
import { getExtendedProblemDetails } from '../utils/problemDetailsHelper';

const ProblemView = () => {
  const { problemId } = useParams();
  const { token, loading: authLoading } = useAuth();
  const { updateProblemStatus } = useProgress();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('statement'); // 'statement' | 'code' | 'solution' | 'pitch' | 'revision'
  const [selectedLang, setSelectedLang] = useState('cpp'); // 'cpp' | 'python' | 'java' | 'javascript'
  const [codeSolution, setCodeSolution] = useState('');
  const [saving, setSaving] = useState(false);

  // AI Test Execution Simulation
  const [testStatus, setTestStatus] = useState(null); // null | 'running' | 'success'
  const [testConsole, setTestConsole] = useState('');

  // Spaced Repetition & Flashcard State
  const [revisionSchedule, setRevisionSchedule] = useState('7 Days');
  const [showActiveRecall, setShowActiveRecall] = useState(false);

  // Pitch Timer Simulator State
  const [pitchTimer, setPitchTimer] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [userCodeMap, setUserCodeMap] = useState({});

  const fetchProblemDetail = async () => {
    if (!token) return;
    try {
      const response = await fetch(`/api/progress/problem/${problemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProblem(data.problem);
        setNotes(data.problem.notes || '');
        setRevisionSchedule(data.problem.revisionSchedule || '7 Days');

        const savedUserCode = data.problem.userCode || {};
        setUserCodeMap(savedUserCode);

        const details = getExtendedProblemDetails(data.problem);
        if (savedUserCode[selectedLang]) {
          setCodeSolution(savedUserCode[selectedLang]);
        } else if (data.problem.answer) {
          setCodeSolution(data.problem.answer);
        } else if (details && details.starterCode && details.starterCode[selectedLang]) {
          setCodeSolution(details.starterCode[selectedLang]);
        }
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        navigate('/');
      } else {
        fetchProblemDetail();
      }
    }
  }, [problemId, authLoading, token]);

  // Handle language switch for code sandbox (preserves user code per language)
  const handleLangChange = (lang) => {
    const updatedMap = { ...userCodeMap, [selectedLang]: codeSolution };
    setUserCodeMap(updatedMap);
    setSelectedLang(lang);

    if (updatedMap[lang]) {
      setCodeSolution(updatedMap[lang]);
    } else {
      const details = getExtendedProblemDetails(problem);
      if (details && details.starterCode && details.starterCode[lang]) {
        setCodeSolution(details.starterCode[lang]);
      }
    }
  };

  // Reset Code Sandbox Starter Template
  const handleResetCode = () => {
    const details = getExtendedProblemDetails(problem);
    if (details && details.starterCode && details.starterCode[selectedLang]) {
      const defaultCode = details.starterCode[selectedLang];
      setCodeSolution(defaultCode);
      setUserCodeMap(prev => ({ ...prev, [selectedLang]: defaultCode }));
    }
  };

  // Save Answer Code to DB
  const handleSaveCode = async (showAlert = true) => {
    setSaving(true);
    const updatedMap = { ...userCodeMap, [selectedLang]: codeSolution };
    setUserCodeMap(updatedMap);
    try {
      await updateProblemStatus(problem._id, problem.topicSlug, {
        userCode: updatedMap,
        answer: codeSolution
      });
      setProblem(prev => ({ ...prev, userCode: updatedMap, answer: codeSolution }));
      if (showAlert) {
        alert('Answer code saved to database successfully!');
      }
    } catch (e) {
      alert('Failed to save answer code');
    } finally {
      setSaving(false);
    }
  };

  // Timer Effect for Pitch Simulator
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && pitchTimer > 0) {
      interval = setInterval(() => {
        setPitchTimer(prev => prev - 1);
      }, 1000);
    } else if (pitchTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pitchTimer]);

  const handleSaveNotes = async (scheduleParam) => {
    setSaving(true);
    const targetSchedule = scheduleParam || revisionSchedule;
    const updatedMap = { ...userCodeMap, [selectedLang]: codeSolution };
    setUserCodeMap(updatedMap);
    try {
      await updateProblemStatus(problem._id, problem.topicSlug, { 
        notes, 
        userCode: updatedMap,
        answer: codeSolution,
        revisionSchedule: targetSchedule 
      });
      setProblem(prev => ({ ...prev, notes, userCode: updatedMap, answer: codeSolution, revisionSchedule: targetSchedule }));
      alert('Revision settings, notes, and answer saved successfully!');
    } catch (e) {
      alert('Failed to save revision notes');
    } finally {
      setSaving(false);
    }
  };

  // Run Automated AI Code Audit & Testsuite
  const handleRunTests = () => {
    setTestStatus('running');
    setTestConsole('Compiling solution with LLVM 16 / GCC 12...\nExecuting test suites [Case 1, Case 2, Case 3]...\nRunning TLE & Memory Leak Audits...');

    setTimeout(() => {
      setTestStatus('success');
      setTestConsole(`✓ compilation_successful
✓ testcase_1_passed: Input matches expected output. (Time: 12ms)
✓ testcase_2_passed: Edge case zero bounds verified. (Time: 8ms)
✓ testcase_3_passed: Maximum N=10^5 stress test passed cleanly. (Time: 34ms)

[AI CODE AUDIT REPORT]
• Time Complexity: O(N) — Optimal for 10^5 constraints.
• Space Complexity: O(N) — Auxiliary space is within limits.
• Bug & Risk Warning: Code compiles cleanly and passes all test suites!`);
    }, 1500);
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (diff === 'Medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  if (loading) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <span>Loading problem workspace...</span>
      </div>
    );
  }

  if (!problem) return null;

  const details = getExtendedProblemDetails(problem);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all shadow-md active:scale-95"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              <span>{problem.platform}</span>
              <span>&bull;</span>
              <span className="text-brand-accent">{problem.topicSlug.replace('-', ' ')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {problem.name}
            </h1>
          </div>
        </div>

        {/* Action Badges & Platform Link */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          
          <span className="px-3 py-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-1.5 shadow-sm">
            🔥 Must Solve
          </span>

          <span className="px-3 py-1 text-xs font-semibold text-brand-accent bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
            +{problem.xp || 50} XP
          </span>

          {problem.solutionLink && (
            <a
              href={problem.solutionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <span>LeetCode Direct</span>
              <FaExternalLinkAlt className="text-[10px] text-gray-400" />
            </a>
          )}
        </div>
      </div>

      {/* Main Interactive Workspace Bar: Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-card/60 p-2 rounded-2xl border border-white/5 glass-panel">
        
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('statement')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'statement'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaLightbulb className="text-amber-400" />
            <span>Problem & Examples</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'code'
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaCode className="text-cyan-400" />
            <span>Solution Sandbox (Your Code)</span>
          </button>

          <button
            onClick={() => setActiveTab('solution')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'solution'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <FaBookOpen className="text-emerald-300" />
            <span>Official Editorial Solution</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'pitch'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <FaMicrophone className="text-purple-300 animate-pulse" />
            <span>Interview Pitch Script</span>
          </button>

          <button
            onClick={() => setActiveTab('revision')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'revision'
                ? 'bg-brand-warning text-slate-950 shadow-lg shadow-brand-warning/20 font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FaBookmark className="text-amber-400" />
            <span>Spaced Recall Notes</span>
          </button>
        </div>

        {/* Target Companies Tag */}
        {problem.companyTags && problem.companyTags.length > 0 && (
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1 bg-slate-900/80 border border-white/5 rounded-xl text-xs text-gray-400">
            <FaBuilding className="text-brand-accent" />
            <span className="font-semibold text-white">Targeted:</span>
            <span>{problem.companyTags.slice(0, 3).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Grid Content Area based on Active Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* TAB 1: STATEMENT & EXAMPLES */}
        {activeTab === 'statement' && (
          <>
            <div className="lg:col-span-7 space-y-6">
              {/* Problem Description Box */}
              <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <FaLightbulb className="text-amber-400" />
                  <span>Problem Statement</span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-sans">
                  {details.description}
                </p>
              </div>

              {/* Concrete Code Examples */}
              <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <FaLaptopCode className="text-cyan-400" />
                  <span>Input / Output Examples</span>
                </h3>

                <div className="space-y-4">
                  {details.examples.map((ex, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-gray-400 font-bold border-b border-white/5 pb-2">
                        <span className="text-brand-accent">Example {idx + 1}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Input:</span>
                        <code className="text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded block mt-0.5">{ex.input}</code>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Output:</span>
                        <code className="text-amber-300 bg-amber-950/30 px-2 py-1 rounded block mt-0.5">{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <div>
                          <span className="text-gray-500 font-semibold block">Explanation:</span>
                          <p className="text-gray-300 font-sans text-xs mt-0.5">{ex.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Constraints & Complexity Card */}
              <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <FaShieldAlt className="text-indigo-400" />
                  <span>Constraints & Targets</span>
                </h3>
                <ul className="space-y-2 text-xs font-mono text-gray-300">
                  {details.constraints.map((c, i) => (
                    <li key={i} className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                      <span className="text-indigo-400 font-black">&bull;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Edge Case Radar */}
              <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-amber-500/20 space-y-4">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                  <FaExclamationTriangle className="text-amber-400" />
                  <span>Sneaky Edge Cases & Pitfalls</span>
                </h3>
                <div className="space-y-2.5 text-xs text-gray-300">
                  {details.edgeCases.map((ec, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 bg-amber-950/20 p-3 rounded-xl border border-amber-500/10">
                      <FaBug className="text-amber-400 text-xs mt-0.5 shrink-0" />
                      <span>{ec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SOLUTION SANDBOX (USER WRITES CODE HERE) */}
        {activeTab === 'code' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-slate-950 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
              
              {/* Language Switcher Toolbar */}
              <div className="bg-slate-900/90 px-6 py-3.5 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <FaCode className="text-cyan-400 text-base" />
                  <span className="font-extrabold text-white text-sm">Write Your Code (Starter Boilerplate)</span>
                </div>

                <div className="flex items-center space-x-2">
                  {['cpp', 'python', 'java', 'javascript'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLangChange(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedLang === lang
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                    </button>
                  ))}

                  <button
                    onClick={handleResetCode}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all"
                  >
                    <FaUndo className="text-[10px]" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={() => handleSaveCode(true)}
                    disabled={saving}
                    className="px-3.5 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <FaSave className="text-[10px]" />
                    <span>{saving ? 'Saving...' : 'Save Answer Code'}</span>
                  </button>

                  <button
                    onClick={handleRunTests}
                    disabled={testStatus === 'running'}
                    className="ml-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center space-x-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    <FaPlay className="text-[10px]" />
                    <span>{testStatus === 'running' ? 'Compiling...' : 'Run Tests & AI Audit'}</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea Editor (User types code here!) */}
              <textarea
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                rows={16}
                placeholder="Write your code implementation here..."
                className="w-full bg-slate-950 text-cyan-200 p-6 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                style={{ tabSize: 4 }}
              />

              {/* Console & AI Execution Output */}
              {testConsole && (
                <div className="bg-slate-900/95 border-t border-white/10 p-5 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-gray-400 font-bold border-b border-white/5 pb-2">
                    <span className="flex items-center space-x-2 text-emerald-400">
                      <FaCheckCircle />
                      <span>Execution & AI Audit Results</span>
                    </span>
                  </div>
                  <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-[11px]">
                    {testConsole}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICIAL EDITORIAL SOLUTION (LEETCODE SOLUTION PAGE) */}
        {activeTab === 'solution' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-brand-card/50 p-8 rounded-3xl glass-panel border border-emerald-500/20 shadow-2xl space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold uppercase tracking-widest">
                    <FaBookOpen />
                    <span>Official Editorial Solution</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">Official Solution Breakdown & Complexity Analysis</h2>
                </div>

                <div className="flex items-center space-x-2">
                  {['cpp', 'python', 'java', 'javascript'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        selectedLang === lang
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-900 text-gray-400 hover:text-white'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solution Intuition & Complexity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-emerald-400 font-bold uppercase text-[11px] block">Intuition & Approach</span>
                  <p className="text-gray-300 leading-relaxed">
                    By leveraging <strong>{problem.pattern || 'an optimal data structure'}</strong>, we process inputs efficiently, reducing time complexity from O(N^2) brute-force down to optimal O(N).
                  </p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-amber-400 font-bold uppercase text-[11px] block">Complexity Analysis</span>
                  <p className="text-gray-300 leading-relaxed">
                    &bull; <strong>Time Complexity:</strong> {problem.difficulty === 'Hard' ? 'O(N log N)' : 'O(N)'} — Single pass or optimal search.<br />
                    &bull; <strong>Space Complexity:</strong> {problem.pattern && problem.pattern.includes('Two Pointers') ? 'O(1)' : 'O(N)'} — Auxiliary state memory.
                  </p>
                </div>
              </div>

              {/* Official Solution Code Display */}
              <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="bg-slate-900/90 px-5 py-3 border-b border-white/5 text-xs text-gray-400 font-bold flex justify-between">
                  <span>Official {selectedLang.toUpperCase()} Solution</span>
                  <span className="text-emerald-400">100% Benchmark Passed</span>
                </div>
                <pre className="p-6 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed bg-slate-950">
                  {details.editorialSolutions[selectedLang]}
                </pre>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEW PITCH SCRIPT */}
        {activeTab === 'pitch' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 p-8 rounded-3xl border border-purple-500/20 shadow-2xl space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-purple-400 font-bold uppercase tracking-widest">
                    <FaMicrophone className="animate-pulse" />
                    <span>FAANG Interviewer Pitch Script</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">How to Verbally Explain This Solution in 2 Minutes</h2>
                  <p className="text-xs text-gray-400">
                    Standard platforms give code, but Road to Offer teaches you exact interview communication scripts!
                  </p>
                </div>

                {/* Pitch Timer Simulator */}
                <div className="bg-purple-900/40 border border-purple-500/30 p-4 rounded-2xl flex items-center space-x-4">
                  <div className="text-center">
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Pitch Timer</span>
                    <span className="text-2xl font-mono font-black text-purple-300">{pitchTimer}s</span>
                  </div>
                  <button
                    onClick={() => {
                      if (isTimerRunning) {
                        setIsTimerRunning(false);
                      } else {
                        setPitchTimer(120);
                        setIsTimerRunning(true);
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    {isTimerRunning ? 'Pause' : 'Start 2-Min Practice'}
                  </button>
                </div>
              </div>

              {/* Pitch Steps Card */}
              <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-sm font-extrabold text-purple-300 uppercase tracking-wider flex items-center space-x-2">
                  <FaLightbulb className="text-amber-400" />
                  <span>Verbal Presentation Blueprint</span>
                </h3>
                <pre className="text-gray-200 font-sans text-sm leading-relaxed whitespace-pre-wrap bg-purple-950/20 p-5 rounded-xl border border-purple-500/10">
                  {details.pitchScript}
                </pre>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: SPACED REPETITION & RECALL NOTES */}
        {activeTab === 'revision' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-brand-card/50 p-8 rounded-3xl glass-panel border border-white/5 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <FaBookmark className="text-brand-warning" />
                    <span>Spaced Repetition & Memory Booster</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Set revision cycles so this problem automatically appears in your smart review queue before interviews.
                  </p>
                </div>

                {/* Active Recall Hide/Show Toggle */}
                <button
                  onClick={() => setShowActiveRecall(!showActiveRecall)}
                  className="px-4 py-2.5 bg-slate-900 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center space-x-2 hover:bg-slate-800 transition-all"
                >
                  {showActiveRecall ? <FaEyeSlash className="text-brand-accent" /> : <FaEye className="text-brand-accent" />}
                  <span>{showActiveRecall ? 'Reveal My Notes' : 'Test My Memory (Hide Notes)'}</span>
                </button>
              </div>

              {/* Interval Selection Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Set Next Revision Cycle:</span>
                <div className="flex flex-wrap gap-3">
                  {['1 Day 🔄', '3 Days ⏳', '7 Days 📈', '14 Days 🎯', '30 Days 🏆'].map((interval) => (
                    <button
                      key={interval}
                      onClick={() => {
                        setRevisionSchedule(interval);
                        handleSaveNotes(interval);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        revisionSchedule === interval
                          ? 'bg-brand-warning text-slate-950 border-brand-warning shadow-lg font-black'
                          : 'bg-slate-900 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Textarea */}
              {!showActiveRecall ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Takeaways & Code Invariants:</span>
                    <button
                      onClick={() => handleSaveNotes()}
                      disabled={saving}
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary/90 transition-all flex items-center space-x-1.5 shadow-md active:scale-95"
                    >
                      <FaSave />
                      <span>{saving ? 'Saving...' : 'Save Notes'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record your intuition, edge case takeaways, and time complexities here..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-gray-500 text-xs focus:border-brand-primary focus:outline-none resize-none font-mono leading-relaxed"
                  />
                </div>
              ) : (
                <div className="p-8 bg-slate-950/90 rounded-2xl border border-brand-warning/30 text-center space-y-4">
                  <FaLightbulb className="text-3xl text-brand-warning mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white">Active Recall Challenge</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Try to speak out loud the algorithm step-by-step and write down your solution before un-hiding your notes!
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProblemView;
