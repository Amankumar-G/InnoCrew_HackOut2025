import React, { useState, useEffect } from "react";
import { FaLeaf, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCoins, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { marketplaceAPI } from "../utils/api";

export default function Restoration() {
  const [plantations, setPlantations] = useState([]);
  const [filteredPlantations, setFilteredPlantations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { token } = useAuth();

  useEffect(() => {
    fetchPlantations();
  }, []);

  const fetchPlantations = async () => {
    try {
      setLoading(true);
      const result = await marketplaceAPI.getMarketplacePlantations();

      if (result.success) {
        // Ensure data is an array
        const plantationsData = Array.isArray(result.data) ? result.data.data : [];

        console.log("Fetched plantations:", result.data.data);
        setPlantations(result.data.data);
        setFilteredPlantations(result.data.data);
      } else {
        setError(result.error || "Failed to fetch plantations");
      }
    } catch (err) {
      console.error("Error fetching plantations:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved_by_admin":
        return "bg-green-100 text-green-800 border-green-200";
      case "verified_by_ai":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved_by_admin":
        return "Approved";
      case "verified_by_ai":
        return "AI Verified";
      case "pending_verification":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  // Filter plantations based on search term and status
  useEffect(() => {
    // Ensure plantations is an array
    if (!Array.isArray(plantations)) {
      setFilteredPlantations([]);
      return;
    }

    let filtered = [...plantations]; // Create a copy to avoid mutations

    // Filter by search term (name, email, location)
    if (searchTerm) {
      filtered = filtered.filter(plantation => 
        plantation?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plantation?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plantation?.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(plantation => plantation?.status === statusFilter);
    }

    setFilteredPlantations(filtered);
  }, [plantations, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto mb-4 text-4xl text-emerald-600" />
          <p className="text-gray-600 text-lg">Loading restoration projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-red-500" />
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Projects</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPlantations}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-green-600">
              <FaLeaf className="text-2xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text mb-2">
              Restoration Marketplace
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover verified mangrove restoration projects and connect with project owners to support environmental conservation.
            </p>
                         <div className="mt-4 text-sm text-gray-500">
               {Array.isArray(plantations) ? plantations.length : 0} restoration project{(Array.isArray(plantations) ? plantations.length : 0) !== 1 ? 's' : ''} available
             </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Projects
              </label>
              <input
                type="text"
                placeholder="Search by owner name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="approved_by_admin">Approved</option>
                <option value="verified_by_ai">AI Verified</option>
                <option value="pending_verification">Pending</option>
              </select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {Array.isArray(filteredPlantations) ? filteredPlantations.length : 0} of {Array.isArray(plantations) ? plantations.length : 0} projects
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!Array.isArray(filteredPlantations) || filteredPlantations.length === 0 ? (
          <div className="text-center py-12">
            <FaLeaf className="mx-auto mb-4 text-6xl text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Available</h3>
            <p className="text-gray-500">Check back later for new restoration projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredPlantations) && filteredPlantations.map((plantation, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Project #{index + 1}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plantation.status)}`}>
                      {getStatusText(plantation.status)}
                    </span>
                  </div>
                  
                  {/* Carbon Credits */}
                  <div className="flex items-center space-x-2 mb-4">
                    <FaCoins className="text-emerald-600" />
                    <span className="text-2xl font-bold text-emerald-600">
                      {plantation.carbonCreditGenerated}
                    </span>
                    <span className="text-sm text-gray-500">tons CO₂</span>
                  </div>
                </div>

                {/* Location */}
                <div className="p-6 border-b border-emerald-100">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">Location</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {plantation.location.address || `${plantation.location.latitude.toFixed(4)}, ${plantation.location.longitude.toFixed(4)}`}
                      </p>
                      <button
                        onClick={() => openGoogleMaps(plantation.location.latitude, plantation.location.longitude)}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        View on Map →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-800 mb-3">Project Owner</h4>
                  <div className="space-y-3">
                                         <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                         <span className="text-sm font-medium text-emerald-700">
                           {plantation?.user?.name?.charAt(0)?.toUpperCase() || '?'}
                         </span>
                       </div>
                       <div>
                         <p className="font-medium text-gray-800">{plantation?.user?.name || 'Unknown Owner'}</p>
                       </div>
                     </div>
                    
                    <div className="space-y-2">
                                             <div className="flex items-center space-x-2 text-sm">
                         <FaEnvelope className="text-gray-400" />
                         <a
                           href={`mailto:${plantation?.user?.email || ''}`}
                           className="text-emerald-600 hover:text-emerald-700"
                         >
                           {plantation?.user?.email || 'No email available'}
                         </a>
                       </div>
                       
                       <div className="flex items-center space-x-2 text-sm">
                         <FaPhone className="text-gray-400" />
                         <a
                           href={`tel:${plantation?.user?.phone || ''}`}
                           className="text-emerald-600 hover:text-emerald-700"
                         >
                           {plantation?.user?.phone || 'No phone available'}
                         </a>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openGoogleMaps(plantation.location.latitude, plantation.location.longitude)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      View Location
                    </button>
                                         <a
                       href={`mailto:${plantation?.user?.email || ''}?subject=Restoration Project Inquiry`}
                       className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
                     >
                       Contact Owner
                     </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-emerald-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Support Environmental Restoration
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each project represents a real effort to restore mangrove ecosystems and combat climate change. 
              Contact project owners to learn more about their restoration efforts or to get involved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
