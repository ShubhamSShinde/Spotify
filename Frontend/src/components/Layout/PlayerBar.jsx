import { useState, useRef, useEffect } from 'react';
import {
  RiPlayFill, RiPauseFill,
  RiSkipForwardFill, RiSkipBackFill,
  RiVolumeUpFill, RiVolumeMuteFill,
  RiMusicFill
} from 'react-icons/ri';

export default function PlayerBar({ track, onNext, onPrev }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  // When track changes, load and play it
  useEffect(() => {
    if (!track?.uri || !audioRef.current) return;
    audioRef.current.src = track.uri;
    audioRef.current.load();
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [track?.uri]);

  const togglePlay = () => {
    if (!audioRef.current || !track) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const time = pct * (audioRef.current?.duration || 0);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.muted = next;
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player-bar">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setPlaying(false); setProgress(0); onNext?.(); }}
        volume={volume}
      />

      {/* Left: Track Info */}
      <div className="player-track">
        <div className="player-thumb">
          {track ? '🎵' : <RiMusicFill style={{ opacity: 0.3 }} />}
        </div>
        {track ? (
          <div className="player-track-info">
            <div className="player-track-title">{track.title}</div>
            <div className="player-track-artist">
              {track.artist?.username || track.artist || 'Unknown Artist'}
            </div>
          </div>
        ) : (
          <div className="player-track-info">
            <div className="player-track-title" style={{ color: 'var(--text-muted)' }}>
              No track selected
            </div>
          </div>
        )}
      </div>

      {/* Center: Controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button className="player-btn" onClick={onPrev} disabled={!track}>
            <RiSkipBackFill />
          </button>
          <button className="player-btn play" onClick={togglePlay} disabled={!track}>
            {playing ? <RiPauseFill /> : <RiPlayFill />}
          </button>
          <button className="player-btn" onClick={onNext} disabled={!track}>
            <RiSkipForwardFill />
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time">{fmt(currentTime)}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="player-time">{fmt(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="player-volume">
        <button className="player-btn" onClick={toggleMute} style={{ fontSize: '1rem' }}>
          {muted || volume === 0 ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
}
