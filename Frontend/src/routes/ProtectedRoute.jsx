import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards a route by auth state and optional role check.
 * @param {React.ReactNode} children  — what to render if allowed
 * @param {'user'|'artist'|null} role — required role (null = any logged-in user)
 * @param {string} redirectTo         — where to redirect on failure
 */
export default function ProtectedRoute({ children, role = null, redirectTo = '/login' }) {
  const { user } = useAuth();

  if (!user) return <Navigate to={redirectTo} replace />;
  if (role && user.role !== role) {
    // Redirect to the correct dashboard for their actual role
    const home = user.role === 'artist' ? '/artist' : '/home';
    return <Navigate to={home} replace />;
  }

  return children;
}
