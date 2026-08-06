import { createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

const MOCK_CREDENTIALS = {
  admin: { role: 'admin', name: 'Admin Miller', email: 'admin@jeevandoot.org' },
  doctor: { role: 'doctor', name: 'Dr. Sharma', email: 'doctor@jeevandoot.org' },
  patient: { role: 'patient', name: 'Patient', email: 'patient@jeevandoot.org' },
  ngo: { role: 'ngo', name: 'Anjali Nair', email: 'ngo@jeevandoot.org' },
  government: { role: 'government', name: 'Government Official', email: 'govt@jeevandoot.org' },
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

  const register = useCallback(async (profile) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const authedUser = {
      id: `usr-${Date.now()}`,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      token: `mock-token-${profile.role}-${Date.now()}`,
      loggedInAt: new Date().toISOString(),
    };
    setUser(authedUser);
    localStorage.setItem('jd_user', JSON.stringify(authedUser));
    return authedUser;
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
