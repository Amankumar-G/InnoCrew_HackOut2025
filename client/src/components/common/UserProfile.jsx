import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Get the appropriate profile path based on user role
  const getProfilePath = () => {
    return user?.role === "admin" ? "/admin-profile" : "/profile";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate(getProfilePath());
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium">{user.name}</span>
        {user.role === "admin" && (
          <FaShieldAlt className="w-3 h-3 text-purple-500" />
        )}
        <FaChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
          >
            <FaUser className="w-4 h-4" />
            <span>
              {user.role === "admin" ? "Admin Dashboard" : "My Profile"}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
