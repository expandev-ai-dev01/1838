import { Outlet } from 'react-router-dom';

/**
 * @layout DashboardLayout
 * @summary Layout for authenticated dashboard pages
 */
export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">FoodTrack</h1>
          {/* Navigation/User Menu would go here */}
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
