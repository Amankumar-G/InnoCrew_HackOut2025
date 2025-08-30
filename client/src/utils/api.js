// API utility functions for centralized API calls

const API_BASE_URL = "http://localhost:8000/api";

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(options.token),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get user profile
  getProfile: async (token) => {
    return apiCall('/auth/profile', {
      method: 'GET',
      token,
    });
  },

  // Update user profile
  updateProfile: async (userData, token) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
      token,
    });
  },

  // Initialize admin (for development)
  initAdmin: async () => {
    return apiCall('/auth/init-admin', {
      method: 'GET',
    });
  },
};

// Plantation API calls
export const plantationAPI = {
  // Submit new plantation
  submitPlantation: async (formData, token) => {
    const url = `${API_BASE_URL}/plantation`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Plantation submission failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's plantations
  getUserPlantations: async (token) => {
    return apiCall('/plantation/user', {
      method: 'GET',
      token,
    });
  },

  // Get plantation by ID
  getPlantationById: async (id, token) => {
    return apiCall(`/plantation/${id}`, {
      method: 'GET',
      token,
    });
  },

  // Update plantation
  updatePlantation: async (id, plantationData, token) => {
    return apiCall(`/plantation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plantationData),
      token,
    });
  },

  // Delete plantation
  deletePlantation: async (id, token) => {
    return apiCall(`/plantation/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};

// User API calls (for future use)
export const userAPI = {
  // Get user stats
  getStats: async (token) => {
    return apiCall('/user/stats', {
      method: 'GET',
      token,
    });
  },

  // Get user complaints/reports
  getComplaints: async (token) => {
    return apiCall('/user/complaints', {
      method: 'GET',
      token,
    });
  },

  // Submit new complaint/report
  submitComplaint: async (complaintData, token) => {
    return apiCall('/user/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
      token,
    });
  },
};

// Export the base URL for other uses
export { API_BASE_URL };
