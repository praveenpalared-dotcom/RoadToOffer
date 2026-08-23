import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaTrophy, FaMedal, FaFire, FaCrown, FaUserFriends, FaGamepad, 
  FaPlus, FaPlay, FaSearch, FaStar, FaTimes, FaCheckCircle, 
  FaClock, FaBolt, FaAward, FaSync, FaShieldAlt
} from 'react-icons/fa';

const Leaderboard = () => {
  const { token, user } = useAuth();
  const [filter, setFilter] = useState('global'); // 'global' | 'weekly' | 'friends'
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Battle Modals State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeBattleModal, setActiveBattleModal] = useState(null);
  
  // Create Battle Form State
  const [battleTopic, setBattleTopic] = useState('Arrays & Hashing');
  const [battleDifficulty, setBattleDifficulty] = useState('Medium');
  const [battleDuration, setBattleDuration] = useState('15');
  const [battleMode, setBattleMode] = useState('1v1 Duel');
  const [creating, setCreating] = useState(false);

  // Active Battle Execution State
  const [battleScore, setBattleScore] = useState(0);
  const [battleProblemsDone, setBattleProblemsDone] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
    fetchBattles();
  }, [token, filter]);

  const fetchLeaderboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?filter=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard || []);
        setCurrentUserRank(data.currentUserRank || null);
      }
    } catch (e) {
      console.error('Failed to fetch leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBattles = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/leaderboard/battles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBattles(data.battles || []);
      }
    } catch (e) {
      console.error('Failed to fetch battles:', e);
    }
  };

  const handleCreateBattle = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/leaderboard/battles', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: battleTopic,
          difficulty: battleDifficulty,
          durationMinutes: battleDuration,
          matchMode: battleMode
        })
      });
      const data = await res.json();
      if (res.ok && data.battle) {
        setBattles(prev => [data.battle, ...prev]);
        setShowCreateModal(false);
        setActiveBattleModal(data.battle);
      }
    } catch (e) {
      console.error('Error creating battle:', e);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinBattle = async (battle) => {
    try {
      const res = await fetch(`/api/leaderboard/battles/${battle.id}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setActiveBattleModal(data.battle || battle);
        setBattleScore(0);
        setBattleProblemsDone(0);
      }
    } catch (e) {
      console.error('Error joining battle:', e);
    }
  };

  const handleSubmitBattleProgress = async () => {
    if (!activeBattleModal) return;
    try {
      const res = await fetch(`/api/leaderboard/battles/${activeBattleModal.id}/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pointsEarned: 50 })
      });
      const data = await res.json();
      if (res.ok && data.battle) {
        setActiveBattleModal(data.battle);
        setBattleScore(prev => prev + 50);
        setBattleProblemsDone(prev => prev + 1);
        fetchLeaderboard(); // refresh leaderboard stats
      }
    } catch (e) {
      console.error('Error submitting progress:', e);
    }
  };

  const filteredLeaderboard = leaderboard.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = leaderboard.slice(0, 3);
  const remainingList = filteredLeaderboard.filter(item => item.rank > 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <FaTrophy className="text-2xl text-amber-400" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Arena Leaderboard</h1>
          </div>
          <p className="text-sm text-gray-400">
            Compete with peers, track your global rank, and join friendly coding sprints!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-2"
          >
            <FaGamepad className="text-lg" />
            <span>Create 1v1 Battle</span>
          </button>
          
          <button
            onClick={fetchLeaderboard}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all"
            title="Refresh Leaderboard"
          >
            <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. FRIENDLY BATTLES BANNER */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-6 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center space-x-2">
            <FaGamepad className="text-indigo-400 text-xl" />
            <h2 className="text-lg font-bold text-white tracking-tight">Friendly Competition Rooms</h2>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            {battles.length} Active Challenges
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {battles.slice(0, 2).map((battle) => (
            <div key={battle.id} className="p-4 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-between hover:border-indigo-500/40 transition-all">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{battle.topic}</span>
                  <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/10">{battle.difficulty}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{battle.title}</h4>
                <p className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                  <span>Host: {battle.creatorName}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1"><FaClock className="text-[10px]" /> <span>{battle.durationMinutes}m</span></span>
                </p>
              </div>

              <button
                onClick={() => handleJoinBattle(battle)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md flex items-center space-x-1.5 shrink-0"
              >
                <FaPlay className="text-[10px]" />
                <span>Join Sprint</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PODIUM (TOP 3 RANKINGS) */}
      {filter === 'global' && topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 md:gap-6 pt-4 pb-2 max-w-4xl mx-auto items-end">
          
          {/* SILVER (RANK 2) */}
          <div className="flex flex-col items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-400/30 glass-panel relative order-1">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center border-2 border-slate-300 text-slate-300 font-black text-xl mb-3 shadow-lg shadow-slate-500/10 relative">
              {topThree[1].name.charAt(0)}
              <span className="absolute -top-3 bg-slate-300 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                #2
              </span>
            </div>
            <h3 className="text-base font-bold text-white text-center truncate w-full">{topThree[1].name}</h3>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">{topThree[1].rankTitle}</p>
            <div className="mt-3 flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-400/20 text-xs font-bold text-white">
              <FaStar className="text-slate-300 text-[10px]" />
              <span>{topThree[1].xp} XP</span>
            </div>
          </div>

          {/* GOLD (RANK 1) */}
          <div className="flex flex-col items-center bg-gradient-to-b from-amber-500/15 to-slate-900/90 p-7 rounded-2xl border-2 border-amber-400/60 glass-panel relative order-2 transform -translate-y-4 shadow-xl shadow-amber-500/10">
            <div className="absolute -top-6 text-amber-400 text-3xl animate-bounce">
              <FaCrown />
            </div>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center border-2 border-amber-400 text-amber-300 font-black text-2xl mb-3 shadow-lg shadow-amber-500/20 relative">
              {topThree[0].name.charAt(0)}
              <span className="absolute -top-3 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-white">
                #1
              </span>
            </div>
            <h3 className="text-lg font-black text-white text-center truncate w-full">{topThree[0].name}</h3>
            <p className="text-xs text-amber-400 font-extrabold mt-0.5">{topThree[0].rankTitle}</p>
            <div className="mt-3 flex items-center space-x-1.5 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-400/40 text-xs font-black text-amber-300">
              <FaStar className="text-amber-400 text-xs" />
              <span>{topThree[0].xp} XP</span>
            </div>
          </div>

          {/* BRONZE (RANK 3) */}
          <div className="flex flex-col items-center bg-slate-900/60 p-6 rounded-2xl border border-amber-700/30 glass-panel relative order-3">
            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center border-2 border-amber-600 text-amber-500 font-black text-xl mb-3 shadow-lg shadow-amber-900/20 relative">
              {topThree[2].name.charAt(0)}
              <span className="absolute -top-3 bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                #3
              </span>
            </div>
            <h3 className="text-base font-bold text-white text-center truncate w-full">{topThree[2].name}</h3>
            <p className="text-xs text-amber-600 font-semibold mt-0.5">{topThree[2].rankTitle}</p>
            <div className="mt-3 flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-amber-700/20 text-xs font-bold text-white">
              <FaStar className="text-amber-500 text-[10px]" />
              <span>{topThree[2].xp} XP</span>
            </div>
          </div>

        </div>
      )}

      {/* 4. FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5">
        
        {/* Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setFilter('global')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              filter === 'global' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaTrophy className="text-xs" />
            <span>Global Standings</span>
          </button>
          
          <button
            onClick={() => setFilter('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              filter === 'weekly' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaBolt className="text-xs" />
            <span>Weekly Sprint</span>
          </button>

          <button
            onClick={() => setFilter('friends')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              filter === 'friends' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaUserFriends className="text-xs" />
            <span>Friends & Squads</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3.5 top-3 text-gray-500 text-xs" />
          <input
            type="text"
            placeholder="Search coder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 text-white text-xs font-medium rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary/50"
          />
        </div>
      </div>

      {/* 5. USER OWN RANK CARD */}
      {currentUserRank && (
        <div className="p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/30 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/30 text-brand-accent font-black flex items-center justify-center border border-brand-primary/40 text-sm">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">Your Current Rank</h4>
                <span className="text-[10px] bg-brand-primary/20 text-brand-accent px-2 py-0.5 rounded-full font-bold uppercase">YOU</span>
              </div>
              <p className="text-xs text-gray-400">Level {currentUserRank.level} • {currentUserRank.rankTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Streak</p>
              <p className="text-sm font-bold text-amber-400 flex items-center justify-end space-x-1">
                <FaFire className="text-xs" />
                <span>{currentUserRank.currentStreak} Days</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Total XP</p>
              <p className="text-sm font-black text-brand-accent flex items-center justify-end space-x-1">
                <FaStar className="text-xs" />
                <span>{currentUserRank.xp} XP</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. MAIN LEADERBOARD TABLE */}
      <div className="bg-brand-card/50 glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/60 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Coder</th>
                  <th className="py-3.5 px-6">Rank Title</th>
                  <th className="py-3.5 px-6 text-center">Problems Solved</th>
                  <th className="py-3.5 px-6 text-center">Streak</th>
                  <th className="py-3.5 px-6 text-right">XP Points</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {filteredLeaderboard.map((coder) => (
                  <tr 
                    key={coder.email} 
                    className={`transition-colors ${
                      coder.isCurrentUser 
                        ? 'bg-brand-primary/10 border-l-4 border-l-brand-primary font-bold' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-xs ${
                        coder.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' :
                        coder.rank === 2 ? 'bg-slate-500/20 text-slate-300 border border-slate-400/40' :
                        coder.rank === 3 ? 'bg-amber-900/20 text-amber-500 border border-amber-700/40' :
                        'text-gray-400'
                      }`}>
                        {coder.rank}
                      </span>
                    </td>

                    {/* Coder Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-white/10 text-white font-bold shrink-0">
                          {coder.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold flex items-center space-x-2">
                            <span>{coder.name}</span>
                            {coder.isCurrentUser && (
                              <span className="text-[9px] bg-brand-primary text-white px-1.5 py-0.2 rounded font-black">YOU</span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-500">Level {coder.level}</p>
                        </div>
                      </div>
                    </td>

                    {/* Rank Title */}
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        coder.rankTitle === 'Grandmaster' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        coder.rankTitle === 'Master' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        coder.rankTitle === 'Expert' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {coder.rankTitle}
                      </span>
                    </td>

                    {/* Solved Count */}
                    <td className="py-4 px-6 text-center font-bold text-gray-300">
                      {coder.solvedCount || 0}
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-[11px]">
                        <FaFire />
                        <span>{coder.currentStreak || 0}d</span>
                      </div>
                    </td>

                    {/* XP */}
                    <td className="py-4 px-6 text-right font-black text-brand-accent">
                      {filter === 'weekly' ? coder.weeklyXP || coder.xp : coder.xp} XP
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-center">
                      {!coder.isCurrentUser ? (
                        <button
                          onClick={() => {
                            setBattleTopic('Data Structures');
                            setShowCreateModal(true);
                          }}
                          className="px-3 py-1.5 bg-white/5 hover:bg-brand-primary text-gray-300 hover:text-white rounded-lg border border-white/10 text-[10px] font-bold transition-all flex items-center space-x-1 mx-auto"
                        >
                          <FaGamepad />
                          <span>Challenge</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-600 font-semibold">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL 1: CREATE 1v1 FRIENDLY BATTLE --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <FaGamepad className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create Friendly Competition</h3>
                <p className="text-xs text-gray-400">Setup a timed coding battle room with peers or AI</p>
              </div>
            </div>

            <form onSubmit={handleCreateBattle} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-gray-300 mb-1.5 font-bold">Topic Focus</label>
                <select
                  value={battleTopic}
                  onChange={(e) => setBattleTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 text-white rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
                >
                  <option value="Arrays & Hashing">Arrays & Hashing</option>
                  <option value="Two Pointers & Sliding Window">Two Pointers & Sliding Window</option>
                  <option value="Trees & Graphs">Trees & Graphs</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="System Design & SQL">System Design & SQL</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1.5 font-bold">Difficulty</label>
                  <select
                    value={battleDifficulty}
                    onChange={(e) => setBattleDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 text-white rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1.5 font-bold">Sprint Duration</label>
                  <select
                    value={battleDuration}
                    onChange={(e) => setBattleDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 text-white rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
                  >
                    <option value="10">10 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1.5 font-bold">Match Mode</label>
                <select
                  value={battleMode}
                  onChange={(e) => setBattleMode(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 text-white rounded-xl border border-white/10 focus:outline-none focus:border-brand-primary"
                >
                  <option value="1v1 Duel">1v1 Peer / AI Duel</option>
                  <option value="Group Squad Sprint">Group Squad Sprint</option>
                </select>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                >
                  {creating ? 'Launching...' : 'Launch Battle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: LIVE FRIENDLY BATTLE ROOM ARENA --- */}
      {activeBattleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setActiveBattleModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>

            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs mb-1">
                <FaGamepad />
                <span>ACTIVE SPRINT ARENA • {activeBattleModal.matchMode}</span>
              </div>
              <h2 className="text-2xl font-black text-white">{activeBattleModal.title}</h2>
              <p className="text-xs text-gray-400 mt-1">Topic: {activeBattleModal.topic} • Duration: {activeBattleModal.durationMinutes} mins</p>
            </div>

            {/* Live Progress Scoreboards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Live Competitor Standings</h4>
              
              {activeBattleModal.participants.map((p, idx) => (
                <div key={idx} className="p-3.5 bg-slate-800/80 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/30">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-gray-400">Solved: {p.solvedCount} problems</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-brand-accent">{p.score} Points</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Challenge Mission Checklist */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                <FaShieldAlt className="text-indigo-400" />
                <span>Sprint Tasks</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {activeBattleModal.targetProblems?.map((task, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <FaCheckCircle className={i < battleProblemsDone ? "text-emerald-400 text-xs" : "text-gray-600 text-xs"} />
                    <span className={i < battleProblemsDone ? "line-through text-gray-500" : ""}>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Battle Actions */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-gray-400 font-medium flex items-center space-x-1">
                <FaClock className="text-indigo-400" />
                <span>Sprint active • Earn +50 XP per solved task</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveBattleModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs rounded-xl border border-white/10"
                >
                  Close Arena
                </button>
                <button
                  onClick={handleSubmitBattleProgress}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
                >
                  <FaCheckCircle />
                  <span>Submit Task (+50 XP)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Leaderboard;
