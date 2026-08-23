import React, { useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { FaCrosshairs, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SkillGap = () => {
  const { dashboardStats, fetchDashboardStats } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (!dashboardStats) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Analyzing Skill Gaps...</p>
        </div>
      </div>
    );
  }

  const { placementReadiness, biggestBottleneck } = dashboardStats;
  const breakdown = placementReadiness.breakdown || {};

  const getStatus = (score) => {
    if (score < 40) return { label: 'Danger', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/20', bgBase: 'bg-red-500/10' };
    if (score < 70) return { label: 'Warning', color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20', bgBase: 'bg-amber-500/10' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', bgBase: 'bg-emerald-500/10' };
  };

  const allCategories = [
    { key: 'DSA', name: 'DSA' },
    { key: 'CS Fundamentals', name: 'CS Fundamentals' },
    { key: 'Projects', name: 'Projects' },
    { key: 'Development', name: 'Development Skills' },
    { key: 'Aptitude', name: 'Aptitude' },
    { key: 'CT', name: 'Mathematics' },
    { key: 'AI/GenAI', name: 'AI / GenAI' },
    { key: 'Resume', name: 'Resume' },
    { key: 'Interview', name: 'Interview' },
    { key: 'Communication', name: 'Communication' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <FaCrosshairs className="text-brand-accent" />
            <span>AI Skill Gap Analyzer</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Understand exactly what is stopping you from becoming placement-ready.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Placement Readiness</p>
          <div className="flex items-center space-x-3 justify-end">
            <div className="w-32 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5 hidden md:block">
              <div className="h-full bg-brand-primary" style={{ width: `${placementReadiness.overall}%` }} />
            </div>
            <span className="text-4xl font-extrabold text-white">{placementReadiness.overall}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. CATEGORY BREAKDOWN LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white mb-4">Detailed Breakdown</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCategories.map((cat, idx) => {
              const score = breakdown[cat.key] || 0;
              const status = getStatus(score);
              return (
                <div 
                  key={idx} 
                  onClick={() => navigate(`/feature/skill-gap/${cat.key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
                  className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between hover:border-brand-primary/50 hover:bg-brand-card cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-bold text-gray-300 uppercase tracking-wider group-hover:text-white transition-colors">{cat.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${status.bgBase} ${status.text} ${status.border}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-black text-white">{score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${status.color}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. BIGGEST BOTTLENECK SIDEBAR */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">AI Analysis</h2>
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-brand-warning/20 relative overflow-hidden flex flex-col justify-between h-auto shadow-2xl shadow-brand-warning/5">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-warning/10 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-6">
                <FaExclamationTriangle className="text-brand-warning" />
                <h2 className="text-sm font-bold text-white tracking-tight uppercase">Your Biggest Bottleneck</h2>
              </div>
              
              <h3 className="text-3xl font-black text-brand-warning mb-4">
                {biggestBottleneck?.name || 'Loading'}
              </h3>
              
              <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Why?</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {biggestBottleneck?.reason}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Action:</p>
                {biggestBottleneck?.recommendations?.map((rec, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm text-gray-300">
                    <span className="text-brand-accent font-black mt-0.5">→</span>
                    <span className="font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/roadmap')}
              className="relative z-10 w-full py-3.5 bg-brand-warning/10 hover:bg-brand-warning/20 border border-brand-warning/30 text-brand-warning text-sm font-bold rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-brand-warning/10"
            >
              Start Fixing This
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillGap;
