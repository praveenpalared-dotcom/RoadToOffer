import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBuilding, FaCheckCircle, FaExclamationTriangle, FaStar, FaGlobe, FaBriefcase, FaChartBar } from 'react-icons/fa';

const Companies = () => {
  const { token, user } = useAuth();
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const userReadiness = user?.placementReadiness?.breakdown || {
    DSA: 0,
    CS: 0,
    Projects: 0,
    CT: 0
  };

  const getMatchScore = (company) => {
    const dsaMatch = Math.min(100, (userReadiness.DSA / (company.expectations.dsa || 1)) * 100);
    const csMatch = Math.min(100, (userReadiness.CS / (company.expectations.cs || 1)) * 100);
    const projMatch = Math.min(100, (userReadiness.Projects / (company.expectations.projects || 1)) * 100);
    const ctMatch = Math.min(100, (userReadiness.CT / (company.expectations.ct || 1)) * 100);
    return Math.floor((dsaMatch + csMatch + projMatch + ctMatch) / 4);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-white/5 pb-5 flex items-start space-x-4">
        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <FaBuilding className="text-4xl text-purple-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Company Preparation Hub</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
            See how your current Placement Readiness Score stacks up against top product and service-based companies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => {
          const matchScore = getMatchScore(company);
          const isReady = matchScore >= 90;
          return (
            <div key={company._id || company.name} className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-6">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{company.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      {company.tier} Tier
                    </span>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded border text-xs font-bold ${
                  isReady ? 'bg-brand-success/10 text-brand-success border-brand-success/20' :
                  matchScore >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {matchScore}% Match
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed min-h-[3rem]">
                {company.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Required Readiness</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">DSA</span>
                    <span className="font-mono text-gray-400">{userReadiness.DSA} / {company.expectations.dsa}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${userReadiness.DSA >= company.expectations.dsa ? 'bg-brand-success' : 'bg-brand-accent'}`} style={{ width: `${Math.min(100, (userReadiness.DSA / company.expectations.dsa) * 100)}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">CS Fundamentals</span>
                    <span className="font-mono text-gray-400">{userReadiness.CS} / {company.expectations.cs}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${userReadiness.CS >= company.expectations.cs ? 'bg-brand-success' : 'bg-brand-accent'}`} style={{ width: `${Math.min(100, (userReadiness.CS / company.expectations.cs) * 100)}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">Projects</span>
                    <span className="font-mono text-gray-400">{userReadiness.Projects} / {company.expectations.projects}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${userReadiness.Projects >= company.expectations.projects ? 'bg-brand-success' : 'bg-brand-accent'}`} style={{ width: `${Math.min(100, (userReadiness.Projects / company.expectations.projects) * 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {isReady ? (
                <button className="w-full py-2.5 bg-brand-success/10 text-brand-success font-bold text-xs rounded-xl border border-brand-success/30 flex items-center justify-center space-x-2">
                  <FaCheckCircle />
                  <span>Interview Ready</span>
                </button>
              ) : (
                <button className="w-full py-2.5 bg-brand-primary/10 text-brand-accent font-bold text-xs rounded-xl border border-brand-primary/30 flex items-center justify-center space-x-2">
                  <FaExclamationTriangle />
                  <span>Improve Weak Areas</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
