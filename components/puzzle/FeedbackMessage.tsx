'use client';

import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface FeedbackMessageProps {
  message?: string;
  type?: 'success' | 'warning' | 'error';
  tempPassword?: string;
}

export function FeedbackMessage({
  message,
  type = 'error',
  tempPassword,
}: FeedbackMessageProps) {
  if (!message) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100';
      case 'error':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 flex-shrink-0" />;
    }
  };

  return (
    <div className={`rounded-lg border p-4 flex gap-3 ${getStyle()}`}>
      {getIcon()}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        {tempPassword && (
          <p className="text-sm mt-2 font-mono bg-white dark:bg-black bg-opacity-30 px-2 py-1 rounded inline-block">
            Temp Password: <strong>{tempPassword}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
