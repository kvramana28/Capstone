import React from 'react';
import { useAuth } from '../AuthContext';

interface FooterProps {
    onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { user } = useAuth();

    return (
        <footer className="w-full mt-auto py-4">
            <div className="container mx-auto text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Paddy Pest Predictor. Empowering farmers with AI.</p>
                {!user && (
                    <div className="mt-2">
                        <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('/terms'); }} className="px-2 font-medium text-gray-600 hover:text-green-700 transition-colors">
                            Terms of Service
                        </a>
                        <span className="mx-1">|</span>
                        <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('/privacy'); }} className="px-2 font-medium text-gray-600 hover:text-green-700 transition-colors">
                            Privacy Policy
                        </a>
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;
