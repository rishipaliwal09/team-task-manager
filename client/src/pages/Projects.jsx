import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTeamMembers } from '../services/userService';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectsForUser,
} from '../services/projectService';

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    const data = isAdmin
      ? await getAllProjects()
      : await getProjectsForUser(user.uid);
    setProjects(data);
  };

  useEffect(() => {
    async function init() {
      try {
        await loadProjects();
        if (isAdmin) {
          const team = await getTeamMembers(user.uid);
          setUsers(team);
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
      await createProject({
        name: form.name,
        description: form.description,
        members: form.members,
        createdBy: user.uid,
      });
      setForm({ name: '', description: '', members: [] });
      await loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMember = (uid) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(uid)
        ? prev.members.filter((id) => id !== uid)
        : [...prev.members, uid],
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-slate-400">Loading projects...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Projects</h1>
      <p className="mt-1 text-slate-400">Manage team projects</p>

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
          <h2 className="font-semibold text-white">Create Project</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Project name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            />
          </div>
          {users.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-400">Add members</p>
              <div className="flex flex-wrap gap-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleMember(u.id)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      form.members.includes(u.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Create Project
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500/50"
          >
            <Link to={`/projects/${p.id}`} className="block">
              <h3 className="font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                {p.description || 'No description'}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {(p.members?.length || 0) + 1} team member(s)
              </p>
            </Link>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="mt-3 text-sm text-rose-400 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="mt-8 text-center text-slate-500">No projects yet.</p>
      )}
    </div>
  );
}
