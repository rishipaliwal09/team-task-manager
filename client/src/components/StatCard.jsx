export default function StatCard({ label, value, accent = 'indigo' }) {
  const accents = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-300',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-300',
    slate: 'from-slate-500/20 to-slate-500/5 border-slate-500/30 text-slate-300',
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 ${accents[accent] || accents.indigo}`}
    >
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
