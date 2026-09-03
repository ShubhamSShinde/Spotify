import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiSpotifyFill, RiEyeLine, RiEyeOffLine, RiUser3Fill, RiMicFill } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      const user = await register(form);
      toast.success(`Welcome to Spotify, ${user.username}! 🎉`);
      navigate(user.role === 'artist' ? '/artist' : '/home', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <RiSpotifyFill size={40} />
          <span>Spotify</span>
        </div>
        <h1>Create your account</h1>
        <p className="subtitle">Join millions of music lovers today</p>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Choose a unique username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  color: 'var(--text-muted)', fontSize: '1.1rem'
                }}
              >
                {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>I am a…</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
              {[
                { value: 'user',   icon: <RiUser3Fill />, label: 'Music Listener', desc: 'Browse & enjoy music' },
                { value: 'artist', icon: <RiMicFill />,   label: 'Artist',         desc: 'Upload & share music' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  id={`role-${opt.value}`}
                  onClick={() => setForm((p) => ({ ...p, role: opt.value }))}
                  style={{
                    background: form.role === opt.value ? 'rgba(29,185,84,0.1)' : 'var(--bg-elevated)',
                    border: `1.5px solid ${form.role === opt.value ? 'var(--spotify-green)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 0.75rem',
                    color: form.role === opt.value ? 'var(--spotify-green)' : 'var(--text-secondary)',
                    transition: 'var(--transition)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                    cursor: 'pointer', fontSize: '1.3rem',
                  }}
                >
                  {opt.icon}
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'inherit' }}>{opt.label}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
