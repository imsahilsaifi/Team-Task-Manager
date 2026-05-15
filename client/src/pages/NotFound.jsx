import { Link } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-6 shadow-xl">
        <FolderKanban className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 dark:text-slate-100 mb-3">404</h1>
      <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Page Not Found</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary px-6 py-2.5">
        Back to Dashboard
      </Link>
    </div>
  );
}
