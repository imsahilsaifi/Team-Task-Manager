import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FolderKanban, ChevronLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateProject() {
  const navigate = useNavigate();
  const { refreshProjects } = useOutletContext();
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/projects', form);
      toast.success('Project created successfully!');
      refreshProjects();
      navigate(`/projects/${data.project.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
            <FolderKanban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create New Project</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Set up a new workspace for your team.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Project Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input text-lg py-3"
              placeholder="e.g. Website Redesign"
              autoFocus
            />
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input py-3"
              rows={5}
              placeholder="What is this project about?"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 flex items-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
