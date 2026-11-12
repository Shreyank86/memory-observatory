import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  validated: 'bg-blue-50 text-blue-700 border-blue-200',
  candidate: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  updated: 'bg-sky-50 text-sky-700 border-sky-200',
  superseded: 'bg-orange-50 text-orange-700 border-orange-200',
  consolidated: 'bg-purple-50 text-purple-700 border-purple-200',
  decayed: 'bg-slate-100 text-slate-600 border-slate-300',
  deleted: 'bg-red-50 text-red-700 border-red-200',
  disconnected: 'bg-slate-100 text-slate-500 border-slate-300',
  error: 'bg-red-50 text-red-700 border-red-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  degraded: 'bg-amber-50 text-amber-700 border-amber-200',
  down: 'bg-red-50 text-red-700 border-red-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-300',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const colors = colorMap[status] || 'bg-slate-100 text-slate-600 border-slate-300';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center rounded-md border font-medium capitalize ${colors} ${sizeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

