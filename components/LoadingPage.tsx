import { Spinner } from '@/components/ui/spinner';

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({
  message = "Loading...",
  className = "min-h-screen"
}: LoadingPageProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4">
        <Spinner className="size-8 mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}