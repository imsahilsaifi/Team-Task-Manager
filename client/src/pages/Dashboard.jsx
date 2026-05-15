import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  CheckSquare, Clock, TrendingUp, AlertTriangle,
  FolderKanban, ChevronRight, User as UserIcon,
  ShoppingCart, CreditCard, Monitor, Users, MoreHorizontal, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const LINE_CHART_DATA = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 250 },
  { name: 'Apr', value: 400 },
  { name: 'May', value: 380 },
  { name: 'Jun', value: 550 },
  { name: 'Jul', value: 480 },
  { name: 'Aug', value: 700 },
  { name: 'Sep', value: 650 },
  { name: 'Oct', value: 800 },
  { name: 'Nov', value: 750 },
  { name: 'Dec', value: 900 },
];

const PIE_CHART_DATA = [
  { name: '17 - 30 Years old', value: 62, color: '#1C3FAA' },
  { name: '31 - 50 Years old', value: 33, color: '#FBBF24' },
  { name: '>= 50 Years old', value: 10, color: '#F87171' },
];

function PremiumStatCard({ title, value, icon: Icon, trend, trendValue, colorClass }) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 transition-transform group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}%
        </div>
      </div>
      <div>
        <h3 className="text-[32px] font-bold text-slate-900 dark:text-white leading-none">{value}</h3>
        <p className="text-sm text-slate-400 font-medium mt-2">{title}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { searchQuery } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/dashboard');
        setData(res);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!data) return { recent: [], overdue: [], created: [] };
    const query = searchQuery.toLowerCase();
    const filter = (tasks) => tasks.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.project?.name?.toLowerCase().includes(query)
    );
    return {
      recent: filter(data.recentTasks || []),
      overdue: filter(data.overdueTasks || []),
      created: filter(data.myCreatedTasks || [])
    };
  }, [data, searchQuery]);

  // Map API data to chart formats
  const lineChartData = data?.activityData || [];
  
  const pieChartData = [
    { name: 'To Do', value: data?.todoCount || 0, color: '#94a3b8' },
    { name: 'In Progress', value: data?.inProgressCount || 0, color: '#FBBF24' },
    { name: 'Done', value: data?.doneCount || 0, color: '#10B981' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  if (error) return <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Main Content Area */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Report</h2>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Reload Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumStatCard title="Total Tasks" value={data.totalTasks} icon={ShoppingCart} trend="up" trendValue="33" colorClass="bg-blue-500" />
          <PremiumStatCard title="Pending" value={data.todoCount} icon={CreditCard} trend="down" trendValue="2" colorClass="bg-red-500" />
          <PremiumStatCard title="In Progress" value={data.inProgressCount} icon={Monitor} trend="up" trendValue="12" colorClass="bg-amber-500" />
          <PremiumStatCard title="Done" value={data.doneCount} icon={Users} trend="up" trendValue="22" colorClass="bg-emerald-500" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Report (Line Chart) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tasks Activity</h3>
                <p className="text-sm text-slate-400 font-medium">Tasks created in the last 6 months</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#1C3FAA" strokeWidth={4} dot={{ r: 4, fill: '#1C3FAA', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} animationDuration={2000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Top Seller (Pie Chart) */}
          <div className="bg-white dark:bg-slate-800/50 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Status Distribution</h3>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalTasks}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tasks</span>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {pieChartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white">
                    {item.value} ({data.totalTasks > 0 ? Math.round((item.value / data.totalTasks) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Search Results / Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Quick Overview'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Tasks List */}
            <div className="bg-white dark:bg-slate-800/50 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between mb-6">
                <h3 className="font-bold">Assigned to Me</h3>
                <MoreHorizontal className="w-4 h-4 text-slate-300" />
              </div>
              <div className="space-y-4">
                {filteredTasks.recent.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No tasks found</p>
                ) : (
                  filteredTasks.recent.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <CheckSquare className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{task.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{task.project?.name}</p>
                        </div>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tasks per User List (Visible to Admins only) */}
            {user.role === 'ADMIN' && (
              <div className="bg-white dark:bg-slate-800/50 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between mb-6">
                  <h3 className="font-bold">Tasks per User</h3>
                  <Users className="w-4 h-4 text-slate-300" />
                </div>
                <div className="space-y-4">
                  {(!data.tasksPerUser || data.tasksPerUser.length === 0) ? (
                    <p className="text-sm text-slate-400 text-center py-4">No data available</p>
                  ) : (
                    data.tasksPerUser.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                            {item.name[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-slate-500">
                          {item.count} Tasks
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Overdue Tasks List */}
            <div className="bg-white dark:bg-slate-800/50 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between mb-6">
                <h3 className="font-bold">Overdue / Critical</h3>
                <MoreHorizontal className="w-4 h-4 text-slate-300" />
              </div>
              <div className="space-y-4">
                {filteredTasks.overdue.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">All clear!</p>
                ) : (
                  filteredTasks.overdue.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{task.title}</p>
                          <p className="text-[10px] text-red-500 font-bold">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
