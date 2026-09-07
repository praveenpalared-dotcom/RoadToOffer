import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

async function safeParseJson(response, fallbackMsg = 'Request failed') {
  try {
    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      // Non-JSON response from server/proxy (e.g. 502 Bad Gateway)
      if (!response.ok) {
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error('Backend server is offline or unreachable. Please run "npm run dev" from the root folder to start both backend and frontend.');
        }
        throw new Error(`Server connection error (${response.status}). Please verify the backend API is running on port 5000.`);
      }
      throw new Error('Invalid JSON response received from server.');
    }
    if (!response.ok) {
      const errorDetail = data.error ? `: ${data.error}` : '';
      throw new Error((data.message || fallbackMsg) + errorDetail);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Sync token changes to axios/fetch headers or localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await safeParseJson(response, 'Profile fetch failed');
        setUser(data.user);
      } else {
        // Token might be invalid/expired
        logout();
      }
    } catch (err) {
      console.error('Profile fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await safeParseJson(response, 'Login failed');
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await safeParseJson(response, 'Registration failed');
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  const resetProgress = async () => {
    if (!token) return;
    const response = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await safeParseJson(response, 'Reset progress failed');
    setUser(data.user);
    return data;
  };

  const syncLeetCodeProfile = async (leetcodeUsername) => {
    if (!token) return;
    const response = await fetch('/api/leetcode/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ leetcodeUsername })
    });
    const data = await safeParseJson(response, 'Sync failed');
    setUser(data.user);
    return data;
  };

  const disconnectLeetCodeProfile = async () => {
    if (!token) return;
    const response = await fetch('/api/leetcode/disconnect', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await safeParseJson(response, 'Disconnect failed');
    setUser(data.user);
    return data;
  };

  const syncCodeforcesProfile = async (codeforcesHandle) => {
    if (!token) return;
    const response = await fetch('/api/codeforces/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ codeforcesHandle })
    });
    const data = await safeParseJson(response, 'Codeforces sync failed');
    setUser(data.user);
    return data;
  };

  const disconnectCodeforcesProfile = async () => {
    if (!token) return;
    const response = await fetch('/api/codeforces/disconnect', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await safeParseJson(response, 'Codeforces disconnect failed');
    setUser(data.user);
    return data;
  };

  const updateUserLocalState = (updatedFields) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  const resetPassword = async (email, newPassword) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, newPassword })
    });
    
    return await safeParseJson(response, 'Password reset failed');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      resetPassword,
      logout,
      resetProgress,
      syncLeetCodeProfile,
      disconnectLeetCodeProfile,
      syncCodeforcesProfile,
      disconnectCodeforcesProfile,
      updateUserLocalState,
      refreshProfile: fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
