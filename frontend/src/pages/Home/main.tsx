import { Link } from 'react-router-dom';

/**
 * @page HomePage
 * @summary Landing page for FoodTrack application
 */
export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          FoodTrack
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple food purchase tracking and management.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
