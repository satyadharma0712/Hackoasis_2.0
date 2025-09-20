import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Shield, RefreshCw, CheckCircle, Heart, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OTPVerificationProps {
  onBack: () => void;
  onVerified: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onBack, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { user, verifyUser } = useAuth();

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Auto-move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all fields are filled
    if (newOTP.every(digit => digit !== '') && newOTP.join('').length === 6) {
      setTimeout(() => handleVerification(newOTP.join('')), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOTP = pastedData.split('');
      setOtp(newOTP);
      inputRefs.current[5]?.focus();
      
      // Auto-verify after paste
      setTimeout(() => handleVerification(pastedData), 100);
    }
  };

  const handleVerification = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call for OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept any 6-digit OTP
      // In production, this would validate against the server
      if (otpToVerify.length === 6) {
        verifyUser();
        onVerified();
      } else {
        throw new Error('Invalid OTP');
      }
      
    } catch (error) {
      setError('Invalid OTP. Please check and try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset timer and state
      setTimeLeft(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      
      alert(`OTP resent successfully to +91 ${user?.phone}`);
      inputRefs.current[0]?.focus();
      
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-4 mb-4">
                <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Travelingo</h1>
              <p className="text-gray-600">Your multilingual travel companion</p>
            </div>
          </div>
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to
          </p>
          <p className="font-semibold text-gray-900">
            +91 {user?.phone}
          </p>
        </div>

        {/* OTP Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
              Enter OTP Code
            </label>
            
            {/* OTP Input Fields */}
            <div className="flex space-x-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${digit ? 'border-green-500 bg-green-50' : ''}`}
                  maxLength={1}
                  disabled={isLoading}
                />
              ))}
            </div>
            
            {error && (
              <p className="mt-4 text-sm text-red-600 text-center flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">!</span>
                {error}
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerification()}
            disabled={isLoading || otp.some(digit => digit === '')}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 mb-4 ${
              isLoading || otp.some(digit => digit === '')
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Verify OTP</span>
              </>
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 mx-auto disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Resend OTP</span>
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend in <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
              </p>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            disabled={isLoading}
            className="w-full mt-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Change Number</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Secure & Private</p>
              <p>Your phone number is verified securely and never shared with third parties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;