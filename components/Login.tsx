import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Spinner from './Spinner';

interface LoginProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Spinner /> : 'Log In'}
          </button>
        </div>
      </form>
      <div className="text-center mt-6">
        <button onClick={onSwitchToForgotPassword} className="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800">
          Forgot Password?
        </button>
      </div>
       <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-bold text-green-600 hover:text-green-800">
            Register here
          </button>
        </p>
    </div>
  );
};

export default Login;