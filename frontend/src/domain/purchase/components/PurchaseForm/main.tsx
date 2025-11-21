import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { cn } from '@/core/lib/utils';
import type { CreatePurchaseDto, Purchase } from '../../types';

const purchaseSchema = z.object({
  product_name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  quantity: z.number({ message: 'Quantidade inválida' }).gt(0, 'Deve ser maior que zero'),
  measurement_unit: z.string().min(1, 'Selecione uma unidade'),
  unit_price: z.number({ message: 'Preço inválido' }).min(0, 'Não pode ser negativo'),
  purchase_date: z
    .string()
    .refine((date) => new Date(date) <= new Date(), 'Data não pode ser no futuro'),
  category: z.string().max(50, 'Máximo 50 caracteres').optional(),
  purchase_location: z.string().max(100, 'Máximo 100 caracteres').optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  initialData?: Purchase;
  onSubmit: (data: CreatePurchaseDto) => Promise<void>;
  isSubmitting: boolean;
}

const MEASUREMENT_UNITS = ['un', 'kg', 'g', 'L', 'ml', 'pacote'];

export const PurchaseForm = ({ initialData, onSubmit, isSubmitting }: PurchaseFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      product_name: '',
      quantity: undefined,
      measurement_unit: '',
      unit_price: undefined,
      purchase_date: new Date().toISOString().split('T')[0],
      category: '',
      purchase_location: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('product_name', initialData.product_name);
      setValue('quantity', Number(initialData.quantity));
      setValue('measurement_unit', initialData.measurement_unit);
      setValue('unit_price', Number(initialData.unit_price));
      setValue('purchase_date', initialData.purchase_date.split('T')[0]);
      setValue('category', initialData.category || '');
      setValue('purchase_location', initialData.purchase_location || '');
    }
  }, [initialData, setValue]);

  const quantity = watch('quantity');
  const unitPrice = watch('unit_price');
  const totalPrice = quantity && unitPrice ? quantity * unitPrice : 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Nome do Produto *
          </label>
          <input
            {...register('product_name')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.product_name && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="Ex: Arroz"
          />
          {errors.product_name && (
            <p className="text-sm font-medium text-destructive">{errors.product_name.message}</p>
          )}
        </div>

        {/* Purchase Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Data da Compra *
          </label>
          <input
            type="date"
            {...register('purchase_date')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.purchase_date && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errors.purchase_date && (
            <p className="text-sm font-medium text-destructive">{errors.purchase_date.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Quantidade *
          </label>
          <input
            type="number"
            step="0.001"
            {...register('quantity', { valueAsNumber: true })}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.quantity && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="0.000"
          />
          {errors.quantity && (
            <p className="text-sm font-medium text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        {/* Measurement Unit */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Unidade de Medida *
          </label>
          <select
            {...register('measurement_unit')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.measurement_unit && 'border-destructive focus-visible:ring-destructive'
            )}
          >
            <option value="">Selecione...</option>
            {MEASUREMENT_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.measurement_unit && (
            <p className="text-sm font-medium text-destructive">
              {errors.measurement_unit.message}
            </p>
          )}
        </div>

        {/* Unit Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Preço Unitário (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('unit_price', { valueAsNumber: true })}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.unit_price && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="0.00"
          />
          {errors.unit_price && (
            <p className="text-sm font-medium text-destructive">{errors.unit_price.message}</p>
          )}
        </div>

        {/* Total Price (Read-only) */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Preço Total (R$)
          </label>
          <input
            type="text"
            value={totalPrice.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            readOnly
            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background cursor-not-allowed opacity-50"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Categoria
          </label>
          <input
            {...register('category')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.category && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="Ex: Laticínios"
          />
          {errors.category && (
            <p className="text-sm font-medium text-destructive">{errors.category.message}</p>
          )}
        </div>

        {/* Purchase Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Local da Compra
          </label>
          <input
            {...register('purchase_location')}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              errors.purchase_location && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder="Ex: Supermercado X"
          />
          {errors.purchase_location && (
            <p className="text-sm font-medium text-destructive">
              {errors.purchase_location.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Link
          to=".."
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
