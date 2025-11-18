import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FolderOpen, 
  TrendingUp, 
  Activity, 
  Zap,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useAppSelector } from '@/hooks/redux';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Cases',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: FolderOpen,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      iconBg: 'from-violet-500/20 to-fuchsia-500/20',
    },
    {
      title: 'Processing',
      value: '23',
      change: '+5.2%',
      trend: 'up',
      icon: Activity,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      iconBg: 'from-cyan-500/20 to-indigo-500/20',
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle2,
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      iconBg: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      title: 'Avg Time',
      value: '2.4h',
      change: '-8.3%',
      trend: 'down',
      icon: Clock,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      iconBg: 'from-amber-500/20 to-red-500/20',
    },
  ];

  const quickActions = [
    {
      title: 'Upload New Cases',
      description: 'Import cases from CSV files with validation',
      icon: Upload,
      gradient: 'from-violet-600 to-fuchsia-600',
      action: () => navigate('/upload'),
      badge: 'Quick',
    },
    {
      title: 'Browse Cases',
      description: 'View and manage all imported cases',
      icon: FolderOpen,
      gradient: 'from-cyan-600 to-blue-600',
      action: () => navigate('/cases'),
      badge: 'Popular',
    },
    {
      title: 'Analytics',
      description: 'View detailed insights and reports',
      icon: BarChart3,
      gradient: 'from-emerald-600 to-teal-600',
      action: () => {},
      badge: 'New',
    },
  ];

  const recentActivity = [
    { action: 'Imported 45 cases', time: '2 minutes ago', type: 'success' },
    { action: 'Updated case C-1045', time: '15 minutes ago', type: 'info' },
    { action: 'Exported report', time: '1 hour ago', type: 'success' },
    { action: 'Validation error fixed', time: '2 hours ago', type: 'warning' },
  ];

  return (
    <div className="relative space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Welcome back, {user?.name?.split(' ')[0]}!
            </span>
          </h1>
        </div>
        <p className="text-gray-400 text-base lg:text-lg ml-11">
          Your command center is ready. Let's build something amazing today.
        </p>
      </motion.div>

      {/* Stats Grid - Better utilization on wide screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="glass-strong card-hover border-0 group overflow-hidden relative cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-3xl transition-all duration-500" />
                  
                  <CardContent className="p-5 lg:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.iconBg} backdrop-blur-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        stat.trend === 'up' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        <ArrowUpRight className={`w-3 h-3 ${stat.trend === 'down' && 'rotate-90'}`} />
                        {stat.change}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        {stat.title}
                      </p>
                      <h3 className="text-4xl font-black text-white mb-1">
                        {stat.value}
                      </h3>
                      <p className="text-xs text-gray-500">
                        vs last month
                      </p>
                    </div>

                    {/* Animated line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="xl:col-span-2 space-y-4"
        >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card 
                      className="glass-strong border-0 card-hover cursor-pointer group relative overflow-hidden h-full"
                      onClick={action.action}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-all duration-500`} />
                      
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg shadow-${action.gradient}/50`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                            {action.badge}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {action.description}
                          </p>
                        </div>

                        <motion.div
                          className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-white"
                          whileHover={{ x: 5 }}
                        >
                          Get started
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            </div>
            
            <Card className="glass-strong border-0">
              <CardContent className="p-6 space-y-4">
                {recentActivity.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      item.type === 'success' ? 'bg-emerald-400' :
                      item.type === 'warning' ? 'bg-amber-400' :
                      'bg-cyan-400'
                    } shadow-lg ${
                      item.type === 'success' ? 'shadow-emerald-400/50' :
                      item.type === 'warning' ? 'shadow-amber-400/50' :
                      'shadow-cyan-400/50'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm group-hover:text-gray-100">
                        {item.action}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}
