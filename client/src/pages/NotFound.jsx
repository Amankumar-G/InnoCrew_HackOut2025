import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const NotFound = () => {
  const { theme } = useAppContext();

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-white to-zinc-50"
      }`}
    >
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent opacity-10 blur-xl">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Page Not Found
          </h2>
          <p
            className={`leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            The page you're looking for doesn't exist or has been moved. Don't
            worry, you can always go back to the home page or search for what
            you need.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <FaHome className="w-4 h-4" />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
