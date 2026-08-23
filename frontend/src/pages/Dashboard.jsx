import React, { useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { FaFire, FaTrophy, FaCalendarCheck, FaChartLine, FaRobot, FaCheckCircle, FaExclamationTriangle, FaChartPie, FaRocket } from 'react-icons/fa';
import Heatmap from '../components/Heatmap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardStats, fetchRoadmap, fetchDashboardStats } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmap();
    fetchDashboardStats();
  }, []);

  if (!dashboardStats) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Generating your consistency cockpit...</p>
        </div>
      </div>
    );
  }

  const { placementReadiness, biggestBottleneck, todayMission, upcomingDeadlines, recentAchievements, weeklyPerformance, aiCareerInsight, heatmap } = dashboardStats;
  const breakdown = placementReadiness.breakdown || {};

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">GOOD MORNING, {(user?.name || 'STUDENT').toUpperCase()} 👋</h1>
          <p className="text-sm text-gray-400 mt-1">Let's get you placement ready. Career Path: <span className="text-brand-accent font-semibold">{placementReadiness.careerPath || 'Software Engineer'}</span></p>
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

      {/* 2. TODAY'S MISSION & BOTTLENECK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TODAY'S MISSION */}
        <div className="lg:col-span-2 bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center space-x-3">
              <FaRocket className="text-2xl text-brand-accent" />
              <h2 className="text-xl font-bold text-white tracking-tight">TODAY'S MISSION</h2>
            </div>
            <span className="text-xs font-bold bg-brand-primary/20 text-brand-accent px-3 py-1 rounded-full border border-brand-primary/30">
              Daily XP: +350
            </span>
          </div>
          
          <div className="space-y-3 relative z-10">
            {todayMission?.map((mission) => (
              <div key={mission.id} className="flex items-center justify-between p-3 rounded-xl border bg-slate-900/40 border-white/5 hover:border-white/10 transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-slate-600 text-lg" />
                  <span className="text-sm font-medium text-gray-300">{mission.title}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex space-x-3 relative z-10">
            <button 
              onClick={() => navigate('/roadmap')}
              className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/20"
            >
              Start Today's Mission
            </button>
            <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-all">
              Regenerate
            </button>
          </div>
        </div>

        {/* BIGGEST BOTTLENECK */}
        <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-brand-warning/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-warning/10 blur-3xl rounded-full" />
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaExclamationTriangle className="text-brand-warning" />
              <h2 className="text-sm font-bold text-white tracking-tight uppercase">Biggest Bottleneck</h2>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{biggestBottleneck?.name || 'Loading'}</h3>
            <p className="text-xs text-gray-400 mb-4">{biggestBottleneck?.reason}</p>
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recommended Action:</p>
              {biggestBottleneck?.recommendations?.map((rec, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                  <span className="text-brand-accent mt-0.5">→</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => navigate('/roadmap')}
            className="w-full py-2.5 bg-brand-warning/10 hover:bg-brand-warning/20 border border-brand-warning/30 text-brand-warning text-sm font-bold rounded-xl transition-all"
          >
            Start Fixing This
          </button>
        </div>
      </div>

      {/* 3. 4 BLOCKS (CORE METRICS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['DSA', 'CS Fundamentals', 'Projects', 'Interview'].map((cat, i) => {
          const score = breakdown[cat] || 0;
          return (
            <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{cat}</p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-black text-white">{score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary" style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. UPCOMING DEADLINES, ACHIEVEMENTS, WEEKLY PERFORMANCE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DEADLINES */}
        <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <FaCalendarCheck className="text-brand-accent" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">Upcoming Deadlines</h3>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines?.map(deadline => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                <span className="text-sm font-semibold text-gray-300 truncate pr-2">{deadline.title}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                  deadline.urgency === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  deadline.urgency === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {deadline.daysLeft} days
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <FaTrophy className="text-amber-500" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {recentAchievements?.map(ach => (
              <div key={ach.id} className="flex items-center space-x-3 p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-lg">
                  {ach.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300">{ach.title}</p>
                  <p className="text-[10px] text-gray-500">{ach.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY PERFORMANCE */}
        <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5">
          <div className="flex items-center space-x-2 mb-4">
            <FaChartLine className="text-emerald-500" />
            <h3 className="text-sm font-bold text-white tracking-tight uppercase">Weekly Performance</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl text-center">
              <p className="text-xs text-gray-400 mb-1">DSA</p>
              <p className="text-lg font-bold text-emerald-400">{weeklyPerformance?.dsa}</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl text-center">
              <p className="text-xs text-gray-400 mb-1">CS Core</p>
              <p className="text-lg font-bold text-emerald-400">{weeklyPerformance?.cs}</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl text-center">
              <p className="text-xs text-gray-400 mb-1">Projects</p>
              <p className="text-lg font-bold text-emerald-400">{weeklyPerformance?.projects}</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl text-center">
              <p className="text-xs text-gray-400 mb-1">Consistency</p>
              <p className="text-lg font-bold text-emerald-400">{weeklyPerformance?.consistency}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 5. AI CAREER INSIGHT & HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI INSIGHT */}
        <div className="bg-brand-primary/10 border border-brand-primary/30 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-5 -right-5 text-8xl text-brand-primary/10">
            <FaRobot />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <FaRobot className="text-brand-accent" />
              <h3 className="text-sm font-bold text-brand-accent tracking-tight uppercase">AI Career Insight</h3>
            </div>
            <p className="text-sm text-brand-primary/90 leading-relaxed font-medium">
              "{aiCareerInsight}"
            </p>
          </div>
        </div>

        {/* HEATMAP */}
        <div className="lg:col-span-2 bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5">
           <Heatmap activity={heatmap} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
