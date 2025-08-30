import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaTrophy,
  FaMedal,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaLeaf,
  FaTree,
  FaWater,
  FaRecycle
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

// API Base URL
const API_BASE_URL = "${import.meta.env.VITE_URL}/api";

const Profile = () => {
  const { user, token, getProfile } = useAuth();
  const { theme } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // User stats from the actual user data
  const [userStats, setUserStats] = useState({
    points: 0,
    rank: 0,
    totalReports: 0,
    resolvedReports: 0,
    carbonCredits: 0,
    mangroveArea: 0
  });

  const [complaints, setComplaints] = useState([]);

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
            mangroveArea: userData.mangroveArea || 0
          });
        }

        // TODO: Fetch user complaints/reports from API
        // For now, using dummy data until complaints API is implemented
        const dummyComplaints = [
          {
            id: 1,
            type: "Illegal Cutting",
            location: user?.location || "Unknown Location",
            severity: "High",
            status: "Resolved",
            date: "2024-01-15",
            description: "Reported illegal mangrove cutting in protected area",
            points: 150,
            carbonImpact: 2.5
          },
          {
            id: 2,
            type: "Pollution Incident",
            location: user?.location || "Unknown Location",
            severity: "Medium",
            status: "Under Investigation",
            date: "2024-01-12",
            description: "Oil spill detected near mangrove roots",
            points: 75,
            carbonImpact: 1.2
          },
          {
            id: 3,
            type: "Restoration Success",
            location: user?.location || "Unknown Location",
            severity: "Positive",
            status: "Completed",
            date: "2024-01-10",
            description: "Successfully planted 500 mangrove saplings",
            points: 300,
            carbonImpact: 5.0
          }
        ];
        
        setComplaints(dummyComplaints);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, user?.location]);

  // TODO: Replace with actual API calls when complaints endpoint is available
  // const fetchComplaints = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/user/complaints`, {
  //       headers: { 
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setComplaints(data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching complaints:', error);
  //   }
  // };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Positive": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "text-green-600";
      case "Under Investigation": return "text-yellow-600";
      case "Completed": return "text-blue-600";
      case "Pending": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved": return <FaCheckCircle className="w-4 h-4" />;
      case "Under Investigation": return <FaClock className="w-4 h-4" />;
      case "Completed": return <FaStar className="w-4 h-4" />;
      case "Pending": return <FaExclamationTriangle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingSpinner></LoadingSpinner>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Details */}
          <div className="lg:col-span-1">
            <div className={`${
              theme === "dark" 
                ? "bg-gray-800/60 backdrop-blur-sm border-gray-700" 
                : "bg-white/60 backdrop-blur-sm border-gray-200"
            } rounded-xl p-6 shadow-lg border sticky top-8`}>
              
              {/* Animated User Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-1 mx-auto mb-4">
                    <img
                      src="./profile.avif"
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white"
                    />
                  </div>
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}>
                  {user.name}
                </h2>
                <p className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  {user.role === 'admin' ? 'Administrator' : 'Conservation Hero'}
                </p>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {user.email}
                  </span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <FaPhone className={`w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`} />
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {user.phone}
                    </span>
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className={`w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`} />
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {user.location}
                    </span>
                  </div>
                )}
                
                {user.organization && (
                  <div className="flex items-center space-x-3">
                    <FaTree className={`w-4 h-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`} />
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {user.organization}
                    </span>
                  </div>
                )}

              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}>
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>Total Reports</span>
                    <span className="text-sm font-semibold text-green-600">
                      {userStats.totalReports}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>Resolved</span>
                    <span className="text-sm font-semibold text-green-600">
                      {userStats.resolvedReports}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>Carbon Credits</span>
                    <span className="text-sm font-semibold text-green-600">
                      {userStats.carbonCredits}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Metrics and Complaints */}
          <div className="lg:col-span-3">
            {/* First Row - Metrics (40% height) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Points Card */}
              <div className={`${
                theme === "dark" 
                  ? "bg-gray-800/60 backdrop-blur-sm border-gray-700" 
                  : "bg-white/60 backdrop-blur-sm border-gray-200"
              } rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <FaTrophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Total Points
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {userStats.points.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaLeaf className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Earned through conservation efforts
                  </span>
                </div>
              </div>

              {/* Rank Card */}
              <div className={`${
                theme === "dark" 
                  ? "bg-gray-800/60 backdrop-blur-sm border-gray-700" 
                  : "bg-white/60 backdrop-blur-sm border-gray-200"
              } rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <FaMedal className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Global Rank
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {userStats.rank || 'Not Available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTree className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {userStats.rank ? 'Top 5% of conservationists' : 'Rank not available yet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Second Row - Complaints (60% height) */}
            <div className={`${
              theme === "dark" 
                ? "bg-gray-800/60 backdrop-blur-sm border-gray-700" 
                : "bg-white/60 backdrop-blur-sm border-gray-200"
            } rounded-xl p-6 shadow-lg border`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}>
                  Previous Reports
                </h3>
                <div className="flex items-center space-x-2">
                  <FaRecycle className="w-5 h-5 text-green-500" />
                  <span className={`text-sm font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {complaints.length} Reports
                  </span>
                </div>
              </div>

              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <FaTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className={`text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    No reports yet
                  </p>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Start reporting mangrove incidents to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {complaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className={`${
                        theme === "dark" 
                          ? "bg-gray-700/60 border-gray-600" 
                          : "bg-gray-50/60 border-gray-200"
                      } rounded-lg p-4 border hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            }`}>
                              {complaint.type}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(complaint.severity)}`}>
                              {complaint.severity}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {complaint.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`flex items-center space-x-1 ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}>
                              <FaMapMarkerAlt className="w-3 h-3" />
                              <span>{complaint.location}</span>
                            </span>
                            <span className={`flex items-center space-x-1 ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}>
                              <FaCalendarAlt className="w-3 h-3" />
                              <span>{complaint.date}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="flex items-center space-x-1 mb-2">
                            {getStatusIcon(complaint.status)}
                            <span className={`text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <FaTrophy className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs font-semibold text-yellow-600">
                                +{complaint.points} pts
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaWater className="w-3 h-3 text-blue-500" />
                              <span className="text-xs font-semibold text-blue-600">
                                {complaint.carbonImpact} CO₂
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
