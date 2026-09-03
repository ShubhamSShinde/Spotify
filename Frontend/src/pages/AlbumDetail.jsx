import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById } from '../services/api';
import TrackRow from '../components/music/TrackRow';
import { RiArrowLeftLine, RiPlayFill, RiAlbumFill } from 'react-icons/ri';

export default function AlbumDetail({ onPlay, currentTrack }) {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAlbumById(albumId)
      .then(({ data }) => setAlbum(data.album))
      .catch((err) => setError(err.response?.data?.message || 'Album not found'))
      .finally(() => setLoading(false));
  }, [albumId]);

  const playAll = () => {
    if (album?.musics?.length > 0) onPlay?.(album.musics[0]);
  };

  return (
    <div>
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
      {error && (
        <div className="page-content">
          <div className="error-banner">⚠️ {error}</div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/albums')}>
            <RiArrowLeftLine /> Back to Albums
          </button>
        </div>
      )}

      {!loading && album && (
        <>
          {/* Album Hero */}
          <div className="album-hero">
            <div className="album-hero-art">
              <RiAlbumFill style={{ color: '#a78bfa' }} />
            </div>
            <div className="album-hero-info">
              <small>Album</small>
              <h1>{album.title}</h1>
              <p>
                By <strong>{album.artist?.username || 'Unknown Artist'}</strong>
                {album.musics?.length > 0 && ` · ${album.musics.length} track${album.musics.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="page-content">
            {/* Back + Play */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/albums')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RiArrowLeftLine /> Back
              </button>
              {album.musics?.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={playAll}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <RiPlayFill /> Play All
                </button>
              )}
            </div>

            {/* Track list */}
            {album.musics?.length === 0 ? (
              <div className="empty-state">
                <RiAlbumFill />
                <h3>No tracks in this album</h3>
                <p>The artist hasn't added any tracks yet.</p>
              </div>
            ) : (
              <div className="fade-in">
                <h2 className="section-title">Tracks</h2>
                <div className="track-list">
                  {album.musics.map((track, i) => (
                    <TrackRow
                      key={track._id}
                      track={track}
                      index={i}
                      isActive={currentTrack?._id === track._id}
                      onPlay={onPlay}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
