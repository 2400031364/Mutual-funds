import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RoleRedirect() {
  const { user, roleDashboardPath } = useAuth();
  if (!user) return ;
  return ;
}



