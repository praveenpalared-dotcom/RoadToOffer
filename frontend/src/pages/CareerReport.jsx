import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaDownload, FaFire, FaTrophy, FaCalendarCheck, FaClock, FaMedal, FaCheckCircle } from 'react-icons/fa';
import Heatmap from '../components/Heatmap';

const CareerReport = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalXP: 0,
    currentStreak: 0,
    projectsCount: 0,
    heatmap: {}
  });

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/progress/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStats({
          totalSolved: data.progress?.filter(p => p.status === 'Solved').length || 0,
          totalXP: user?.xp || 0,
          currentStreak: user?.currentStreak || 0,
          projectsCount: user?.projects?.length || 0,
          heatmap: data.heatmap || {}
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('Generating PDF Career Report... (Coming Soon)');
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-5 gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
            <FaChartLine className="text-4xl text-brand-accent" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Weekly Career Report</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
              Analyze your consistency, problem-solving throughput, and overall Placement Readiness over time.
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 shadow-lg flex items-center space-x-2 transition-all"
        >
          <FaDownload />
          <span>Export Analytics</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
          <FaCheckCircle className="text-2xl text-emerald-400 mb-1" />
          <span className="text-3xl font-black text-white">{stats.totalSolved}</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Problems Solved</span>
        </div>
        
        <div className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
          <FaFire className="text-2xl text-amber-500 mb-1" />
          <span className="text-3xl font-black text-white">{stats.currentStreak}</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Day Streak</span>
        </div>

        <div className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
          <FaMedal className="text-2xl text-blue-400 mb-1" />
          <span className="text-3xl font-black text-white">{stats.totalXP}</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total XP</span>
        </div>

        <div className="bg-brand-card/50 p-5 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
          <FaTrophy className="text-2xl text-purple-400 mb-1" />
          <span className="text-3xl font-black text-white">{stats.projectsCount}</span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Projects Shipped</span>
        </div>
      </div>

      <div className="w-full">
        <Heatmap activity={stats.heatmap} />
      </div>

    </div>
  );
};

export default CareerReport;
