import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

const AuthContext = createContext(null);

// ============================================================
// SAFE JSON PARSER
// ============================================================

async function safeParseJson(
  response,
  fallbackMsg = 'Request failed'
) {
  try {
    const text = await response.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      // Non-JSON response from server/proxy
      if (!response.ok) {
        if (
          response.status === 502 ||
          response.status === 503 ||
          response.status === 504
        ) {
          throw new Error(
            'Backend server is offline or unreachable. Please run "npm run dev" from the root folder to start both backend and frontend.'
          );
        }

        throw new Error(
          `Server connection error (${response.status}). Please verify the backend API is running on port 5000.`
        );
      }

      throw new Error(
        'Invalid JSON response received from server.'
      );
    }

    if (!response.ok) {
      const errorDetail = data.error
        ? `: ${data.error}`
        : '';

      throw new Error(
        (data.message || fallbackMsg) + errorDetail
      );
    }

    return data;
  } catch (err) {
    throw err;
  }
}

// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem('token') || ''
  );

  const [loading, setLoading] = useState(true);

  // ==========================================================
  // TOKEN / PROFILE SYNC
  // ==========================================================

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

  // ==========================================================
  // FETCH USER PROFILE
  // ==========================================================

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        '/api/auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await safeParseJson(
          response,
          'Profile fetch failed'
        );

        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error(
        'Profile fetch failed:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIALIZE USER PROBLEMS
  // ==========================================================
  //
  // IMPORTANT:
  // This is intentionally NOT awaited during registration.
  //
  // Registration can finish immediately while the problems
  // are initialized separately.
  // ==========================================================

  const initializeUserProblems = async (
    authToken
  ) => {
    if (!authToken) return;

    try {
      console.log(
        '[AUTH] Starting background problem initialization...'
      );

      const response = await fetch(
        '/api/auth/initialize',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      const data = await safeParseJson(
        response,
        'Problem initialization failed'
      );

      console.log(
        '[AUTH] Problem initialization completed:',
        data
      );

      return data;
    } catch (err) {
      // Do NOT log the user out if initialization fails.
      // Authentication has already succeeded.
      console.error(
        '[AUTH] Background problem initialization failed:',
        err
      );
    }
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email,
    password
  ) => {
    const response = await fetch(
      '/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await safeParseJson(
      response,
      'Login failed'
    );

    // Save authentication immediately
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = async (
    name,
    email,
    password
  ) => {
    // --------------------------------------------------------
    // STEP 1: Register user
    // --------------------------------------------------------

    const response = await fetch(
      '/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    // --------------------------------------------------------
    // STEP 2: Get token immediately
    // --------------------------------------------------------

    const data = await safeParseJson(
      response,
      'Registration failed'
    );

    // --------------------------------------------------------
    // STEP 3: Authenticate immediately
    // --------------------------------------------------------

    setToken(data.token);
    setUser(data.user);

    // --------------------------------------------------------
    // STEP 4: Start problem initialization separately
    //
    // IMPORTANT:
    // There is NO await here.
    //
    // The dashboard can open immediately.
    // --------------------------------------------------------

    initializeUserProblems(data.token);

    return data;
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  // ==========================================================
  // RESET PROGRESS
  // ==========================================================

  const resetProgress = async () => {
    if (!token) return;

    const response = await fetch(
      '/api/auth/reset',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await safeParseJson(
      response,
      'Reset progress failed'
    );

    setUser(data.user);

    return data;
  };

  // ==========================================================
  // LEETCODE SYNC
  // ==========================================================

  const syncLeetCodeProfile = async (
    leetcodeUsername
  ) => {
    if (!token) return;

    const response = await fetch(
      '/api/leetcode/sync',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          leetcodeUsername
        })
      }
    );

    const data = await safeParseJson(
      response,
      'Sync failed'
    );

    setUser(data.user);

    return data;
  };

  // ==========================================================
  // DISCONNECT LEETCODE
  // ==========================================================

  const disconnectLeetCodeProfile =
    async () => {
      if (!token) return;

      const response = await fetch(
        '/api/leetcode/disconnect',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await safeParseJson(
        response,
        'Disconnect failed'
      );

      setUser(data.user);

      return data;
    };

  // ==========================================================
  // CODEFORCES SYNC
  // ==========================================================

  const syncCodeforcesProfile = async (
    codeforcesHandle
  ) => {
    if (!token) return;

    const response = await fetch(
      '/api/codeforces/sync',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          codeforcesHandle
        })
      }
    );

    const data = await safeParseJson(
      response,
      'Codeforces sync failed'
    );

    setUser(data.user);

    return data;
  };

  // ==========================================================
  // DISCONNECT CODEFORCES
  // ==========================================================

  const disconnectCodeforcesProfile =
    async () => {
      if (!token) return;

      const response = await fetch(
        '/api/codeforces/disconnect',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await safeParseJson(
        response,
        'Disconnect failed'
      );

      setUser(data.user);

      return data;
    };

  // ==========================================================
  // UPDATE LOCAL USER STATE
  // ==========================================================

  const updateUserLocalState = (
    updatedFields
  ) => {
    setUser(prev =>
      prev
        ? {
          ...prev,
          ...updatedFields
        }
        : null
    );
  };

  // ==========================================================
  // RESET PASSWORD
  // ==========================================================

  const resetPassword = async (
    email,
    newPassword
  ) => {
    const response = await fetch(
      '/api/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          newPassword
        })
      }
    );

    return await safeParseJson(
      response,
      'Password reset failed'
    );
  };

  // ==========================================================
  // CONTEXT
  // ==========================================================

  return (
    <AuthContext.Provider
      value={{
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

        refreshProfile: fetchUserProfile,

        initializeUserProblems
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};