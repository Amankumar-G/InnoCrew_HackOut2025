import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaTree, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useAppContext();

  return (
    <footer
      className={`${
        theme === "dark"
          ? "bg-gray-800/80 backdrop-blur-md border-t border-gray-700/50"
          : "bg-white/80 backdrop-blur-md border-t border-gray-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <FaTree className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Community Mangrove Watch
              </span>
            </div>
            <p
              className={`mb-4 max-w-md ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Empowering coastal communities to protect and restore mangrove ecosystems through participatory monitoring, 
              AI-powered verification, and carbon credit rewards. Join the global movement to safeguard our planet's vital coastal forests.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${
                  theme === "dark"
                    ? "text-gray-400 hover:text-green-400"
                    : "text-gray-400 hover:text-green-600"
                } transition-colors`}
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Platform Features
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/report"
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-green-400"
                      : "text-gray-600 hover:text-green-600"
                  } transition-colors`}
                >
                  Report Incident
                </a>
              </li>
              <li>
                <a
                  href="/restoration"
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-green-400"
                      : "text-gray-600 hover:text-green-600"
                  } transition-colors`}
                >
                  Mangrove Restoration
                </a>
              </li>
              <li>
                <a
                  href="/carbon-credits"
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-green-400"
                      : "text-gray-600 hover:text-green-600"
                  } transition-colors`}
                >
                  Carbon Credits
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-green-400"
                      : "text-gray-600 hover:text-green-600"
                  } transition-colors`}
                >
                  Community Hub
                </a>
              </li>
              <li>
                <a
                  href="/analytics"
                  className={`${
                    theme === "dark"
                      ? "text-gray-300 hover:text-green-400"
                      : "text-gray-600 hover:text-green-600"
                  } transition-colors`}
                >
                  Impact Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Contact Us
            </h3>
            <ul
              className={`space-y-3 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <li className="flex items-center space-x-2">
                <FaEnvelope className="w-4 h-4 text-green-600" />
                <span>hello@mangrovewatch.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="w-4 h-4 text-green-600" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
                <span>Global Conservation Network</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaGlobe className="w-4 h-4 text-green-600" />
                <span>www.mangrovewatch.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`border-t mt-8 pt-8 ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              &copy; {currentYear} Community Mangrove Watch. All rights reserved. 
              <span className="ml-2">Protecting our coastal ecosystems together.</span>
            </p>
            <p
              className={`text-sm flex items-center space-x-1 mt-2 md:mt-0 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
