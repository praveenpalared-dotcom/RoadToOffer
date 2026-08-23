import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFire, FaTrophy, FaSignOutAlt, FaUser, FaChartLine, FaRoad, FaCog, FaLaptopCode, FaBrain, FaRobot, FaBuilding, FaUserTie, FaFileAlt, FaBars, FaTimes, FaCrosshairs, FaRedoAlt, FaCalculator, FaProjectDiagram } from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const xpInCurrentLevel = (user?.xp || 0) % 1000;
  const xpPercent = Math.min((xpInCurrentLevel / 1000) * 100, 100);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartLine /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <FaTrophy /> },
    { name: 'Skill Gap', path: '/skill-gap', icon: <FaCrosshairs /> },
    { name: 'CS Fundamentals', path: '/cs-fundamentals', icon: <FaLaptopCode /> },
    { name: 'Interview Sim', path: '/interview-simulator', icon: <FaUserTie /> },
    { name: 'Company Prep', path: '/company-prep', icon: <FaBuilding /> },
    { name: 'My Projects', path: '/projects', icon: <FaLaptopCode /> },
    { name: 'Adv. Projects', path: '/advanced-projects', icon: <FaProjectDiagram /> },
    { name: 'Revision', path: '/revision', icon: <FaRedoAlt /> },
    { name: 'Aptitude', path: '/aptitude', icon: <FaCalculator /> },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: <FaFileAlt /> },
    { name: 'Contest Arena', path: '/contests', icon: <FaTrophy /> },
    { name: 'Roadmap', path: '/roadmap', icon: <FaRoad /> },
    { name: 'AI Companion', path: '/mentor', icon: <FaRobot /> }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-brand-card rounded-lg text-white border border-white/10"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 flex flex-col h-screen
        glass-panel border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2 w-full" onClick={() => setIsOpen(false)}>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              RoadToOffer
            </span>
            <span className="text-[10px] bg-brand-primary/20 text-brand-accent px-1.5 py-0.5 rounded-full font-medium border border-brand-primary/30">
              Beta
            </span>
          </Link>
        </div>

        {/* Scrollable Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
          `}</style>
          
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2 mt-2">Menu</div>
          
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path) || (link.path === '/roadmap' && location.pathname.startsWith('/topic/'))
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-sm">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}
          
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2 mt-6">Settings</div>
          
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/profile')
                ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-sm"><FaUser /></span>
            <span>Profile</span>
          </Link>
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive('/admin')
                ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20 shadow-[inset_2px_0_0_0_#3B82F6]'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-sm"><FaCog /></span>
            <span>Admin</span>
          </Link>
        </div>

        {/* User Stats & Logout (Bottom Fixed) */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-slate-900/30">
          
          {/* Streak */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/20 w-full justify-center">
              <FaFire className="text-sm animate-flame text-orange-500" />
              <span className="text-xs font-bold tracking-tight">{user?.currentStreak || 0} Days Streak</span>
            </div>
          </div>

          {/* Level and XP */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Level {user?.level || 1}</span>
              <span className="text-[10px] font-bold text-brand-accent">{(user?.xp || 0) % 1000}/1000 XP</span>
            </div>
            <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 progress-bar-fill"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 shrink-0">
                <span className="text-brand-accent font-bold text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-gray-400 hover:text-brand-danger hover:bg-brand-danger/10 border border-transparent hover:border-brand-danger/20 transition-all shrink-0 ml-2"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
