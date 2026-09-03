import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiUploadCloud2Fill, RiAddBoxFill, RiMicFill,
  RiSpotifyFill
} from 'react-icons/ri';

export default function ArtistDashboard() {
  const { user } = useAuth();

  const actions = [
    {
      to: '/upload',
      icon: <RiUploadCloud2Fill />,
      label: 'Upload Music',
      desc: 'Share a new track with listeners worldwide',
      color: '#1DB954',
    },
    {
      to: '/create-album',
      icon: <RiAddBoxFill />,
      label: 'Create Album',
      desc: 'Group your tracks into a beautiful collection',
      color: '#a78bfa',
    },
  ];

  return (
    <div>
      <div className="page-content">
        {/* Hero */}
        <div className="dashboard-hero fade-up">
          <div className="dashboard-hero-icon">
            <RiMicFill />
          </div>
          <div className="dashboard-hero-text">
            <h1>Welcome back, {user?.username} 🎤</h1>
            <p>You're logged in as an <strong style={{ color: 'var(--spotify-green)' }}>Artist</strong>. Start creating and sharing your music.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="section-title">Quick Actions</h2>
        <div className="dashboard-actions">
          {actions.map((action) => (
            <Link key={action.to} to={action.to} className="action-card">
              <div className="action-card-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <div className="action-card-text">
                <h3>{action.label}</h3>
                <p>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Banner */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginTop: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <RiSpotifyFill style={{ color: 'var(--spotify-green)', fontSize: '1.4rem' }} />
            <h3 style={{ fontWeight: 700 }}>Artist Notes</h3>
          </div>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>• Your artist identity is automatically linked to all uploads via your JWT session</li>
            <li>• Music is stored on <strong style={{ color: 'var(--text-primary)' }}>ImageKit CDN</strong> — no file size limit configured</li>
            <li>• Albums require existing track IDs — upload tracks first, then create albums</li>
            <li>• As an artist, you cannot browse the music feed (backend role restriction)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
