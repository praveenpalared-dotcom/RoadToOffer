import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCode, FaFire, FaTrophy, FaChartLine, FaGithub, FaGoogle, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const Landing = () => {
  const { isAuthenticated, login, register, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartJourney = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isForgotPassword) {
        await resetPassword(email, newPassword);
        setIsForgotPassword(false);
        setIsLogin(true);
        alert('Password reset successful. Please sign in with your new password.');
      } else if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register(name, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoCredentials = () => {
    setEmail('candidate@roadtooffer.com');
    setPassword('candidate123');
    setIsLogin(true);
    setIsForgotPassword(false);
  };

  return (
    <div className="w-full min-h-screen bg-brand-bg flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Header / Navbar on Landing */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            RoadToOffer
          </span>
          <span className="text-[10px] bg-brand-primary/20 text-brand-accent px-2 py-0.5 rounded-full font-bold uppercase border border-brand-primary/30">
            SaaS
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => {
                document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
                setIsLogin(true);
              }}
              className="text-gray-300 hover:text-white font-semibold text-sm transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Copywriting */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-brand-primary/10 text-brand-accent px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-primary/20 inline-block mb-3">
              🔥 Track consistency & scale analytics
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
              🚀 Master DSA.<br/>
              Stay Consistent.<br/>
              Crack Placements.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Track your entire DSA journey, unlock badges, monitor mock preparation analytics, and gamify consistency daily until you secure your dream offer.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={handleStartJourney}
              className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-8 py-4 rounded-xl flex items-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20"
            >
              <span>Start Journey</span>
              <FaArrowRight className="text-sm" />
            </button>
            <button
              onClick={() => {
                if (isAuthenticated) navigate('/roadmap');
                else handleStartJourney();
              }}
              className="bg-brand-card/80 hover:bg-brand-card text-gray-200 hover:text-white px-8 py-4 rounded-xl font-bold border border-white/10 transition-all"
            >
              View Roadmap
            </button>
          </motion.div>

          {/* Features highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5"
          >
            <div>
              <p className="text-xl font-extrabold text-white">400+</p>
              <p className="text-xs text-gray-500">Curated Problems</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">🔥 Live</p>
              <p className="text-xs text-gray-500">Real-Time Streak & XP</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">6 Phases</p>
              <p className="text-xs text-gray-500">From Easy to DP & Graph</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Animated Mockups & Floating Widgets */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="w-full max-w-sm rounded-2xl glass-panel border border-white/15 p-6 shadow-2xl relative"
          >
            {/* Top mock header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-500 font-mono">Console Interface Preview</span>
            </div>

            {/* Dashboard snippet mockup */}
            <div className="space-y-4">
              {/* Stat card 1: Streak */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <FaFire className="text-orange-500 text-lg animate-flame" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Streak Engine</p>
                    <p className="text-base font-extrabold text-white">Real-Time Sync</p>
                  </div>
                </div>
                <span className="text-[10px] text-brand-success font-bold bg-brand-success/15 px-2.5 py-1 rounded-full">Automated</span>
              </div>

              {/* Stat card 2: Progress */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Roadmap Progress</span>
                  <span className="text-xs font-bold text-white">Dynamic Analytics</span>
                </div>
                <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary progress-bar-fill" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Daily Goals mock */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Goal Checklist</p>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-brand-primary" readOnly />
                    <span className="line-through text-gray-500">Solve Math & Array Problems</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-brand-primary" readOnly />
                    <span className="line-through text-gray-500">Revise Tree DFS & DP Notes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <input type="checkbox" defaultChecked={false} className="rounded border-slate-700 bg-slate-900 text-brand-primary" disabled />
                    <span>Sync LeetCode Account Daily</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing active level tag */}
            <div className="absolute -top-3 -right-3 bg-brand-primary text-white border border-brand-accent px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg animate-bounce">
              Gamified XP & Levels 💎
            </div>
          </motion.div>
        </div>
      </main>

      {/* Auth Portal Section */}
      <section id="auth-section" className="w-full max-w-md mx-auto px-6 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-card/80 p-8 rounded-2xl glass-panel border border-white/5 shadow-2xl relative"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isForgotPassword ? 'Enter your email and new password' : isLogin ? 'Sign in to sync your progress & streak' : 'Register to start your gamified roadmap'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-brand-danger/10 border border-brand-danger/25 text-brand-danger text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-400 font-semibold uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-xs text-gray-400 font-semibold uppercase">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-brand-primary focus:outline-none transition-colors"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-brand-primary hover:text-brand-accent transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-brand-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {isForgotPassword && (
              <div className="space-y-1 text-left">
                <label className="text-xs text-gray-400 font-semibold uppercase">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-brand-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm shadow-lg tracking-wide active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? 'Authenticating...' : isForgotPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Register Now'}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={loadDemoCredentials}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-accent text-xs font-bold border border-brand-accent/20 transition-all"
            >
              ⚡ Fast-Track: Autofill Candidate Demo Login
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                } else {
                  setIsLogin(!isLogin);
                }
                setError('');
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {isForgotPassword ? 'Back to Sign In' : isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 text-center text-xs text-gray-500 z-10">
        <p>© {new Date().getFullYear()} RoadToOffer. Designed for placements & long-term consistency.</p>
      </footer>
    </div>
  );
};

export default Landing;
