import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { FiMail, FiLock, FiUser, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

// Enhanced TextField Component with GSAP animations
interface TextFieldProps {
  label: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  startIcon,
  className = "",
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const isPasswordField = type === "password";
  const hasValue = value.length > 0;
  const shouldFloatLabel = focused || hasValue;

  // Animate label on focus/value change
  useEffect(() => {
    if (labelRef.current) {
      if (shouldFloatLabel) {
        gsap.to(labelRef.current, {
          y: -20,
          scale: 0.85,
          duration: 0.2,
          ease: "power2.out",
          color: error ? "#ef4444" : focused ? "#3b82f6" : "#9ca3af"
        });
      } else {
        gsap.to(labelRef.current, {
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
          color: "#9ca3af"
        });
      }
    }
  }, [shouldFloatLabel, focused, error]);

  // Animate border on focus
  useEffect(() => {
    if (borderRef.current) {
      if (focused) {
        gsap.to(borderRef.current, {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out",
          backgroundColor: error ? "#ef4444" : "#3b82f6"
        });
      } else {
        gsap.to(borderRef.current, {
          scaleX: 0,
          duration: 0.3,
          ease: "power2.out",
          backgroundColor: error ? "#ef4444" : "#3b82f6"
        });
      }
    }
  }, [focused, error]);

  return (
    <div className={`relative mt-4 ${className}`}>
      <div
        className={`relative flex items-center rounded-md bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-300"
        } transition-all duration-200 ${focused ? "shadow-md" : ""}`}
      >
        {startIcon && (
          <div className="pl-3 text-gray-500">
            {startIcon}
          </div>
        )}

        <div className="relative flex-1 py-2">
          <label
            ref={labelRef}
            className={`absolute left-3 pointer-events-none origin-left text-gray-500 ${
              shouldFloatLabel ? "top-1" : "top-3"
            }`}
            onClick={() => inputRef.current?.focus()}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <input
            ref={inputRef}
            type={isPasswordField && !showPassword ? "password" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full px-3 pt-4 pb-2 bg-transparent outline-none text-gray-800"
          />
        </div>

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {/* Animated bottom border */}
      <div
        ref={borderRef}
        className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 origin-center transform"
      />

      {error && (
        <div className="text-red-500 text-xs mt-1 ml-1">
          {error}
        </div>
      )}
    </div>
  );
};



export default TextField
