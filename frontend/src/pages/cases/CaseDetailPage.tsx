import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Mail, Phone, User, FileText, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCaseById } from '@/features/cases/casesSlice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/Loading';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCase, isLoading } = useAppSelector((state) => state.cases);

  useEffect(() => {
    if (id) {
      dispatch(fetchCaseById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedCase) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">Case not found</p>
        <Button onClick={() => navigate('/cases')} className="mt-4">
          Back to Cases
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, 'default' | 'warning' | 'success' | 'destructive'> = {
    PENDING: 'warning',
    IN_PROGRESS: 'default',
    COMPLETED: 'success',
    REJECTED: 'destructive',
  };

  const priorityColors: Record<string, 'success' | 'warning' | 'destructive'> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'destructive',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Button
          variant="outline"
          onClick={() => navigate('/cases')}
          className="glass border-white/20 hover:border-violet-500/50 hover:bg-violet-500/10 text-white gap-2 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Cases
        </Button>
        
        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <FileText size={24} className="text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {selectedCase.case_id}
                </h1>
              </div>
              <p className="text-gray-400 text-lg ml-15">
                Complete case information and timeline
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant={statusColors[selectedCase.status]} className="text-sm px-4 py-2 font-bold rounded-xl">
                {selectedCase.status}
              </Badge>
              <Badge variant={priorityColors[selectedCase.priority]} className="text-sm px-4 py-2 font-bold rounded-xl">
                {selectedCase.priority}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <User size={24} className="text-violet-400" />
            Applicant Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <User size={20} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Full Name</p>
              </div>
              <p className="text-lg font-bold text-white">{selectedCase.applicant_name}</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Calendar size={20} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Date of Birth</p>
              </div>
              <p className="text-lg font-bold text-white">{formatDate(selectedCase.dob)}</p>
            </motion.div>

            {selectedCase.email && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Mail size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">Email</p>
                </div>
                <p className="text-lg font-bold text-white truncate">{selectedCase.email}</p>
              </motion.div>
            )}

            {selectedCase.phone && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Phone size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">Phone</p>
                </div>
                <p className="text-lg font-bold text-white">{selectedCase.phone}</p>
              </motion.div>
            )}

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <FileText size={20} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Category</p>
              </div>
              <Badge variant="outline" className="border-white/20 bg-white/5 text-white font-bold px-3 py-1">{selectedCase.category}</Badge>
            </motion.div>

            {selectedCase.assignee && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <User size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">Assignee</p>
                </div>
                <p className="text-lg font-bold text-white">{selectedCase.assignee}</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Clock size={24} className="text-violet-400" />
            Timeline
          </h2>
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <Clock size={24} className="text-white" />
                </div>
                <div className="w-1 h-full bg-gradient-to-b from-emerald-500/50 to-transparent mt-3" />
              </div>
              <div className="flex-1 pb-8 glass rounded-2xl p-5 border border-white/10">
                <p className="text-lg font-bold text-white mb-2">Case Created</p>
                <p className="text-sm text-violet-400 font-semibold mb-2">
                  {formatRelativeTime(selectedCase.createdAt)}
                </p>
                <p className="text-sm text-gray-400">
                  Created by <span className="text-white font-semibold">{selectedCase.createdBy}</span>
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/40">
                  <FileText size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1 glass rounded-2xl p-5 border border-white/10">
                <p className="text-lg font-bold text-white mb-2">Last Updated</p>
                <p className="text-sm text-cyan-400 font-semibold">
                  {formatRelativeTime(selectedCase.updatedAt)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
