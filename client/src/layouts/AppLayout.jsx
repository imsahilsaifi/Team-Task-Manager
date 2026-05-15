import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => setProjects(data.projects || []))
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <Sidebar projects={projects} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Decorative background blobs to match the image's premium feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"></div>
        
        <Navbar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet context={{ 
            searchQuery,
            refreshProjects: () => {
              api.get('/projects').then(({ data }) => setProjects(data.projects || [])).catch(() => {});
            }
          }} />
        </main>
      </div>
    </div>
  );
}
