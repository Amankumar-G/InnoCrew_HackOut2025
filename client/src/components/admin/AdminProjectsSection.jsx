import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaLeaf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  //   FaTreeAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
  FaEye,
  FaEdit,
} from "react-icons/fa";

const AdminProjectsSection = ({ theme, token }) => {
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlantation, setSelectedPlantation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch plantations data
  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_URL}/api/plantation/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch plantations");
        }

        const data = await response.json();
        setPlantations(data.plantations || []);
        setError("");
      } catch (err) {
        setError("Failed to load plantation data");
        console.error("Error fetching plantations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPlantations();
    }
  }, [token]);

  // Handle status update
  const handleStatusUpdate = async (plantationId, newStatus, adminComment) => {
    try {
      setStatusUpdateLoading(true);
      console.log(newStatus);
      const response = await fetch(
        `${import.meta.env.VITE_URL}/api/plantation/${plantationId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            adminComment: adminComment || `Status updated to ${newStatus}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the plantation in state
      setPlantations((prev) =>
        prev.map((plantation) =>
          plantation._id === plantationId
            ? { ...plantation, status: newStatus }
            : plantation
        )
      );

      // Close modal if open
      setModalOpen(false);
      setSelectedPlantation(null);
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update plantation status");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved_by_admin":
        return "text-green-600";
      case "verified_by_ai":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved_by_admin":
        return <FaCheckCircle className="w-4 h-4" />;
      case "verified_by_ai":
        return <FaCheckCircle className="w-4 h-4" />;
      case "rejected":
        return <FaTimes className="w-4 h-4" />;
      case "pending":
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const getMarketplaceStatusColor = (status) => {
    return status === "listed"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePlantationClick = (plantation) => {
    setSelectedPlantation(plantation);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPlantation(null);
  };

  if (loading) {
    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
            : "bg-white/60 backdrop-blur-sm border-gray-200"
        } rounded-xl p-6 shadow-lg border`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span
            className={`ml-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading plantations...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
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
              {plantations.length} Plantations
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {plantations.length === 0 ? (
          <div className="py-12 text-center">
            <FaUsers className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No Carbon Credit Owners
            </p>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Plantations will appear here as they are registered
            </p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-96">
            {plantations.map((plantation) => (
              <div
                key={plantation._id}
                className={`${
                  theme === "dark"
                    ? "bg-gray-700/60 border-gray-600"
                    : "bg-gray-50/60 border-gray-200"
                } rounded-lg p-4 border hover:shadow-md transition-all duration-200 cursor-pointer`}
                onClick={() => handlePlantationClick(plantation)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 space-x-3">
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {plantation.plantationName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getMarketplaceStatusColor(
                          plantation.marketplaceStatus
                        )}`}
                      >
                        {plantation.marketplaceStatus === "listed"
                          ? "Listed"
                          : "Not Listed"}
                      </span>
                    </div>

                    <p
                      className={`text-sm mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Owner: {plantation.projectOwnerId.name} (
                      {plantation.projectOwnerId.email})
                    </p>

                    <div className="flex items-center space-x-4 text-xs mb-2">
                      <span
                        className={`flex items-center space-x-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {/* <FaTreeAlt className="w-3 h-3" /> */}
                        <span>{plantation.area} hectares</span>
                      </span>
                      <span
                        className={`flex items-center space-x-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{formatDate(plantation.plantingDate)}</span>
                      </span>
                      {plantation.location.address && (
                        <span
                          className={`flex items-center space-x-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <FaMapMarkerAlt className="w-3 h-3" />
                          <span>{plantation.location.address}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Species: {plantation.species.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="flex items-center mb-2 space-x-1">
                      {getStatusIcon(plantation.status)}
                      <span
                        className={`text-sm font-semibold ${getStatusColor(
                          plantation.status
                        )}`}
                      >
                        {plantation.status.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <FaLeaf className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-semibold text-green-600">
                          {plantation.carbonCreditGenerated} Credits
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Survival: {plantation.survivalRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plantation Details Modal */}
      {modalOpen && selectedPlantation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-xl p-6 shadow-2xl border max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {selectedPlantation.plantationName}
              </h3>
              <button
                onClick={handleModalClose}
                className={`p-2 rounded-lg hover:bg-gray-100 ${
                  theme === "dark"
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-gray-500"
                }`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Plantation Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Project Owner
                </label>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedPlantation.projectOwnerId.name} (
                  {selectedPlantation.projectOwnerId.email})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Area
                  </label>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {selectedPlantation.area} hectares
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Planting Date
                  </label>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatDate(selectedPlantation.plantingDate)}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Survival Rate
                  </label>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {selectedPlantation.survivalRate}%
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Carbon Credits
                  </label>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {selectedPlantation.carbonCreditGenerated} Credits
                  </p>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Species
                </label>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedPlantation.species.join(", ")}
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Location
                </label>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedPlantation.location.address ||
                    `${selectedPlantation.location.latitude}, ${selectedPlantation.location.longitude}`}
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Current Status
                </label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedPlantation.status)}
                  <span
                    className={`text-sm font-semibold ${getStatusColor(
                      selectedPlantation.status
                    )}`}
                  >
                    {selectedPlantation.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="border-t pt-4">
              <h4
                className={`font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Admin Actions
              </h4>
              <div className="flex space-x-3">
                {selectedPlantation.status !== "approved_by_admin" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedPlantation._id,
                        "approved_by_admin",
                        "Approved by admin"
                      )
                    }
                    disabled={statusUpdateLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                  >
                    {statusUpdateLoading ? "Updating..." : "Approve"}
                  </button>
                )}

                {selectedPlantation.status !== "rejected" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedPlantation._id,
                        "rejected",
                        "Rejected by admin"
                      )
                    }
                    disabled={statusUpdateLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                  >
                    {statusUpdateLoading ? "Updating..." : "Reject"}
                  </button>
                )}

                {/* View Documents */}
                <button
                  onClick={() =>
                    window.open(selectedPlantation.soilCertificate, "_blank")
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  View Soil Certificate
                </button>

                <button
                  onClick={() =>
                    window.open(selectedPlantation.plantCertificate, "_blank")
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                >
                  View Plant Certificate
                </button>
              </div>

              {/* View Images */}
              {selectedPlantation.images &&
                selectedPlantation.images.length > 0 && (
                  <div className="mt-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Plantation Images
                    </label>
                    <div className="flex space-x-2 overflow-x-auto">
                      {selectedPlantation.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Plantation ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(image, "_blank")}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProjectsSection;
