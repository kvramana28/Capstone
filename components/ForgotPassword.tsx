import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

interface ForgotPasswordProps {
  onNavigate: (path: string) => void;
}

type Step = 'enterMobile' | 'enterOtp' | 'resetPassword';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const { findUserByMobile, resetUserPassword } = useAuth();
  const [step, setStep] = useState<Step>('enterMobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const user = await findUserByMobile(mobile);
    if (user) {
      setMessage("Use mock OTP '1234' to proceed.");
      setStep('enterOtp');
    } else {
      setError("No user found with this mobile number.");
    }
    setLoading(false);
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP check
      setStep('resetPassword');
      setMessage('');
      setError('');
    } else {
      setError("Invalid OTP.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError('');
    const success = await resetUserPassword(mobile, newPassword);
    if (success) {
      setMessage("Password reset successfully. Please log in.");
      setTimeout(() => onNavigate('/login'), 2000);
    } else {
      setError("Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Forgot Password</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">{message}</div>}

        {step === 'enterMobile' && (
          <form onSubmit={handleMobileSubmit}>
            <p className="text-center text-gray-600 mb-4">Enter your mobile number to receive a verification code.</p>
            <input type="tel" name="mobile" value={mobile} onChange={e => setMobile(e.target.value)} className="input-style mb-4" placeholder="Mobile Number" required />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        )}
        {step === 'enterOtp' && (
          <form onSubmit={handleOtpSubmit}>
            <p className="text-center text-gray-600 mb-4">Enter the 4-digit code sent to your phone.</p>
            <input type="text" name="otp" value={otp} onChange={e => setOtp(e.target.value)} className="input-style mb-4" placeholder="Enter OTP" required />
            <button type="submit" className="btn-primary w-full">Verify OTP</button>
          </form>
        )}
        {step === 'resetPassword' && (
          <form onSubmit={handleResetSubmit}>
            <p className="text-center text-gray-600 mb-4">Enter your new password.</p>
            <input type="password" name="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-style mb-4" placeholder="New Password" required />
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-style mb-4" placeholder="Confirm New Password" required />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?
          <a href="/login" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }} className="font-bold text-green-600 hover:text-green-800">
            Back to Login
          </a>
        </p>
      </div>
      <style>{`
        .input-style { box-shadow: none; appearance: none; border: 1px solid #e2e8f0; border-radius: 0.5rem; width: 100%; padding: 0.75rem 1rem; color: #4a5568; }
        .input-style:focus { outline: none; box-shadow: 0 0 0 2px #48bb78; }
        .btn-primary { padding: 0.75rem 2rem; background-color: #38a169; color: white; font-weight: bold; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: background-color 0.2s; }
        .btn-primary:hover { background-color: #2f855a; }
        .btn-primary:disabled { background-color: #a0aec0; cursor: not-allowed; }
      `}</style>
    </main>
  );
};

export default ForgotPassword;
