import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-500/20 text-indigo-300'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="text-lg font-bold text-white">
            Team<span className="text-indigo-400">Task</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Projects
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">
              {user?.name}{' '}
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs uppercase text-indigo-300">
                {user?.role}
              </span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
