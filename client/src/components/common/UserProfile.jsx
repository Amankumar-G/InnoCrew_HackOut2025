import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaSignOutAlt, FaCog, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useAppContext();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-opacity-80 
          ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
        />

        <span
          className={`hidden md:block text-sm font-medium ${
            theme === "dark"
              ? "text-gray-800 group-hover:text-white"
              : "text-gray-900"
          }`}
        >
          {user.name}
        </span>

        <FaChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${
            theme === "dark"
              ? "text-gray-800 group-hover:text-white"
              : "text-gray-600"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* User Info */}
          <div
            className={`px-4 py-3 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FaUser className="mr-3 h-4 w-4" />
              Profile
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FaCog className="mr-3 h-4 w-4" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div
            className={`pt-1 border-t ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                theme === "dark"
                  ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <FaSignOutAlt className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
