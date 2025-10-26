import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import PestPredictor from './components/PestPredictor';
import AdminDashboard from './components/AdminDashboard';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

const AppRouter: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  if (loading) {
    return (
      <div className="flex-grow container mx-auto p-8 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Public routes
  if (path === '/terms') return <TermsOfService onNavigate={onNavigate} />;
  if (path === '/privacy') return <PrivacyPolicy onNavigate={onNavigate} />;

  // Auth routes
  if (!user) {
    if (path === '/register') return <Register onNavigate={onNavigate} />;
    if (path.startsWith('/forgot_password')) return <ForgotPassword onNavigate={onNavigate} />;
    return <Login onNavigate={onNavigate} />;
  }

  // Protected routes
  if (user.role === 'admin') {
    if (path === '/admin') {
      return <AdminDashboard />;
    }
  }
  
  // Default to predictor for farmers, or admin
  if (path === '/' || path === '/admin') {
    return user.role === 'admin' ? <AdminDashboard /> : <PestPredictor />;
  }

  return <PestPredictor />;
};

const App: React.FC = () => {
  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Header onNavigate={handleNavigate} />
        <AppRouter onNavigate={handleNavigate} />
        <Footer onNavigate={handleNavigate}/>
      </div>
    </AuthProvider>
  );
};

export default App;
