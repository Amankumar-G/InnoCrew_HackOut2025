import React from "react";
import { FaClipboardList, FaUsers } from "react-icons/fa";

const AdminToggleSection = ({ viewMode, setViewMode, theme }) => {
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
          : "bg-white/60 backdrop-blur-sm border-gray-200"
      } rounded-xl p-6 shadow-lg border mb-6`}
    >
      <div className="flex items-center justify-between">
        <h3
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Admin Dashboard
        </h3>

        {/* Side by side toggle buttons */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            onClick={() => setViewMode("complaints")}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              viewMode === "complaints"
                ? "bg-purple-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FaClipboardList className="w-4 h-4" />
            <span>Complaints</span>
          </button>

          <button
            onClick={() => setViewMode("projects")}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              viewMode === "projects"
                ? "bg-purple-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FaUsers className="w-4 h-4" />
            <span>Carbon Credit Owners</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminToggleSection;
