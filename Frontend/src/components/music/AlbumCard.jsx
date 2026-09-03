import { useNavigate } from 'react-router-dom';
import { RiAlbumFill } from 'react-icons/ri';

export default function AlbumCard({ album }) {
  const navigate = useNavigate();

  return (
    <div className="music-card" onClick={() => navigate(`/albums/${album._id}`)}>
      <div className="music-card-thumb" style={{ background: 'linear-gradient(135deg, #2a1a4e, #1a1a3e)' }}>
        <RiAlbumFill style={{ fontSize: '2.5rem', color: '#a78bfa' }} />
      </div>
      <div className="music-card-title">{album.title}</div>
      <div className="music-card-sub">
        {album.artist?.username || 'Unknown Artist'}
      </div>
    </div>
  );
}
