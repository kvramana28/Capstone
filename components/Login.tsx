import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

interface LoginProps {
    onNavigate: (path: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user) {
                onNavigate('/');
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Welcome Back</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={loading} className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <a href="/forgot_password" onClick={(e) => { e.preventDefault(); onNavigate('/forgot_password'); }} className="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800">
                        Forgot Password?
                    </a>
                </div>
                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account?
                    <a href="/register" onClick={(e) => { e.preventDefault(); onNavigate('/register'); }} className="font-bold text-green-600 hover:text-green-800">
                        Register here
                    </a>
                </p>
            </div>
        </main>
    );
};

export default Login;
