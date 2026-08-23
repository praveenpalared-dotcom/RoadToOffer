import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCode, FaSync, FaExternalLinkAlt, FaCheckCircle, FaUnlink, FaTrophy, FaChartBar, FaAward } from 'react-icons/fa';

const CodeforcesCard = () => {
  const { user, syncCodeforcesProfile, disconnectCodeforcesProfile } = useAuth();

  const [inputHandle, setInputHandle] = useState(user?.codeforcesHandle || '');
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(!user?.codeforcesHandle);

  useEffect(() => {
    if (user?.codeforcesHandle) {
      setInputHandle(user.codeforcesHandle);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [user?.codeforcesHandle]);

  const stats = user?.codeforcesStats;

  const handleSync = async (e) => {
    e?.preventDefault();
    if (!inputHandle.trim()) return;

    setError('');
    setSuccessMsg('');
    setSyncing(true);

    try {
      const res = await syncCodeforcesProfile(inputHandle.trim());
      setSuccessMsg(res.message || 'Codeforces profile synced successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to sync Codeforces profile');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    const confirm = window.confirm('Are you sure you want to disconnect your Codeforces profile?');
    if (!confirm) return;

    setDisconnecting(true);
    setError('');
    setSuccessMsg('');
    try {
      await disconnectCodeforcesProfile();
      setInputHandle('');
      setIsEditing(true);
      setSuccessMsg('Codeforces account disconnected.');
    } catch (err) {
      setError(err.message || 'Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  const getRankBadgeColor = (rankStr = '') => {
    const r = rankStr.toLowerCase();
    if (r.includes('legendary') || r.includes('grandmaster')) return 'text-red-500 bg-red-500/10 border-red-500/30';
    if (r.includes('master')) return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    if (r.includes('candidate master')) return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
    if (r.includes('expert')) return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    if (r.includes('specialist')) return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
    if (r.includes('pupil')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  };

  return (
    <div className="w-full bg-brand-card/60 p-6 rounded-2xl glass-panel border border-sky-500/20 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Top Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-sky-500/20 to-blue-600/20 rounded-xl border border-sky-500/30">
            <span className="text-xl font-black text-sky-400">CF</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Codeforces Integration</h3>
              {user?.codeforcesHandle && (
                <span className="flex items-center space-x-1 text-[10px] text-brand-success bg-brand-success/15 px-2 py-0.5 rounded-full font-bold border border-brand-success/30">
                  <FaCheckCircle className="text-[10px]" />
                  <span>Connected</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Sync rating, contest handle & competitive stats</p>
          </div>
        </div>

        {user?.codeforcesHandle && !isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-white/10 transition-all disabled:opacity-50"
              title="Refresh Codeforces Data"
            >
              <FaSync className={`text-xs ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            <a
              href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-sky-500/30 transition-all"
            >
              <span>Profile</span>
              <FaExternalLinkAlt className="text-[10px]" />
            </a>

            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-gray-500 hover:text-red-400 p-2 rounded-lg text-xs transition-colors"
              title="Disconnect Profile"
            >
              <FaUnlink />
            </button>
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-3 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger text-xs font-semibold rounded-lg">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-brand-success/10 border border-brand-success/25 text-brand-success text-xs font-semibold rounded-lg flex items-center justify-between">
          <span>{successMsg}</span>
          <span className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full font-bold">+200 XP Bonus!</span>
        </div>
      )}

      {/* Handle Input / Connection Form */}
      {isEditing ? (
        <form onSubmit={handleSync} className="space-y-3 pt-1">
          <label className="text-xs text-gray-300 font-semibold block">
            Enter your Codeforces handle or profile URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="e.g. Tourist or codeforces.com/profile/Tourist"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={syncing || !inputHandle.trim()}
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all disabled:opacity-50 shadow-md shadow-sky-500/20"
              >
                <FaSync className={syncing ? 'animate-spin' : ''} />
                <span>{syncing ? 'Connecting...' : 'Connect Profile'}</span>
              </button>
              {user?.codeforcesHandle && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-xs border border-white/10 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            Connect your Codeforces handle to track rating, max rank, solved count & earn +200 XP instantly.
          </p>
        </form>
      ) : (
        /* Connected Stats Display */
        stats && (
          <div className="space-y-6">
            {/* User Info Header */}
            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-white/5">
              <div className="flex items-center space-x-3">
                {stats.avatar ? (
                  <img
                    src={stats.avatar}
                    alt={stats.handle}
                    className="w-11 h-11 rounded-full object-cover border border-sky-500/40"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center font-bold text-sky-400">
                    {stats.handle.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-white">{stats.handle}</h4>
                  <p className="text-xs text-gray-400">{stats.organization || 'Competitive Programmer'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full border ${getRankBadgeColor(stats.rank)}`}>
                  {stats.rank}
                </span>
                {stats.maxRating > 0 && (
                  <p className="text-[10px] text-gray-400 mt-1">Max Rating: <span className="font-bold text-white">{stats.maxRating}</span></p>
                )}
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Rating</p>
                <p className="text-lg font-extrabold text-sky-400">{stats.rating || 'Unrated'}</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Solved</p>
                <p className="text-lg font-extrabold text-white">{stats.totalSolved}</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Div 2/3 (Easy)</p>
                <p className="text-lg font-extrabold text-brand-success">{stats.easySolved}</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Div 1/2 (Medium+)</p>
                <p className="text-lg font-extrabold text-brand-warning">{stats.mediumSolved + stats.hardSolved}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CodeforcesCard;
