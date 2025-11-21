import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseListReturn } from './types';

/**
 * @hook usePurchaseList
 * @summary Fetches the list of purchases and current month total
 * @domain purchase
 */
export const usePurchaseList = (): UsePurchaseListReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['purchases'],
    queryFn: purchaseService.list,
  });

  return {
    purchases: data?.purchase_list || [],
    totalCurrentMonth: data?.total_current_month || 0,
    isLoading,
    error,
    refetch,
  };
};
