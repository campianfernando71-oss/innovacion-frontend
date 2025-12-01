import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // Ahora está correctamente exportado

export default function useAuth() {
  return useContext(AuthContext);
}
