import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

type View = 'terms' | 'privacy';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <footer className="w-full mt-12 py-4">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Paddy Pest Predictor. Empowering farmers with AI.</p>
        {!isAuthenticated && (
          <div className="mt-2">
            <button onClick={() => onNavigate('terms')} className="px-2 font-medium text-gray-600 hover:text-green-700 transition-colors">
              Terms of Service
            </button>
            <span className="mx-1">|</span>
            <button onClick={() => onNavigate('privacy')} className="px-2 font-medium text-gray-600 hover:text-green-700 transition-colors">
              Privacy Policy
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;