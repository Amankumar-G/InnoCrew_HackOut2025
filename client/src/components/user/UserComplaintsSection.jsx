import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRecycle,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaExclamationTriangle,
  FaTrophy,
  FaTree,
} from "react-icons/fa";

const UserComplaintsSection = ({ complaints, theme, onComplaintClick }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Positive":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-600";
      case "Under Investigation":
        return "text-yellow-600";
      case "Completed":
        return "text-blue-600";
      case "Pending":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <FaCheckCircle className="w-4 h-4" />;
      case "Under Investigation":
        return <FaClock className="w-4 h-4" />;
      case "Completed":
        return <FaStar className="w-4 h-4" />;
      case "Pending":
        return <FaExclamationTriangle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

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
          My Reports
        </h3>
        <div className="flex items-center space-x-2">
          <FaRecycle className="w-5 h-5 text-green-500" />
          <span
            className={`text-sm font-semibold ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {complaints.length} Reports
          </span>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="py-12 text-center">
          <FaTree className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No reports yet
          </p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Start reporting mangrove incidents to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-96">
          {complaints.map((complaint) => (
            <div
              key={complaint.id || complaint._id}
              className={`${
                theme === "dark"
                  ? "bg-gray-700/60 border-gray-600"
                  : "bg-gray-50/60 border-gray-200"
              } rounded-lg p-4 border hover:shadow-md transition-all duration-200 cursor-pointer`}
              onClick={() => onComplaintClick(complaint)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2 space-x-3">
                    <h4
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {complaint.category}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                        complaint.damageEstimate
                      )}`}
                    >
                      {complaint.damageEstimate}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {complaint.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span
                      className={`flex items-center space-x-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <FaCalendarAlt className="w-3 h-3" />
                      <span>
                        {
                          new Date(complaint.timestamp)
                            .toISOString()
                            .split("T")[0]
                        }
                      </span>
                    </span>
                    <span
                      className={`flex items-center space-x-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <FaMapMarkerAlt className="w-3 h-3" />
                      <span>{complaint.landmark}</span>
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="flex items-center mb-2 space-x-1">
                    {getStatusIcon(complaint.status)}
                    <span
                      className={`text-sm font-semibold ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <FaTrophy className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-semibold text-yellow-600">
                        +
                        {
                          complaint?.verification?.verificationSummary
                            ?.finalVerification?.carbonCreditsEarned
                        }{" "}
                        pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserComplaintsSection;