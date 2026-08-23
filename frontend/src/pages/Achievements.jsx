import React, { useState } from 'react';
import { FaTrophy, FaCertificate, FaMedal, FaPlus, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const Achievements = () => {
  const [activeTab, setActiveTab] = useState('hackathons');
  
  // Dummy data since we haven't built out the full backend CRUD for these yet
  const [hackathons] = useState([
    {
      title: 'Smart India Hackathon 2025',
      date: 'Aug 2025',
      role: 'Backend Developer',
      result: 'Finalist',
      project: 'AI Traffic Optimizer',
      skills: ['Python', 'FastAPI', 'YOLOv8']
    },
    {
      title: 'Global Fintech Hack',
      date: 'Dec 2024',
      role: 'Full Stack',
      result: 'Winner',
      project: 'Decentralized Credit Score',
      skills: ['Solidity', 'React', 'Node.js']
    }
  ]);

  const [certifications] = useState([
    {
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'May 2025',
      credentialId: 'AWS-123456789'
    },
    {
      title: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: 'Jan 2025',
      credentialId: 'GCP-987654321'
    }
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="border-b border-white/5 pb-5 flex items-start space-x-4">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <FaTrophy className="text-4xl text-amber-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Achievements & Certifications</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
            Track your hackathon participation and industry certifications. These significantly boost your resume score and placement readiness.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('hackathons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'hackathons' 
              ? 'bg-amber-600 text-white shadow-lg' 
              : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <FaMedal />
          <span>Hackathons</span>
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'certifications' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-slate-900 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <FaCertificate />
          <span>Certifications</span>
        </button>
      </div>

      {activeTab === 'hackathons' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2">
              <FaPlus />
              <span>Add Hackathon</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hackathons.map((h, i) => (
              <div key={i} className="bg-brand-card/50 p-6 rounded-2xl border border-white/5 glass-panel flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{h.title}</h3>
                    <p className="text-xs text-amber-400 font-bold mt-1">{h.result}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-slate-800 px-2 py-1 rounded flex items-center space-x-1">
                    <FaCalendarAlt />
                    <span>{h.date}</span>
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-300"><strong>Role:</strong> {h.role}</p>
                  <p className="text-xs text-gray-300"><strong>Project:</strong> {h.project}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {h.skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2">
              <FaPlus />
              <span>Add Certification</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((c, i) => (
              <div key={i} className="bg-brand-card/50 p-6 rounded-2xl border border-white/5 glass-panel flex items-start space-x-4 hover:border-blue-500/30 transition-colors">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <FaCertificate className="text-2xl" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-gray-400">{c.issuer}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-gray-500">
                    <span className="flex items-center space-x-1"><FaCalendarAlt /> <span>{c.date}</span></span>
                    <span className="flex items-center space-x-1"><FaCheckCircle className="text-emerald-400" /> <span>ID: {c.credentialId}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Achievements;
