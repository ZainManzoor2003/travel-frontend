// Centralized API configuration
// For local development, use http://localhost:3001
// For production, set VITE_API_BASE_URL in .env file or use deployed Vercel URL
export const API_BASE = 
  (import.meta as any).env?.VITE_API_BASE_URL || 
  'https://travel-backend-psi.vercel.app';

