import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  Plus,
  Menu,
  X,
  FileText,
  Mail,
  Users,
  Settings,
  Briefcase,
  Layers
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ projects = [], collapsed, setCollapsed }) {
  const location = useLocation();
  const { user } = useAuth();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1C3FAA] text-white/70 overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
          <Layers className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <span className="text-2xl font-bold text-white tracking-tight">
            Task Flow
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide pt-4">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
            isActive('/') 
              ? 'bg-slate-50 text-[#1C3FAA] font-bold shadow-lg scale-105' 
              : 'hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 flex-shrink-0 ${isActive('/') ? 'text-[#1C3FAA]' : 'group-hover:text-white'}`} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/30">
          {!collapsed ? 'Menu Layout' : '•••'}
        </div>

        {/* Projects section */}
        <div className="space-y-1">
          <button
            onClick={() => setProjectsOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
              location.pathname.startsWith('/projects') && !isActive('/')
                ? 'bg-white/10 text-white font-medium'
                : 'hover:bg-white/10 hover:text-white'
            }`}
          >
            <FolderKanban className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="flex-1 text-left">Projects</span>}
            {!collapsed && (
              <span className="ml-auto">
                {projectsOpen ? (
                  <ChevronDown className="w-4 h-4 opacity-50" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-50" />
                )}
              </span>
            )}
          </button>

          {/* Project list dropdown */}
          {!collapsed && projectsOpen && (
            <div className="ml-4 pl-4 border-l border-white/10 space-y-1 pt-1 pb-2">
              <Link
                to="/projects"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all ${
                  isActive('/projects') ? 'text-white font-bold' : 'hover:text-white'
                }`}
              >
                All Projects
              </Link>
              {projects.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all truncate ${
                    isActive(`/projects/${p.id}`) ? 'text-white font-bold bg-white/5' : 'hover:text-white'
                  }`}
                  title={p.name}
                >
                  <span className="truncate">{p.name}</span>
                </Link>
              ))}
              <Link
                to="/projects/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-blue-300 hover:text-white transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Link>
            </div>
          )}
        </div>

        {/* Internal Apps section removed as requested */}
      </nav>

      {/* User footer */}
      <div className="p-4 mt-auto">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 transition-all ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg border border-white/20">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-white/50 truncate font-medium">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-full transition-all duration-500 ease-in-out flex-shrink-0 ${
          collapsed ? 'w-24' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 lg:hidden flex flex-col transition-transform duration-500 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile toggle floating button */}
      {!mobileOpen && (
        <button
          className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 rounded-full bg-[#1C3FAA] text-white shadow-2xl flex items-center justify-center animate-bounce hover:animate-none transition-all"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
