import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tracker', label: 'Tracker' },
  ];

  return (
    <header className="border-b border-slate-200 bg-white shadow-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Placement Prep
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Preparation Tracker</h1>
        </div>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </nav>
      </div>
      {user && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-600 sm:px-6">
          Welcome back, <span className="font-medium text-slate-900">{user.name}</span>
        </div>
      )}
    </header>
  );
};

export default Navbar;
