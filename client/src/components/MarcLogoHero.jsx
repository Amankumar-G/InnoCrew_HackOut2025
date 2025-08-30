import React, { useState, useEffect } from 'react';
import { FaUsers, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MarcLogoHero = () => {
  const [theme, setTheme] = useState('light');

  return (
    <div className="relative w-full h-[83vh] overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-xl">
      <div className="relative backdrop-blur-sm h-full">
        {/* White overlay */}
        <div className="absolute inset-0 bg-white/75"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20"></div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center space-y-8 pt-24">
          {/* MARC Logo */}
          <div className="relative inline-block group">
            {/* Subtle glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Logo container */}
            <div className="relative bg-white/80 backdrop-blur-md rounded-2xl px-12 py-8 shadow-2xl border border-emerald-100/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
              {/* Decorative corner elements */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-emerald-400/40 rounded-tl-lg"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-emerald-400/40 rounded-tr-lg"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-emerald-400/40 rounded-bl-lg"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-emerald-400/40 rounded-br-lg"></div>
              
              {/* Main logo text */}
              <h1 className="text-6xl md:text-8xl font-light tracking-wider relative">
                {['M', 'A', 'R', 'C'].map((letter, index) => (
                  <span
                    key={letter}
                    className="inline-block bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 transition-all duration-500 hover:scale-110 transform-gpu"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animation: `fadeInUp 0.8s ease-out forwards`
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
              
            </div>
            
            {/* Small leaf icon */}
            <div className="absolute -top-2 -right-2 text-emerald-500 animate-bounce" style={{animationDelay: '1s'}}>
              <FaLeaf className="w-6 h-6" />
            </div>
          </div>

          <p className={`text-2xl max-w-4xl mx-auto leading-relaxed font-semibold text-[#114924] mt-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Mangrove Action for Restoration And Conservation
          </p>
          
          <p className={`text-xl pb-4 max-w-4xl mx-auto leading-relaxed text-[#114924] ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Empowering coastal communities to protect and restore mangrove ecosystems through participatory monitoring, 
            AI-powered verification, and carbon credit rewards. Join the global movement to safeguard our planet's vital coastal forests.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10">
          <Link
          to="/login"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaUsers className="w-5 h-5" />
          <span>Join the Community</span>
        </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default MarcLogoHero;