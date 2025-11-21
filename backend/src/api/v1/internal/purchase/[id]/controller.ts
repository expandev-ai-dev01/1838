import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { purchaseDelete, purchaseGet, purchaseUpdate } from '@/services/purchase';
import { zDateString } from '@/utils/zodValidation';

const securable = 'PURCHASE';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const updateSchema = z.object({
  product_name: z.string().min(2).max(100),
  quantity: z.number().gt(0),
  measurement_unit: z.string().min(1),
  unit_price: z.number().min(0),
  purchase_date: zDateString.or(z.string()),
  category: z.string().max(50).optional().nullable(),
  purchase_location: z.string().max(100).optional().nullable(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) return next(error);

  try {
    const result = await purchaseGet({
      idAccount: validated.credential.idAccount,
      purchaseUid: validated.params.id,
    });

    if (!result) {
      res.status(404).json(errorResponse('Purchase not found', 'NOT_FOUND'));
      return;
    }

    const response = {
      purchase_id: result.purchaseUid,
      product_name: result.productName,
      quantity: result.quantity,
      measurement_unit: result.measurementUnit,
      unit_price: result.unitPrice,
      total_price: result.totalPrice,
      purchase_date: result.purchaseDate,
      category: result.category,
      purchase_location: result.purchaseLocation,
    };

    res.json(successResponse(response));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);
  const [validated, error] = await operation.update(req, paramsSchema, updateSchema);

  if (!validated) return next(error);

  try {
    const params = validated.params as z.infer<typeof paramsSchema> & z.infer<typeof updateSchema>;

    const result = await purchaseUpdate({
      idAccount: validated.credential.idAccount,
      purchaseUid: params.id,
      productName: params.product_name,
      quantity: params.quantity,
      measurementUnit: params.measurement_unit,
      unitPrice: params.unit_price,
      purchaseDate: params.purchase_date,
      category: params.category,
      purchaseLocation: params.purchase_location,
    });

    const response = {
      purchase_id: result.purchaseUid,
      product_name: result.productName,
      quantity: result.quantity,
      measurement_unit: result.measurementUnit,
      unit_price: result.unitPrice,
      total_price: result.totalPrice,
      purchase_date: result.purchaseDate,
      category: result.category,
      purchase_location: result.purchaseLocation,
    };

    res.json(successResponse(response));
  } catch (error: any) {
    if (error.message === 'PurchaseNotFound') {
      res.status(404).json(errorResponse('Purchase not found', 'NOT_FOUND'));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);
  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) return next(error);

  try {
    await purchaseDelete({
      idAccount: validated.credential.idAccount,
      purchaseUid: validated.params.id,
    });

    res.json(successResponse({ deleted: true }));
  } catch (error: any) {
    if (error.message === 'PurchaseNotFound') {
      res.status(404).json(errorResponse('Purchase not found', 'NOT_FOUND'));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}
