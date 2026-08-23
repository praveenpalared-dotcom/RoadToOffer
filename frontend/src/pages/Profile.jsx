import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import LeetCodeCard from '../components/LeetCodeCard';
import CodeforcesCard from '../components/CodeforcesCard';
import { FaUserCircle, FaTrophy, FaMedal, FaCrown, FaCheck, FaExclamationTriangle, FaTimes, FaRedo, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import { GiDiamondRing, GiCrown } from 'react-icons/gi';

const Profile = () => {
  const { user, resetProgress } = useAuth();
  const { roadmapTopics } = useProgress();
  const [resetting, setResetting] = useState(false);

  // Dynamic Metrics: Strongest and Weakest topics
  const getStrongestTopic = () => {
    if (roadmapTopics.length === 0) return 'None';
    const sorted = [...roadmapTopics]
      .filter(t => t.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);
    return sorted.length > 0 ? `${sorted[0].name} (${sorted[0].percentage}%)` : 'None';
  };

  const getWeakestTopic = () => {
    if (roadmapTopics.length === 0) return 'None';
    const sorted = [...roadmapTopics]
      .filter(t => t.percentage < 100)
      .sort((a, b) => a.percentage - b.percentage);
    return sorted.length > 0 ? `${sorted[0].name} (${sorted[0].percentage}%)` : 'None';
  };

  const handleReset = async () => {
    const confirm = window.confirm(
      '⚠️ WARNING: This will permanently delete all your solved problem logs, streaks, and reset your level back to 1. Are you sure you want to start over?'
    );
    if (!confirm) return;

    setResetting(true);
    try {
      await resetProgress();
      alert('Your progress has been completely reset.');
      window.location.reload();
    } catch (err) {
      alert('Progress reset failed: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  // Badges Definitions
  const allBadges = [
    { name: 'Bronze', title: 'Bronze Challenger', desc: 'Completed Foundation Phase', icon: <FaMedal className="text-amber-500 text-4xl" /> },
    { name: 'Silver', title: 'Silver Competitor', desc: 'Completed Problem Solving Phase', icon: <FaMedal className="text-gray-300 text-4xl" /> },
    { name: 'Gold', title: 'Gold Champion', desc: 'Completed Trees Phase', icon: <FaTrophy className="text-yellow-400 text-4xl" /> },
    { name: 'Platinum', title: 'Platinum Tactician', desc: 'Completed Graphs Phase', icon: <FaCrown className="text-teal-300 text-4xl" /> },
    { name: 'Diamond', title: 'Diamond Specialist', desc: 'Completed Dynamic Programming Phase', icon: <GiDiamondRing className="text-blue-300 text-4xl animate-pulse" /> },
    { name: 'Grandmaster', title: 'RoadToOffer Grandmaster', desc: 'Mastered Entire Roadmap', icon: <GiCrown className="text-red-500 text-4xl" /> }
  ];

  const earnedBadges = user?.badges || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      
      <div className="border-b border-white/5 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight font-sans">Student Profile</h2>
        <p className="text-xs text-gray-400">Review your achievements, badges, dynamic strengths, and LeetCode integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & settings (Width 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full" />
            
            <div className="flex justify-center mb-4">
              <FaUserCircle className="text-8xl text-slate-700 bg-white/5 rounded-full" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">{user?.name || 'Candidate'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email || ''}</p>

            <div className="mt-4 inline-flex items-center space-x-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>{earnedBadges.includes('Grandmaster') ? 'Grandmaster' : 'Candidate'}</span>
            </div>

            {/* General Counts */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5 text-xs">
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold block uppercase">Level</span>
                <span className="text-lg font-bold text-white">{user?.level || 1}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold block uppercase">XP earned</span>
                <span className="text-lg font-bold text-white">{user?.xp || 0}</span>
              </div>
            </div>
          </div>

          {/* Settings Control Card */}
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Settings</h3>
            
            {/* Danger: Reset */}
            <button
              onClick={handleReset}
              disabled={resetting}
              className="w-full py-3 bg-brand-danger/10 hover:bg-brand-danger/20 border border-brand-danger/20 text-brand-danger rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <FaRedo className="text-[10px]" />
              <span>{resetting ? 'Resetting Data...' : 'Reset All Progress'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Platform Sync (LeetCode & Codeforces), Statistics & Badges (Width 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* LeetCode Sync Integration Card */}
          <LeetCodeCard />

          {/* Codeforces Sync Integration Card */}
          <CodeforcesCard />

          {/* Dynamic Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strongest topic */}
            <div className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Strongest Topic</h4>
              <p className="text-lg font-extrabold text-brand-success truncate">{getStrongestTopic()}</p>
              <p className="text-[10px] text-gray-400">Your highest completed roadmap section</p>
            </div>

            {/* Weakest topic */}
            <div className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Focus Recommendation</h4>
              <p className="text-lg font-extrabold text-brand-warning truncate">{getWeakestTopic()}</p>
              <p className="text-[10px] text-gray-400"> Roadmap section requiring immediate focus</p>
            </div>

          </div>

          {/* Badges Cabinet */}
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Milestone Achievements Cabinet</h3>
              <p className="text-xs text-gray-400">Unlock these medals by completely finishing phase topics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {allBadges.map((badge) => {
                const isEarned = earnedBadges.includes(badge.name);

                return (
                  <div 
                    key={badge.name} 
                    className={`p-4 rounded-xl border flex items-center space-x-3 transition-all ${
                      isEarned 
                        ? 'bg-slate-900 border-brand-primary/20 shadow-lg shadow-brand-primary/5 hover:scale-[1.02]' 
                        : 'bg-brand-card/10 border-white/5 opacity-40 select-none'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className="flex-shrink-0">
                      {badge.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold truncate ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                        {badge.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{badge.desc}</p>
                      
                      {isEarned ? (
                        <span className="inline-flex items-center space-x-0.5 text-[9px] text-brand-success font-bold mt-1 bg-brand-success/15 px-1.5 py-0.2 rounded-full">
                          <FaCheck className="text-[8px]" />
                          <span>Earned</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-0.5 text-[9px] text-gray-500 font-bold mt-1 bg-white/5 px-1.5 py-0.2 rounded-full">
                          <FaShieldAlt className="text-[8px]" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
