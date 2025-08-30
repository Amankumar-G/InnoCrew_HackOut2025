import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTree,
  FaShieldAlt,
} from "react-icons/fa";

const AdminSidebar = ({ user, adminData, theme }) => {
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
          : "bg-white/60 backdrop-blur-sm border-gray-200"
      } rounded-xl p-6 shadow-lg border sticky top-8`}
    >
      {/* Admin Avatar */}
      <div className="mb-6 text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 p-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500">
            <img
              src="./profile.avif"
              alt={user.name}
              className="object-cover w-full h-full border-4 border-white rounded-full"
            />
          </div>
          <div className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full">
            <FaShieldAlt className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2
          className={`text-2xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {user.name}
        </h2>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          System Administrator
        </p>
      </div>

      {/* Admin Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <FaEnvelope
            className={`w-4 h-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {user.email}
          </span>
        </div>

        {user.phone && (
          <div className="flex items-center space-x-3">
            <FaPhone
              className={`w-4 h-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {user.phone}
            </span>
          </div>
        )}

        {user.location && (
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt
              className={`w-4 h-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {user.location}
            </span>
          </div>
        )}

        {user.organization && (
          <div className="flex items-center space-x-3">
            <FaTree
              className={`w-4 h-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {user.organization}
            </span>
          </div>
        )}
      </div>

      {/* Admin Stats */}
      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
        <h3
          className={`text-lg font-semibold mb-3 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          System Overview
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Complaints
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {adminData.totalComplaints}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Pending
            </span>
            <span className="text-sm font-semibold text-yellow-600">
              {adminData.pendingComplaints}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Resolved
            </span>
            <span className="text-sm font-semibold text-green-600">
              {adminData.resolvedComplaints}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
