import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiSpotifyFill } from 'react-icons/ri';

export default function NotFound() {
  const { user } = useAuth();
  const home = user?.role === 'artist' ? '/artist' : user ? '/home' : '/login';

  return (
    <div className="not-found">
      <RiSpotifyFill style={{ fontSize: '4rem', color: 'var(--spotify-green)' }} />
      <div className="not-found-code">404</div>
      <h2>Page not found</h2>
      <p>We searched everywhere but couldn't find the page you were looking for.</p>
      <Link to={home} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
        Go Home
      </Link>
    </div>
  );
}
