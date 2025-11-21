import { Link } from 'react-router-dom';

/**
 * @page NotFoundPage
 * @summary 404 Error page
 */
export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
      <p className="mb-8 text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
