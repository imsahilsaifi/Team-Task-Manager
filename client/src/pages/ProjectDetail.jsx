import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Plus, Users, Settings, Trash2, Filter, 
  ChevronLeft, LayoutGrid, List, MoreVertical,
  Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MemberList from '../components/MemberList';
import StatusBadge from '../components/StatusBadge';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshProjects } = useOutletContext();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('tasks'); // tasks | members | settings
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? All tasks will be permanently removed.')) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      refreshProjects();
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskSaved = (task, mode) => {
    if (mode === 'create') {
      setTasks([task, ...tasks]);
    } else {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const filteredTasks = statusFilter === 'ALL' 
    ? tasks 
    : tasks.filter(t => t.status === statusFilter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
      <p>{error}</p>
      <button onClick={() => navigate('/projects')} className="mt-4 text-sm font-medium hover:underline flex items-center gap-1">
        <ChevronLeft className="w-4 h-4" /> Back to projects
      </button>
    </div>
  );

  const isAdmin = project.userRole === 'ADMIN';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">
              {project.description || 'No description'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tasks' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'members' 
              ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Members ({project.members?.length || 0})
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Settings
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Task Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {status === 'ALL' ? 'All Tasks' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Task Grid */}
            {filteredTasks.length === 0 ? (
              <div className="card p-12 text-center bg-slate-50/50 dark:bg-slate-800/30 border-dashed">
                <p className="text-slate-500 dark:text-slate-400">No tasks found for this criteria.</p>
                <button 
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Create a task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    canDelete={isAdmin}
                    canEditAll={isAdmin}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsTaskModalOpen(true);
                    }}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="max-w-2xl">
            <MemberList 
              projectId={id}
              members={project.members}
              currentUserId={user.id}
              isAdmin={isAdmin}
              onMembersChange={(newMembers) => setProject({...project, members: newMembers})}
            />
          </div>
        )}

        {activeTab === 'settings' && isAdmin && (
          <div className="max-w-2xl space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Project Information</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Update your project's name and description.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Project Name</label>
                  <input className="input" defaultValue={project.name} id="edit-name" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input" rows={4} defaultValue={project.description} id="edit-desc" />
                </div>
                <button 
                  onClick={async () => {
                    const name = document.getElementById('edit-name').value;
                    const description = document.getElementById('edit-desc').value;
                    try {
                      await api.put(`/projects/${id}`, { name, description });
                      toast.success('Project updated');
                      setProject({...project, name, description});
                      refreshProjects();
                    } catch (err) {
                      toast.error('Update failed');
                    }
                  }}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="card p-6 border-red-100 dark:border-red-900/30">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Permanently delete this project and all its data. This action cannot be undone.
              </p>
              <button 
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="btn-danger flex items-center gap-2"
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                Delete Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <TaskModal 
          projectId={id}
          task={editingTask}
          members={project.members}
          userRole={project.userRole}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSaved={handleTaskSaved}
        />
      )}
    </div>
  );
}
