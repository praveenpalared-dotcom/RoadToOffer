import React, { useState } from 'react';
import { FaFilePdf, FaGithub, FaMagic, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ResumeAnalyzer = () => {
  const { token } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.analysis);
      }
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <FaFilePdf className="text-brand-accent" />
          <span>Resume Analyzer</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">Get an AI-powered ATS score and actionable insights.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Upload Section */}
        <div className="flex-1 bg-brand-card/50 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center hover:border-brand-accent/50 transition-all cursor-pointer relative overflow-hidden">
          {analyzing ? (
            <div className="flex flex-col items-center">
              <FaMagic className="text-6xl text-brand-accent mb-4 animate-spin-slow" />
              <h3 className="text-lg font-bold text-white">AI is Analyzing your Resume...</h3>
              <p className="text-sm text-gray-400 mt-2">Extracting keywords and parsing impact metrics.</p>
            </div>
          ) : (
            <>
              <FaFilePdf className="text-6xl text-gray-600 mb-4 group-hover:text-brand-accent transition-colors" />
              <h3 className="text-lg font-bold text-white">Upload Resume (PDF)</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">Max file size 5MB.</p>
              <button onClick={handleAnalyze} className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/80 transition-all text-white rounded-xl font-bold text-sm flex items-center space-x-2">
                <FaMagic /> <span>Analyze Mock Resume</span>
              </button>
            </>
          )}
        </div>

        {/* GitHub Link Section */}
        <div className="flex-1 bg-brand-card/50 border border-white/5 rounded-2xl p-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <FaGithub /> <span>GitHub Profile Link</span>
          </h3>
          <input type="text" placeholder="https://github.com/username" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent mb-4" />
          <button className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 transition-all">
            Link GitHub Account
          </button>
        </div>
      </div>

      {/* Dynamic Results Section */}
      {result && (
        <div className="bg-brand-card border border-brand-accent/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(0,255,163,0.1)] space-y-8 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Analysis Complete</h2>
              <p className="text-gray-400">{result.feedback}</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-brand-accent">{result.score}/100</span>
              <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">ATS Match Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                <FaCheckCircle className="text-emerald-500" /> <span>Keywords Found</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keywords.found.map((k, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">{k}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                <FaExclamationTriangle className="text-amber-500" /> <span>Missing Keywords</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keywords.missing.map((k, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold">{k}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-black/30 p-6 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Actionable Improvements</h3>
            <ul className="space-y-3">
              {result.improvements.map((imp, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-gray-300">
                  <span className="text-brand-accent mt-0.5">→</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
