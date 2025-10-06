import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Warm-up ping for backend after initial paint (low priority)
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://travel-backend-psi.vercel.app';
const warmUp = () => {
  try {
    fetch(`${API_BASE}/tours?limit=1`, { credentials: 'include' }).catch(() => {});
  } catch {}
};
// Use requestIdleCallback or fallback to setTimeout to avoid blocking
// @ts-ignore
if (window.requestIdleCallback) {
  // @ts-ignore
  window.requestIdleCallback(warmUp, { timeout: 2000 });
} else {
  setTimeout(warmUp, 0);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



