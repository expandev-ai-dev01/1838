export interface PurchaseEntity {
  id: number;
  purchaseUid: string;
  idAccount: number;
  productName: string;
  quantity: number;
  measurementUnit: string;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: Date;
  category: string | null;
  purchaseLocation: string | null;
  createdAt: Date;
}

export interface PurchaseCreateRequest {
  idAccount: number;
  productName: string;
  quantity: number;
  measurementUnit: string;
  unitPrice: number;
  purchaseDate: string; // Date string from JSON
  category?: string | null;
  purchaseLocation?: string | null;
}

export interface PurchaseUpdateRequest extends PurchaseCreateRequest {
  purchaseUid: string;
}

export interface PurchaseListResponse {
  purchases: PurchaseEntity[];
  totalCurrentMonth: number;
}
