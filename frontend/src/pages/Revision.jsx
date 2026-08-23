import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaBrain, FaRedoAlt, FaCheck, FaTimes, FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Revision = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevisionData();
  }, [token]);

  const fetchRevisionData = async () => {
    
    try {
      const res = await fetch('/api/revision', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFlashcards(data.flashcards || []);
        setTopics(data.topics || []);
      }
    } catch (err) {
      console.error('Failed to load revision data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="border-b border-white/5 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <FaBrain className="text-brand-accent" />
            <span>Spaced Repetition Engine</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Never forget what you've learned. Smart flashcards powered by Ebbinghaus Forgetting Curve.</p>
        </div>
        <button onClick={() => navigate('/feature/revision/flashcards')} className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/80 transition-all text-white font-bold rounded-xl shadow-[0_0_20px_rgba(100,108,255,0.3)] flex items-center space-x-2">
          <FaRedoAlt />
          <span>Start Session (4 Due)</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading revision data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Upcoming Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((f, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${f.status === 'due' ? 'bg-brand-card border-brand-accent/30 shadow-[0_0_15px_rgba(0,255,163,0.1)]' : 'bg-black/40 border-white/5'} transition-all flex flex-col justify-between`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{f.type}</span>
                      <span className={`text-xs font-bold ${f.status === 'due' ? 'text-brand-accent animate-pulse' : 'text-gray-500'}`}>{f.nextReview}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">{f.title}</h3>
                  </div>
                  
                  {f.status === 'due' && (
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <button className="py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-sm font-bold"><FaTimes className="mx-auto" /></button>
                      <button className="py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all text-sm font-bold"><FaQuestionCircle className="mx-auto" /></button>
                      <button className="py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-sm font-bold"><FaCheck className="mx-auto" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Weak Topics</h2>
            <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
              {topics.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="text-gray-300">{t.name}</span>
                    <span className={t.color.split(' ')[0]}>{t.strength}%</span>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full ${t.color.split(' ')[1]} ${t.color.split(' ')[2]}`} style={{ width: `${t.strength}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Revision;
