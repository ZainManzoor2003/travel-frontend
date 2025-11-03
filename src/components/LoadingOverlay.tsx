import React from 'react';

type Props = {
  show: boolean;
  label?: string;
};

export default function LoadingOverlay({ show, label = 'Loading...' }: Props) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}


