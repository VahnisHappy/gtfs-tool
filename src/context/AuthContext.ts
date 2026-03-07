import { createContext } from 'react';
import type { AuthUser } from '../services/authService';

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export default AuthContext;