import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-500">
    <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
    <p className="text-sm mb-3">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="text-sm px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;

