import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '../../services/purchaseService';
import type { UsePurchaseActionsReturn } from './types';

/**
 * @hook usePurchaseActions
 * @summary Handles create, update, and delete operations for purchases
 * @domain purchase
 */
export const usePurchaseActions = (): UsePurchaseActionsReturn => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: purchaseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => purchaseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchase'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: purchaseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    createPurchase: createMutation.mutateAsync,
    updatePurchase: updateMutation.mutateAsync,
    deletePurchase: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
