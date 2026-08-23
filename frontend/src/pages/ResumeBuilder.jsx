import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaFileAlt, FaDownload, FaStar, FaCheckCircle, FaLaptopCode, FaLock } from 'react-icons/fa';

const ResumeBuilder = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.userProjects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('PDF Export feature coming soon! (Feature in Beta)');
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedProjects = projects.filter(p => p.status === 'Completed');

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-white/5 pb-5 flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <FaFileAlt className="text-4xl text-emerald-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Resume Evidence Engine</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
              Automatically generates FAANG-style STAR format resume bullets based on the projects you build and complete.
            </p>
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 flex items-center space-x-2 transition-all"
        >
          <FaDownload />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <FaStar className="text-amber-400" />
            <span>Generated STAR Bullets</span>
          </h3>

          {completedProjects.length === 0 ? (
            <div className="bg-brand-card/50 p-8 rounded-2xl border border-white/5 text-center space-y-4">
              <FaLock className="text-4xl text-gray-600 mx-auto" />
              <h4 className="text-white font-bold text-lg">No Completed Projects</h4>
              <p className="text-gray-400 text-sm">
                Complete projects in the Projects Hub to automatically unlock and generate recruiter-approved resume bullets here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedProjects.map(proj => (
                <div key={proj._id || proj.id} className="bg-slate-900 p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                      <FaLaptopCode className="text-blue-400" />
                      <span>{proj.title}</span>
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center space-x-1">
                      <FaCheckCircle />
                      <span>Verified Evidence</span>
                    </span>
                  </div>
                  
                  {proj.resumeBullets && proj.resumeBullets.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                      {proj.resumeBullets.map((b, i) => (
                        <li key={i} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No STAR bullets found for this project. Edit it in the Projects tab to add them.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 p-6 rounded-2xl border border-emerald-500/20">
            <h4 className="text-emerald-400 font-bold mb-2">Resume Score</h4>
            <div className="text-5xl font-black text-white mb-4">
              {Math.min(100, completedProjects.length * 25)}<span className="text-2xl text-gray-500">/100</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your resume score is based on the number of completed projects with verified STAR bullets. Target a score of 75+ for FAANG shortlisting.
            </p>
          </div>

          <div className="bg-brand-card/50 p-6 rounded-2xl border border-white/5 space-y-4">
            <h4 className="text-white font-bold text-sm">The STAR Method</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <p><strong className="text-blue-400">Situation:</strong> Set the context for your project.</p>
              <p><strong className="text-purple-400">Task:</strong> What was the goal or problem?</p>
              <p><strong className="text-amber-400">Action:</strong> What specific steps did you take?</p>
              <p><strong className="text-emerald-400">Result:</strong> What was the quantifiable outcome?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
