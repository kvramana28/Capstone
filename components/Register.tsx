import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';

interface RegisterProps {
  onSwitchView: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }
    
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    const result = await register(email, mobile, password);
    setIsLoading(false);
    
    setMessage(result.message);
    if(result.success) {
        setIsError(false);
        setTimeout(() => onSwitchView(), 2000);
    } else {
        setIsError(true);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Create Farmer Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-style" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">Mobile Number</label>
          <input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="input-style" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-style" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-style" required />
        </div>
        
        {message && <p className={`text-sm mb-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

        <div className="flex items-center justify-center">
          <button type="submit" disabled={isLoading} className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
            {isLoading ? <Spinner /> : 'Register'}
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{' '}
        <button onClick={onSwitchView} className="font-bold text-green-600 hover:text-green-800">
          Log In
        </button>
      </p>
      <style>{`.input-style { box-shadow: none; appearance: none; border: 1px solid #e2e8f0; border-radius: 0.5rem; width: 100%; padding: 0.75rem 1rem; color: #4a5568; line-height: 1.25; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #48bb78; }`}</style>
    </div>
  );
};

export default Register;
