import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getTeamMembers } from '../services/userService';
import {
  getAllProjects,
  getProjectsForUser,
} from '../services/projectService';
import TaskUpdateBox from '../components/TaskUpdateBox';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasksForUser,
  updateTask,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from '../services/taskService';

const statusLabels = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    const data = isAdmin
      ? await getAllTasks()
      : await getTasksForUser(user.uid);
    setTasks(data);
  };

  useEffect(() => {
    async function init() {
      try {
        await loadTasks();
        const projs = isAdmin
          ? await getAllProjects()
          : await getProjectsForUser(user.uid);
        setProjects(projs);
        if (isAdmin) {
          const team = await getTeamMembers(user.uid);
          setUsers(team);
          const all = await getAllUsers();
          const map = {};
          all.forEach((u) => {
            map[u.id] = u.name || u.email;
          });
          setUserMap(map);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [user, isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createTask({
        title: form.title,
        description: form.description,
        projectId: form.projectId,
        assignedTo: form.assignedTo,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
        createdBy: user.uid,
        status: 'todo',
      });
      setForm({
        title: '',
        description: '',
        projectId: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
      });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered =
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const getProjectName = (projectId) =>
    projects.find((p) => p.id === projectId)?.name || projectId;

  const getUserName = (uid) =>
    userMap[uid] || users.find((u) => u.id === uid)?.name || 'Unassigned';

  if (loading) return <p className="text-slate-400">Loading tasks...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Tasks</h1>
      <p className="mt-1 text-slate-400">
        {isAdmin
          ? 'Create and assign tasks'
          : 'Update status and post progress on your assigned tasks'}
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
          {error}
        </p>
      )}

      {isAdmin && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="font-semibold text-white">Create Task</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
            <select
              required
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              required
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            >
              <option value="">Assign to member</option>
              {users.length === 0 ? (
                <option value="" disabled>
                  No other members — ask them to sign up first
                </option>
              ) : (
                users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) — {u.role}
                  </option>
                ))
              )}
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white sm:col-span-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create Task
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {['all', ...TASK_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {s === 'all' ? 'All' : statusLabels[s]}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {filtered.map((t) => (
          <li
            key={t.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{t.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Project: {getProjectName(t.projectId)} · Priority: {t.priority}
                  {isAdmin && ` · Assigned: ${getUserName(t.assignedTo)}`}
                </p>
              </div>
              <select
                value={t.status}
                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                disabled={!isAdmin && t.assignedTo !== user.uid}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white"
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
            <TaskUpdateBox
              taskId={t.id}
              user={user}
              canPost={isAdmin || t.assignedTo === user.uid}
            />
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="mt-2 text-sm text-rose-400 hover:underline"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-slate-500">No tasks found.</p>
      )}
    </div>
  );
}
