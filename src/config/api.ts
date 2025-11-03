// Centralized API configuration
// For local development, use http://localhost:3001
// For production, set VITE_API_BASE_URL in .env file
export const API_BASE = 
  (import.meta as any).env?.VITE_API_BASE_URL || 
  'http://localhost:3001';

