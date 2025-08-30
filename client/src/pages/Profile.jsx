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

const Profile = () => {
  const { user } = useAuth();
  const { theme } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data - replace with API calls
  const [userStats, setUserStats] = useState({
    points: 2847,
    rank: 15,
    totalReports: 23,
    resolvedReports: 19,
    carbonCredits: 156,
    mangroveArea: 2.3
  });

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      type: "Illegal Cutting",
      location: "Sundarbans, Bangladesh",
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
      location: "Mangrove Bay, India",
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
      location: "Mekong Delta, Vietnam",
      severity: "Positive",
      status: "Completed",
      date: "2024-01-10",
      description: "Successfully planted 500 mangrove saplings",
      points: 300,
      carbonImpact: 5.0
    },
    {
      id: 4,
      type: "Habitat Destruction",
      location: "Florida Keys, USA",
      severity: "High",
      status: "Resolved",
      date: "2024-01-08",
      description: "Construction activity damaging mangrove habitat",
      points: 200,
      carbonImpact: 3.8
    },
    {
      id: 5,
      type: "Water Quality Issue",
      location: "Great Barrier Reef, Australia",
      severity: "Medium",
      status: "Under Investigation",
      date: "2024-01-05",
      description: "Suspicious water discoloration near mangroves",
      points: 100,
      carbonImpact: 1.5
    }
  ]);

  // TODO: Replace with actual API calls
  // useEffect(() => {
  //   const fetchUserStats = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch('/api/user/stats', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const data = await response.json();
  //       setUserStats(data);
  //     } catch (error) {
  //       console.error('Error fetching user stats:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   const fetchComplaints = async () => {
  //     try {
  //       const response = await fetch('/api/user/complaints', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const data = await response.json();
  //       setComplaints(data);
  //     } catch (error) {
  //       console.error('Error fetching complaints:', error);
  //     }
  //   };

  //   fetchUserStats();
  //   fetchComplaints();
  // }, [token]);

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
                  Conservation Hero
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
                
                <div className="flex items-center space-x-3">
                  <FaPhone className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    +1 (555) 123-4567
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Mumbai, India
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Member since Jan 2024
                  </span>
                </div>
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
                      #{userStats.rank}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTree className="w-4 h-4 text-green-500" />
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    Top 5% of conservationists
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
