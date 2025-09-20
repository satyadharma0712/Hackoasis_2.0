import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PhoneLogin from './PhoneLogin';
import OTPVerification from './OTPVerification';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<'login' | 'otp'>('login');

  const handleOTPSent = () => {
    setStep('otp');
  };

  const handleBackToLogin = () => {
    setStep('login');
  };

  const handleVerified = () => {
    // Authentication is handled in the context
    // The component will re-render with isAuthenticated: true
  };

  // Show authentication flow if user is not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {step === 'login' && (
          <PhoneLogin onOTPSent={handleOTPSent} />
        )}
        {step === 'otp' && user && (
          <OTPVerification 
            onBack={handleBackToLogin}
            onVerified={handleVerified}
          />
        )}
      </>
    );
  }

  // Show main application if user is authenticated
  return <>{children}</>;
};

export default AuthWrapper;