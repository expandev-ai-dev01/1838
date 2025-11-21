import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth';
import { validationMiddleware } from '@/middleware/validation';
import * as purchaseController from '@/api/v1/internal/purchase/controller';
import * as purchaseIdController from '@/api/v1/internal/purchase/[id]/controller';

const router = Router();

// Purchase routes
router.get('/purchase', authMiddleware, purchaseController.listHandler);
router.post('/purchase', authMiddleware, purchaseController.createHandler);
router.get('/purchase/:id', authMiddleware, purchaseIdController.getHandler);
router.put('/purchase/:id', authMiddleware, purchaseIdController.updateHandler);
router.delete('/purchase/:id', authMiddleware, purchaseIdController.deleteHandler);

export default router;
