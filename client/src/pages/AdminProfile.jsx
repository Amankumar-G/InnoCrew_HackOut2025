import React, { useState, useEffect } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ComplaintModal from "../components/ComplaintModal";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminToggleSection from "../components/admin/AdminToggleSection";
import AdminComplaintsSection from "../components/admin/AdminComplaintsSection";
import AdminProjectsSection from "../components/admin/AdminProjectsSection";

const AdminProfile = () => {
  const { user, token, getProfile } = useAuth();
  const { theme } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // Toggle between complaints and project owners
  const [viewMode, setViewMode] = useState("complaints");

  // Admin data
  const [adminData, setAdminData] = useState({
    totalComplaints: 0,
    totalProjectOwners: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [projectOwners, setProjectOwners] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleComplaintClick = (complaint) => {
    setModalError("");
    setModalOpen(true);
    setModalLoading(false);
    setSelectedComplaint(complaint);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
    setModalError("");
  };

  // Fetch admin profile and data
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token || user?.role !== "admin") return;

      setIsLoading(true);
      try {
        const profileResult = await getProfile();
        if (profileResult.success) {
          const userData = profileResult.user;

          setComplaints(userData.complaints || []);

          // Calculate admin stats
          const totalComplaints = userData.complaints?.length || 0;
          const pendingCount =
            userData.complaints?.filter((c) => c.status === "Pending")
              ?.length || 0;
          const resolvedCount =
            userData.complaints?.filter((c) => c.status === "Resolved")
              ?.length || 0;

          setAdminData({
            totalComplaints,
            totalProjectOwners: 0, // Will be implemented later
            pendingComplaints: pendingCount,
            resolvedComplaints: resolvedCount,
          });

          setProjectOwners([]); // Will be implemented later
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [token, user?.role]);

  // Access control
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaShieldAlt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            Access denied. Admin privileges required.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <AdminSidebar user={user} adminData={adminData} theme={theme} />
          </div>

          {/* Right Section */}
          <div className="lg:col-span-3">
            {/* Toggle Section */}

            <AdminToggleSection
              viewMode={viewMode}
              setViewMode={setViewMode}
              theme={theme}
            />

            {/* Content Based on Toggle */}
            {viewMode === "complaints" ? (
              <AdminComplaintsSection
                complaints={complaints}
                theme={theme}
                onComplaintClick={handleComplaintClick}
              />
            ) : (
              <AdminProjectsSection
                projectOwners={projectOwners}
                theme={theme}
              />
            )}
          </div>
        </div>
      </div>

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        complaint={selectedComplaint}
        theme={theme}
      />

      {/* Modal Loading State */}
      {modalLoading && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <LoadingSpinner />
            <p className="mt-2 text-gray-700">Loading complaint details...</p>
          </div>
        </div>
      )}

      {/* Modal Error State */}
      {modalError && modalOpen && !modalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <p className="font-semibold text-red-600">{modalError}</p>
            <button
              className="px-4 py-2 mt-4 bg-gray-200 rounded"
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
