import React from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = () => {
  const { theme } = useAppContext();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
      }`}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 mx-auto sm:px-6 lg: py-8 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
