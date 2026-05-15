import { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, CheckCircle2, Circle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'TODO',
  assigneeId: '',
  dueDate: '',
};

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'HIGH', label: 'High', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
];

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do', icon: Circle },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Clock },
  { value: 'DONE', label: 'Done', icon: CheckCircle2 },
];

export default function TaskModal({ projectId, task, members, userRole, onClose, onSaved }) {
  const isEdit = Boolean(task);
  const isMember = userRole === 'MEMBER';
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldValue = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      const payload = isMember
        ? { status: form.status }
        : {
            title: form.title,
            description: form.description,
            priority: form.priority,
            status: form.status,
            assigneeId: form.assigneeId || null,
            dueDate: form.dueDate || null,
          };

      if (isEdit) {
        const { data } = await api.put(`/projects/${projectId}/tasks/${task.id}`, payload);
        toast.success('Task updated!');
        onSaved(data.task, 'update');
      } else {
        const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
        toast.success('Task created!');
        onSaved(data.task, 'create');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay px-4 py-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-h-[90vh] flex flex-col">
        {/* Header with gradient shelf */}
        <div className="relative h-24 rounded-t-[32px] overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-8 text-white">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Edit task' : 'New task'}
            </h2>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 animate-slide-up">
              {error}
            </div>
          )}

          {/* Title Input - Modern & Large */}
          <div className="space-y-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isMember}
              className="w-full text-xl font-semibold bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-600 p-0 disabled:opacity-60"
              placeholder="Task title..."
              autoFocus
            />
            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
          </div>

          {/* Description */}
          {!isMember && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Description</span>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                rows={3}
                placeholder="Add more details about this task..."
              />
            </div>
          )}

          {/* Segmented Controls for Priority & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Flag className="w-3 h-3" />
                <span>Priority</span>
              </div>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isMember}
                    onClick={() => setFieldValue('priority', opt.value)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      form.priority === opt.value
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                <span>Status</span>
              </div>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFieldValue('status', opt.value)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      form.status === opt.value
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <opt.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Assignee */}
            {!isMember && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <User className="w-3 h-3" />
                  <span>Assignee</span>
                </div>
                <select
                  name="assigneeId"
                  value={form.assigneeId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 text-sm border-none focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user.id} value={m.user.id}>
                      {m.user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Due Date */}
            {!isMember && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  <span>Due Date</span>
                </div>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 text-sm border-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            )}
          </div>

          {isMember && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                You're currently viewing this task as a member. You can update its status as you progress.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="flex-[2] py-4 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading && <LoadingSpinner size="sm" color="white" />}
            {isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
