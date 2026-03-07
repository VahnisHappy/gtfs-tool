import { useState, useEffect, type ReactNode } from 'react';
import AuthContext from '../../context/AuthContext';
import { fetchCurrentUser, isAuthenticated, logout, type AuthUser } from '../../services/authService';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    setUser(null);
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
