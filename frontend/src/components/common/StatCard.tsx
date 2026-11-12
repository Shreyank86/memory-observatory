import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, change, changeType = 'neutral' }) => {
  const changeColor = changeType === 'positive' ? 'text-emerald-600' : changeType === 'negative' ? 'text-red-500' : 'text-slate-500';
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4">
      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-semibold text-slate-900 mt-0.5">{value}</p>
        {change && <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>}
      </div>
    </div>
  );
};

export default StatCard;

