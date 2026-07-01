// ============================================================
// SIDEBAR COMPONENT
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const XLogo = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    to: '/tweets/create',
    label: 'Post',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

const adminNavItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/admin/users',
    label: 'Users',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/tweets',
    label: 'Tweets',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 xl:w-72 flex flex-col py-4 px-3 border-r border-twitter-border bg-black z-40 lg:flex hidden">
      {/* Logo */}
      <div className="px-3 mb-4 text-twitter-white">
        <XLogo />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'font-extrabold text-twitter-white' : 'text-twitter-white'}`
            }
          >
            {item.icon}
            <span className="xl:block hidden">{item.label}</span>
          </NavLink>
        ))}

        {/* Admin Links */}
        {isAdmin && (
          <>
            <div className="pt-2 pb-1 px-3">
              <span className="text-xs text-twitter-text uppercase tracking-wider font-semibold">Admin</span>
            </div>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'font-extrabold text-yellow-400' : 'text-twitter-text hover:text-twitter-white'}`
                }
              >
                {item.icon}
                <span className="xl:block hidden">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Post Button */}
      <NavLink
        to="/tweets/create"
        className="btn-blue text-center mb-4 hidden xl:block"
      >
        Post
      </NavLink>

      {/* User Menu */}
      <div className="border-t border-twitter-border pt-4">
        <div
          className="flex items-center gap-3 p-3 rounded-full hover:bg-twitter-hover cursor-pointer transition-colors group"
          onClick={() => navigate('/profile')}
        >
          <Avatar name={user?.name || user?.username} src={user?.profileImage} size="md" />
          <div className="flex-1 min-w-0 xl:block hidden">
            <p className="font-bold text-twitter-white text-sm truncate">{user?.name || user?.username}</p>
            <p className="text-twitter-text text-xs truncate">@{user?.username || user?.email?.split('@')[0]}</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="xl:block hidden text-twitter-text hover:text-red-400 transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
