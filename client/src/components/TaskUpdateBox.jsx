import { useEffect, useState } from 'react';
import { addTaskUpdate, getTaskUpdates } from '../services/taskService';

function formatTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString();
}

export default function TaskUpdateBox({ taskId, canPost, user }) {
  const [updates, setUpdates] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const list = await getTaskUpdates(taskId);
      setUpdates(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await addTaskUpdate(taskId, {
        text: text.trim(),
        authorId: user.uid,
        authorName: user.name || user.email,
      });
      setText('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-slate-800 pt-4">
      <h4 className="text-sm font-medium text-slate-300">Task updates</h4>

      {canPost && (
        <form onSubmit={handleSubmit} className="mt-2">
          <textarea
            rows={3}
            placeholder="Write a progress update for this task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post update'}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-2 text-xs text-rose-400">{error}</p>
      )}

      <div className="mt-3 space-y-2">
        {loading ? (
          <p className="text-xs text-slate-500">Loading updates...</p>
        ) : updates.length === 0 ? (
          <p className="text-xs text-slate-500">No updates yet.</p>
        ) : (
          updates.map((u) => (
            <div
              key={u.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <p className="text-sm text-slate-200">{u.text}</p>
              <p className="mt-1 text-xs text-slate-500">
                {u.authorName} · {formatTime(u.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
