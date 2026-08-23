import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaStar, FaRegStar, FaStickyNote, FaExternalLinkAlt, FaCheck, FaUndo, FaSearch, FaFilter } from 'react-icons/fa';

const TopicDetails = () => {
  const { slug } = useParams();
  const { token } = useAuth();
  const { roadmapTopics, updateProblemStatus } = useProgress();
  
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Notes state
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [notesContent, setNotesContent] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Topic Metadata
  const topicMeta = roadmapTopics.find(t => t.slug === slug) || { name: slug, percentage: 0 };

  const fetchTopicProblems = async () => {
    try {
      const response = await fetch(`/api/progress/problems/${slug}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProblems(data.problems);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicProblems();
  }, [slug]);

  // Handle toggles
  const handleStatusToggle = async (prob) => {
    const nextStatus = prob.status === 'Complete' ? 'In Progress' : 'Complete';
    try {
      const result = await updateProblemStatus(prob._id, slug, { status: nextStatus });
      // Update local state
      setProblems(prev => prev.map(p => p._id === prob._id ? { ...p, status: nextStatus } : p));
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleFavoriteToggle = async (prob) => {
    const nextFav = !prob.isFavorite;
    try {
      await updateProblemStatus(prob._id, slug, { isFavorite: nextFav });
      setProblems(prev => prev.map(p => p._id === prob._id ? { ...p, isFavorite: nextFav } : p));
    } catch (e) {
      alert('Failed to update favorite');
    }
  };

  const handleRevisionChange = async (probId, schedule) => {
    try {
      await updateProblemStatus(probId, slug, { revisionSchedule: schedule });
      setProblems(prev => prev.map(p => p._id === probId ? { ...p, revisionSchedule: schedule } : p));
    } catch (e) {
      alert('Failed to update revision schedule');
    }
  };

  // Notes saving
  const openNotesEditor = (prob) => {
    setActiveNotesId(prob._id);
    setNotesContent(prob.notes || '');
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateProblemStatus(activeNotesId, slug, { notes: notesContent });
      setProblems(prev => prev.map(p => p._id === activeNotesId ? { ...p, notes: notesContent } : p));
      setActiveNotesId(null);
    } catch (e) {
      alert('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Filter implementation
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.pattern && p.pattern.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'text-brand-success bg-brand-success/10 border-brand-success/20';
    if (diff === 'Medium') return 'text-brand-warning bg-brand-warning/10 border-brand-warning/20';
    return 'text-brand-danger bg-brand-danger/10 border-brand-danger/20';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      
      {/* Back button and Topic metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Link 
            to="/roadmap"
            className="flex items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            <FaArrowLeft className="text-sm" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{topicMeta.name}</h2>
            <p className="text-xs text-gray-400">Total Solves: {topicMeta.completedProblems} / {topicMeta.totalProblems} Problems</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-1 bg-slate-900 border border-white/10 p-3 rounded-xl">
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            <span>Topic Progress</span>
            <span className="text-white">{topicMeta.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-primary progress-bar-fill" 
              style={{ width: `${topicMeta.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <FaSearch className="text-xs" />
          </span>
          <input
            type="text"
            placeholder="Search problems by name or pattern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-brand-card/50 border border-white/5 text-white placeholder-gray-500 text-sm focus:border-brand-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Difficulty */}
        <div className="md:col-span-3 flex items-center space-x-2 bg-brand-card/50 border border-white/5 px-3 py-1 rounded-xl">
          <span className="text-gray-500 text-xs"><FaFilter /></span>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-transparent text-white border-0 focus:outline-none text-xs h-9 cursor-pointer"
          >
            <option value="All" className="bg-slate-950">All Difficulties</option>
            <option value="Easy" className="bg-slate-950">Easy</option>
            <option value="Medium" className="bg-slate-950">Medium</option>
            <option value="Hard" className="bg-slate-950">Hard</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="md:col-span-3 flex items-center space-x-2 bg-brand-card/50 border border-white/5 px-3 py-1 rounded-xl">
          <span className="text-gray-500 text-xs"><FaFilter /></span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent text-white border-0 focus:outline-none text-xs h-9 cursor-pointer"
          >
            <option value="All" className="bg-slate-950">All Progress</option>
            <option value="Complete" className="bg-slate-950">Complete</option>
            <option value="In Progress" className="bg-slate-950">In Progress</option>
            <option value="Not Started" className="bg-slate-950">Not Started</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="w-full text-center py-16 text-gray-500">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span>Syncing problem banks...</span>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="w-full text-center py-16 bg-brand-card/25 rounded-2xl border border-white/5 text-gray-500">
          <p className="font-semibold text-gray-400">No matching problems found.</p>
          <p className="text-xs mt-1">Try expanding your search query or reset filters.</p>
        </div>
      ) : (
        /* Problems Cards List */
        <div className="space-y-4">
          {filteredProblems.map((prob) => {
            const isCompleted = prob.status === 'Complete';

            return (
              <div 
                key={prob._id}
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-slate-900/60 border-brand-success/15 hover:border-brand-success/20' 
                    : 'bg-brand-card/50 hover:bg-brand-card border-white/5 hover:border-white/10'
                } flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4`}
              >
                
                {/* Checkbox and detail info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Status checkbox */}
                  <button
                    onClick={() => handleStatusToggle(prob)}
                    className={`mt-1 flex items-center justify-center w-5.5 h-5.5 rounded-md border-2 transition-all ${
                      isCompleted 
                        ? 'bg-brand-success border-brand-success text-white' 
                        : 'border-slate-600 hover:border-slate-400 text-transparent'
                    }`}
                  >
                    <FaCheck className="text-[10px] font-black" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link 
                        to={`/problem/${prob._id}`}
                        className={`font-bold hover:text-brand-accent transition-colors ${
                          isCompleted ? 'text-gray-400 line-through' : 'text-white'
                        }`}
                      >
                        {prob.name}
                      </Link>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>

                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        🔥 Must Solve
                      </span>

                      {prob.pattern && (
                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono">
                          {prob.pattern}
                        </span>
                      )}

                      <span className="text-[10px] font-semibold text-brand-accent uppercase bg-brand-primary/10 border border-brand-primary/15 px-2 py-0.5 rounded">
                        +{prob.xp} XP
                      </span>
                    </div>

                    {/* Company tags */}
                    {prob.companyTags && prob.companyTags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {prob.companyTags.map(tag => (
                          <span key={tag} className="text-[9px] text-gray-400 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls section */}
                <div className="flex flex-wrap items-center gap-3.5 self-stretch lg:self-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                  
                  {/* Revision Selector */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Revise</span>
                    <select
                      value={prob.revisionSchedule || 'None'}
                      onChange={(e) => handleRevisionChange(prob._id, e.target.value)}
                      className="bg-slate-900/60 border border-white/10 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-primary cursor-pointer"
                    >
                      <option value="None">None</option>
                      <option value="1 Day">1 Day</option>
                      <option value="3 Days">3 Days</option>
                      <option value="7 Days">7 Days</option>
                    </select>
                  </div>

                  {/* Notes Button */}
                  <button
                    onClick={() => openNotesEditor(prob)}
                    title={prob.notes ? 'Edit Revision Notes' : 'Add Revision Notes'}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      prob.notes 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                        : 'bg-slate-900/60 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <FaStickyNote />
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={() => handleFavoriteToggle(prob)}
                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                      prob.isFavorite 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                        : 'bg-slate-900/60 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {prob.isFavorite ? <FaStar /> : <FaRegStar />}
                  </button>

                  {/* Link Platform */}
                  {prob.solutionLink && (
                    <a
                      href={prob.solutionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Solve on ${prob.platform}`}
                      className="flex items-center space-x-1 px-3 py-2 text-xs font-bold text-white bg-slate-900 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                    >
                      <span>{prob.platform}</span>
                      <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Floating Notes Editor Modal Overlay */}
      {activeNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Write Revision Notes</h3>
              <p className="text-xs text-gray-400">Save key constraints, runtime details, or corner cases for mock interviews.</p>
            </div>
            
            <textarea
              rows={6}
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder="e.g. Requires binary search on answer because check(mid) function is monotonic. Watch out for potential index overflows..."
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 text-xs focus:border-brand-primary focus:outline-none focus:ring-0 resize-none font-mono"
            />

            <div className="flex justify-end space-x-3 text-xs">
              <button
                onClick={() => setActiveNotesId(null)}
                className="px-4 py-2.5 bg-slate-900 border border-white/10 text-gray-400 hover:text-white rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="px-5 py-2.5 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/95 transition-all shadow-md"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TopicDetails;
