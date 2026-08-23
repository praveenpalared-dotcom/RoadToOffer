import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTrophy, FaCode, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Contests = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, [token]);

  const fetchContests = async () => {
    
    try {
      const res = await fetch('/api/contests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setContests(data.contests || []);
      }
    } catch (err) {
      console.error('Failed to fetch contests:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <FaTrophy className="text-brand-accent" />
          <span>Global Contests</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Track upcoming competitive programming contests across all major platforms.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading upcoming contests...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((c, i) => (
            <div key={i} className="bg-brand-card/50 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 ${c.color} bg-black/50`}>
                    {c.platform}
                  </span>
                  <button className="text-gray-500 hover:text-brand-accent transition-colors">
                    <FaBell />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">{c.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mt-3">
                  <FaCalendarAlt className="text-brand-primary" />
                  <span>{c.date}</span>
                </div>
              </div>
              <button onClick={() => navigate('/feature/contest/registration')} className="mt-6 w-full py-2.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl font-bold text-sm transition-all border border-brand-primary/20 flex justify-center items-center space-x-2">
                <FaCode /> <span>Register Now</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contests;
