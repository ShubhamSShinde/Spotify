import { RiPlayFill, RiPauseFill } from 'react-icons/ri';

export default function TrackRow({ track, index, isActive, onPlay }) {
  return (
    <div className={`track-row${isActive ? ' active' : ''}`} onClick={() => onPlay?.(track)}>
      <span className="track-number">
        {isActive ? (
          <RiPlayFill style={{ color: 'var(--spotify-green)', fontSize: '0.9rem' }} />
        ) : (
          index + 1
        )}
      </span>
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">
          {track.artist?.username || track.artist || 'Unknown Artist'}
        </div>
      </div>
      <span className="track-duration">–:––</span>
    </div>
  );
}
