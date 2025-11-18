import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload', path: '/upload', icon: Upload },
  { name: 'Cases', path: '/cases', icon: FolderOpen },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd + Key is pressed
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        switch(e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 'u':
            e.preventDefault();
            navigate('/upload');
            break;
          case 'c':
            e.preventDefault();
            navigate('/cases');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative flex bg-gradient-to-br from-[#0a0a0f] via-[#1a0f2e] to-[#0f1419]">
      {/* Sidebar - Always visible on desktop */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 glass-strong border-r border-white/10 shadow-2xl',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-6 right-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="glass-strong border-white/10"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 glow">
                <span className="text-white font-black text-2xl">C</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                CaseFlow
              </span>
              <p className="text-xs text-gray-500">Command Center</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 relative group',
                      isActive
                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl border border-violet-500/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <Icon className={cn(
                        "w-5 h-5 transition-transform duration-300 flex-shrink-0",
                        isActive && "text-violet-400",
                        "group-hover:scale-110"
                      )} />
                      <span className="font-semibold">{item.name}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="mt-6 p-4 glass rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900 shadow-lg shadow-emerald-400/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 glass-strong border-white/10 hover:bg-white/10 text-white group p-3"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Main content - offset for sidebar on desktop */}
      <main className="flex-1 min-h-screen flex flex-col overflow-hidden lg:ml-0">
        {/* World-Class Navbar */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl shadow-xl"
        >
          <div className="h-16 px-6 lg:px-8 flex items-center justify-between max-w-[2000px] mx-auto">
            {/* Left section */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden glass border-white/20 hover:border-violet-500/50 h-10 w-10"
              >
                <Menu size={20} />
              </Button>
              
              {/* Page title */}
              <div>
                <h1 className="text-base lg:text-lg font-bold text-white">
                  {navItems.find(item => item.path === location.pathname)?.name || 'CaseFlow'}
                </h1>
              </div>
            </div>

            {/* Center section - Quick Nav Links (Large screens only) */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                        isActive
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </motion.button>
                  </Link>
                );
              })}
            </div>

            {/* Right section - User Profile */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-white/10">
                <div className="relative">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-gray-900" />
                </div>
                <span className="hidden md:inline text-sm font-semibold text-white">
                  {user?.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Page content with better container */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 lg:px-8 xl:px-12 py-6 lg:py-8 max-w-[2000px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
