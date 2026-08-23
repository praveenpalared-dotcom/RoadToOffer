import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { FaCog, FaPlus, FaUpload, FaDatabase, FaList } from 'react-icons/fa';

const Admin = () => {
  const { roadmapTopics, adminAddTopic, adminAddProblem, adminUploadCSV } = useProgress();

  // Add Topic state
  const [topicName, setTopicName] = useState('');
  const [topicPhase, setTopicPhase] = useState('Foundation');
  const [topicOrder, setTopicOrder] = useState('1');
  const [topicLoading, setTopicLoading] = useState(false);

  // Add Problem state
  const [probName, setProbName] = useState('');
  const [probDiff, setProbDiff] = useState('Easy');
  const [probPattern, setProbPattern] = useState('');
  const [probPlatform, setProbPlatform] = useState('LeetCode');
  const [probTags, setProbTags] = useState('');
  const [probLink, setProbLink] = useState('');
  const [probTopic, setProbTopic] = useState(roadmapTopics[0]?.slug || 'arrays');
  const [probLoading, setProbLoading] = useState(false);

  // CSV State
  const [csvContent, setCsvContent] = useState('');
  const [csvTopic, setCsvTopic] = useState(roadmapTopics[0]?.slug || 'arrays');
  const [csvLoading, setCsvLoading] = useState(false);

  useEffect(() => {
    if (roadmapTopics.length > 0) {
      if (!probTopic || probTopic === 'arrays') setProbTopic(roadmapTopics[0].slug);
      if (!csvTopic || csvTopic === 'arrays') setCsvTopic(roadmapTopics[0].slug);
    }
  }, [roadmapTopics]);

  // Submit handlers
  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topicName) return;
    setTopicLoading(true);
    try {
      await adminAddTopic({
        name: topicName,
        phase: topicPhase,
        order: parseInt(topicOrder) || 1
      });
      alert('Topic added successfully!');
      setTopicName('');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setTopicLoading(false);
    }
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    if (!probName || !probTopic) return;
    setProbLoading(true);

    const tags = probTags ? probTags.split(';').map(t => t.trim()) : [];

    try {
      await adminAddProblem({
        name: probName,
        difficulty: probDiff,
        pattern: probPattern,
        platform: probPlatform,
        companyTags: tags,
        solutionLink: probLink,
        topicSlug: probTopic
      });
      alert('Problem template seeded successfully!');
      setProbName('');
      setProbPattern('');
      setProbLink('');
      setProbTags('');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setProbLoading(false);
    }
  };

  const handleCSVSubmit = async (e) => {
    e.preventDefault();
    if (!csvContent || !csvTopic) return;
    setCsvLoading(true);
    try {
      const data = await adminUploadCSV(csvContent, csvTopic);
      alert(data.message || 'CSV Bulk Upload Successful!');
      setCsvContent('');
    } catch (err) {
      alert('CSV Upload Failed: ' + err.message);
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      <div className="border-b border-white/5 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <FaCog className="text-brand-accent animate-spin" style={{ animationDuration: '6s' }} />
          <span>Admin Platform Console</span>
        </h2>
        <p className="text-xs text-gray-400">Add custom topics, inject algorithmic coding questions, or parse CSV templates directly into the database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column Forms (Width 6) */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Form 1: Add Custom Topic */}
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FaPlus className="text-brand-success text-xs" />
              <span>Create Custom DSA Topic</span>
            </h3>

            <form onSubmit={handleTopicSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-semibold uppercase">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Segment Trees"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold uppercase">Roadmap Phase</label>
                  <select
                    value={topicPhase}
                    onChange={(e) => setTopicPhase(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white focus:border-brand-primary focus:outline-none cursor-pointer"
                  >
                    <option value="Foundation">Phase 1: Foundation</option>
                    <option value="Problem Solving">Phase 2: Problem Solving</option>
                    <option value="Trees">Phase 3: Trees</option>
                    <option value="Graphs">Phase 4: Graphs</option>
                    <option value="Dynamic Programming">Phase 5: Dynamic Programming</option>
                    <option value="Advanced">Phase 6: Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold uppercase">Order Rank</label>
                  <input
                    type="number"
                    min="1"
                    value={topicOrder}
                    onChange={(e) => setTopicOrder(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={topicLoading}
                className="w-full py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-md tracking-wider active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {topicLoading ? 'Creating topic...' : 'Create Topic'}
              </button>
            </form>
          </div>

          {/* Form 2: Add Custom Problem */}
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FaPlus className="text-brand-accent text-xs" />
              <span>Seeding Custom Code Problems</span>
            </h3>

            <form onSubmit={handleProblemSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-semibold uppercase">Problem Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lowest Common Ancestor"
                  value={probName}
                  onChange={(e) => setProbName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold uppercase">Topic Destination</label>
                  <select
                    value={probTopic}
                    onChange={(e) => setProbTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white focus:border-brand-primary focus:outline-none cursor-pointer"
                  >
                    {roadmapTopics.map(t => (
                      <option key={t.slug} value={t.slug}>{t.name} ({t.phase})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold uppercase">Difficulty Level</label>
                  <select
                    value={probDiff}
                    onChange={(e) => setProbDiff(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white focus:border-brand-primary focus:outline-none cursor-pointer"
                  >
                    <option value="Easy">Easy (+20 XP)</option>
                    <option value="Medium">Medium (+50 XP)</option>
                    <option value="Hard">Hard (+100 XP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold uppercase">Coding Pattern</label>
                  <input
                    type="text"
                    placeholder="e.g. Sliding Window / DFS"
                    value={probPattern}
                    onChange={(e) => setProbPattern(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 font-semibold uppercase">Platform</label>
                  <input
                    type="text"
                    placeholder="e.g. LeetCode / GeeksforGeeks"
                    value={probPlatform}
                    onChange={(e) => setProbPlatform(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold uppercase">Practice Link URL</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={probLink}
                  onChange={(e) => setProbLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold uppercase">Asked Companies (Separated by Semicolon ';')</label>
                <input
                  type="text"
                  placeholder="Google; Amazon; Meta; Microsoft"
                  value={probTags}
                  onChange={(e) => setProbTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={probLoading}
                className="w-full py-3 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-md tracking-wider active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {probLoading ? 'Seeding problem...' : 'Seed Problem Template'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: CSV Bulk Upload (Width 6) */}
        <div className="lg:col-span-6 space-y-8">
          
          <div className="bg-brand-card/50 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <FaUpload className="text-brand-warning text-xs animate-bounce" />
                <span>Bulk CSV Question Importer</span>
              </h3>
              <span className="text-[10px] text-brand-warning bg-brand-warning/10 border border-brand-warning/15 px-2 py-0.5 rounded font-bold uppercase">
                CSV Input
              </span>
            </div>

            <form onSubmit={handleCSVSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-semibold uppercase">Target DSA Topic</label>
                <select
                  value={csvTopic}
                  onChange={(e) => setCsvTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white focus:border-brand-primary focus:outline-none cursor-pointer text-xs"
                >
                  {roadmapTopics.map(t => (
                    <option key={t.slug} value={t.slug}>{t.name} ({t.phase})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold uppercase block">Raw CSV Data</label>
                <textarea
                  rows={10}
                  required
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={`Name,Difficulty,Pattern,Platform,CompanyTags,PracticeLink
"Subarray Product Less Than K","Medium","Sliding Window","LeetCode","Google;Amazon","https://leetcode.com/problems/..."
"Sort Colors","Medium","Three Pointers","LeetCode","Meta;Microsoft","https://leetcode.com/problems/..."`}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-gray-500 font-mono text-[10px] focus:border-brand-primary focus:outline-none resize-none"
                />
              </div>

              {/* Formatting Helper Alert */}
              <div className="p-3.5 bg-slate-900 border border-white/5 rounded-xl space-y-1 text-gray-400 leading-normal">
                <p className="font-bold text-white flex items-center space-x-1">
                  <FaDatabase className="text-[10px] text-brand-accent" />
                  <span>CSV Schema Formatting Rules:</span>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[10px]">
                  <li>Include header row: <span className="font-mono text-white">Name,Difficulty,Pattern,Platform,CompanyTags,PracticeLink</span></li>
                  <li>Values containing commas (like company arrays) should be wrapped in double quotes.</li>
                  <li>Separate companies using semicolons (<span className="text-white font-mono">;</span>).</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={csvLoading}
                className="w-full py-3.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-md tracking-wider active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {csvLoading ? 'Uploading & parsing CSV...' : 'Parse and Import CSV Data'}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Admin;
