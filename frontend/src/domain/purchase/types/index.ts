export interface Purchase {
  purchase_id: string;
  product_name: string;
  quantity: number;
  measurement_unit: string;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  category?: string | null;
  purchase_location?: string | null;
}

export interface PurchaseListResponse {
  purchase_list: Purchase[];
  total_current_month: number;
}

export interface CreatePurchaseDto {
  product_name: string;
  quantity: number;
  measurement_unit: string;
  unit_price: number;
  purchase_date: string;
  category?: string;
  purchase_location?: string;
}

export interface UpdatePurchaseDto extends CreatePurchaseDto {}
