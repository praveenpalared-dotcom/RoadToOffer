import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFire, FaTrophy, FaSignOutAlt, FaUser, FaChartLine, FaRoad, FaCog, FaLaptopCode, FaBrain, FaRobot, FaBuilding, FaUserTie, FaFileAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  // Calculate XP percentage to next level
  const xpInCurrentLevel = (user?.xp || 0) % 1000;
  const xpPercent = Math.min((xpInCurrentLevel / 1000) * 100, 100);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-40 w-full px-6 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-8">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            RoadToOffer
          </span>
          <span className="text-xs bg-brand-primary/20 text-brand-accent px-2 py-0.5 rounded-full font-medium border border-brand-primary/30">
            SaaS Beta
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex flex-1 items-center px-4 mx-4 overflow-hidden">
          <style>{`
            .hide-scroll::-webkit-scrollbar { display: none; }
            .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          <div className="flex items-center space-x-1 overflow-x-auto hide-scroll w-full pb-1">
            <Link
              to="/dashboard"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaChartLine className="text-xs" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/roadmap"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/roadmap') || location.pathname.startsWith('/topic/')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaRoad className="text-xs" />
              <span>Roadmap</span>
            </Link>
            <Link
              to="/projects"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/projects')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaLaptopCode className="text-xs" />
              <span>Projects</span>
            </Link>
            <Link
              to="/grit-center"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/grit-center')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaBrain className="text-xs" />
              <span>Exams</span>
            </Link>
            <Link
              to="/mentor"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/mentor')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaRobot className="text-xs" />
              <span>AI Mentor</span>
            </Link>
            <Link
              to="/companies"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/companies')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaBuilding className="text-xs" />
              <span>Companies</span>
            </Link>
            <Link
              to="/interviews"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/interviews')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaUserTie className="text-xs" />
              <span>Interviews</span>
            </Link>
            <Link
              to="/resume"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/resume')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaFileAlt className="text-xs" />
              <span>Resume</span>
            </Link>
            <Link
              to="/awards"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/awards')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaTrophy className="text-xs" />
              <span>Awards</span>
            </Link>
            <Link
              to="/analytics"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/analytics')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaChartLine className="text-xs" />
              <span>Analytics</span>
            </Link>
            <Link
              to="/profile"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaUser className="text-xs" />
              <span>Profile</span>
            </Link>
            <Link
              to="/admin"
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin')
                  ? 'bg-brand-primary/10 text-brand-accent border border-brand-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FaCog className="text-xs" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Stats and Controls */}
      <div className="flex items-center space-x-6">
        {/* Streak indicator */}
        <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <FaFire className="text-base animate-flame text-orange-500" />
          <span className="text-sm font-bold tracking-tight">{user?.currentStreak || 0} Days</span>
        </div>

        {/* Level and XP bar */}
        <div className="hidden sm:flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-medium">Level {user?.level || 1}</span>
            <span className="text-xs font-bold text-brand-accent">{(user?.xp || 0) % 1000} / 1000 XP</span>
          </div>
          <div className="w-32 h-1.5 bg-brand-bg rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 progress-bar-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-brand-danger hover:bg-brand-danger/10 border border-transparent hover:border-brand-danger/20 transition-all"
        >
          <FaSignOutAlt className="text-sm" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
