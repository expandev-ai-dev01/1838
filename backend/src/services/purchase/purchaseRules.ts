import { getPool } from '@/utils/database';
import {
  PurchaseCreateRequest,
  PurchaseEntity,
  PurchaseListResponse,
  PurchaseUpdateRequest,
} from './purchaseTypes';

export async function purchaseCreate(params: PurchaseCreateRequest): Promise<PurchaseEntity> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('measurementUnit', params.measurementUnit)
    .input('unitPrice', params.unitPrice)
    .input('purchaseDate', params.purchaseDate)
    .input('category', params.category || null)
    .input('purchaseLocation', params.purchaseLocation || null)
    .execute('spPurchaseCreate');

  return result.recordset[0];
}

export async function purchaseUpdate(params: PurchaseUpdateRequest): Promise<PurchaseEntity> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('purchaseUid', params.purchaseUid)
    .input('productName', params.productName)
    .input('quantity', params.quantity)
    .input('measurementUnit', params.measurementUnit)
    .input('unitPrice', params.unitPrice)
    .input('purchaseDate', params.purchaseDate)
    .input('category', params.category || null)
    .input('purchaseLocation', params.purchaseLocation || null)
    .execute('spPurchaseUpdate');

  return result.recordset[0];
}

export async function purchaseDelete(params: {
  idAccount: number;
  purchaseUid: string;
}): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('purchaseUid', params.purchaseUid)
    .execute('spPurchaseDelete');
}

export async function purchaseList(params: { idAccount: number }): Promise<PurchaseListResponse> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .execute('spPurchaseList');

  // Cast to any[] to resolve TS7053 error where recordsets is inferred as a union type
  const recordsets = result.recordsets as any[];

  return {
    purchases: recordsets[0],
    totalCurrentMonth: recordsets[1]?.[0]?.totalCurrentMonth || 0,
  };
}

export async function purchaseGet(params: {
  idAccount: number;
  purchaseUid: string;
}): Promise<PurchaseEntity | null> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('purchaseUid', params.purchaseUid)
    .execute('spPurchaseGet');

  return result.recordset[0] || null;
}
