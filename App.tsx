import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import PestPredictor from './components/PestPredictor';
import AdminDashboard from './components/AdminDashboard';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

type View = 'login' | 'register' | 'forgotPassword' | 'terms' | 'privacy';

const App: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState<View>('login');

  const renderAuthView = () => {
    switch (currentView) {
      case 'register':
        return <Register onSwitchView={() => setCurrentView('login')} />;
      case 'forgotPassword':
        return <ForgotPassword onSwitchView={() => setCurrentView('login')} />;
      case 'terms':
        return <TermsOfService onGoBack={() => setCurrentView('login')} />;
      case 'privacy':
        return <PrivacyPolicy onGoBack={() => setCurrentView('login')} />;
      case 'login':
      default:
        return <Login onSwitchToRegister={() => setCurrentView('register')} onSwitchToForgotPassword={() => setCurrentView('forgotPassword')} />;
    }
  };

  const renderAppContent = () => {
    if (!isAuthenticated || !user) {
      return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          {renderAuthView()}
        </main>
      );
    }

    if (user.role === 'admin') {
      return <AdminDashboard />;
    }
    
    return <PestPredictor />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50/50 font-sans">
      <Header />
      {renderAppContent()}
      <Footer onNavigate={(view) => setCurrentView(view)} />
    </div>
  );
};

export default App;