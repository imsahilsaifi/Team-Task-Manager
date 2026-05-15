import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, useTheme } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Signup() {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-3xl bg-[#A37B7B]/10 flex items-center justify-center mb-4">
          <UserIcon className="w-8 h-8 text-[#A37B7B]" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Join the team and start managing tasks</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A37B7B] transition-colors">
              <UserIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full h-13 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#A37B7B]/10 focus:border-[#A37B7B] transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#A37B7B] transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full h-13 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#A37B7B]/10 focus:border-[#A37B7B] transition-all"
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
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full h-13 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-[#A37B7B]/10 focus:border-[#A37B7B] transition-all"
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

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Select Your Role</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: 'MEMBER' }))}
              className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                form.role === 'MEMBER' 
                ? 'border-[#A37B7B] bg-[#A37B7B]/5 text-[#A37B7B]' 
                : 'border-slate-100 dark:border-slate-800 bg-transparent text-slate-400'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span className="font-bold text-sm">Member</span>
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, role: 'ADMIN' }))}
              className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                form.role === 'ADMIN' 
                ? 'border-red-500 bg-red-500/5 text-red-500' 
                : 'border-slate-100 dark:border-slate-800 bg-transparent text-slate-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-sm">Admin</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/5 transition-all transform hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? <LoadingSpinner color={theme === 'dark' ? 'black' : 'white'} /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#A37B7B] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
