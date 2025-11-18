import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { CaseData, ValidationError } from '@/types/case';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface DataGridProps {
  data: CaseData[];
  errors: ValidationError[];
}

export default function DataGrid({ data, errors }: DataGridProps) {
  // Create error map for quick lookup
  const errorMap = useMemo(() => {
    const map = new Map<string, ValidationError[]>();
    errors.forEach((error) => {
      const key = `${error.row}-${error.field}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(error);
    });
    return map;
  }, [errors]);

  const columns: ColumnDef<CaseData>[] = useMemo(
    () => [
      {
        accessorKey: 'case_id',
        header: 'Case ID',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-case_id`);
          return (
            <div className={cn('flex items-center gap-2 font-semibold', error && 'text-rose-400')}>
              {error && <AlertCircle size={16} className="animate-pulse" />}
              <span className="text-white">{getValue() as string}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'applicant_name',
        header: 'Applicant Name',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-applicant_name`);
          return (
            <div className={cn('flex items-center gap-2', error && 'text-rose-400')}>
              {error && <AlertCircle size={16} className="animate-pulse" />}
              <span className="text-gray-200">{getValue() as string}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'dob',
        header: 'Date of Birth',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-dob`);
          return (
            <div className={cn('flex items-center gap-2', error && 'text-red-600')}>
              {error && <AlertCircle size={14} />}
              <span>{getValue() as string}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-email`);
          return (
            <div className={cn('flex items-center gap-2', error && 'text-rose-400')}>
              {error && <AlertCircle size={16} className="animate-pulse" />}
              <span className="truncate max-w-xs text-gray-300">{getValue() as string}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-phone`);
          return (
            <div className={cn('flex items-center gap-2', error && 'text-rose-400')}>
              {error && <AlertCircle size={16} className="animate-pulse" />}
              <span className="text-gray-300">{getValue() as string || '-'}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-category`);
          const value = getValue() as string;
          const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
            TAX: 'default',
            LICENSE: 'secondary',
            PERMIT: 'destructive',
          };
          return (
            <div className="flex items-center gap-2">
              {error && <AlertCircle size={16} className="text-rose-400 animate-pulse" />}
              <Badge variant={variants[value] || 'outline'} className="font-semibold px-3 py-1">{value}</Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row, getValue }) => {
          const error = errorMap.get(`${row.index + 1}-priority`);
          const value = getValue() as string;
          const variants: Record<string, 'success' | 'warning' | 'destructive'> = {
            LOW: 'success',
            MEDIUM: 'warning',
            HIGH: 'destructive',
          };
          return (
            <div className="flex items-center gap-2">
              {error && <AlertCircle size={16} className="text-rose-400 animate-pulse" />}
              <Badge variant={variants[value] || 'outline'} className="font-semibold px-3 py-1">{value || 'LOW'}</Badge>
            </div>
          );
        },
      },
    ],
    [errorMap]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="glass-strong border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white/10">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-bold text-violet-400 uppercase tracking-wider bg-white/5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.slice(0, 100).map((row) => {
              const hasError = errors.some((e) => e.row === row.index + 1);
              return (
                <tr
                  key={row.id}
                  className={cn(
                    'hover:bg-white/5 transition-all duration-200',
                    hasError && 'bg-rose-500/10 border-l-4 border-rose-500'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length > 100 && (
        <div className="px-6 py-4 text-center text-sm text-gray-400 bg-white/5 border-t border-white/10">
          <span className="font-semibold text-violet-400">Showing first 100 rows</span> of {data.length} total
        </div>
      )}
    </div>
  );
}
