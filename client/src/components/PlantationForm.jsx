

import React, { useState, useEffect } from "react";
import { FaLeaf, FaCheck, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { plantationAPI } from "../utils/api";

const initialForm = {
  plantationName: "",
  location: { latitude: "", longitude: "", address: "" },
  area: "",
  species: [""],
  plantingDate: "",
  survivalRate: "",
  expectedCarbonCredit: "",
  images: [],
  soilCertificate: "",
  plantCertificate: "",
  additionalDocs: [],
};

export default function PlantationForm() {
  const [form, setForm] = useState(initialForm);
  const [mediaFiles, setMediaFiles] = useState({
    images: [],
    soilCertificate: null,
    plantCertificate: null,
    additionalDocs: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  // Get auth context
  const { token } = useAuth();

  // Auto-fetch geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
          }));
          setLocationStatus("success");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationStatus("error");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (event, field) => {
    const files = Array.from(event.target.files);
    
    if (field === "images" || field === "additionalDocs") {
      setMediaFiles(prev => ({
        ...prev,
        [field]: [...prev[field], ...files]
      }));
      setForm(prev => ({
        ...prev,
        [field]: [...prev[field], ...files.map(f => f.name)]
      }));
    } else {
      setMediaFiles(prev => ({
        ...prev,
        [field]: files[0] || null
      }));
      setForm(prev => ({
        ...prev,
        [field]: files[0]?.name || ""
      }));
    }
  };

  // Remove file
  const removeFile = (field, index) => {
    if (field === "images" || field === "additionalDocs") {
      setMediaFiles(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
      setForm(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    } else {
      setMediaFiles(prev => ({
        ...prev,
        [field]: null
      }));
      setForm(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Species handlers
  const handleSpeciesChange = (idx, value) => {
    const updated = [...form.species];
    updated[idx] = value;
    setForm((prev) => ({ ...prev, species: updated }));
  };
  
  const addSpeciesField = () =>
    setForm((prev) => ({ ...prev, species: [...prev.species, ""] }));
  
  const removeSpeciesField = (idx) =>
    setForm((prev) => ({
      ...prev,
      species: prev.species.filter((_, i) => i !== idx),
    }));

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const formData = new FormData();
      
      // Add basic form fields
      formData.append("plantationName", form.plantationName);
      formData.append("latitude", form.location.latitude);
      formData.append("longitude", form.location.longitude);
      formData.append("address", form.location.address || "");
      formData.append("area", form.area);
      formData.append("species", form.species.filter(s => s.trim()).join(","));
      formData.append("plantingDate", form.plantingDate);
      formData.append("survivalRate", form.survivalRate || "");

      // Add files
      mediaFiles.images.forEach((file, index) => {
        formData.append("images", file);
      });

      if (mediaFiles.soilCertificate) {
        formData.append("soilCertificate", mediaFiles.soilCertificate);
      }

      if (mediaFiles.plantCertificate) {
        formData.append("plantCertificate", mediaFiles.plantCertificate);
      }

      mediaFiles.additionalDocs.forEach((file, index) => {
        formData.append("additionalDocs", file);
      });

      const result = await plantationAPI.submitPlantation(formData, token);

      if (result.success) {
        setSubmitStatus("success");
        setTimeout(() => {
          navigate("/pdfChat");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Failed to submit plantation");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.plantationName.trim() &&
    form.location.latitude &&
    form.location.longitude &&
    form.area &&
    form.species.filter((s) => s.trim()).length > 0 &&
    form.plantingDate;

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Plantation Name */}
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Plantation Name *
        </label>
        <input
          type="text"
          value={form.plantationName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, plantationName: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          placeholder="Enter plantation name"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Location *</label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.location.latitude}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, latitude: e.target.value },
              }))
            }
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.location.longitude}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, longitude: e.target.value },
              }))
            }
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={form.location.address}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, address: e.target.value },
              }))
            }
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Location status */}
        {locationStatus === "loading" && (
          <p className="mt-2 text-sm text-blue-600 flex items-center">
            <FaSpinner className="animate-spin mr-2" />
            Getting your location...
          </p>
        )}
        {locationStatus === "success" && (
          <p className="mt-2 text-sm text-green-600">
            ✅ Location captured: {Number(form.location.latitude).toFixed(4)},{" "}
            {Number(form.location.longitude).toFixed(4)}
          </p>
        )}
        {locationStatus === "error" && (
          <p className="mt-2 text-sm text-red-600">
            ⚠️ Unable to fetch location. Please enable GPS or enter manually.
          </p>
        )}
      </div>

      {/* Area */}
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Area (hectares) *
        </label>
        <input
          type="number"
          step="any"
          min="0.01"
          value={form.area}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, area: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          placeholder="Enter area in hectares"
          required
        />
      </div>

      {/* Species */}
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Mangrove Species *
        </label>
        <div className="space-y-2">
          {form.species.map((sp, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={sp}
                onChange={(e) => handleSpeciesChange(idx, e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                placeholder="Enter species name"
                required
              />
              {form.species.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpeciesField(idx)}
                  className="px-4 py-3 text-red-600 hover:text-red-800 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpeciesField}
            className="px-4 py-2 mt-2 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
          >
            + Add Species
          </button>
        </div>
      </div>

      {/* Planting Date */}
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Planting Date *
        </label>
        <input
          type="date"
          value={form.plantingDate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, plantingDate: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          required
        />
      </div>

      {/* Survival Rate */}
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Survival Rate (%)
        </label>
        <input
          type="number"
          step="any"
          min="0"
          max="100"
          value={form.survivalRate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, survivalRate: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          placeholder="Enter survival rate percentage"
        />
      </div>

      {/* Expected Carbon Credit */}
      <div>
        <label className="block mb-2 text-lg font-semibold">
          Expected Carbon Credit (tons CO₂)
        </label>
        <input
          type="number"
          step="any"
          min="0"
          value={form.expectedCarbonCredit}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              expectedCarbonCredit: e.target.value,
            }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          placeholder="Enter expected carbon credit"
        />
      </div>

      {/* File Uploads */}
      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-lg font-semibold">
            Plantation Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "images")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
          {mediaFiles.images.length > 0 && (
            <div className="mt-2 space-y-1">
              {mediaFiles.images.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile("images", index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold">
            Soil Certificate
          </label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => handleFileUpload(e, "soilCertificate")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
          {mediaFiles.soilCertificate && (
            <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{mediaFiles.soilCertificate.name}</span>
              <button
                type="button"
                onClick={() => removeFile("soilCertificate")}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold">
            Plant Certificate
          </label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => handleFileUpload(e, "plantCertificate")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
          {mediaFiles.plantCertificate && (
            <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{mediaFiles.plantCertificate.name}</span>
              <button
                type="button"
                onClick={() => removeFile("plantCertificate")}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold">
            Additional Documents
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e, "additionalDocs")}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          />
          {mediaFiles.additionalDocs.length > 0 && (
            <div className="mt-2 space-y-1">
              {mediaFiles.additionalDocs.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile("additionalDocs", index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-8">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex items-center px-8 py-4 space-x-3 text-lg font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FaLeaf />
              <span>Submit Plantation</span>
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {submitStatus === "success" && (
        <div className="flex items-center p-6 mt-8 space-x-4 border-2 border-green-300 bg-green-50 rounded-xl">
          <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
            <FaCheck className="text-xl text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-800">
              Plantation Submitted Successfully!
            </h3>
            <p className="text-green-700">
              Thank you for contributing to mangrove restoration and carbon
              credit generation. Redirecting to your profile...
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === "error" && (
        <div className="flex items-center p-6 mt-8 space-x-4 border-2 border-red-300 bg-red-50 rounded-xl">
          <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
            <FaExclamationTriangle className="text-xl text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">
              Submission Failed
            </h3>
            <p className="text-red-700">
              {errorMessage || "An error occurred while submitting your plantation. Please try again."}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
