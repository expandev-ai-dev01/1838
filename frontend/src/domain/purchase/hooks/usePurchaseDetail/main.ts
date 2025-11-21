import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';

/**
 * @hook usePurchaseDetail
 * @summary Fetches a single purchase by ID
 * @domain purchase
 */
export const usePurchaseDetail = (id?: string) => {
  return useQuery({
    queryKey: ['purchase', id],
    queryFn: () => purchaseService.getById(id!),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data for edit form
  });
};
