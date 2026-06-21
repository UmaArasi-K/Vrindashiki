import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/track', label: 'Track', icon: '📊' },
  { path: '/streaks', label: 'Streaks', icon: '🔥' },
  { path: '/community', label: 'Community', icon: '🌍' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <aside className="sidebar" id="sidebar-navigation">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="brand-icon">🌿</span>
        <span className="brand-name">Vrindashiki</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
            end={item.path === '/'}
            id={`nav-${item.label.toLowerCase()}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user">
            <div className="avatar">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.displayName}</span>
              <span className="sidebar-user-email">{user.email}</span>
            </div>
          </div>
        )}
        <button
          className="btn btn-secondary sidebar-logout"
          onClick={() => dispatch(logout())}
          id="btn-logout"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
