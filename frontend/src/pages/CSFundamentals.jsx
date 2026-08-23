import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaServer, FaDatabase, FaNetworkWired, FaSitemap, FaLaptopCode, FaBookOpen, FaQuestionCircle, FaRedo, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const CSFundamentals = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, [token]);

  const fetchSubjects = async () => {
    
    try {
      const res = await fetch('/api/cs-fundamentals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSubjects(data.subjects || []);
      }
    } catch (err) {
      console.error('Failed to load CS fundamentals:', err);
    } finally {
      setLoading(false);
    }
  };

  const icons = {
    'Operating Systems': <FaServer className="text-4xl text-amber-500 opacity-20 absolute right-4 bottom-4" />,
    'Database Mgmt (DBMS)': <FaDatabase className="text-4xl text-emerald-500 opacity-20 absolute right-4 bottom-4" />,
    'Computer Networks': <FaNetworkWired className="text-4xl text-red-500 opacity-20 absolute right-4 bottom-4" />,
    'System Design': <FaSitemap className="text-4xl text-purple-500 opacity-20 absolute right-4 bottom-4" />
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <FaLaptopCode className="text-brand-accent" />
            <span>CS Fundamentals Hub</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Master Core CS Subjects. Track your weaknesses.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading CS subjects...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {subjects.map((subject, i) => (
            <div key={i} className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all shadow-lg hover:shadow-xl relative overflow-hidden">
              {icons[subject.title]}
              
              {/* Title & Progress */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-black text-white tracking-tight">{subject.title}</h2>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${subject.color} text-white`}>
                    {subject.modules} Concepts
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Progress</span>
                    <span className="text-white">{subject.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full ${subject.color.split(' ')[0]}`} style={{ width: `${subject.progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
                <button onClick={() => navigate('/feature/practice/cs-fundamentals')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
                  <FaBookOpen className="mb-2 text-lg text-brand-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Practice</span>
                </button>
                <button onClick={() => navigate('/feature/practice/cs-fundamentals')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
                  <FaQuestionCircle className="mb-2 text-lg text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center">Interview Q's</span>
                </button>
                <button onClick={() => navigate('/feature/practice/cs-fundamentals')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
                  <FaRedo className="mb-2 text-lg text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Revise</span>
                </button>
                <button onClick={() => navigate('/feature/practice/cs-fundamentals')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white">
                  <FaCheckCircle className="mb-2 text-lg text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Take Test</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CSFundamentals;
