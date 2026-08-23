import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaLaptopCode, FaProjectDiagram, FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdvancedProjects = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
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
        setProjects(data.recommendedBlueprints || []);
      }
    } catch (err) {
      console.error('Failed to load blueprints:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <FaProjectDiagram className="text-brand-accent" />
          <span>Advanced Projects Hub</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Stand out with production-grade architectural implementations.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading FAANG Blueprints...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">{p.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${p.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                    {p.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{p.title}</h2>
                <p className="text-sm text-gray-400 mb-6">Tech Stack: <span className="text-gray-300 font-semibold">{p.techStack?.join(', ')}</span></p>
              </div>
              
              <div className="flex space-x-3">
                <button onClick={() => navigate('/feature/project/architecture-guide')} className="flex-1 py-2 bg-brand-primary/10 text-brand-accent border border-brand-primary/20 rounded-xl text-xs font-bold hover:bg-brand-primary hover:text-white transition-all">
                  Architecture Guide
                </button>
                <button onClick={() => navigate('/feature/project/architecture-guide')} className="px-4 py-2 bg-white/5 text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <FaGithub />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedProjects;
