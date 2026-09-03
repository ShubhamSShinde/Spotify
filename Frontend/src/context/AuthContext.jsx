import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext(null);

const USER_KEY = 'spotify_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginUser(credentials);
      // Backend sets the JWT cookie — we store user info in localStorage
      // to persist role/username across page refreshes
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await registerUser(credentials);
      localStorage.setItem(USER_KEY, JSON.stringify(data.newUser));
      setUser(data.newUser);
      return data.newUser;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if request fails, clear local state
    } finally {
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
