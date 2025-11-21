import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import type { Purchase } from '../../types';

interface PurchaseListProps {
  purchases: Purchase[];
  totalCurrentMonth: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const PurchaseList = ({
  purchases,
  totalCurrentMonth,
  onDelete,
  isDeleting,
}: PurchaseListProps) => {
  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este item?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Gasto (Mês Atual)</p>
          <p className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              totalCurrentMonth
            )}
          </p>
        </div>
        <Link
          to="new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Plus size={16} />
          Adicionar Compra
        </Link>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Data
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Produto
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Qtd.
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Preço Total
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Nenhuma compra registrada ainda.
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr
                    key={purchase.purchase_id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      {format(new Date(purchase.purchase_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-4 align-middle font-medium">{purchase.product_name}</td>
                    <td className="p-4 align-middle">
                      {purchase.quantity} {purchase.measurement_unit}
                    </td>
                    <td className="p-4 align-middle">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(purchase.total_price)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`${purchase.purchase_id}/edit`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(purchase.purchase_id)}
                          disabled={isDeleting}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
