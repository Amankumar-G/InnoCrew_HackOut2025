import React from "react";

const ComplaintModal = ({ isOpen, onClose, complaint, theme = "light" }) => {
  if (!isOpen || !complaint) return null;

  // Essential details from the JSON
  const { location, verification, description, category, media, damageEstimate, landmark, status, timestamp, createdAt, updatedAt } = complaint;
  const summary = verification?.verificationSummary;
  const final = summary?.finalVerification;
  const fullAnalysis = verification?.fullAnalysis;

  // Theme-based close button styles
  const closeBtnBase = "absolute top-2 right-2 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500";
  const closeBtnTheme = theme === "dark"
    ? "bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white border border-gray-700 shadow"
    : "bg-white text-gray-600 hover:bg-green-100 hover:text-green-700 border border-gray-200 shadow";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
        <button
          className={`${closeBtnBase} ${closeBtnTheme}`}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="mb-2 text-2xl font-bold">Complaint Details</h2>
        <div className="mb-2"><span className="font-semibold">Description:</span> {description}</div>
        <div className="mb-2"><span className="font-semibold">Category:</span> {category}</div>
        <div className="mb-2"><span className="font-semibold">Location:</span> Lat {location?.lat}, Lng {location?.lng}</div>
        <div className="mb-2"><span className="font-semibold">Landmark:</span> {landmark}</div>
        <div className="mb-2"><span className="font-semibold">Status:</span> {status}</div>
        <div className="mb-2"><span className="font-semibold">Severity:</span> {verification?.severity}</div>
        <div className="mb-2"><span className="font-semibold">Confidence Score:</span> {verification?.confidenceScore}</div>
        <div className="mb-2"><span className="font-semibold">Damage Estimate:</span> {damageEstimate}</div>
        <div className="mb-2"><span className="font-semibold">Timestamp:</span> {new Date(timestamp).toLocaleString()}</div>
        <div className="mb-2"><span className="font-semibold">Created At:</span> {new Date(createdAt).toLocaleString()}</div>
        <div className="mb-2"><span className="font-semibold">Updated At:</span> {new Date(updatedAt).toLocaleString()}</div>

        {/* Verification Summary */}
        {summary && (
          <div className="mb-2">
            <span className="font-semibold">Verification Summary:</span>
            <div className="ml-4">
              <div><span className="font-semibold">Status:</span> {summary.status}</div>
              <div><span className="font-semibold">Severity:</span> {summary.severity}</div>
              <div><span className="font-semibold">Confidence:</span> {verification?.confidenceScore}</div>
              <div><span className="font-semibold">Checks:</span></div>
              <ul className="ml-6 list-disc">
                <li><span className="font-semibold">Image:</span> {summary.checks?.image?.passed ? "Passed" : "Failed"} ({summary.checks?.image?.confidence})</li>
                <li><span className="font-semibold">Geo:</span> {summary.checks?.geo?.passed ? "Passed" : "Failed"} (In Mangrove Zone: {summary.checks?.geo?.details?.isInMangroveZone ? "Yes" : "No"})</li>
                <li><span className="font-semibold">Text:</span> {summary.checks?.text?.passed ? "Passed" : "Failed"} (Preliminary Severity: {summary.checks?.text?.details?.preliminarySeverity})</li>
              </ul>
            </div>
          </div>
        )}

        {/* Final Verification */}
        {final && (
          <div className="mb-2">
            <span className="font-semibold">Final Verification:</span>
            <div className="ml-4">
              <div><span className="font-semibold">Complaint Status:</span> {final.complaintStatus}</div>
              <div><span className="font-semibold">Final Severity:</span> {final.finalSeverity}</div>
              <div><span className="font-semibold">Overall Confidence:</span> {final.overallConfidence}</div>
              <div><span className="font-semibold">Reason:</span> {final.verificationReason}</div>
              <div><span className="font-semibold">Priority Level:</span> {final.priorityLevel}</div>
              <div><span className="font-semibold">Carbon Credits Earned:</span> {final.carbonCreditsEarned}</div>
              <div><span className="font-semibold">Recommended Actions:</span>
                <ul className="ml-6 list-disc">
                  {final.recommendedActions?.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Media */}
        <div className="mb-2">
          <span className="font-semibold">Media:</span>
          <div className="flex gap-2 mt-2">
            {media?.map((m) => (
              <img
                key={m._id}
                src={`${import.meta.env.VITE_URL}${m.url}`}
                alt={m.type}
                className="object-cover w-20 h-20 border rounded"
              />
            ))}
          </div>
        </div>

        {/* Full Analysis */}
        {fullAnalysis && (
          <div className="mb-2">
            <span className="font-semibold">Full Analysis:</span>
            <div className="ml-4">
              <div className="mb-1"><span className="font-semibold">Image Analysis:</span> {fullAnalysis.imageAnalysis?.analysisDetails}</div>
              <div className="mb-1"><span className="font-semibold">Geo Validation:</span> {fullAnalysis.geoValidation?.geoDetails}</div>
              <div className="mb-1"><span className="font-semibold">Text Analysis:</span> {fullAnalysis.textAnalysis?.textAnalysis}</div>
              <div className="mb-1"><span className="font-semibold">Final Verification:</span> {fullAnalysis.finalVerification?.verificationReason}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintModal;
