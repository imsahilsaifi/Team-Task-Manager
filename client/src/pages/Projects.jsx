import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderKanban, Users, CheckSquare } from 'lucide-react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and track all your team projects.
          </p>
        </div>
        <Link to="/projects/new" className="btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {search ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {search ? 'Try adjusting your search terms.' : 'Create your first project to get started.'}
          </p>
          {!search && (
            <Link to="/projects/new" className="btn-primary inline-flex">
              Create Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <span className={`badge ${project.userRole === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {project.userRole}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 truncate">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
                {project.description || 'No description provided.'}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{project.members?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" />
                  <span>{project._count?.tasks || 0}</span>
                </div>
                <div className="ml-auto text-xs opacity-50">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
