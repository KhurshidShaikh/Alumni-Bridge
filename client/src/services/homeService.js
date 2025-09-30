// Get backend URL from environment or use default
const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
};

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Home page data service functions
export const homeService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/profile/me`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  // Get recent alumni (limited for home page)
  getRecentAlumni: async (limit = 4) => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/profile/alumni?limit=${limit}&page=1`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get recent alumni error:', error);
      throw error;
    }
  },

  // Get latest job postings (limited for home page)
  getLatestJobs: async (limit = 4) => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/jobs?limit=${limit}&page=1&sortBy=createdAt&sortOrder=desc`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get latest jobs error:', error);
      throw error;
    }
  },

  // Get upcoming events (limited for home page)
  getUpcomingEvents: async (limit = 4) => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/event/get-auth?limit=${limit}&page=1`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get upcoming events error:', error);
      throw error;
    }
  },

  // Get platform statistics
  getPlatformStats: async () => {
    try {
      const backendUrl = getBackendUrl();
      const headers = getAuthHeaders();

      let totalAlumni = 0;
      let totalJobs = 0;
      let totalEvents = 0;

      // Get alumni count (safe)
      try {
        const alumniResponse = await fetch(`${backendUrl}/api/profile/alumni?limit=1&page=1`, { headers });
        const alumniData = await alumniResponse.json();
        totalAlumni = alumniData.pagination?.totalCount || 0;
      } catch (error) {
        console.warn('Failed to fetch alumni count:', error);
      }

      // Get jobs count (safe)
      try {
        const jobsResponse = await fetch(`${backendUrl}/api/jobs?limit=1&page=1`, { headers });
        const jobsData = await jobsResponse.json();
        totalJobs = jobsData.pagination?.totalCount || 0;
      } catch (error) {
        console.warn('Failed to fetch jobs count:', error);
      }

      // Get events count (safe)
      try {
        const eventsResponse = await fetch(`${backendUrl}/api/event/get-auth?limit=1&page=1`, { headers });
        const eventsData = await eventsResponse.json();
        totalEvents = eventsData.pagination?.totalEvents || 0;
      } catch (error) {
        console.warn('Failed to fetch events count:', error);
      }

      return {
        totalAlumni,
        totalJobs,
        totalEvents,
        // Mock active mentors for now (can be implemented later)
        activeMentors: Math.floor(totalAlumni * 0.3) // Assume 30% of alumni are active mentors
      };
    } catch (error) {
      console.error('Get platform stats error:', error);
      // Return default stats instead of throwing
      return {
        totalAlumni: 0,
        totalJobs: 0,
        totalEvents: 0,
        activeMentors: 0
      };
    }
  },

  // Get user connections count
  getUserConnections: async () => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/connections/my-connections`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user connections error:', error);
      // Return empty array if error (user might not have connections yet)
      return { success: true, connections: [] };
    }
  }
};

export default homeService;
