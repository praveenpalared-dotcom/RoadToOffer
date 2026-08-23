import React from 'react';
import { FaBriefcase, FaGraduationCap, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaChartLine } from 'react-icons/fa';

const PlacementReadiness = ({ readiness }) => {
  if (!readiness) return null;

  const { overall, breakdown, trend, strongest, weakest } = readiness;

  // 1. Company-specific readiness percentages (Mock logic driven by breakdown)
  const tcsReadiness = Math.round((breakdown['DSA'] * 0.3) + (breakdown['CS Fundamentals'] * 0.3) + (breakdown['Aptitude'] * 0.4));
  const infosysReadiness = Math.round((breakdown['DSA'] * 0.4) + (breakdown['CS Fundamentals'] * 0.4) + (breakdown['Aptitude'] * 0.2));
  const amazonReadiness = Math.round((breakdown['DSA'] * 0.6) + (breakdown['CS Fundamentals'] * 0.2) + (breakdown['Projects'] * 0.2));
  const microsoftReadiness = Math.round((breakdown['DSA'] * 0.5) + (breakdown['CS Fundamentals'] * 0.3) + (breakdown['Projects'] * 0.2));
  const googleReadiness = Math.round((breakdown['DSA'] * 0.7) + (breakdown['CS Fundamentals'] * 0.2) + (breakdown['Communication'] * 0.1));
  const metaReadiness = Math.round((breakdown['DSA'] * 0.6) + (breakdown['Projects'] * 0.3) + (breakdown['Interview'] * 0.1));

  const companies = [
    { name: 'TCS', score: tcsReadiness, tier: 'Service' },
    { name: 'Infosys', score: infosysReadiness, tier: 'Service' },
    { name: 'Amazon', score: amazonReadiness, tier: 'Product' },
    { name: 'Meta', score: metaReadiness, tier: 'Product' },
    { name: 'Microsoft', score: microsoftReadiness, tier: 'Product' },
    { name: 'Google', score: googleReadiness, tier: 'Product' }
  ];

  const getCompanyColor = (score) => {
    if (score >= 80) return 'bg-brand-success';
    if (score >= 50) return 'bg-brand-warning';
    return 'bg-brand-accent';
  };

  const categories = Object.keys(breakdown).map(k => ({ name: k, score: breakdown[k] })).sort((a,b) => b.score - a.score);

  return (
    <div className="w-full bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1: Overall Placement Score */}
      <div className="lg:col-span-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaGraduationCap className="text-brand-accent text-xl" />
              <h3 className="text-lg font-bold text-white tracking-tight">Placement Readiness</h3>
            </div>
            <span className="text-brand-success text-xs font-bold flex items-center bg-brand-success/10 px-2 py-1 rounded">
              <FaChartLine className="mr-1" />
              {trend}
            </span>
          </div>
          
          {/* Visual Gauge */}
          <div className="flex items-baseline space-x-2 mt-4 mb-1">
            <span className="text-5xl font-extrabold text-white tracking-tight">{overall}%</span>
            <span className="text-xs text-gray-400 font-medium">Ready</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-6 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 progress-bar-fill"
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>

        {/* Strongest & Weakest Insights */}
        <div className="space-y-3">
          <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-brand-accent uppercase tracking-wider font-bold mb-0.5">Strongest Pillar</p>
              <h4 className="text-white text-sm font-bold">{strongest}</h4>
            </div>
            <span className="text-brand-accent text-sm font-bold">{breakdown[strongest]}%</span>
          </div>
          <div className="p-3 bg-brand-danger/5 border border-brand-danger/10 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-brand-danger uppercase tracking-wider font-bold mb-0.5">Area to Improve</p>
              <h4 className="text-white text-sm font-bold">{weakest}</h4>
            </div>
            <span className="text-brand-danger text-sm font-bold">{breakdown[weakest]}%</span>
          </div>
        </div>
      </div>

      {/* Col 2: Category Breakdown */}
      <div className="lg:col-span-1">
        <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Core Pillars Breakdown</h4>
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 hide-scrollbar">
          {categories.map(cat => (
            <div key={cat.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-300">{cat.name}</span>
                <span className="text-gray-400 font-semibold">{cat.score}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full progress-bar-fill ${
                    cat.score >= 80 ? 'bg-brand-success' : cat.score >= 50 ? 'bg-brand-warning' : 'bg-brand-accent'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Company-wise readiness rating */}
      <div className="lg:col-span-1">
        <div className="flex items-center space-x-2 mb-3">
          <FaBriefcase className="text-brand-accent text-sm" />
          <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Company Targets</h4>
        </div>
        
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 hide-scrollbar">
          {companies.map(c => (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center space-x-1">
                  <span>{c.name}</span>
                  <span className="text-[9px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">{c.tier}</span>
                </span>
                <span className="text-gray-400 font-semibold">{c.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full progress-bar-fill ${getCompanyColor(c.score)}`}
                  style={{ width: `${c.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PlacementReadiness;
