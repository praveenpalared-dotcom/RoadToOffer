import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPlay, FaCheckCircle, FaLock, FaBrain, FaClock, FaTrophy } from 'react-icons/fa';

const GritCenter = () => {
  const { token } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/assessments', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setAssessments(data.assessments || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAttempts = async () => {
    try {
      const res = await fetch('/api/assessments/attempts/history', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([fetchAssessments(), fetchAttempts()]).then(() => setLoading(false));
  }, [token]);

  const startTest = (assessment) => {
    setActiveTest(assessment);
    setAnswers({});
    setResult(null);
  };

  const handleOptionSelect = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const submitTest = async () => {
    try {
      const res = await fetch(`/api/assessments/${activeTest._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      setResult(data);
      fetchAttempts();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // TEST TAKING VIEW
  if (activeTest && !result) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{activeTest.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{activeTest.type} Assessment • {activeTest.durationMinutes} Minutes</p>
          </div>
          <button 
            onClick={() => setActiveTest(null)}
            className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg text-sm hover:bg-slate-700 font-semibold"
          >
            Cancel Test
          </button>
        </div>

        <div className="space-y-8">
          {activeTest.questions.map((q, index) => (
            <div key={index} className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5">
              <h3 className="text-white font-semibold mb-4">
                <span className="text-brand-accent mr-2">{index + 1}.</span> {q.questionText}
              </h3>
              <div className="space-y-3">
                {q.options.map((opt, oIdx) => (
                  <div 
                    key={oIdx}
                    onClick={() => handleOptionSelect(index, opt)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      answers[index] === opt 
                        ? 'bg-brand-accent/20 border-brand-accent text-white'
                        : 'bg-slate-900 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={submitTest}
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/25 hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <FaCheckCircle />
            <span>Submit Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  // RESULT VIEW
  if (activeTest && result) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="bg-brand-card/80 p-10 rounded-3xl glass-panel border border-white/5 space-y-6">
          <div className="w-20 h-20 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrophy className="text-4xl text-brand-success" />
          </div>
          <h2 className="text-3xl font-black text-white">Assessment Complete!</h2>
          <p className="text-gray-400">You scored <span className="text-white font-bold">{result.score}%</span> on {activeTest.title}.</p>
          
          <div className="flex justify-center space-x-8 py-6 border-y border-white/10">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Correct</p>
              <p className="text-2xl text-white font-bold">{result.correctCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Total</p>
              <p className="text-2xl text-white font-bold">{result.totalQuestions}</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setActiveTest(null);
              setResult(null);
            }}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors w-full"
          >
            Return to Exam Center
          </button>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD VIEW
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3">
          <FaBrain className="text-brand-accent text-3xl" />
          <span>CT & Grit Exam Center</span>
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-2xl">
          Test your Computational Thinking, Core CS knowledge, and problem-solving grit under timed conditions. Your scores directly impact your Placement Readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Available Assessments */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-white">Available Assessments</h3>
          
          {assessments.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-brand-card/30">
              <p className="text-gray-500">No assessments available right now. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map(a => {
                const pastAttempt = attempts.find(att => att.assessmentId === a._id);
                return (
                  <div key={a._id} className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-brand-accent bg-brand-primary/10 px-2 py-1 rounded uppercase tracking-wide">
                          {a.type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <FaClock />
                          <span>{a.durationMinutes}m</span>
                        </span>
                      </div>
                      <h4 className="text-white font-bold mb-1">{a.title}</h4>
                      <p className="text-xs text-gray-400">{a.questions.length} Questions</p>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                      {pastAttempt ? (
                        <div className="text-xs">
                          <span className="text-gray-500">Previous Score: </span>
                          <span className={`font-bold ${pastAttempt.score >= 80 ? 'text-brand-success' : 'text-brand-warning'}`}>
                            {pastAttempt.score}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Not attempted yet</span>
                      )}
                      
                      <button 
                        onClick={() => startTest(a)}
                        className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-accent flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        <FaPlay className="text-[10px] ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History / Stats */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-white">Your History</h3>
          <div className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 space-y-4">
            {attempts.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No exams taken yet.</p>
            ) : (
              attempts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(att => {
                const test = assessments.find(a => a._id === att.assessmentId);
                return (
                  <div key={att._id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-300">{test ? test.title : 'Unknown Test'}</p>
                      <p className="text-[10px] text-gray-500">{new Date(att.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-sm font-bold ${att.score >= 80 ? 'text-brand-success' : 'text-brand-warning'}`}>
                      {att.score}%
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GritCenter;
