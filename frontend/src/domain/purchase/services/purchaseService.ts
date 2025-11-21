import { authenticatedClient } from '@/core/lib/api';
import type {
  Purchase,
  PurchaseListResponse,
  CreatePurchaseDto,
  UpdatePurchaseDto,
} from '../types';

/**
 * @service purchaseService
 * @summary Service for managing food purchases
 * @domain purchase
 */
export const purchaseService = {
  async list(): Promise<PurchaseListResponse> {
    const response = await authenticatedClient.get('/purchase');
    return response.data.data;
  },

  async getById(id: string): Promise<Purchase> {
    const response = await authenticatedClient.get(`/purchase/${id}`);
    return response.data.data;
  },

  async create(data: CreatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.post('/purchase', data);
    return response.data.data;
  },

  async update(id: string, data: UpdatePurchaseDto): Promise<Purchase> {
    const response = await authenticatedClient.put(`/purchase/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/purchase/${id}`);
  },
};
