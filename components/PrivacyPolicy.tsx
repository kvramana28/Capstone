import React from 'react';

interface PrivacyPolicyProps {
  onGoBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onGoBack }) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Privacy Policy</h2>
      <div className="prose max-w-none text-gray-700">
        <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
        <p>Your privacy is important to us. It is Paddy Pest Predictor's policy to respect your privacy regarding any information we may collect from you across our application.</p>
        
        <h4>1. Information We Collect</h4>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We collect:</p>
        <ul>
            <li><strong>Account Information:</strong> When you register, we collect your email and mobile number.</li>
            <li><strong>Image Data:</strong> We collect the images you upload for the purpose of analysis. These images may be used to improve our AI model.</li>
        </ul>

        <h4>2. How We Use Your Information</h4>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our application</li>
          <li>Improve, personalize, and expand our application</li>
          <li>Understand and analyze how you use our application</li>
          <li>Develop new products, services, features, and functionality</li>
        </ul>

        <h4>3. Data Security</h4>
        <p>We are committed to protecting your data. We use a variety of security technologies and procedures to help protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.</p>

        <h4>4. Third-Party Services</h4>
        <p>We do not share your personally identifying information with third-parties, except to comply with the law or protect our rights.</p>
      </div>
      <div className="text-center mt-8">
        <button
          onClick={onGoBack}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          Back
        </button>
      </div>
       <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `}</style>
    </div>
  );
};

export default PrivacyPolicy;