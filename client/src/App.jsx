import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

// Layout Components
import AppLayout from "./components/layout/AppLayout";

// Common Components
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundaryComponent from "./components/common/ErrorBoundary";
import ScrollToTop from "./components/common/ScrollToTop";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import Pdf from "./pages/Pdf";
import ReportIncident from "./pages/ReportIncident";

// Lazy load components for better performance
const LazyHome = React.lazy(() => import("./pages/Home"));
const LazyLogin = React.lazy(() => import("./pages/Login"));
const LazyNotFound = React.lazy(() => import("./pages/NotFound"));
const LazyProfile = React.lazy(() => import("./pages/Profile"));
const LazyAdminProfile = React.lazy(() => import("./pages/AdminProfile")); // Added AdminProfile

const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));
const CarbonCredits = React.lazy(() => import("./pages/CarbonCredits"));
const Restoration = React.lazy(() => import("./pages/Restoration"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
    <LoadingSpinner size="lg" text="Loading Mangrove Watch..." />
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <ErrorBoundaryComponent
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
);

// Main router configuration
const router = createBrowserRouter([
  {
    // Main application routes with AppLayout
    element: (
      <>
        <ScrollToTop />
        <AppProvider>
          <AuthProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<PageLoader />}>
                <AppLayout />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </AppProvider>
      </>
    ),
    errorElement: <ErrorBoundaryComponent />,
    children: [
      {
        path: "/",
        element: <LazyHome />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/pdfChat",
        element: <Pdf />,
      },
      {
        path: "/profile",
        element: <LazyProfile />,
      },
      {
        path: "/admin-profile", // Added admin profile route
        element: <LazyAdminProfile />,
      },
      {
        path: "/reportIncident",
        element: <ReportIncident />,
      },
      {
        path: "/carbon-credits",
        element: <CarbonCredits/>
      },
      {
        path: "/restoration",
        element: <Restoration/>
      }
    ],
  },
  {
    // Login route - no layout
    path: "/login",
    element: (
      <>
        <ScrollToTop />
        <AppProvider>
          <AuthProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<PageLoader />}>
                <LazyLogin />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </AppProvider>
      </>
    ),
  },
  {
    // 404 route - no layout
    path: "*",
    element: (
      <>
        <ScrollToTop />
        <AppProvider>
          <AuthProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<PageLoader />}>
                <LazyNotFound />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </AppProvider>
      </>
    ),
  },
]);

function App() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
}

export default App;
