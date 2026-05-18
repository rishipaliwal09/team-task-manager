import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ThemeToggle from '../components/ThemeToggle';
import {
  getAllTasks,
  getTasksForUser,
  getDashboardStats,
} from '../services/taskService';
import {
  getAllUsers,
  getTeamMembers,
  groupMembersByName,
} from '../services/userService';

const statusLabels = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [nameGroups, setNameGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const tasks = isAdmin
          ? await getAllTasks()
          : await getTasksForUser(user.uid);
        setStats(getDashboardStats(tasks));
        if (!isAdmin) setMyTasks(tasks);

        if (isAdmin) {
          const members = await getTeamMembers(user.uid);
          setTeamMembers(members);
          setNameGroups(groupMembersByName(members));
        } else {
          const all = await getAllUsers();
          setTeamMembers(all.filter((u) => u.role === 'admin'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.uid) load();
  }, [user, isAdmin]);

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {isAdmin ? 'All team tasks & members' : 'Your assigned tasks'}
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {isAdmin && (
          <StatCard
            label="Team Members"
            value={teamMembers.length}
            accent="indigo"
          />
        )}
        <StatCard label="Total Tasks" value={stats?.totalTasks ?? 0} accent="slate" />
        <StatCard label="To Do" value={stats?.todo ?? 0} accent="slate" />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} accent="amber" />
        <StatCard label="Done" value={stats?.done ?? 0} accent="emerald" />
        <StatCard label="Overdue" value={stats?.overdue ?? 0} accent="rose" />
      </div>

      {!isAdmin && (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks assigned to you</h2>
          {myTasks.length === 0 ? (
            <p className="mt-4 text-slate-500">
              No tasks assigned yet. Your admin will assign tasks from the Tasks page.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {myTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <span className="font-medium text-slate-900 dark:text-white">{t.title}</span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {statusLabels[t.status] || t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/tasks"
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Update task status →
          </Link>
        </div>
      )}

      {isAdmin && (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Team members ({teamMembers.length})
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Everyone who signed up — assign tasks on the{' '}
            <Link to="/tasks" className="text-indigo-600 hover:underline dark:text-indigo-400">
              Tasks page
            </Link>
          </p>

          {teamMembers.length === 0 ? (
            <p className="mt-4 text-slate-500">
              No other accounts yet. Ask teammates to sign up from the Sign up page.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {nameGroups.map((group) => (
                <li
                  key={group.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{group.name}</span>
                    {group.count > 1 && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                        {group.count} accounts with this name
                      </span>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {group.members.map((m) => (
                      <li
                        key={m.id}
                        className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span>{m.email}</span>
                        <span className="rounded bg-slate-200 px-2 py-0.5 text-xs uppercase text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                          {m.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!isAdmin && teamMembers.length > 0 && (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your admin</h2>
          <ul className="mt-3 space-y-2">
            {teamMembers.map((m) => (
              <li key={m.id} className="text-sm text-slate-600 dark:text-slate-400">
                {m.name} · {m.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
