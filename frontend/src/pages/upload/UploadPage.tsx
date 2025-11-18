import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFile, setParsedData, setValidationErrors, importCases } from '@/features/upload/uploadSlice';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { caseSchema, CaseData, ValidationError } from '@/types/case';
import { toast } from 'sonner';
import DataGrid from '@/components/upload/DataGrid';

export default function UploadPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { parsedData, validationErrors, isUploading, importResult } = useAppSelector(
    (state) => state.upload
  );
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    if (!csvFile) return;

    dispatch(setFile(csvFile));

    // Parse CSV
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CaseData[];
        
        // Validate data
        const errors: ValidationError[] = [];
        const validData: CaseData[] = [];

        data.forEach((row, index) => {
          try {
            const validated = caseSchema.parse(row);
            validData.push(validated);
          } catch (err: any) {
            const zodErrors = err.errors || [];
            zodErrors.forEach((error: any) => {
              errors.push({
                row: index + 1,
                field: error.path[0] || 'unknown',
                message: error.message,
                value: String(row[error.path[0] as keyof typeof row] || ''),
              });
            });
          }
        });

        dispatch(setParsedData(data));
        dispatch(setValidationErrors(errors));
        setStep('preview');

        if (errors.length > 0) {
          toast.warning(`Found ${errors.length} validation errors`);
        } else {
          toast.success(`Parsed ${data.length} rows successfully`);
        }
      },
      error: (error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
      },
    });
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast.error('Please fix validation errors before importing');
      return;
    }

    try {
      await dispatch(importCases(parsedData)).unwrap();
      setStep('complete');
      toast.success('Cases imported successfully!');
    } catch (error: any) {
      toast.error(error || 'Import failed');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Import Cases
        </h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg">
          Upload and validate CSV files to import case data
        </p>
      </motion.div>

      {/* Steps Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-2 md:gap-4"
      >
        {['Upload', 'Preview', 'Complete'].map((label, index) => {
          const stepIndex = ['upload', 'preview', 'complete'].indexOf(step);
          const isActive = index === stepIndex;
          const isCompleted = index < stepIndex;

          return (
            <div key={label} className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                      : 'glass text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : index + 1}
                </motion.div>
                <span
                  className={`font-semibold text-sm md:text-base ${
                    isActive || isCompleted
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`w-12 md:w-20 h-1 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="glass-strong rounded-3xl p-8 border border-white/10">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Upload CSV File</h3>
                <p className="text-gray-400">
                  Drag and drop your CSV file or click to browse
                </p>
              </div>
              
              <div
                {...getRootProps()}
                className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-500 ${
                  isDragActive
                    ? 'border-violet-500 bg-violet-500/10 scale-[1.02] shadow-2xl shadow-violet-500/50'
                    : 'border-white/20 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-xl hover:shadow-violet-500/20'
                }`}
              >
                <input {...getInputProps()} />
                
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  animate={{
                    y: isDragActive ? -10 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative z-10"
                >
                  <motion.div 
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-violet-500/50"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UploadIcon size={42} className="text-white" />
                  </motion.div>
                  <p className="text-xl font-bold text-white mb-2">
                    {isDragActive ? 'Drop the file here' : 'Drop CSV file here'}
                  </p>
                  <p className="text-gray-400">
                    or click to browse your computer
                  </p>
                </motion.div>
              </div>

              {/* Sample CSV Download */}
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="outline" 
                  className="gap-2 glass border-white/20 hover:border-violet-500/50 hover:bg-violet-500/10 text-white"
                >
                  <Download size={16} />
                  Download Sample CSV
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Summary Stats */}
            <div className="glass-strong rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Data Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                      <FileText size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Rows</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{parsedData.length}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Valid</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                        {parsedData.length - validationErrors.length}
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/50">
                      <AlertCircle size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Errors</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
                        {validationErrors.length}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Data Grid */}
            <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white mb-2">Data Preview</h3>
                <p className="text-gray-400">
                  Review and edit your data before importing
                </p>
              </div>
              <div className="p-8">
                <DataGrid data={parsedData} errors={validationErrors} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setStep('upload')}
                disabled={isUploading}
                className="glass border-white/20 hover:border-violet-500/50 hover:bg-violet-500/10 text-white font-semibold px-8 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleImport}
                disabled={isUploading || validationErrors.length > 0}
                className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold px-8 h-12 shadow-2xl shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Importing...
                  </>
                ) : (
                  <>
                    Import {parsedData.length} Cases
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'complete' && importResult && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center min-h-[500px]"
          >
            <div className="glass-strong rounded-3xl border border-white/10 p-16 text-center max-w-2xl w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/50"
              >
                <CheckCircle size={56} className="text-white" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4"
              >
                Import Complete!
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mb-10 text-lg"
              >
                Your cases have been successfully imported
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-10"
              >
                <div className="glass rounded-2xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Success</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{importResult.success}</p>
                </div>
                <div className="glass rounded-2xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Failed</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">{importResult.failed}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 justify-center"
              >
                <Button 
                  onClick={() => navigate('/cases')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 h-12 shadow-2xl shadow-emerald-500/50"
                >
                  View Cases
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="glass border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white font-semibold px-8 h-12"
                >
                  Import More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
