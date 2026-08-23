import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { FaBuilding, FaMoneyBillWave, FaQuestionCircle, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const CompanyPrep = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, [token]);

  const fetchCompanies = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <FaBuilding className="text-brand-accent" />
          <span>Company Specific Prep</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Targeted insights, most asked questions, and interview experiences.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((c, i) => (
            <div key={i} className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl mb-4 border ${c.color || 'text-blue-400 border-blue-400/30 bg-blue-400/10'}`}>
                  {c.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">{c.name}</h2>
                <p className="text-xs text-gray-400 mt-1 mb-4">{c.roles}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                    <span className="text-gray-400 flex items-center space-x-2"><FaMoneyBillWave className="text-emerald-500" /> <span>Salary</span></span>
                    <span className="font-bold text-white">{c.salary}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                    <span className="text-gray-400 flex items-center space-x-2"><FaStar className="text-amber-500" /> <span>Rounds</span></span>
                    <span className="font-bold text-white">{c.rounds}</span>
                  </div>
                </div>
              </div>
              
              <button onClick={() => navigate('/feature/company/interview-prep')} className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl border border-white/10 transition-all flex justify-center items-center space-x-2">
                <FaQuestionCircle />
                <span>View Top Questions</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyPrep;
