import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';

interface ForgotPasswordProps {
  onSwitchView: () => void;
}

type Step = 'enterMobile' | 'enterOtp' | 'resetPassword' | 'success';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchView }) => {
  const [step, setStep] = useState<Step>('enterMobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { findUserByMobile, resetPassword } = useContext(AuthContext);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const userExists = await findUserByMobile(mobile);
    setIsLoading(false);
    if (userExists) {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setMockOtp(generatedOtp);
      // In a real app, you would send the OTP via an SMS service here.
      // For this mockup, we'll log it to the console and show it in a message.
      console.log(`Generated OTP for ${mobile}: ${generatedOtp}`);
      setMessage(`An OTP has been sent to your mobile (Mock OTP: ${generatedOtp})`);
      setStep('enterOtp');
    } else {
      setMessage('No user found with this mobile number.');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (otp === mockOtp) {
      setStep('resetPassword');
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (newPassword.length < 8) {
        setMessage('Password must be at least 8 characters long.');
        return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const success = await resetPassword(mobile, newPassword);
    setIsLoading(false);

    if (success) {
      setMessage('Password has been reset successfully!');
      setStep('success');
      setTimeout(() => onSwitchView(), 2000);
    } else {
      setMessage('An error occurred. Could not reset password.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'enterMobile':
        return (
          <form onSubmit={handleMobileSubmit}>
            <p className="text-center text-gray-600 mb-4">Enter your mobile number to receive a verification code.</p>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="input-style mb-4" placeholder="Mobile Number" required />
            <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? <Spinner /> : 'Send OTP'}</button>
          </form>
        );
      case 'enterOtp':
        return (
          <form onSubmit={handleOtpSubmit}>
            <p className="text-center text-gray-600 mb-4">Enter the 4-digit code sent to your phone.</p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-style mb-4" placeholder="Enter OTP" required />
            <button type="submit" className="btn-primary w-full">Verify OTP</button>
          </form>
        );
      case 'resetPassword':
        return (
          <form onSubmit={handlePasswordReset}>
            <p className="text-center text-gray-600 mb-4">Enter your new password.</p>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-style mb-4" placeholder="New Password" required />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-style mb-4" placeholder="Confirm New Password" required />
            <button type="submit" disabled={isLoading} className="btn-primary w-full">{isLoading ? <Spinner /> : 'Reset Password'}</button>
          </form>
        );
       case 'success':
        return <p className="text-center text-green-600 font-bold">{message}</p>;
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Forgot Password</h2>
      {message && <p className={`text-center text-sm mb-4 ${step === 'success' || step === 'enterOtp' ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
      {renderStep()}
       <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{' '}
          <button onClick={onSwitchView} className="font-bold text-green-600 hover:text-green-800">
            Back to Login
          </button>
        </p>
      <style>{`
        .input-style { box-shadow: none; appearance: none; border: 1px solid #e2e8f0; border-radius: 0.5rem; width: 100%; padding: 0.75rem 1rem; color: #4a5568; }
        .input-style:focus { outline: none; box-shadow: 0 0 0 2px #48bb78; }
        .btn-primary { padding: 0.75rem 2rem; background-color: #38a169; color: white; font-weight: bold; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #2f855a; }
        .btn-primary:disabled { background-color: #a0aec0; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;