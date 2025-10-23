import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            Paddy Pest Predictor
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI-Powered Crop Protection</p>
        </div>
        {isAuthenticated && user && (
          <div className="text-right">
            <p className="text-gray-700">Welcome, <span className="font-semibold">{user.role === 'admin' ? 'Admin' : 'Farmer'}</span>!</p>
            <button
              onClick={logout}
              className="mt-1 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
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