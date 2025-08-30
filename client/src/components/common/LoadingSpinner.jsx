import React from "react";

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} mangrove-spinner`}
        ></div>
      </div>
      {text && (
        <p className="text-green-600 font-medium mangrove-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
