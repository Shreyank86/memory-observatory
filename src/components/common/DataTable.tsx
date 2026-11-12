import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

function DataTable<T>({ columns, data, onRowClick, emptyMessage = 'No data available.', keyExtractor }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map(col => (
              <th key={col.key} className={`text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-100 ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} transition-colors`}
            >
              {columns.map(col => (
                <td key={col.key} className={`py-3 px-4 text-slate-700 ${col.className || ''}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

