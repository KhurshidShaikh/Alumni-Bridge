// Centralized API configuration
// In production (behind Nginx), VITE_BACKEND_URL should be empty string or the full domain URL
// In development, the Vite proxy handles /api requests, so empty string works too
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '';

// Helper to get the backend URL (for compatibility with existing code)
export const getBackendUrl = () => API_BASE_URL;
