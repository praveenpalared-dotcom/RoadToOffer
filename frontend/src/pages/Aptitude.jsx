import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaCalculator, FaPuzzlePiece, FaLanguage, FaPlayCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Aptitude = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAptitudeData();
  }, [token]);

  const fetchAptitudeData = async () => {
    
    try {
      const res = await fetch('/api/aptitude', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTopics(data.topics || []);
      }
    } catch (err) {
      console.error('Failed to load aptitude data:', err);
    } finally {
      setLoading(false);
    }
  };

  const icons = {
    'Quantitative Aptitude': <FaCalculator className="text-4xl opacity-50 absolute right-4 bottom-4" />,
    'Logical Reasoning': <FaPuzzlePiece className="text-4xl opacity-50 absolute right-4 bottom-4" />,
    'Verbal Ability': <FaLanguage className="text-4xl opacity-50 absolute right-4 bottom-4" />
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <FaCalculator className="text-brand-accent" />
          <span>Aptitude & Logic</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Essential for initial screening rounds at top product and service companies.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading aptitude topics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map((t, i) => (
            <div key={i} className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden group">
              {icons[t.title]}
              <h2 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">{t.title}</h2>
              <p className="text-xs text-gray-400 mt-1 mb-6">{t.topics}</p>

              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span>Mastery</span>
                  <span>{t.progress}%</span>
                </div>
                <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full ${t.color}`} style={{ width: `${t.progress}%` }}></div>
                </div>
              </div>

              <button onClick={() => navigate('/feature/aptitude/quantitative')} className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all flex justify-center items-center space-x-2 relative z-10">
                <FaPlayCircle />
                <span>Start Practice</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Aptitude;
