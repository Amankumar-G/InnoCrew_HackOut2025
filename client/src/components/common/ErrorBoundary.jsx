import React from "react";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";
import { Link } from "react-router-dom";

const ErrorBoundary = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <FaExclamationTriangle className="w-10 h-10 text-red-600" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            We're sorry, but something unexpected happened. Please try again or
            go back to the home page.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-sm text-red-800 font-medium mb-2">
                Error Details:
              </p>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <FaRedo className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            to="/"
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <FaHome className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
