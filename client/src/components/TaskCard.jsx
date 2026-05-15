import { CalendarDays, User } from 'lucide-react';
import StatusBadge from './StatusBadge';

const priorityConfig = {
  LOW: { label: 'Low', className: 'priority-low' },
  MEDIUM: { label: 'Medium', className: 'priority-medium' },
  HIGH: { label: 'High', className: 'priority-high' },
};

export default function TaskCard({ task, onEdit, onDelete, canDelete, canEditAll }) {
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div className="card p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug flex-1 min-w-0 truncate">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {(canEditAll || task.assignee) && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Edit task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={task.status} />
        <span className={`badge ${priority.className}`}>{priority.label}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3" />
          <span>{task.assignee?.name || 'Unassigned'}</span>
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
            <CalendarDays className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            {isOverdue && <span className="font-medium">(Overdue)</span>}
          </div>
        )}
      </div>
    </div>
  );
}
