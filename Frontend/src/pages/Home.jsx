import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllMusic } from '../services/api';
import MusicCard from '../components/music/MusicCard';
import { RiMusicFill, RiSpotifyFill } from 'react-icons/ri';

export default function Home({ onPlay, currentTrack }) {
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllMusic()
      .then(({ data }) => setTracks(data.albums || []))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load music');
      })
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Greeting Header */}
      <div style={{
        background: 'linear-gradient(180deg, #1a3a1a 0%, var(--bg-base) 100%)',
        padding: '2.5rem 2rem 1.5rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
          <RiSpotifyFill style={{ marginRight: '0.4rem', color: 'var(--spotify-green)' }} />
          {greeting()}, <strong style={{ color: 'var(--text-primary)' }}>{user?.username}</strong>
        </p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1 }}>
          Your Music Feed
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Discover tracks uploaded by artists
        </p>
      </div>

      <div className="page-content">
        {loading && (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        )}

        {error && (
          <div className="error-banner">⚠️ {error}</div>
        )}

        {!loading && !error && tracks.length === 0 && (
          <div className="empty-state fade-in">
            <RiMusicFill />
            <h3>No tracks yet</h3>
            <p>Artists haven't uploaded any music yet. Check back soon!</p>
          </div>
        )}

        {!loading && tracks.length > 0 && (
          <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Tracks</h2>
              <span className="chip">{tracks.length} track{tracks.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="cards-grid">
              {tracks.map((track) => (
                <MusicCard
                  key={track._id}
                  track={track}
                  onPlay={onPlay}
                  isActive={currentTrack?._id === track._id}
                />
              ))}
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
            }}>
              ℹ️ Showing up to 2 tracks (backend limit). More tracks will appear as the library grows.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
