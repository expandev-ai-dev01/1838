import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseActions } from '@/domain/purchase/hooks/usePurchaseActions';
import { usePurchaseDetail } from '@/domain/purchase/hooks/usePurchaseDetail';
import { PurchaseForm } from '@/domain/purchase/components/PurchaseForm';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';
import type { CreatePurchaseDto } from '@/domain/purchase/types';

/**
 * @page PurchaseFormPage
 * @summary Page for creating or editing a purchase
 * @domain purchase
 */
export const PurchaseFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { createPurchase, updatePurchase, isCreating, isUpdating } = usePurchaseActions();
  const { data: purchase, isLoading: isLoadingDetail, error: detailError } = usePurchaseDetail(id);

  const handleSubmit = async (data: CreatePurchaseDto) => {
    try {
      if (isEditMode && id) {
        await updatePurchase({ id, data });
      } else {
        await createPurchase(data);
      }
      navigate('..');
    } catch (error) {
      console.error('Failed to save purchase:', error);
      // Error handling is typically managed by the mutation or a toast service
    }
  };

  if (isEditMode && isLoadingDetail) {
    return <LoadingSpinner />;
  }

  if (isEditMode && detailError) {
    return (
      <div className="p-4 text-center text-destructive">
        Erro ao carregar dados da compra. Tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEditMode ? 'Editar Compra' : 'Nova Compra'}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode
            ? 'Atualize os dados da compra.'
            : 'Preencha os dados para registrar uma nova compra.'}
        </p>
      </div>

      <ErrorBoundary>
        <PurchaseForm
          initialData={purchase}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </ErrorBoundary>
    </div>
  );
};

export default PurchaseFormPage;
