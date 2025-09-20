import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  Building2,
  Send,
  Check,
  AlertCircle
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  budgetRange: string;
  travelAgency: string;
  travelType: string;
  specialRequests: string;
}

const travelAgencies = [
  'Expedia',
  'Booking.com',
  'TripAdvisor',
  'Kayak',
  'Priceline',
  'Orbitz',
  'Travelocity',
  'Thomas Cook',
  'Kuoni',
  'TUI Group',
  'American Express Travel',
  'Carlson Wagonlit Travel',
  'Flight Centre',
  'Liberty Travel',
  'AAA Travel'
];

const budgetRanges = [
  'Under $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $20,000',
  'Over $20,000'
];

const travelTypes = [
  'Leisure/Vacation',
  'Business Travel',
  'Adventure/Adventure Sports',
  'Cultural/Historical',
  'Beach/Resort',
  'City Break',
  'Honeymoon/Romance',
  'Family Vacation',
  'Solo Travel',
  'Group Travel'
];

export const TravelForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    travelers: 1,
    budgetRange: '',
    travelAgency: '',
    travelType: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'travelers' ? parseInt(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
    if (!formData.budgetRange) newErrors.budgetRange = 'Budget range is required';
    if (!formData.travelAgency) newErrors.travelAgency = 'Travel agency is required';
    if (!formData.travelType) newErrors.travelType = 'Travel type is required';

    // Validate dates
    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      if (returnDate <= departure) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmitStatus('idle');

  //   try {
  //     // Replace this URL with your Django backend endpoint
  //     const response = await fetch('/api/travel-inquiries/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         // Add CSRF token if needed for Django
  //         // 'X-CSRFToken': getCookie('csrftoken'),
  //       },
  //       body: JSON.stringify({
  //         first_name: formData.firstName,
  //         last_name: formData.lastName,
  //         email: formData.email,
  //         phone: formData.phone,
  //         destination: formData.destination,
  //         departure_date: formData.departureDate,
  //         return_date: formData.returnDate,
  //         travelers: formData.travelers,
  //         budget_range: formData.budgetRange,
  //         travel_agency: formData.travelAgency,
  //         travel_type: formData.travelType,
  //         special_requests: formData.specialRequests,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to submit form');
  //     }

  //     setSubmitStatus('success');
  //     // Reset form
  //     setFormData({
  //       firstName: '',
  //       lastName: '',
  //       email: '',
  //       phone: '',
  //       destination: '',
  //       departureDate: '',
  //       returnDate: '',
  //       travelers: 1,
  //       budgetRange: '',
  //       travelAgency: '',
  //       travelType: '',
  //       specialRequests: ''
  //     });
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setSubmitStatus('error');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle'); // Reset the submit status before sending the request

    try {
      // Construct the request body to match the API endpoint
      const requestBody = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        departure_date: formData.departureDate,
        return_date: formData.returnDate,
        travelers: formData.travelers,
        budget_range: formData.budgetRange,
        travel_agency: formData.travelAgency,
        travel_type: formData.travelType,
        special_requests: formData.specialRequests,
      };


      // Make a POST request to the Django API
      const response = await fetch('http://127.0.0.1:8000/api/travel-inquiries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add CSRF token if necessary for Django's CSRF protection
          // 'X-CSRFToken': getCookie('csrftoken'), // Uncomment if using CSRF
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // If submission is successful, update the status and reset the form
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        travelers: 1,
        budgetRange: '',
        travelAgency: '',
        travelType: '',
        specialRequests: '',
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error'); // Show error message on failure
    } finally {
      setIsSubmitting(false); // Reset the submitting state
    }
  };


  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white";
  const errorClasses = "border-red-300 focus:ring-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Travel Inquiry Form</h1>
                <p className="text-blue-100 mt-1">Plan your perfect journey with Travelingo</p>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 px-6 py-4 m-6 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Inquiry Submitted Successfully!</h3>
                  <p className="text-sm text-green-600">We'll get back to you within 24 hours with personalized recommendations.</p>
                </div>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 px-6 py-4 m-6 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-medium text-red-800">Submission Failed</h3>
                  <p className="text-sm text-red-600">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.firstName ? errorClasses : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.lastName ? errorClasses : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.email ? errorClasses : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.phone ? errorClasses : ''}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </motion.div>

            {/* Travel Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Travel Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${errors.destination ? errorClasses : ''}`}
                  placeholder="e.g., Paris, France or Multiple Cities"
                />
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.departureDate ? errorClasses : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.returnDate ? errorClasses : ''}`}
                    min={formData.departureDate || new Date().toISOString().split('T')[0]}
                  />
                  {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                  <input
                    type="number"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className={inputClasses}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.budgetRange ? errorClasses : ''}`}
                  >
                    <option value="">Select your budget range</option>
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {errors.budgetRange && <p className="text-red-500 text-sm mt-1">{errors.budgetRange}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Travel Type</label>
                  <select
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleInputChange}
                    className={`${inputClasses} ${errors.travelType ? errorClasses : ''}`}
                  >
                    <option value="">Select travel type</option>
                    {travelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.travelType && <p className="text-red-500 text-sm mt-1">{errors.travelType}</p>}
                </div>
              </div>
            </motion.div>

            {/* Travel Agency Selection */}
            {/* <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-800">Preferred Travel Agency</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Travel Agency</label>
                <select
                  name="travelAgency"
                  value={formData.travelAgency}
                  onChange={handleInputChange}
                  className={`${inputClasses} ${errors.travelAgency ? errorClasses : ''}`}
                >
                  <option value="">Choose your preferred travel agency</option>
                  {travelAgencies.map(agency => (
                    <option key={agency} value={agency}>{agency}</option>
                  ))}
                </select>
                {errors.travelAgency && <p className="text-red-500 text-sm mt-1">{errors.travelAgency}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Notes</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className={inputClasses}
                  placeholder="Any dietary requirements, accessibility needs, special occasions, or preferences..."
                />
              </div>
            </motion.div> */}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-6"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Travel Inquiry
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};