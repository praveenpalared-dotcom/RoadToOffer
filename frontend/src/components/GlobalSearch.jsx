import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaMapSigns, FaLaptopCode, FaBuilding, FaUserTie, FaFileAlt } from 'react-icons/fa';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const links = [
    { name: 'Roadmap', path: '/roadmap', icon: <FaMapSigns className="text-amber-400" />, keywords: ['tracks', 'path', 'learn', 'dsa'] },
    { name: 'Projects', path: '/projects', icon: <FaLaptopCode className="text-blue-400" />, keywords: ['portfolio', 'blueprints', 'faang', 'build'] },
    { name: 'Company Prep', path: '/companies', icon: <FaBuilding className="text-purple-400" />, keywords: ['target', 'tier', 'requirements'] },
    { name: 'Interviews', path: '/interviews', icon: <FaUserTie className="text-emerald-400" />, keywords: ['mock', 'hr', 'system design'] },
    { name: 'Resume Builder', path: '/resume', icon: <FaFileAlt className="text-rose-400" />, keywords: ['star', 'bullets', 'cv', 'export'] },
    { name: 'Analytics', path: '/analytics', icon: <FaSearch className="text-gray-400" />, keywords: ['stats', 'heatmap', 'report'] }
  ];

  const filteredLinks = query.trim() === '' 
    ? links 
    : links.filter(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) || 
        l.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200">
        
        <div className="flex items-center px-4 py-4 border-b border-white/5 relative">
          <FaSearch className="text-gray-400 text-lg absolute left-6" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pages, features, or 'Ctrl+K' commands..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm"
          />
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white px-2">
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredLinks.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quick Navigation</div>
              {filteredLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(link.path);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{link.name}</h4>
                    <p className="text-[10px] text-gray-500">{link.path}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium">Jump</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 bg-slate-950/50 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <span>Use</span>
            <span className="px-1.5 py-0.5 rounded border border-white/10 bg-slate-800 font-mono">↑↓</span>
            <span>to navigate</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Press</span>
            <span className="px-1.5 py-0.5 rounded border border-white/10 bg-slate-800 font-mono">Esc</span>
            <span>to close</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalSearch;
