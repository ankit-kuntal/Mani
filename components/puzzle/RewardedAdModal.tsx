'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAttempts } from '@/hooks/useAttempts';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RewardedAdModal({ isOpen, onClose }: RewardedAdModalProps) {
  const { increment } = useAttempts();
  const [watching, setWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!watching) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setWatching(false);
          increment();
          setTimeLeft(30);
          onClose();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [watching, increment, onClose]);

  const handleWatchAd = () => {
    setWatching(true);
    setTimeLeft(30);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Watch a Video for a Bonus Attempt</AlertDialogTitle>
          <AlertDialogDescription>
            Earn one additional attempt by watching a short video ad
          </AlertDialogDescription>
        </AlertDialogHeader>

        {watching ? (
          <div className="space-y-4">
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/50">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Video Ad Playing...</p>
                <p className="text-3xl font-bold">{timeLeft}s</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Please watch the video to earn your bonus attempt
            </p>
          </div>
        ) : (
          <Button
            onClick={handleWatchAd}
            className="w-full"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch 30-second Ad
          </Button>
        )}

        <div className="flex gap-2">
          {!watching && (
            <>
              <AlertDialogCancel className="flex-1">
                Skip
              </AlertDialogCancel>
            </>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
