import { useState, useEffect } from 'react';
import { getAllAlbums } from '../services/api';
import AlbumCard from '../components/music/AlbumCard';
import { RiAlbumFill } from 'react-icons/ri';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllAlbums()
      .then(({ data }) => setAlbums(data.albums || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load albums'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, #1a1a3a 0%, var(--bg-base) 100%)',
        padding: '2.5rem 2rem 1.5rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Albums</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Browse all artist albums
        </p>
      </div>

      <div className="page-content">
        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

        {error && <div className="error-banner">⚠️ {error}</div>}

        {!loading && !error && albums.length === 0 && (
          <div className="empty-state fade-in">
            <RiAlbumFill />
            <h3>No albums yet</h3>
            <p>Artists haven't created any albums yet. Check back soon!</p>
          </div>
        )}

        {!loading && albums.length > 0 && (
          <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>All Albums</h2>
              <span className="chip">{albums.length} album{albums.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="cards-grid">
              {albums.map((album) => (
                <AlbumCard key={album._id} album={album} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
