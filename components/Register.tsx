import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

interface RegisterProps {
    onNavigate: (path: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        const result = await register(email, mobile, password);
        setLoading(false);

        if (result.success) {
            setMessage(result.message);
            setTimeout(() => onNavigate('/login'), 2000); // Redirect after a delay
        } else {
            setError(result.message);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Create Farmer Account</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
                {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-style" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">Mobile Number</label>
                        <input id="mobile" name="mobile" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="input-style" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-style" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-style" required />
                    </div>

                    <div className="flex items-center justify-center">
                        <button type="submit" disabled={loading} className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?
                    <a href="/login" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }} className="font-bold text-green-600 hover:text-green-800">
                        Log In
                    </a>
                </p>
            </div>
            <style>{`.input-style { box-shadow: none; appearance: none; border: 1px solid #e2e8f0; border-radius: 0.5rem; width: 100%; padding: 0.75rem 1rem; color: #4a5568; line-height: 1.25; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #48bb78; }`}</style>
        </main>
    );
};

export default Register;
