import { useContext } from 'react';
import { AuthContext, ThemeContext } from '../context/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}

export function useTheme() {
  return useContext(ThemeContext);
}
