import { createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const MOCK_CREDENTIALS = {
  admin: { role: 'admin', name: 'Admin Miller', email: 'admin@jeevandoot.org' },
  doctor: { role: 'doctor', name: 'Dr. Sharma', email: 'doctor@jeevandoot.org' },
  chw: { role: 'chw', name: 'Priya Sharma', email: 'chw@jeevandoot.org' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jd_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (role, email, _password) => {
    // Mock authentication. In production, call authService.login()
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const profile = MOCK_CREDENTIALS[role];
    const authedUser = {
      ...profile,
      email: email || profile.email,
      token: `mock-token-${role}-${Date.now()}`,
      loggedInAt: new Date().toISOString(),
    };
    setUser(authedUser);
    localStorage.setItem('jd_user', JSON.stringify(authedUser));
    return authedUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('jd_user');
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
