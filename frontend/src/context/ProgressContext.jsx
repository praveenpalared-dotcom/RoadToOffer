import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const ProgressContext = createContext(null);

async function safeParseJson(response, fallbackMsg = 'Request failed') {
  try {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new Error(data.message || `${fallbackMsg} (Status ${response.status})`);
    }
    return data;
  } catch (err) {
    if (err.message && !err.message.includes('Unexpected') && !err.message.includes('JSON')) {
      throw err;
    }
    if (!response.ok) {
      throw new Error(`Server connection failed (${response.status}). Please make sure the backend server is running.`);
    }
    throw new Error('Invalid response received from server.');
  }
}

export const ProgressProvider = ({ children }) => {
  const { token, updateUserLocalState } = useAuth();
  const [roadmapTracks, setRoadmapTracks] = useState([]);
  const [roadmapTopics, setRoadmapTopics] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [unlockedBadge, setUnlockedBadge] = useState(null); // Tracks the name of badge to show modal
  const [loading, setLoading] = useState(false);

  const fetchRoadmap = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/progress/roadmap', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await safeParseJson(response, 'Fetch roadmap failed');
        setRoadmapTracks(data.tracks || []);
        setRoadmapTopics(data.topics || []);
      }
    } catch (err) {
      console.error('Fetch roadmap failed:', err);
    }
  };

  const fetchDashboardStats = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/progress/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await safeParseJson(response, 'Fetch dashboard stats failed');
        setDashboardStats(data);
      }
    } catch (err) {
      console.error('Fetch dashboard stats failed:', err);
    }
  };

  const updateProblemStatus = async (problemId, topicSlug, updateFields) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/progress/problem/${problemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateFields)
      });
      
      const data = await safeParseJson(response, 'Problem update failed');

      // Update user details (XP, Level, Streaks, Daily Goals) in Auth Context
      updateUserLocalState(data.user);

      // Trigger Confetti if marked Completed now
      if (updateFields.status === 'Complete') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Check badge unlock
      if (data.badgeUnlocked) {
        setUnlockedBadge(data.badgeUnlocked);
        // Double burst for badges!
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 }
          });
        }, 300);
      }

      // Refresh roadmap and stats in background
      fetchRoadmap();
      fetchDashboardStats();

      return data;
    } catch (err) {
      console.error('Failed to update problem status:', err);
      throw err;
    }
  };

  const updateDailyGoals = async (goalsUpdate) => {
    if (!token) return;
    try {
      const response = await fetch('/api/progress/daily-goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalsUpdate)
      });
      if (response.ok) {
        const data = await safeParseJson(response, 'Failed to update daily goals');
        updateUserLocalState({ dailyGoals: data.dailyGoals });
        fetchDashboardStats();
      }
    } catch (err) {
      console.error('Failed to update daily goals:', err);
    }
  };

  // ADMIN CONTROLS
  const adminAddTopic = async (topicData) => {
    if (!token) return;
    const response = await fetch('/api/progress/admin/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(topicData)
    });
    const data = await safeParseJson(response, 'Failed to add topic');
    fetchRoadmap();
    return data;
  };

  const adminAddProblem = async (problemData) => {
    if (!token) return;
    const response = await fetch('/api/progress/admin/problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(problemData)
    });
    const data = await safeParseJson(response, 'Failed to add problem');
    fetchRoadmap();
    fetchDashboardStats();
    return data;
  };

  const adminUploadCSV = async (csvData, topicSlug) => {
    if (!token) return;
    const response = await fetch('/api/progress/admin/upload-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ csvData, topicSlug })
    });
    const data = await safeParseJson(response, 'CSV bulk upload failed');
    fetchRoadmap();
    fetchDashboardStats();
    return data;
  };

  return (
    <ProgressContext.Provider value={{
      roadmapTracks,
      roadmapTopics,
      dashboardStats,
      unlockedBadge,
      setUnlockedBadge,
      fetchRoadmap,
      fetchDashboardStats,
      updateProblemStatus,
      updateDailyGoals,
      adminAddTopic,
      adminAddProblem,
      adminUploadCSV
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
