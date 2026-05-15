import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectById } from '../services/projectService';
import { getUserProfile } from '../services/userService';
import { getTasksByProject } from '../services/taskService';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProjectById(id);
        setProject(p);
        const projectTasks = await getTasksByProject(id);
        setTasks(projectTasks);

        const ids = [...(p?.members || []), p?.createdBy].filter(Boolean);
        const names = await Promise.all(
          [...new Set(ids)].map(async (uid) => {
            const profile = await getUserProfile(uid);
            return profile?.name || uid;
          })
        );
        setMemberNames(names);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="text-slate-400">Loading...</p>;
  if (!project) return <p className="text-rose-400">Project not found</p>;

  return (
    <div>
      <Link to="/projects" className="text-sm text-indigo-400 hover:underline">
        ← Back to projects
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">{project.name}</h1>
      <p className="mt-2 text-slate-400">{project.description || 'No description'}</p>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="font-semibold text-white">Team Members</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {memberNames.map((name) => (
            <li
              key={name}
              className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-white">Tasks ({tasks.length})</h2>
        <Link
          to="/tasks"
          className="mt-2 inline-block text-sm text-indigo-400 hover:underline"
        >
          Manage tasks →
        </Link>
        <ul className="mt-4 space-y-2">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <span className="font-medium text-white">{t.title}</span>
              <span className="ml-2 rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {t.status}
              </span>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-slate-500">No tasks in this project yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
