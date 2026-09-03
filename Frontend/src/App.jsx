import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Sidebar  from './components/Layout/Sidebar';
import PlayerBar from './components/Layout/PlayerBar';

// Pages
import Login          from './pages/Login';
import Register       from './pages/Register';
import Home           from './pages/Home';
import Albums         from './pages/Albums';
import AlbumDetail    from './pages/AlbumDetail';
import Upload         from './pages/Upload';
import CreateAlbum    from './pages/CreateAlbum';
import ArtistDashboard from './pages/ArtistDashboard';
import Profile        from './pages/Profile';
import NotFound       from './pages/NotFound';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';

function AppShell({ children }) {
  // Global music player state lifted here so player persists across page navigations
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);

  const handlePlay = (track, trackList = []) => {
    setCurrentTrack(track);
    if (trackList.length > 0) setQueue(trackList);
  };

  const handleNext = () => {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex((t) => t._id === currentTrack._id);
    if (idx < queue.length - 1) setCurrentTrack(queue[idx + 1]);
  };

  const handlePrev = () => {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex((t) => t._id === currentTrack._id);
    if (idx > 0) setCurrentTrack(queue[idx - 1]);
  };

  // Inject player props into children via render prop pattern
  const childrenWithProps = typeof children === 'function'
    ? children({ currentTrack, onPlay: handlePlay })
    : children;

  return (
    <div className="app-layout">
      <div className="app-sidebar">
        <Sidebar />
      </div>
      <main className="app-main">
        {childrenWithProps}
      </main>
      <div className="app-player">
        <PlayerBar
          track={currentTrack}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login"    element={!user ? <Login />    : <Navigate to={user.role === 'artist' ? '/artist' : '/home'} replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'artist' ? '/artist' : '/home'} replace />} />

      {/* User-only Routes (role: "user") */}
      <Route path="/home" element={
        <ProtectedRoute role="user">
          <AppShell>
            {({ currentTrack, onPlay }) => <Home onPlay={onPlay} currentTrack={currentTrack} />}
          </AppShell>
        </ProtectedRoute>
      } />

      <Route path="/albums" element={
        <ProtectedRoute role="user">
          <AppShell>
            {() => <Albums />}
          </AppShell>
        </ProtectedRoute>
      } />

      <Route path="/albums/:albumId" element={
        <ProtectedRoute role="user">
          <AppShell>
            {({ currentTrack, onPlay }) => <AlbumDetail onPlay={onPlay} currentTrack={currentTrack} />}
          </AppShell>
        </ProtectedRoute>
      } />

      {/* Artist-only Routes (role: "artist") */}
      <Route path="/artist" element={
        <ProtectedRoute role="artist">
          <AppShell>
            {() => <ArtistDashboard />}
          </AppShell>
        </ProtectedRoute>
      } />

      <Route path="/upload" element={
        <ProtectedRoute role="artist">
          <AppShell>
            {() => <Upload />}
          </AppShell>
        </ProtectedRoute>
      } />

      <Route path="/create-album" element={
        <ProtectedRoute role="artist">
          <AppShell>
            {() => <CreateAlbum />}
          </AppShell>
        </ProtectedRoute>
      } />

      {/* Shared Protected Routes (any authenticated user) */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppShell>
            {() => <Profile />}
          </AppShell>
        </ProtectedRoute>
      } />

      {/* Root redirect */}
      <Route path="/" element={
        user
          ? <Navigate to={user.role === 'artist' ? '/artist' : '/home'} replace />
          : <Navigate to="/login" replace />
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
