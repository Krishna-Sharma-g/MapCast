import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
});

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      setLoading(true);
      apiClient
        .get('/auth/profile')
        .then((res) => setUser(res.data.data.user))
        .catch(() => {
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      delete apiClient.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
      setLoading(false);
    }
  }, [token]);

  const handleAuthResponse = (response) => {
    const { user: nextUser, token: nextToken } = response.data.data;
    apiClient.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
    setToken(nextToken);
    setUser(nextUser);
    setError(null);
    setLoading(false);
  };

  const signup = async (payload) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/signup', payload);
      handleAuthResponse(response);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Unable to signup');
      throw err;
    }
  };

  const login = async (payload) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/login', payload);
      handleAuthResponse(response);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Unable to login');
      throw err;
    }
  };

  const logout = () => {
    delete apiClient.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
    setError(null);
  };

  const deleteAccount = async () => {
    await apiClient.delete('/auth/profile');
    logout();
  };

  const value = useMemo(
    () => ({
      api: apiClient,
      user,
      token,
      error,
      loading,
      signup,
      login,
      logout,
      deleteAccount,
      setError,
    }),
    [user, token, error, loading],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
