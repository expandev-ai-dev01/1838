import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { RootLayout } from '@/pages/layouts/RootLayout';
import { DashboardLayout } from '@/pages/layouts/DashboardLayout';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/Home'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Feature pages
const PurchaseListPage = lazy(() => import('@/pages/Purchase'));
const PurchaseFormPage = lazy(() => import('@/pages/PurchaseForm'));

/**
 * @router AppRouter
 * @summary Main application routing configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <div className="p-8 text-center">Routing Error</div>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: 'purchases',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <PurchaseListPage />
                  </Suspense>
                ),
              },
              {
                path: 'new',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <PurchaseFormPage />
                  </Suspense>
                ),
              },
              {
                path: ':id/edit',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <PurchaseFormPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
