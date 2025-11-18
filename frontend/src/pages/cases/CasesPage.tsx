import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCases, setPage, setFilters } from '@/features/cases/casesSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Loading';
import { formatDate } from '@/lib/utils';
import { Case } from '@/types/case';

export default function CasesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cases = [], isLoading, pagination = { page: 1, limit: 10, total: 0, totalPages: 1 }, filters = {} } = useAppSelector((state) => state.cases || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: filters?.status || '',
    category: filters?.category || '',
    priority: filters?.priority || '',
  });

  useEffect(() => {
    dispatch(fetchCases());
  }, [dispatch, pagination.page, filters]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    dispatch(setFilters({ ...filters, search: value }));
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    dispatch(setFilters({
      ...filters,
      status: localFilters.status || undefined,
      category: localFilters.category || undefined,
      priority: localFilters.priority || undefined,
    }));
    setShowFilters(false);
  };

  const clearFilters = () => {
    setLocalFilters({ status: '', category: '', priority: '' });
    dispatch(setFilters({ search: filters.search }));
    setShowFilters(false);
  };

  const activeFilterCount = [localFilters.status, localFilters.category, localFilters.priority].filter(Boolean).length;

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
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:gap-6"
      >
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-2 lg:mb-3">
            Cases
          </h1>
          <p className="text-gray-400 text-base lg:text-lg">
            Manage and track all your imported cases
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 h-12 glass border-white/20 focus:border-violet-500/50 bg-white/5 text-white placeholder:text-gray-500"
            />
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative w-12 h-12 glass border-white/20 hover:border-violet-500/50 hover:bg-violet-500/10"
          >
            <Filter size={20} className="text-white" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Filter Panel - Compact & Premium */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-cyan-500/5" />
          
          <div className="relative glass-strong rounded-2xl p-5 border border-white/10 shadow-xl shadow-violet-500/10">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center gap-2">
                <Filter size={18} />
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg glass border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Compact 3-Column Layout with Chips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Status Filter */}
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2.5 block uppercase tracking-wide">Status</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'PENDING', label: 'Pending', color: 'bg-amber-500/90 hover:bg-amber-500' },
                    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500/90 hover:bg-blue-500' },
                    { value: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500/90 hover:bg-emerald-500' },
                    { value: 'REJECTED', label: 'Rejected', color: 'bg-rose-500/90 hover:bg-rose-500' }
                  ].map((status) => (
                    <motion.button
                      key={status.value}
                      onClick={() => handleFilterChange('status', localFilters.status === status.value ? '' : status.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        localFilters.status === status.value
                          ? `${status.color} text-white shadow-lg ring-2 ring-white/40`
                          : 'glass border border-white/20 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      {status.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2.5 block uppercase tracking-wide">Category</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'TAX', label: 'Tax', gradient: 'from-violet-500 to-purple-500' },
                    { value: 'LICENSE', label: 'License', gradient: 'from-fuchsia-500 to-pink-500' },
                    { value: 'PERMIT', label: 'Permit', gradient: 'from-cyan-500 to-blue-500' }
                  ].map((category) => (
                    <motion.button
                      key={category.value}
                      onClick={() => handleFilterChange('category', localFilters.category === category.value ? '' : category.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        localFilters.category === category.value
                          ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg ring-2 ring-white/40`
                          : 'glass border border-white/20 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-xs font-bold text-gray-400 mb-2.5 block uppercase tracking-wide">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'LOW', label: 'Low', gradient: 'from-emerald-500 to-green-500' },
                    { value: 'MEDIUM', label: 'Medium', gradient: 'from-amber-500 to-orange-500' },
                    { value: 'HIGH', label: 'High', gradient: 'from-rose-500 to-red-500' }
                  ].map((priority) => (
                    <motion.button
                      key={priority.value}
                      onClick={() => handleFilterChange('priority', localFilters.priority === priority.value ? '' : priority.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        localFilters.priority === priority.value
                          ? `bg-gradient-to-r ${priority.gradient} text-white shadow-lg ring-2 ring-white/40`
                          : 'glass border border-white/20 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      {priority.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-white/10">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 glass border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all flex items-center gap-2"
              >
                Apply
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm font-semibold text-gray-400">Active Filters:</span>
          {localFilters.status && (
            <Badge
              variant={statusColors[localFilters.status]}
              className="px-3 py-1 cursor-pointer hover:opacity-80"
              onClick={() => {
                handleFilterChange('status', '');
                dispatch(setFilters({ ...filters, status: undefined }));
              }}
            >
              {localFilters.status.replace('_', ' ')} ×
            </Badge>
          )}
          {localFilters.category && (
            <Badge
              variant="outline"
              className="px-3 py-1 cursor-pointer hover:opacity-80 border-white/20 bg-white/5"
              onClick={() => {
                handleFilterChange('category', '');
                dispatch(setFilters({ ...filters, category: undefined }));
              }}
            >
              {localFilters.category} ×
            </Badge>
          )}
          {localFilters.priority && (
            <Badge
              variant={priorityColors[localFilters.priority]}
              className="px-3 py-1 cursor-pointer hover:opacity-80"
              onClick={() => {
                handleFilterChange('priority', '');
                dispatch(setFilters({ ...filters, priority: undefined }));
              }}
            >
              {localFilters.priority} ×
            </Badge>
          )}
        </motion.div>
      )}

      {/* Cases Grid - Better utilization on wide screens */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 glass-strong rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
          {cases.map((caseItem: Case, index: number) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div
                className="glass-strong rounded-3xl p-6 border border-white/10 cursor-pointer hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 group"
                onClick={() => navigate(`/cases/${caseItem.id}`)}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-xl text-white group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {caseItem.case_id}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {caseItem.applicant_name}
                    </p>
                  </div>
                  <Badge 
                    variant={statusColors[caseItem.status]}
                    className="px-3 py-1 text-xs font-semibold rounded-xl"
                  >
                    {caseItem.status}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Category:</span>
                    <Badge 
                      variant="outline"
                      className="border-white/20 bg-white/5 text-white px-3 py-1 rounded-xl"
                    >
                      {caseItem.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Priority:</span>
                    <Badge 
                      variant={priorityColors[caseItem.priority]}
                      className="px-3 py-1 text-xs font-semibold rounded-xl"
                    >
                      {caseItem.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Created:</span>
                    <span className="text-white font-medium">{formatDate(caseItem.createdAt)}</span>
                  </div>
                </div>

                {caseItem.email && (
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-xs text-gray-400 truncate">{caseItem.email}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && cases.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mb-6 border border-white/10">
            <Filter size={48} className="text-violet-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No cases found</h3>
          <p className="text-gray-400 mb-8 text-lg">
            Try adjusting your search or filters
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold px-8 h-12 shadow-2xl shadow-violet-500/50"
          >
            Import Cases
          </Button>
        </motion.div>
      )}

      {/* Pagination */}
      {cases.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between glass-strong rounded-2xl p-6 border border-white/10"
        >
          <p className="text-sm text-gray-400 font-medium">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setPage(pagination.page - 1))}
              disabled={pagination.page === 1}
              className="glass border-white/20 hover:border-violet-500/50 hover:bg-violet-500/10 text-white font-semibold disabled:opacity-30"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setPage(pagination.page + 1))}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="glass border-white/20 hover:border-violet-500/50 hover:bg-violet-500/10 text-white font-semibold disabled:opacity-30"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
