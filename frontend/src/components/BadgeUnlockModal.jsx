import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { FaAward, FaMedal, FaCrown, FaTimes, FaTrophy } from 'react-icons/fa';
import { GiDiamondRing, GiCrown } from 'react-icons/gi';

const BadgeUnlockModal = () => {
  const { unlockedBadge, setUnlockedBadge } = useProgress();

  if (!unlockedBadge) return null;

  const getBadgeDetails = (badge) => {
    switch (badge) {
      case 'Bronze':
        return {
          title: 'Bronze Tier Achieved',
          subtitle: 'Completed Foundation Phase',
          desc: 'You have mastered core arrays, strings, hashing, linked lists, stacks, and binary search. The journey has officially begun!',
          color: 'from-amber-700 via-amber-600 to-amber-800',
          icon: <FaMedal className="text-amber-500 text-7xl" />,
          shadow: 'shadow-amber-500/20'
        };
      case 'Silver':
        return {
          title: 'Silver Tier Achieved',
          subtitle: 'Completed Problem Solving Phase',
          desc: 'You have conquered key greedy algorithms, recursion, backtracking, and bit manipulation. Your algorithmic intuition is sharpening!',
          color: 'from-gray-400 via-gray-300 to-gray-500',
          icon: <FaMedal className="text-gray-300 text-7xl" />,
          shadow: 'shadow-gray-400/20'
        };
      case 'Gold':
        return {
          title: 'Gold Tier Achieved',
          subtitle: 'Completed Trees Phase',
          desc: 'You are now fluent in binary trees, BST properties, traversal patterns, and priority queues. Excellent structural traversal!',
          color: 'from-yellow-500 via-yellow-400 to-yellow-600',
          icon: <FaTrophy className="text-yellow-400 text-7xl" />,
          shadow: 'shadow-yellow-400/20'
        };
      case 'Platinum':
        return {
          title: 'Platinum Tier Achieved',
          subtitle: 'Completed Graphs Phase',
          desc: 'You have navigated BFS, DFS, Dijkstra, network topologies, and spanning tree algorithms. Your structural pathfinding is stellar!',
          color: 'from-teal-500 via-teal-400 to-emerald-500',
          icon: <FaAward className="text-teal-300 text-7xl" />,
          shadow: 'shadow-teal-400/20'
        };
      case 'Diamond':
        return {
          title: 'Diamond Tier Achieved',
          subtitle: 'Completed DP Phase',
          desc: 'You have unlocked the secrets of Dynamic Programming: 1D, 2D Grid structures, and Knapsack optimization. Pure problem solving artistry!',
          color: 'from-blue-600 via-indigo-500 to-purple-600',
          icon: <GiDiamondRing className="text-blue-300 text-7xl animate-pulse" />,
          shadow: 'shadow-blue-500/20'
        };
      case 'Grandmaster':
        return {
          title: 'Grandmaster Tier Unlocked!',
          subtitle: 'Completed Entire Roadmap',
          desc: 'You solved every single DSA problem in the curriculum! You are highly competitive and ready to crack interviews at any FAANG/Tier-1 firm. Simply legendary!',
          color: 'from-red-600 via-orange-500 to-yellow-500',
          icon: <GiCrown className="text-red-400 text-8xl animate-bounce" />,
          shadow: 'shadow-red-500/35'
        };
      default:
        return {
          title: 'Achievement Unlocked',
          subtitle: 'Milestone Cleared',
          desc: 'Congratulations on completing this DSA preparation stage!',
          color: 'from-blue-500 to-indigo-600',
          icon: <FaAward className="text-white text-7xl" />,
          shadow: 'shadow-blue-500/20'
        };
    }
  };

  const details = getBadgeDetails(unlockedBadge);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Background Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={() => setUnlockedBadge(null)}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.85, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl glass-panel text-center p-8 ${details.shadow} border border-white/10`}
        >
          {/* Close button */}
          <button
            onClick={() => setUnlockedBadge(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Glowing Animated Background Ring */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Badge Emblem Display */}
          <div className="flex justify-center mb-6 mt-4">
            <motion.div
              initial={{ rotateY: 180, scale: 0.5 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
              className="p-6 bg-white/5 rounded-full border border-white/10 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/10 rounded-full" />
              {details.icon}
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
            {details.title}
          </h2>
          <p className="text-brand-accent font-bold text-sm uppercase tracking-wider mb-4">
            {details.subtitle}
          </p>

          {/* Divider */}
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-4" />

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-6 px-2">
            {details.desc}
          </p>

          {/* Call-to-action button */}
          <button
            onClick={() => setUnlockedBadge(null)}
            className={`w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${details.color} hover:brightness-110 shadow-lg active:scale-[0.98] transition-all`}
          >
            Claim & Keep Solving
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BadgeUnlockModal;
