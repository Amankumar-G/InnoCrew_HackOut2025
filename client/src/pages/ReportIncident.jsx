import React, { useState, useEffect } from "react";
import {
  FaMapMarkedAlt,
  FaCamera,
  FaVideo,
  FaExclamationTriangle,
  FaLocationArrow,
  FaUpload,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaTree,
  FaLeaf,
  FaWater,
  FaFish,
  FaShip,
  FaRecycle,
  FaFire,
} from "react-icons/fa";

import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ReportIncident() {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    location: { lat: null, lng: null },
    damageEstimate: "",
    landmark: "",
    media: [],
  });

  const [locationStatus, setLocationStatus] = useState("idle");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fix: Properly destructure the auth context
  const { user, token } = useAuth(); // or however your auth context is structured
  // Alternative if useAuth returns user directly:
  // const user = useAuth();

  const categories = [
    {
      value: "cutting",
      label: "Illegal Cutting",
      icon: FaTree,
      color: "text-red-600",
    },
    {
      value: "dumping",
      label: "Waste Dumping",
      icon: FaRecycle,
      color: "text-orange-600",
    },
    {
      value: "pollution",
      label: "Pollution",
      icon: FaWater,
      color: "text-blue-600",
    },
    {
      value: "fire",
      label: "Fire/Burning",
      icon: FaExclamationTriangle,
      color: "text-red-500",
    },
    {
      value: "other",
      label: "Other",
      icon: FaExclamationTriangle,
      color: "text-gray-600",
    },
  ];

  const damageEstimates = [
    {
      value: "small",
      label: "Small Impact",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "medium",
      label: "Medium Impact",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "large", label: "Large Impact", color: "bg-red-100 text-red-800" },
  ];

  const getCurrentLocation = () => {
    setLocationStatus("loading");

    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
        setLocationStatus("success");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMedia = [];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "photo" : "video";
      newMedia.push({ url, type, file });
    });

    setMediaFiles((prev) => [...prev, ...newMedia]);
    setFormData((prev) => ({
      ...prev,
      media: [
        ...prev.media,
        ...newMedia.map((m) => ({ url: m.url, type: m.type })),
      ],
    }));
  };

  const removeMedia = (index) => {
    const updatedMedia = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMedia);
    setFormData((prev) => ({
      ...prev,
      media: updatedMedia.map((m) => ({ url: m.url, type: m.type })),
    }));
  };

  // Fixed submit function with better error handling and debugging
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("from handle submit");

    try {
      // Debug: Log the environment variable
      console.log("API URL:", import.meta.env.VITE_URL);

      // Debug: Log the token
      console.log("User token:", token || user?.token);

      const fd = new FormData();
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("location", JSON.stringify(formData.location));
      fd.append("damageEstimate", formData.damageEstimate);
      fd.append("landmark", formData.landmark);

      mediaFiles.forEach((media) => {
        fd.append("media", media.file);
      });

      // Debug: Log FormData contents
      console.log("FormData being sent:");
      for (let [key, value] of fd.entries()) {
        console.log(key, value);
      }

      const apiUrl = `${import.meta.env.VITE_URL}/api/complaints`;
      console.log("Making request to:", apiUrl);

      const res = await axios.post(apiUrl, fd, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token || user?.token}`, // Fix: Handle both cases
          "Content-Type": "multipart/form-data",
        },
      });

      // This console.log should now work
      console.log("Success response:", res);
      console.log("Response data:", res.data);
      console.log("Response status:", res.status);

      if (res.status === 200 || res.status === 201) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          description: "",
          category: "",
          location: { lat: null, lng: null },
          damageEstimate: "",
          landmark: "",
          media: [],
        });
        setMediaFiles([]);
        setLocationStatus("idle");
      } else {
        console.log("Unexpected status code:", res.status);
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Error submitting report:", err);

      // More detailed error logging
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.description &&
    formData.category &&
    formData.location.lat &&
    formData.damageEstimate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full mb-6 shadow-lg">
            <FaMapMarkedAlt className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            Report Incident
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help protect our mangrove ecosystems by reporting incidents in your
            area. Your reports help us respond quickly and effectively.
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === "success" && (
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-8 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-green-800 font-bold text-lg">
                Report Submitted Successfully!
              </h3>
              <p className="text-green-700">
                Thank you for helping protect our mangroves. We'll investigate
                this incident promptly.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-8 flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-red-800 font-bold text-lg">
                Error Submitting Report
              </h3>
              <p className="text-red-700">
                There was an error submitting your report. Please check the
                console for details and try again.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          <div className="p-8 space-y-8">
            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Incident Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe what you observed (e.g., Mangroves being cut near XYZ creek)"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Incident Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = formData.category === category.value;
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          category: category.value,
                        }))
                      }
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 shadow-lg"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`text-xl ${
                            isSelected ? "text-emerald-600" : category.color
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isSelected ? "text-emerald-800" : "text-gray-700"
                          }`}
                        >
                          {category.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Location *
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationStatus === "loading"}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                >
                  {locationStatus === "loading" ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaLocationArrow />
                  )}
                  <span>
                    {locationStatus === "loading"
                      ? "Getting Location..."
                      : "Use Current Location"}
                  </span>
                </button>

                {locationStatus === "success" && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <FaCheck />
                    <span className="text-sm font-medium">
                      Location captured: {formData.location.lat?.toFixed(4)},{" "}
                      {formData.location.lng?.toFixed(4)}
                    </span>
                  </div>
                )}

                {locationStatus === "error" && (
                  <div className="text-red-600 text-sm">
                    Unable to get location. Please enable location services.
                  </div>
                )}
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Nearby Landmark
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, landmark: e.target.value }))
                }
                placeholder="e.g., XYZ creek, Main bridge, Village center"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
              />
            </div>

            {/* Damage Estimate */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Damage Estimate *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {damageEstimates.map((estimate) => {
                  const isSelected = formData.damageEstimate === estimate.value;
                  return (
                    <button
                      key={estimate.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          damageEstimate: estimate.value,
                        }))
                      }
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 shadow-lg"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${estimate.color}`}
                      >
                        {estimate.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                    <FaUpload className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Upload Photos
                    </p>
                    <p className="text-sm text-gray-500">
                      Click to browse or drag and drop files
                    </p>
                  </div>
                </label>
              </div>

              {/* Media Preview */}
              {mediaFiles.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mediaFiles.map((media, index) => (
                    <div key={index} className="relative group">
                      {media.type === "photo" ? (
                        <img
                          src={media.url}
                          alt="Uploaded"
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                          <FaVideo className="text-gray-400 text-2xl" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                      <div className="absolute bottom-1 left-1 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        {media.type === "photo" ? <FaCamera /> : <FaVideo />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <FaMapMarkedAlt />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Report Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      formData.description
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {formData.description ? (
                      <FaCheck className="text-xs" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <span
                    className={
                      formData.description
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Description provided
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      formData.category
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {formData.category ? <FaCheck className="text-xs" /> : "2"}
                  </div>
                  <span
                    className={
                      formData.category
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Category selected
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      formData.location.lat
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {formData.location.lat ? (
                      <FaCheck className="text-xs" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <span
                    className={
                      formData.location.lat
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Location captured
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      formData.damageEstimate
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {formData.damageEstimate ? (
                      <FaCheck className="text-xs" />
                    ) : (
                      "4"
                    )}
                  </div>
                  <span
                    className={
                      formData.damageEstimate
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Damage estimate provided
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      mediaFiles.length > 0
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {mediaFiles.length > 0 ? (
                      <FaCheck className="text-xs" />
                    ) : (
                      "5"
                    )}
                  </div>
                  <span
                    className={
                      mediaFiles.length > 0
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    Evidence uploaded ({mediaFiles.length} files)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Reporting Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-emerald-600 flex items-center space-x-2">
                <FaExclamationTriangle />
                <span>What to Report</span>
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Illegal cutting or clearing of mangroves</li>
                <li>• Waste dumping in mangrove areas</li>
                <li>• Industrial pollution affecting ecosystems</li>
                <li>• Fires or burning in protected zones</li>
                <li>• Any unusual changes in mangrove health</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-emerald-600 flex items-center space-x-2">
                <FaCamera />
                <span>Evidence Tips</span>
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Take clear photos showing the full scope</li>
                <li>• Include close-up shots of specific damage</li>
                <li>• Record videos for ongoing activities</li>
                <li>• Note the date and time of observation</li>
                <li>• Include any visible landmarks for reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
