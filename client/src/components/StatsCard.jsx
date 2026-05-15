export default function StatsCard({ title, value, icon: Icon, color, subtitle }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/30',
    amber: 'from-amber-500 to-amber-600 shadow-amber-200 dark:shadow-amber-900/30',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/30',
    red: 'from-red-500 to-red-600 shadow-red-200 dark:shadow-red-900/30',
    violet: 'from-violet-500 to-violet-600 shadow-violet-200 dark:shadow-violet-900/30',
    slate: 'from-slate-500 to-slate-600 shadow-slate-200 dark:shadow-slate-900/30',
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color] || colors.blue} shadow-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
