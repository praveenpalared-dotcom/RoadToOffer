import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { FaLock, FaLockOpen, FaChevronRight, FaGraduationCap, FaCertificate, FaCrown } from 'react-icons/fa';

const Roadmap = () => {
  const { roadmapTracks, roadmapTopics, fetchRoadmap } = useProgress();
  const navigate = useNavigate();
  const [bypassLock, setBypassLock] = useState(false);
  const [activeTrack, setActiveTrack] = useState('TRACK C — DSA');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  // Use default fallback if roadmapTracks is empty
  const tracks = roadmapTracks?.length > 0 
    ? roadmapTracks 
    : [{ name: 'TRACK C — DSA', description: 'Data Structures and Algorithms' }];

  // Extract topics for the active track, sorted by order
  const activeTopics = roadmapTopics
    .filter(t => t.track === activeTrack || (!t.track && activeTrack === 'TRACK C — DSA'))
    .sort((a, b) => a.order - b.order);

  // Extract unique phases for the active track in order of appearance
  const phases = [];
  const phaseColors = [
    { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500' },
    { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500' },
    { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-500' },
    { color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', dot: 'bg-sky-500' },
    { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-500' },
    { color: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-500' }
  ];

  activeTopics.forEach(t => {
    if (!phases.find(p => p.name === t.phase)) {
      const pIndex = phases.length % phaseColors.length;
      phases.push({ name: t.phase, ...phaseColors[pIndex] });
    }
  });

  // Helper: compute stats per phase
  const getPhaseStats = (phaseName) => {
    const phaseTopics = activeTopics.filter(t => t.phase === phaseName);
    const total = phaseTopics.reduce((sum, t) => sum + t.totalProblems, 0);
    const completed = phaseTopics.reduce((sum, t) => sum + t.completedProblems, 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : (phaseTopics.length > 0 && total === 0 ? 100 : 0);
    return { total, completed, percent };
  };

  // Determine locks (An array of lock statuses: index 0 is always false, index i is locked if index i-1 is < 80%)
  const phaseLocks = [];
  phases.forEach((p, idx) => {
    if (idx === 0) {
      phaseLocks.push(false);
    } else {
      const prevStats = getPhaseStats(phases[idx - 1].name);
      const isLocked = prevStats.percent < 80;
      phaseLocks.push(isLocked);
    }
  });

  const handleTopicClick = (slug, isLocked) => {
    if (isLocked && !bypassLock) return;
    navigate(`/topic/${slug}`);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Mastered':
        return 'bg-brand-success/15 text-brand-success border-brand-success/25';
      case 'In Progress':
        return 'bg-brand-warning/15 text-brand-warning border-brand-warning/25 animate-pulse';
      default:
        return 'bg-white/5 text-gray-500 border-white/5';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar: Track Selection */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-2 overflow-x-auto md:overflow-visible flex md:flex-col pb-4 md:pb-0 hide-scrollbar">
        {tracks.map(track => (
          <button
            key={track.name}
            onClick={() => setActiveTrack(track.name)}
            className={`text-left px-4 py-3 rounded-xl border transition-all flex-shrink-0 md:flex-shrink whitespace-nowrap md:whitespace-normal text-sm font-semibold ${
              activeTrack === track.name
                ? 'bg-brand-card border-brand-accent/50 text-brand-accent shadow-[0_0_15px_rgba(100,108,255,0.15)]'
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {track.name.replace(/TRACK [A-Z] — /, '')}
          </button>
        ))}
      </div>

      {/* Main Content: Phases & Topics */}
      <div className="flex-1 space-y-8 min-w-0">
        
        {/* Header and bypass */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between border-b border-white/5 pb-5 space-y-4 xl:space-y-0">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{activeTrack}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {tracks.find(t => t.name === activeTrack)?.description || 'Master this track phase-by-phase.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 px-4 py-2.5 rounded-xl w-fit">
            <input
              type="checkbox"
              id="bypass"
              checked={bypassLock}
              onChange={(e) => setBypassLock(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="bypass" className="text-xs font-bold text-gray-400 cursor-pointer select-none">
              🔓 Bypass Lock Rules
            </label>
          </div>
        </div>

        {/* Grid of Phase Modules */}
        <div className="space-y-12">
          {phases.length === 0 && (
            <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500">No topics added to this track yet.</p>
            </div>
          )}
          {phases.map((phase, pIndex) => {
            const stats = getPhaseStats(phase.name);
            const isLocked = phaseLocks[pIndex] && !bypassLock;
            const phaseTopics = activeTopics.filter(t => t.phase === phase.name);

            return (
              <div 
                key={phase.name} 
                className={`space-y-4 transition-all duration-300 ${isLocked ? 'opacity-40' : 'opacity-100'}`}
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${phase.color} flex items-center space-x-1.5`}>
                      <span className={`w-2 h-2 rounded-full ${phase.dot}`} />
                      <span>Phase {pIndex + 1}: {phase.name}</span>
                    </span>
                    
                    {isLocked ? (
                      <span className="flex items-center text-xs text-brand-danger font-semibold space-x-1">
                        <FaLock className="text-[10px]" />
                        <span>Locked (Requires 80% in Phase {pIndex})</span>
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-brand-success font-semibold space-x-1">
                        <FaLockOpen className="text-[10px]" />
                        <span>Unlocked</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-semibold text-gray-400 mt-2 sm:mt-0">
                    <span>{stats.completed} / {stats.total} Problems</span>
                    <span className="text-white bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                      {stats.percent}% Finished
                    </span>
                  </div>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {phaseTopics.map((topic) => {
                    return (
                      <div
                        key={topic.slug}
                        onClick={() => handleTopicClick(topic.slug, isLocked)}
                        className={`group p-5 rounded-2xl border transition-all duration-200 ${
                          isLocked 
                            ? 'bg-brand-card/20 border-white/5 cursor-not-allowed'
                            : 'bg-brand-card/50 hover:bg-brand-card border-white/5 hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white group-hover:text-brand-accent transition-colors">
                              {topic.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">
                              {topic.completedProblems} of {topic.totalProblems} solved
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeStyle(topic.status)}`}>
                            {topic.status}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full progress-bar-fill ${
                                topic.percentage === 100 ? 'bg-brand-success' : 'bg-brand-accent'
                              }`}
                              style={{ width: `${topic.percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-gray-400">
                            <span>Mastery</span>
                            <span>{topic.percentage}%</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
