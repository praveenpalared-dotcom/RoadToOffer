import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaFolderPlus, FaGithub, FaExternalLinkAlt, FaCode, FaCheckCircle, 
  FaClock, FaTrash, FaEdit, FaRocket, FaLightbulb, FaLayerGroup, 
  FaStar, FaShieldAlt, FaTerminal, FaLaptopCode, FaPlus, FaTimes, FaAward,
  FaCoins, FaUniversity, FaChartLine, FaLandmark
} from 'react-icons/fa';

const Projects = () => {
  const { token, user, updateUserLocalState } = useAuth();
  const [activeTab, setActiveTab] = useState('my-projects'); // 'my-projects' | 'blueprints'
  const [blueprintCategory, setBlueprintCategory] = useState('all'); // 'all' | 'fintech' | 'faang'
  const [userProjects, setUserProjects] = useState([]);
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Fintech & High-Frequency Trading',
    techStack: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    status: 'In Progress',
    resumeBullets: ''
  });

  const categories = [
    'Tech Project - AI/ML',
    'Tech Project - Full Stack',
    'Tech Project - Backend/Systems',
    'FinTech Project',
    'VLSI Semiconductor Project'
  ];
  const statuses = ['Planning', 'In Progress', 'Completed'];

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUserProjects(data.userProjects || []);
        setBlueprints(data.recommendedBlueprints || []);
      } else {
        setError(data.message || 'Failed to load projects');
      }
    } catch (err) {
      setError('Network error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Tech Project - Full Stack',
      techStack: 'React, Node.js, Express, MongoDB, TailwindCSS',
      description: 'Full stack web application featuring responsive UI, authentication, and RESTful APIs.',
      githubUrl: 'https://github.com/username/project-repo',
      demoUrl: 'https://project-demo.vercel.app',
      status: 'In Progress',
      resumeBullets: 'Architected fullstack platform serving 1,000+ active users.\nIntegrated JWT authentication and REST endpoints reducing latency by 25%.'
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingId(proj._id || proj.id);
    setFormData({
      title: proj.title || '',
      category: proj.category || 'Tech Project - Full Stack',
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (proj.techStack || ''),
      description: proj.description || '',
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      status: proj.status || 'In Progress',
      resumeBullets: Array.isArray(proj.resumeBullets) ? proj.resumeBullets.join('\n') : (proj.resumeBullets || '')
    });
    setError('');
    setShowModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setUserProjects(data.userProjects || []);
        if (data.user) {
          updateUserLocalState(data.user);
        }
        setSuccessMsg(data.message || (editingId ? 'Project updated!' : 'Project added (+150 XP earned)!'));
        setShowModal(false);
      } else {
        setError(data.message || 'Failed to save project');
      }
    } catch (err) {
      setError('Network error saving project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUserProjects(data.userProjects || []);
        setSuccessMsg('Project removed successfully.');
      }
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const handleUseBlueprint = (bp) => {
    setEditingId(null);
    setFormData({
      title: bp.title,
      category: bp.category,
      techStack: bp.techStack.join(', '),
      description: bp.summary,
      githubUrl: bp.githubUrl || '',
      demoUrl: '',
      status: 'In Progress',
      resumeBullets: bp.resumeBullets.join('\n')
    });
    setActiveTab('my-projects');
    setShowModal(true);
  };

  const completedCount = userProjects.filter(p => p.status === 'Completed').length;
  const inProgressCount = userProjects.filter(p => p.status === 'In Progress').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span className="p-2.5 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <FaLaptopCode className="text-2xl" />
            </span>
            <span>Portfolio Projects Hub</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            Showcase your real-world software projects, craft STAR-formatted resume bullets for FAANG recruiters, and discover high-impact industry blueprints.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <FaPlus />
          <span>Add Custom Project (+150 XP)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <FaLayerGroup className="text-xl" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Projects</span>
            <span className="text-2xl font-black text-white">{userProjects.length}</span>
          </div>
        </div>

        <div className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <FaCheckCircle className="text-xl" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-black text-emerald-400">{completedCount}</span>
          </div>
        </div>

        <div className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <FaClock className="text-xl" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-black text-amber-400">{inProgressCount}</span>
          </div>
        </div>

        <div className="bg-brand-card/50 p-5 rounded-2xl glass-panel border border-white/5 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <FaAward className="text-xl" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Project XP Earned</span>
            <span className="text-2xl font-black text-purple-400">{userProjects.length * 150} XP</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><FaTimes /></button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}><FaTimes /></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('my-projects')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'my-projects'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/60 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <FaLaptopCode />
          <span>My Projects ({userProjects.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('blueprints'); setBlueprintCategory('all'); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'blueprints' && blueprintCategory === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900/60 text-gray-400 hover:text-white border border-white/5'
          }`}
        >
          <FaLightbulb className="text-amber-400" />
          <span>FAANG & Big Tech Blueprints ({blueprints.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('blueprints'); setBlueprintCategory('fintech'); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'blueprints' && blueprintCategory === 'fintech'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-emerald-950/40 text-emerald-400 hover:text-white border border-emerald-500/20'
          }`}
        >
          <FaCoins className="text-amber-400" />
          <span>Fintech & HFT Blueprints ({blueprints.filter(b => b.category.includes('Fintech')).length})</span>
        </button>
      </div>

      {/* TAB 1: MY PROJECTS */}
      {activeTab === 'my-projects' && (
        <div className="space-y-6">
          {userProjects.length === 0 ? (
            <div className="bg-brand-card/30 border border-white/5 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto text-2xl">
                <FaFolderPlus />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">No Projects Added Yet</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                Add your software projects to build a recruiter-ready portfolio, generate STAR resume bullet points, and earn +150 XP per project!
              </p>
              <div className="pt-2 flex justify-center space-x-4">
                <button
                  onClick={handleOpenAddModal}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Add First Project</span>
                </button>
                <button
                  onClick={() => { setActiveTab('blueprints'); setBlueprintCategory('fintech'); }}
                  className="px-6 py-3 bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-2"
                >
                  <FaCoins className="text-amber-400" />
                  <span>Explore Fintech Blueprints</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userProjects.map((proj) => {
                const isFintech = proj.category?.includes('Fintech');
                return (
                  <div key={proj._id || proj.id} className={`bg-brand-card/50 p-6 rounded-2xl glass-panel border flex flex-col justify-between space-y-4 hover:border-blue-500/30 transition-all group ${
                    isFintech ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-white/5'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center space-x-1 ${
                          isFintech 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {isFintech && <FaCoins className="text-[10px] text-amber-400 mr-1" />}
                          <span>{proj.category || 'Full Stack'}</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                            proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            proj.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-slate-800 text-gray-400 border-white/10'
                          }`}>
                            {proj.status}
                          </span>
                          <button
                            onClick={() => handleOpenEditModal(proj)}
                            className="p-1.5 text-gray-400 hover:text-white transition-colors"
                            title="Edit Project"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj._id || proj.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                            title="Delete Project"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>

                      {/* Tech Stack Pills */}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.techStack.map((tech, idx) => (
                            <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-gray-300 font-mono">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Resume Bullets */}
                      {proj.resumeBullets && proj.resumeBullets.length > 0 && (
                        <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs text-gray-300 font-sans">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block flex items-center space-x-1">
                            <FaStar className="text-[9px]" />
                            <span>{isFintech ? 'Fintech & Quant Resume STAR Bullets' : 'FAANG Resume STAR Bullets'}</span>
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-gray-300">
                            {proj.resumeBullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="text-gray-300">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Links Row */}
                    <div className="flex items-center space-x-3 pt-3 border-t border-white/5 text-xs font-bold">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-lg border border-white/10 flex items-center space-x-1.5 transition-colors"
                        >
                          <FaGithub />
                          <span>GitHub Code</span>
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20 flex items-center space-x-1.5 transition-colors"
                        >
                          <FaExternalLinkAlt className="text-[10px]" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INDUSTRY BLUEPRINTS */}
      {activeTab === 'blueprints' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-950/30 to-emerald-950/30 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <FaLandmark className="text-2xl" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Recruiter-Approved FAANG & Fintech Architectural Blueprints</span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adopt high-throughput distributed systems, low-latency HFT matching engines, and double-entry payment ledgers designed for FAANG & Wall Street recruiters.
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
              <button
                onClick={() => setBlueprintCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  blueprintCategory === 'all'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                All ({blueprints.length})
              </button>
              <button
                onClick={() => setBlueprintCategory('Fintech & High-Frequency Trading')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  blueprintCategory === 'Fintech & High-Frequency Trading'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-950/40 text-emerald-400 hover:text-white border border-emerald-500/20'
                }`}
              >
                <FaCoins className="text-[10px]" />
                <span>Fintech & HFT ({blueprints.filter(b => b.category?.includes('Fintech')).length})</span>
              </button>
              {categories.filter(c => c !== 'Fintech & High-Frequency Trading').map(cat => {
                const count = blueprints.filter(b => b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setBlueprintCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      blueprintCategory === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat.split('&')[0].trim()} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Blueprints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprints
              .filter(bp => {
                if (blueprintCategory === 'all') return true;
                if (blueprintCategory === 'fintech') return bp.category?.includes('Fintech');
                if (blueprintCategory === 'systems') return bp.category?.includes('Systems') || bp.category?.includes('AI');
                return bp.category === blueprintCategory;
              })
              .map((bp) => {
                const isFintech = bp.category.includes('Fintech');
                return (
                  <div key={bp.id} className={`bg-brand-card/50 p-6 rounded-2xl glass-panel border flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all ${
                    isFintech ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-white/5'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center space-x-1 ${
                          isFintech
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {isFintech && <FaCoins className="text-amber-400 mr-1" />}
                          <span>{bp.category}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isFintech ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          +{bp.xpReward || 200} XP
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                        {isFintech && <FaUniversity className="text-emerald-400 text-sm flex-shrink-0" />}
                        <span>{bp.title}</span>
                      </h3>

                      <p className="text-xs text-gray-300 leading-relaxed">{bp.summary}</p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {bp.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Resume Bullet Highlights */}
                      <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center space-x-1">
                          <FaStar className="text-[9px]" />
                          <span>{isFintech ? 'Wall Street & Fintech STAR Resume Bullets' : 'FAANG STAR Method Resume Impact Bullets'}</span>
                        </span>
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-300">
                          {bp.resumeBullets.map((bullet, idx) => (
                            <li key={idx} className="leading-relaxed">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUseBlueprint(bp)}
                      className={`w-full py-3 border text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${
                        isFintech
                          ? 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/30 text-emerald-300'
                          : 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/30 text-purple-300'
                      }`}
                    >
                      <FaRocket />
                      <span>Adopt This {isFintech ? 'Fintech' : 'FAANG'} Blueprint</span>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <FaLaptopCode className="text-blue-400" />
                <span>{editingId ? 'Edit Project Details' : 'Add New Portfolio Project'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-lg">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. High-Concurrency Distributed Cache"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status & Tech Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="React, Node.js, Redis, Docker"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://project-demo.vercel.app"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">Project Overview / Highlights</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what your project does and its core architecture..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* STAR Resume Bullets */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5">
                  FAANG STAR Method Resume Bullets (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.resumeBullets}
                  onChange={(e) => setFormData({ ...formData, resumeBullets: e.target.value })}
                  placeholder="Engineered X using Y resulting in Z% performance improvement..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update Project' : 'Save & Earn +150 XP')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Projects;
