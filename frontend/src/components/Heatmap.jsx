import React from 'react';

const Heatmap = ({ activity = {} }) => {
  // Generate dates for the last 26 weeks (182 days)
  const getHeatmapData = () => {
    const today = new Date();
    const data = [];
    
    // We want the grid to end on today.
    // To align properly into weeks (columns of 7 days), we will collect 26 weeks.
    // 26 weeks * 7 days = 182 days
    for (let i = 181; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const count = activity[dateString] || 0;
      data.push({
        date: d,
        dateStr: dateString,
        count
      });
    }
    return data;
  };

  const heatmapDays = getHeatmapData();

  // Helper to determine green color density
  const getCellColor = (count) => {
    if (count === 0) return 'bg-slate-800/80 hover:bg-slate-700 border border-white/5';
    if (count === 1) return 'bg-emerald-900 border border-emerald-950/20';
    if (count === 2) return 'bg-emerald-700 border border-emerald-800/20 shadow-sm shadow-emerald-500/10';
    return 'bg-emerald-400 border border-emerald-300/20 shadow-md shadow-emerald-500/20 animate-pulse';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Group days into weeks (columns of 7 items)
  const weeks = [];
  let currentWeek = [];
  
  heatmapDays.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === heatmapDays.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="w-full bg-brand-card/50 p-6 rounded-2xl glass-panel relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Consistency Heatmap</h3>
          <p className="text-xs text-gray-400">Your coding activity grid over the last 180 days</p>
        </div>
        
        {/* Color Legend */}
        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2 md:mt-0">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-800 border border-white/5" />
          <div className="w-3 h-3 rounded bg-emerald-900" />
          <div className="w-3 h-3 rounded bg-emerald-700" />
          <div className="w-3 h-3 rounded bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="overflow-x-auto w-full pb-2">
        <div className="flex space-x-1 min-w-[500px]">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col space-y-1">
              {week.map((day) => (
                <div
                  key={day.dateStr}
                  className={`w-3.5 h-3.5 rounded-sm relative group cursor-pointer transition-all duration-200 hover:scale-125 hover:z-20 ${getCellColor(day.count)}`}
                >
                  {/* Premium Floating Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-slate-900 border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none z-30">
                    <p className="font-bold text-brand-accent">
                      {day.count} {day.count === 1 ? 'problem' : 'problems'} solved
                    </p>
                    <p className="text-[10px] text-gray-400 font-normal">
                      {formatDate(day.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
