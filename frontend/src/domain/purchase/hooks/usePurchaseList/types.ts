import type { Purchase } from '../../types';

export interface UsePurchaseListReturn {
  purchases: Purchase[];
  totalCurrentMonth: number;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
