import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCode, FaSync, FaExternalLinkAlt, FaCheckCircle, FaUnlink, FaTrophy, FaChartBar, FaAward } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const LeetCodeCard = () => {
  const { user, syncLeetCodeProfile, disconnectLeetCodeProfile } = useAuth();

  const [inputUsername, setInputUsername] = useState(user?.leetcodeUsername || '');
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(!user?.leetcodeUsername);

  useEffect(() => {
    if (user?.leetcodeUsername) {
      setInputUsername(user.leetcodeUsername);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [user?.leetcodeUsername]);

  const stats = user?.leetcodeStats;

  const handleSync = async (e) => {
    e?.preventDefault();
    if (!inputUsername.trim()) return;
    
    setError('');
    setSuccessMsg('');
    setSyncing(true);

    try {
      const res = await syncLeetCodeProfile(inputUsername.trim());
      setSuccessMsg(res.message || 'LeetCode profile synced successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to sync LeetCode profile');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    const confirm = window.confirm('Are you sure you want to disconnect your LeetCode profile?');
    if (!confirm) return;

    setDisconnecting(true);
    setError('');
    setSuccessMsg('');
    try {
      await disconnectLeetCodeProfile();
      setInputUsername('');
      setIsEditing(true);
      setSuccessMsg('LeetCode account disconnected.');
    } catch (err) {
      setError(err.message || 'Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-5 relative overflow-hidden">
      
      {/* Glow effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <SiLeetcode className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>LeetCode Integration</span>
            </h3>
            <p className="text-xs text-gray-400">Connect your official LeetCode handle to sync ranking & problem counts.</p>
          </div>
        </div>

        {user?.leetcodeUsername ? (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-brand-success bg-brand-success/15 border border-brand-success/20 px-3 py-1 rounded-full self-start sm:self-auto">
            <FaCheckCircle className="text-[10px]" />
            <span>Connected</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
            <span>Not Connected</span>
          </span>
        )}
      </div>

      {/* Error / Success Feedback */}
      {error && (
        <div className="p-3 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-brand-success/10 border border-brand-success/25 text-brand-success text-xs font-semibold rounded-xl flex justify-between items-center">
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mode 1: Connected Profile Card */}
      {user?.leetcodeUsername && !isEditing && stats ? (
        <div className="space-y-5">
          
          {/* User Header Details */}
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-white/5">
            <div className="flex items-center space-x-3">
              {stats.avatar ? (
                <img src={stats.avatar} alt="LeetCode Avatar" className="w-12 h-12 rounded-full border border-amber-500/30 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-black text-lg">
                  {user.leetcodeUsername[0].toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                  <span>{stats.realName || user.leetcodeUsername}</span>
                  <a
                    href={`https://leetcode.com/u/${user.leetcodeUsername}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-amber-400 text-xs transition-colors"
                  >
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </h4>
                <p className="text-xs text-amber-400/90 font-mono">@{user.leetcodeUsername}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs rounded-lg border border-white/10 font-medium transition-all"
              >
                Edit Handle
              </button>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs rounded-lg font-bold flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <FaSync className={`text-[10px] ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Global Rank */}
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Global Rank</span>
              <span className="text-base font-extrabold text-white font-mono">
                #{stats.ranking ? stats.ranking.toLocaleString() : 'N/A'}
              </span>
            </div>

            {/* Total Solved */}
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Total Solved</span>
              <span className="text-base font-extrabold text-amber-400 font-mono">
                {stats.totalSolved}
              </span>
            </div>

            {/* Easy / Medium / Hard */}
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Breakdown</span>
              <div className="flex items-center space-x-1.5 text-xs font-bold font-mono">
                <span className="text-brand-success" title="Easy">{stats.easySolved}E</span>
                <span className="text-gray-600">/</span>
                <span className="text-brand-warning" title="Medium">{stats.mediumSolved}M</span>
                <span className="text-gray-600">/</span>
                <span className="text-brand-danger" title="Hard">{stats.hardSolved}H</span>
              </div>
            </div>

            {/* Contest Rating */}
            <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Contest Rating</span>
              <span className="text-base font-extrabold text-indigo-300 font-mono">
                {stats.contestRating ? stats.contestRating : 'Unrated'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-white/5">
            <span>Last Synced: {new Date(stats.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-red-400 hover:text-red-300 font-semibold flex items-center space-x-1 transition-colors"
            >
              <FaUnlink className="text-[9px]" />
              <span>Disconnect Handle</span>
            </button>
          </div>

        </div>
      ) : (
        /* Mode 2: Connect Form */
        <form onSubmit={handleSync} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">LeetCode Username / Handle</label>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                placeholder="e.g. tourist, neal_wu, hardik..."
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-gray-500 text-xs focus:border-amber-500 focus:outline-none transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={syncing}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center space-x-1.5 transition-all disabled:opacity-50 active:scale-95 flex-shrink-0"
              >
                <FaSync className={`text-xs ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync LeetCode'}</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-400">
            ⚡ <span className="font-bold text-amber-400">+200 XP Bonus</span> awarded on connecting your LeetCode profile!
          </p>

          {user?.leetcodeUsername && (
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-400 hover:text-white font-medium underline"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      )}

    </div>
  );
};

export default LeetCodeCard;
