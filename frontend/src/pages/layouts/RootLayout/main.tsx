import { Outlet } from 'react-router-dom';

/**
 * @layout RootLayout
 * @summary Base layout for the application
 */
export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
    </div>
  );
};
