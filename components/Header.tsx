import React from 'react';
import { useAuth } from '../AuthContext';

interface HeaderProps {
    onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onNavigate('/login');
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-green-800">
                        Paddy Pest Predictor
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">AI-Powered Crop Protection</p>
                </a>
                {user && (
                    <div className="text-right">
                        <p className="text-gray-700">Welcome, <span className="font-semibold">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>!</p>
                        <button
                            onClick={handleLogout}
                            className="mt-1 inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
