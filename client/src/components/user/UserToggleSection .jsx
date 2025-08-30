import React from "react";
import { FaClipboardList, FaLeaf } from "react-icons/fa";

const UserToggleSection = ({ viewMode, setViewMode, theme }) => {
  return (
    <div className="flex items-center justify-center w-full">
      {/* Toggle buttons */}
      <div className="flex items-center justify-between rounded-lg overflow-hidden border border-gray-300 mb-4 w-[30vw]">
        <button
          onClick={() => setViewMode("complaints")}
          className={`flex items-center space-x-3 px-6 py-3 text-base font-medium transition-all duration-200 w-1/2 justify-center ${
            viewMode === "complaints"
              ? "bg-green-600 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaClipboardList className="w-5 h-5" />
          <span>My Complaints</span>
        </button>

        <button
          onClick={() => setViewMode("carbonCredits")}
          className={`flex items-center space-x-3 px-6 py-3 text-base font-medium transition-all duration-200 w-1/2 justify-center ${
            viewMode === "carbonCredits"
              ? "bg-green-600 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaLeaf className="w-5 h-5" />
          <span>Carbon Credits</span>
        </button>
      </div>
    </div>
  );
};

export default UserToggleSection;
