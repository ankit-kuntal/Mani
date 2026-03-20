'use client';

import { AlertCircle, Zap } from 'lucide-react';

interface AttemptCounterProps {
  attemptsLeft: number | null;
  loading?: boolean;
}

export function AttemptCounter({ attemptsLeft, loading = false }: AttemptCounterProps) {
  if (loading || attemptsLeft === null) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Loading attempts...</p>
      </div>
    );
  }

  const getColor = () => {
    if (attemptsLeft === 0) return 'text-destructive';
    if (attemptsLeft === 1) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-green-600 dark:text-green-500';
  };

  const getIcon = () => {
    if (attemptsLeft === 0) return <AlertCircle className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${getColor()}`}>
      {getIcon()}
      <span className="font-semibold">
        {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left
      </span>
    </div>
  );
}
