import { usePurchaseList } from '@/domain/purchase/hooks/usePurchaseList';
import { usePurchaseActions } from '@/domain/purchase/hooks/usePurchaseActions';
import { PurchaseList } from '@/domain/purchase/components/PurchaseList';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';

/**
 * @page PurchasePage
 * @summary Page for listing and managing purchases
 * @domain purchase
 */
export const PurchasePage = () => {
  const { purchases, totalCurrentMonth, isLoading, error } = usePurchaseList();
  const { deletePurchase, isDeleting } = usePurchaseActions();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Erro ao carregar compras. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestão de Compras</h2>
        <p className="text-muted-foreground">
          Gerencie suas compras de alimentos e acompanhe seus gastos.
        </p>
      </div>

      <ErrorBoundary>
        <PurchaseList
          purchases={purchases}
          totalCurrentMonth={totalCurrentMonth}
          onDelete={deletePurchase}
          isDeleting={isDeleting}
        />
      </ErrorBoundary>
    </div>
  );
};

export default PurchasePage;
