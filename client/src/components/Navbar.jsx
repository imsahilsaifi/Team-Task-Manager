import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Sun, Moon, Search, Bell, Menu, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, useTheme } from '../hooks/useAuth';

export default function Navbar({ collapsed, setCollapsed, searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-6 bg-transparent flex-shrink-0 z-30">
      {/* Left: Breadcrumbs or Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">Application</Link>
          <span className="opacity-30">/</span>
          <span className="text-slate-900 dark:text-white font-bold">Dashboard</span>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className={`relative group transition-all duration-300 ${searchFocused ? 'w-80' : 'w-64'}`}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-800 shadow-md">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 p-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
