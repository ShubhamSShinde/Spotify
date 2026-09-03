import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  RiHome5Fill, RiAlbumFill, RiMusicFill,
  RiUploadCloud2Fill, RiAddBoxFill, RiLogoutBoxLine,
  RiSpotifyFill, RiUser3Fill
} from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const userLinks = [
    { to: '/home',   icon: <RiHome5Fill />,  label: 'Home' },
    { to: '/albums', icon: <RiAlbumFill />,  label: 'Albums' },
  ];

  const artistLinks = [
    { to: '/artist',        icon: <RiHome5Fill />,         label: 'Dashboard' },
    { to: '/upload',        icon: <RiUploadCloud2Fill />,  label: 'Upload Music' },
    { to: '/create-album',  icon: <RiAddBoxFill />,        label: 'Create Album' },
  ];

  const links = user?.role === 'artist' ? artistLinks : userLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <RiSpotifyFill />
        <span>Spotify</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        <div className="sidebar-divider" />

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <RiUser3Fill />
          Profile
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        {user && (
          <div className="user-badge">
            <div className="user-badge-avatar">
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="user-badge-info">
              <div className="user-badge-name">{user.username}</div>
              <div className="user-badge-role">{user.role}</div>
            </div>
            <button
              className="user-badge-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <RiLogoutBoxLine />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
