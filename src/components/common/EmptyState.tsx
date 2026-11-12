import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title = 'No data', message = 'There is nothing to display yet.', action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <Inbox className="w-10 h-10 mb-3" />
    <p className="text-sm font-medium text-slate-600">{title}</p>
    <p className="text-xs mt-1">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;

