import { useState, useEffect, useRef } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone, FiClock, FiEye, FiEyeOff } from 'react-icons/fi';

// Enhanced TextField Component with GSAP animations
interface TextFieldProps {
  label: string;
  type?: "text" | "password" | "email" | "textarea";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  className?: string;
  rows?: number;
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
  rows = 4,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const isTextarea = type === "textarea";
  const hasValue = value.length > 0;
  const shouldFloatLabel = focused || hasValue;

  return (
    <div className={`relative mt-4 ${className}`}>
      <div
        className={`relative flex items-start rounded-md bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-300"
        } transition-all duration-200 ${focused ? "shadow-md ring-2 ring-[#3f7670] ring-opacity-20" : ""}`}
      >
        {startIcon && (
          <div className="pl-3 pt-3 text-gray-500">
            {startIcon}
          </div>
        )}

        <div className="relative flex-1 py-2">
          <label
            className={`absolute left-3 pointer-events-none origin-left transition-all duration-200 ${
              shouldFloatLabel 
                ? "top-1 text-xs font-medium scale-85 text-[#3f7670]" 
                : "top-3 text-base text-gray-500"
            } ${error && shouldFloatLabel ? "text-red-500" : ""}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {isTextarea ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={rows}
              className="w-full px-3 pt-4 pb-2 bg-transparent outline-none text-gray-800 resize-none"
            />
          ) : (
            <input
              type={isPasswordField && !showPassword ? "password" : type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full px-3 pt-4 pb-2 bg-transparent outline-none text-gray-800"
            />
          )}
        </div>

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3 pt-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {/* Animated bottom border */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
          focused ? "w-full" : "w-0"
        } ${error ? "bg-red-500" : "bg-[#3f7670]"}`}
      />

      {error && (
        <div className="text-red-500 text-xs mt-1 ml-1">
          {error}
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-8">Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-[#3f7670] text-white px-6 py-3 rounded-lg hover:bg-[#2d5550] transition-colors duration-200 shadow-lg"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="yy" className="relative pt-32 pb-16 text-white" style={{ backgroundColor: '#3f7670' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Talk
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Ready to plan your next adventure? We're here to help make it unforgettable.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Message</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Full Name"
                      type="text"
                      value={formData.name}
                      onChange={(value) => handleInputChange('name', value)}
                      error={errors.name}
                      required
                      startIcon={<FiUser size={18} />}
                    />

                    <TextField
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      error={errors.email}
                      required
                      startIcon={<FiMail size={18} />}
                    />
                  </div>

                  <TextField
                    label="Subject"
                    type="text"
                    value={formData.subject}
                    onChange={(value) => handleInputChange('subject', value)}
                    error={errors.subject}
                    required
                    startIcon={<FiMessageSquare size={18} />}
                  />

                  <TextField
                    label="Your Message"
                    type="textarea"
                    value={formData.message}
                    onChange={(value) => handleInputChange('message', value)}
                    error={errors.message}
                    required
                    rows={5}
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#3f7670] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d5550] disabled:bg-teal-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Info</h2>
                
                {/* Contact information in responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-[#3f7670]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        123 Travel Street<br />
                        Adventure City, AC 12345
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiPhone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                      <p className="text-gray-600 text-sm">info@travelbeyondtours.com</p>
                    </div>
                  </div>

                  {/* Business Hours - spans full width on larger screens */}
                  <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2 flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick response note */}
                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-teal-800 text-sm">
                    <span className="font-semibold">Quick Response:</span> We typically respond to all inquiries within 2-4 hours during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;