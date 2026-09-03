import { RiPlayFill } from 'react-icons/ri';

export default function MusicCard({ track, onPlay, isActive }) {
  return (
    <div
      className={`music-card${isActive ? ' active' : ''}`}
      onClick={() => onPlay?.(track)}
    >
      <div className="music-card-thumb">
        🎵
        <button className="music-card-play">
          <RiPlayFill />
        </button>
      </div>
      <div className="music-card-title">{track.title}</div>
      <div className="music-card-sub">
        {track.artist?.username || track.artist || 'Unknown Artist'}
      </div>
    </div>
  );
}
