import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaSignInAlt,
  FaTree,
  FaMapMarkedAlt,
  FaChartLine,
  FaUsers,
  FaLeaf,
  FaMedal,
  FaFilePdf,
} from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../common/UserProfile";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useAppContext();
  const { isAuthenticated } = useAuth();

  const navigation = [
    { name: "Report Incident", href: "/reportIncident", icon: FaMapMarkedAlt },
    { name: "Restoration", href: "/restoration", icon: FaTree },
    { name: "Carbon Credits", href: "/carbon-credits", icon: FaLeaf },
    { name: "Leaderboard", href: "/leaderboard", icon: FaMedal },
    { name: "PDF Chat", href: "/pdfChat", icon: FaFilePdf }, // ✅ new link
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b shadow-sm bg-white/80 backdrop-blur-md border-gray-200/50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
                <FaLeaf className="w-4 h-4 text-white" />{" "}
                {/* ✅ consistent size + color */}
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                MARC
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-6 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Dark/Light Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 transition-colors rounded-lg hover:text-green-600 hover:bg-green-50"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button> */}

            {/* Auth Section */}
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <FaSignInAlt className="w-4 h-4" />
                <span>Join Community</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Dark/Light Toggle for mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 transition-colors rounded-lg hover:text-green-600 hover:bg-green-50"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 transition-colors rounded-lg hover:text-green-600 hover:bg-green-50"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 mt-2 space-y-1 rounded-lg shadow-lg bg-white/95 backdrop-blur-md">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-gray-200">
                  <UserProfile />
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <FaSignInAlt className="w-4 h-4" />
                  <span>Join Community</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
