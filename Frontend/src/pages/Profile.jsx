import { useAuth } from '../context/AuthContext';
import { RiUser3Fill, RiMailFill, RiShieldUserFill, RiSpotifyFill } from 'react-icons/ri';

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    { icon: <RiUser3Fill />,      label: 'Username', value: user?.username },
    { icon: <RiMailFill />,       label: 'Email',    value: user?.email || 'Not available' },
    { icon: <RiShieldUserFill />, label: 'Role',     value: user?.role },
  ];

  return (
    <div>
      <div className="page-content">
        {/* Profile Hero */}
        <div className="profile-hero fade-up">
          <div className="profile-avatar">
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="profile-info">
            <small>Profile</small>
            <h1>{user?.username}</h1>
            <span className="role-badge">
              {user?.role === 'artist' ? '🎤 Artist' : '🎧 Listener'}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <h2 className="section-title">Account Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 480 }}>
          {fields.map((field) => (
            <div
              key={field.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span style={{ color: 'var(--spotify-green)', fontSize: '1.2rem' }}>{field.icon}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {field.label}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '0.15rem', textTransform: 'capitalize' }}>
                  {field.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          maxWidth: 480,
        }}>
          <RiSpotifyFill style={{ color: 'var(--spotify-green)', fontSize: '1.1rem', flexShrink: 0 }} />
          Profile editing is not yet supported by the backend. Contact support to update your details.
        </div>
      </div>
    </div>
  );
}
