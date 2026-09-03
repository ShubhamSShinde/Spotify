import { useState, useRef } from 'react';
import { uploadMusic } from '../services/api';
import { RiUploadCloud2Fill, RiCheckLine, RiMusicFill } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('audio/')) {
      setError('Please select a valid audio file (mp3, wav, etc.)');
      return;
    }
    setFile(f);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Track title is required.'); return; }
    if (!file)          { setError('Please select an audio file to upload.'); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    // Build multipart/form-data exactly as backend expects:
    // field "music" = the file, field "title" = the title string
    // artist is taken from req.user.id (JWT cookie) — do NOT send artist from frontend
    const formData = new FormData();
    formData.append('music', file);
    formData.append('title', title.trim());

    try {
      const { data } = await uploadMusic(formData);
      setSuccess(`"${data.Music.title}" uploaded successfully! 🎵`);
      toast.success('Track uploaded!');
      setTitle('');
      setFile(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, #1a2a3a 0%, var(--bg-base) 100%)',
        padding: '2.5rem 2rem 1.5rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Upload Music</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Share your music with the world
        </p>
      </div>

      <div className="page-content">
        <div className="form-page fade-in">
          {error   && <div className="error-banner">⚠️ {error}</div>}
          {success && <div className="success-banner"><RiCheckLine /> {success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Track Title */}
            <div className="form-group">
              <label htmlFor="upload-title">Track Title</label>
              <input
                id="upload-title"
                type="text"
                className="form-input"
                placeholder="Enter the name of your track"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
              />
            </div>

            {/* File Upload Zone */}
            <div className="form-group">
              <label>Audio File</label>
              <div
                className={`upload-zone${dragging ? ' drag-over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                {file ? (
                  <>
                    <RiMusicFill style={{ fontSize: '2.5rem', color: 'var(--spotify-green)', marginBottom: '0.75rem' }} />
                    <p className="file-name">{file.name}</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Click to change
                    </p>
                  </>
                ) : (
                  <>
                    <RiUploadCloud2Fill />
                    <p><strong>Click to browse</strong> or drag & drop your audio file here</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Supports MP3, WAV, OGG, FLAC, AAC
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
            }}>
              ℹ️ Your artist identity is automatically set from your account. Files are uploaded to ImageKit CDN.
            </div>

            <button
              id="upload-submit"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || !file || !title.trim()}
            >
              {loading ? 'Uploading to ImageKit…' : (
                <><RiUploadCloud2Fill /> Upload Track</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
