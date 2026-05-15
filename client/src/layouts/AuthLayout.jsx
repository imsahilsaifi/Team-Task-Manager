import { Outlet } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#FDFCFD] dark:bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1100px] h-full min-h-[600px] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Form Area */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          {/* Brand */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
          </div>

          <div className="max-w-[400px] mx-auto w-full">
            <Outlet />
          </div>
        </div>

        {/* Right Side: Illustration Area */}
        <div className="hidden md:block md:w-1/2 p-6">
          <div className="w-full h-full rounded-[32px] overflow-hidden relative group">
            <img 
              src="/auth-bg.png" 
              alt="Authentication Illustration" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <h3 className="text-2xl font-bold mb-2">Elevate your team's productivity</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Experience the next generation of task management with seamless collaboration and intelligent insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
