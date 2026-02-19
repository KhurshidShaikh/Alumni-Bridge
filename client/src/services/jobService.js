import { API_BASE_URL as BASE_URL } from '../config/api.js';
const API_BASE_URL = `${BASE_URL}/api`;

// Get authentication token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create headers with authentication
const createHeaders = (isFormData = false) => {
    const headers = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// Handle API response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || 'Something went wrong');
    }
    return response.json();
};

export const jobService = {
    // Get all jobs with filters
    getAllJobs: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'All' && filters[key] !== '') {
                queryParams.append(key, filters[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    // Get single job by ID
    getJobById: async (jobId) => {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    // Create new job (Alumni only)
    createJob: async (jobData) => {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(jobData)
        });

        return handleResponse(response);
    },

    // Update job (Job poster only)
    updateJob: async (jobId, jobData) => {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(jobData)
        });

        return handleResponse(response);
    },

    // Delete job (Job poster only)
    deleteJob: async (jobId) => {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: 'DELETE',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    // Apply to job with resume
    applyToJob: async (jobId, formData) => {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: createHeaders(true), // FormData, so no Content-Type header
            body: formData
        });

        return handleResponse(response);
    },

    // Get job applications (Job poster only)
    getJobApplications: async (jobId, filters = {}) => {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'all') {
                queryParams.append(key, filters[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications?${queryParams}`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    // Get user's job applications
    getMyApplications: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'all') {
                queryParams.append(key, filters[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/jobs/my/applications?${queryParams}`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    // Get jobs posted by current user (Alumni only)
    getMyJobs: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'all') {
                queryParams.append(key, filters[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/jobs/my/jobs?${queryParams}`, {
            method: 'GET',
            headers: createHeaders()
        });

        return handleResponse(response);
    },

    // Update application status (Job poster only)
    updateApplicationStatus: async (applicationId, status, notes = '') => {
        const response = await fetch(`${API_BASE_URL}/jobs/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify({ status, notes })
        });

        return handleResponse(response);
    }
};
