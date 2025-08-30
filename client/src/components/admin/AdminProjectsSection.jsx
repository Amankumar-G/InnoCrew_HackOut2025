import React from "react";
import { FaUsers, FaLeaf } from "react-icons/fa";

const AdminProjectsSection = ({ projectOwners, theme }) => {
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
          : "bg-white/60 backdrop-blur-sm border-gray-200"
      } rounded-xl p-6 shadow-lg border`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Carbon Credit Owners
        </h3>
        <div className="flex items-center space-x-2">
          <FaLeaf className="w-5 h-5 text-green-500" />
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {projectOwners.length} Credit Owners
          </span>
        </div>
      </div>

      <div className="py-12 text-center">
        <FaUsers className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p
          className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Carbon Credit Owners Management
        </p>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          This section will be implemented soon
        </p>
      </div>
    </div>
  );
};

export default AdminProjectsSection;
