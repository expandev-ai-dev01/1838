import type { CreatePurchaseDto, UpdatePurchaseDto, Purchase } from '../../types';

export interface UsePurchaseActionsReturn {
  createPurchase: (data: CreatePurchaseDto) => Promise<Purchase>;
  updatePurchase: (params: { id: string; data: UpdatePurchaseDto }) => Promise<Purchase>;
  deletePurchase: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}
