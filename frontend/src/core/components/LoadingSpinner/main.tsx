import { cn } from '@/core/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

/**
 * @component LoadingSpinner
 * @summary Generic loading spinner component using Lucide icons
 */
export const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={cn('animate-spin text-primary', className)} size={size} />
    </div>
  );
};
