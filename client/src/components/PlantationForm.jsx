import React, { useState, useEffect } from "react";
import { FaLeaf, FaCheck, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  const navigate = useNavigate();

  // Auto-fetch geolocation
  useEffect(() => {
    if (navigator.geolocation) {
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
        () => setLocationStatus("error")
      );
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (event, field) => {
    const files = Array.from(event.target.files);
    if (field === "images" || field === "additionalDocs") {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], ...files.map((f) => f.name)],
      }));
      setMediaFiles((prev) => [...prev, ...files]);
    } else {
      setForm((prev) => ({ ...prev, [field]: files[0]?.name || "" }));
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
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/plantation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setTimeout(() => navigate("/profile"), 1200);
      } else setSubmitStatus("error");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.plantationName &&
    form.location.latitude &&
    form.location.longitude &&
    form.area &&
    form.species.filter((s) => s).length > 0 &&
    form.plantingDate;

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Plantation Name */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Plantation Name *</label>
        <input
          type="text"
          value={form.plantationName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, plantationName: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
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
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
          />
        </div>

        {/* Location status */}
        {locationStatus === "success" && (
          <p className="mt-2 text-sm text-green-600">
            Location captured: {Number(form.location.latitude).toFixed(4)},{" "}
            {Number(form.location.longitude).toFixed(4)}
          </p>
        )}
        {locationStatus === "error" && (
          <p className="mt-2 text-sm text-red-600">
            Unable to fetch location. Please enable GPS.
          </p>
        )}
      </div>

      {/* Area */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Area (hectares) *</label>
        <input
          type="number"
          step="any"
          value={form.area}
          onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
          required
        />
      </div>

      {/* Species */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Mangrove Species *</label>
        <div className="space-y-2">
          {form.species.map((sp, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                type="text"
                value={sp}
                onChange={(e) => handleSpeciesChange(idx, e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
                required
              />
              {form.species.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpeciesField(idx)}
                  className="px-2 py-1 text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpeciesField}
            className="px-4 py-2 mt-2 rounded bg-emerald-100 text-emerald-800"
          >
            + Add Species
          </button>
        </div>
      </div>

      {/* Planting Date */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Planting Date *</label>
        <input
          type="date"
          value={form.plantingDate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, plantingDate: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
          required
        />
      </div>

      {/* Survival Rate */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Survival Rate (%)</label>
        <input
          type="number"
          step="any"
          min="0"
          max="100"
          value={form.survivalRate}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, survivalRate: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
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
          value={form.expectedCarbonCredit}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, expectedCarbonCredit: e.target.value }))
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500"
        />
      </div>

      {/* File Uploads */}
      <div>
        <label className="block mb-2 text-lg font-semibold">Plantation Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "images")}
        />
      </div>
      <div>
        <label className="block mb-2 text-lg font-semibold">Soil Certificate</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileUpload(e, "soilCertificate")}
        />
      </div>
      <div>
        <label className="block mb-2 text-lg font-semibold">Plant Certificate</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => handleFileUpload(e, "plantCertificate")}
        />
      </div>
      <div>
        <label className="block mb-2 text-lg font-semibold">Additional Documents</label>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e, "additionalDocs")}
        />
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
              Thank you for contributing to mangrove restoration and carbon credit generation.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
