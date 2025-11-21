import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { purchaseCreate, purchaseList } from '@/services/purchase';
import { zDateString } from '@/utils/zodValidation';

const securable = 'PURCHASE';

const createSchema = z.object({
  product_name: z.string().min(2).max(100),
  quantity: z.number().gt(0),
  measurement_unit: z.string().min(1),
  unit_price: z.number().min(0),
  purchase_date: zDateString.or(z.string()), // Accept ISO string
  category: z.string().max(50).optional().nullable(),
  purchase_location: z.string().max(100).optional().nullable(),
});

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);
  const [validated, error] = await operation.list(req);

  if (!validated) return next(error);

  try {
    const data = await purchaseList({ idAccount: validated.credential.idAccount });

    // Transform to match frontend expectations (snake_case)
    const response = {
      purchase_list: data.purchases.map((p) => ({
        purchase_id: p.purchaseUid,
        product_name: p.productName,
        quantity: p.quantity,
        measurement_unit: p.measurementUnit,
        unit_price: p.unitPrice,
        total_price: p.totalPrice,
        purchase_date: p.purchaseDate,
        category: p.category,
        purchase_location: p.purchaseLocation,
      })),
      total_current_month: data.totalCurrentMonth,
    };

    res.json(successResponse(response));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);
  const [validated, error] = await operation.create(req, createSchema);

  if (!validated) return next(error);

  try {
    const params = validated.params as z.infer<typeof createSchema>;
    const result = await purchaseCreate({
      idAccount: validated.credential.idAccount,
      productName: params.product_name,
      quantity: params.quantity,
      measurementUnit: params.measurement_unit,
      unitPrice: params.unit_price,
      purchaseDate: params.purchase_date,
      category: params.category,
      purchaseLocation: params.purchase_location,
    });

    // Transform response
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
