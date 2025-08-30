import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTrophy,
  FaMedal,
  FaLeaf,
  FaTree,
  FaRecycle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ComplaintModal from "../components/ComplaintModal";
import UserToggleSection from "../components/user/UserToggleSection ";
import UserComplaintsSection from "../components/user/UserComplaintsSection";
import UserCarbonCreditsSection from "../components/user/UserCarbonCreditsSection";

const Profile = () => {
  const { user, token, getProfile } = useAuth();
  const { theme } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // Toggle between complaints and carbon credits
  const [viewMode, setViewMode] = useState("complaints");

  // User stats from the actual user data
  const [userStats, setUserStats] = useState({
    points: 0,
    rank: 0,
    totalReports: 0,
    resolvedReports: 0,
    carbonCredits: 0,
    mangroveArea: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleComplaintClick = (complaint) => {
    setModalError("");
    setModalOpen(true);
    setModalLoading(false);
    // Show dummy data for now
    setSelectedComplaint(complaint);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
    setModalError("");
  };

  // Fetch user profile and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        // Fetch updated user profile
        const profileResult = await getProfile();
        if (profileResult.success) {
          const userData = profileResult.user;

          // Calculate stats from user data
          setUserStats({
            points: userData.points || 0,
            rank: userData.rank || 0,
            totalReports: userData.totalReports || 0,
            resolvedReports: userData.resolvedReports || 0,
            carbonCredits: userData.carbonCredits?.earned || 0,
            mangroveArea: userData.mangroveArea || 0,
          });
          setComplaints(userData.complaints);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, user?.location]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaUser className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Sidebar - User Details */}
          <div className="lg:col-span-1">
            <div
              className={`${
                theme === "dark"
                  ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
                  : "bg-white/60 backdrop-blur-sm border-gray-200"
              } rounded-xl p-6 shadow-lg border sticky top-8`}
            >
              {/* Animated User Avatar */}
              <div className="mb-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 p-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                    <img
                      src="./profile.avif"
                      alt={user.name}
                      className="object-cover w-full h-full border-4 border-white rounded-full"
                    />
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
                  {user.role === "admin" ? "Administrator" : "Conservation Hero"}
                </p>
              </div>

              {/* User Details */}
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

              {/* Quick Stats */}
              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Reports
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {userStats.totalReports}
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
                      {userStats.resolvedReports}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Carbon Credits
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {Math.round(Number(userStats?.carbonCredits || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Metrics and Toggle Content */}
          <div className="lg:col-span-3">
            {/* First Row - Metrics (40% height) */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              {/* Points Card */}
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
                    : "bg-white/60 backdrop-blur-sm border-gray-200"
                } rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500">
                    <FaTrophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Points
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {userStats.points.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaLeaf className="w-4 h-4 text-green-500" />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Earned through conservation efforts
                  </span>
                </div>
              </div>

              {/* Carbon Credits Card */}
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gray-800/60 backdrop-blur-sm border-gray-700"
                    : "bg-white/60 backdrop-blur-sm border-gray-200"
                } rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500">
                    <FaLeaf className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Carbon Credits
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {userStats.carbonCredits || "0"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRecycle className="w-4 h-4 text-green-500" />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Environmental impact credits
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Section */}
            <UserToggleSection
              viewMode={viewMode}
              setViewMode={setViewMode}
              theme={theme}
            />

            {/* Content Based on Toggle */}
            {viewMode === "complaints" ? (
              <UserComplaintsSection
                complaints={complaints}
                theme={theme}
                onComplaintClick={handleComplaintClick}
              />
            ) : (
              <UserCarbonCreditsSection theme={theme} token={token} />
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
      {modalLoading && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <LoadingSpinner />
            <p className="mt-2 text-gray-700">Loading complaint details...</p>
          </div>
        </div>
      )}
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

export default Profile;