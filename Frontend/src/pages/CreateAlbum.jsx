import { useState, useEffect } from 'react';
import { getAllMusic, createAlbum } from '../services/api';
import { RiAddBoxFill, RiCheckLine, RiMusicFill } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function CreateAlbum() {
  const [title, setTitle] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // NOTE: GET /api/music/ requires role:"user", but we're an artist.
  // The backend will return 403 for this request from an artist account.
  // This is a backend limitation documented in the implementation plan.
  // We display a friendly message if tracks can't be loaded.
  useEffect(() => {
    getAllMusic()
      .then(({ data }) => setTracks(data.albums || []))
      .catch(() => setTracks([]))
      .finally(() => setTracksLoading(false));
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Album title is required.'); return; }
    if (selectedIds.length === 0) { setError('Select at least one track for the album.'); return; }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // POST /api/music/create-album — body: { title, musics: [id, id, ...] }
      // artist is taken from JWT cookie automatically
      await createAlbum({ title: title.trim(), musics: selectedIds });
      setSuccess(`Album "${title}" created successfully! 🎶`);
      toast.success('Album created!');
      setTitle('');
      setSelectedIds([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create album.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, #2a1a3a 0%, var(--bg-base) 100%)',
        padding: '2.5rem 2rem 1.5rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Create Album</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Group your tracks into a collection
        </p>
      </div>

      <div className="page-content">
        <div className="form-page fade-in">
          {error   && <div className="error-banner">⚠️ {error}</div>}
          {success && <div className="success-banner"><RiCheckLine /> {success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="album-title">Album Title</label>
              <input
                id="album-title"
                type="text"
                className="form-input"
                placeholder="Name your album"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
              />
            </div>

            <div className="form-group">
              <label>Select Tracks</label>
              {tracksLoading ? (
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                  <div className="spinner" style={{ margin: '0 auto' }} />
                </div>
              ) : tracks.length === 0 ? (
                <div style={{
                  background: 'rgba(233,20,41,0.07)',
                  border: '1px solid rgba(233,20,41,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                }}>
                  <strong style={{ color: '#ff6b6b' }}>⚠️ Backend limitation:</strong> The track listing endpoint
                  (<code>/api/music/</code>) requires <code>role: "user"</code>, but you are authenticated as an
                  artist. You can still create an album by entering track IDs manually below.
                  <br /><br />
                  <label htmlFor="manual-ids" style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Track IDs (comma-separated MongoDB ObjectIDs)
                  </label>
                  <input
                    id="manual-ids"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 64abc..., 64def..."
                    onChange={(e) => {
                      const ids = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setSelectedIds(ids);
                    }}
                  />
                </div>
              ) : (
                <div className="music-select-list">
                  {tracks.map((track) => (
                    <div
                      key={track._id}
                      className={`music-select-item${selectedIds.includes(track._id) ? ' selected' : ''}`}
                      onClick={() => toggleSelect(track._id)}
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={selectedIds.includes(track._id)}
                      />
                      <RiMusicFill style={{ color: 'var(--spotify-green)', flexShrink: 0 }} />
                      <span className="music-select-item-title">{track.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--spotify-green)' }}>
                ✓ {selectedIds.length} track{selectedIds.length !== 1 ? 's' : ''} selected
              </div>
            )}

            <button
              id="create-album-submit"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || !title.trim() || selectedIds.length === 0}
            >
              {loading ? 'Creating album…' : (
                <><RiAddBoxFill /> Create Album</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
