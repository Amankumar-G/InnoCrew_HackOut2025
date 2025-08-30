import { API_BASE_URL } from "../utils/api";

export async function fetchComplaintDetails(complaintId, token) {
  const res = await fetch(`${API_BASE_URL}/complaint/${complaintId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch complaint details");
  return res.json();
}
