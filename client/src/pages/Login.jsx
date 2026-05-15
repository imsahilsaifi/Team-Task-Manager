import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, useTheme } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-10">
        <div className="w-16 h-16 rounded-3xl bg-[#A37B7B]/10 flex items-center justify-center mb-4">
          <CheckSquare className="w-8 h-8 text-[#A37B7B]" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Log in to your Team Task Manager</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A37B7B] transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#A37B7B]/10 focus:border-[#A37B7B] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A37B7B] transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-[#A37B7B]/10 focus:border-[#A37B7B] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/5 transition-all transform hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? <LoadingSpinner color={theme === 'dark' ? 'black' : 'white'} /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#A37B7B] font-bold hover:underline">
            Create account
          </Link>
        </p>
        
        <div className="w-full flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or</span>
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <Link to="/admin/login" className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
          Admin Portal Access →
        </Link>
      </div>
    </div>
  );
}
