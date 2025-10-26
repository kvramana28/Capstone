import React from 'react';

interface TermsOfServiceProps {
    onNavigate: (path: string) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Terms of Service</h2>
                <div className="prose max-w-none text-gray-700">
                    <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
                    <p>Welcome to Paddy Pest Predictor! These terms and conditions outline the rules and regulations for the use of our application.</p>
                    
                    <h4>1. Acceptance of Terms</h4>
                    <p>By accessing this application, we assume you accept these terms and conditions. Do not continue to use Paddy Pest Predictor if you do not agree to all of the terms and conditions stated on this page.</p>
                    
                    <h4>2. License to Use</h4>
                    <p>Unless otherwise stated, Paddy Pest Predictor and/or its licensors own the intellectual property rights for all material on the app. You may access this from Paddy Pest Predictor for your own personal use subjected to restrictions set in these terms and conditions.</p>
                    <p>You must not:</p>
                    <ul>
                        <li>Republish material from Paddy Pest Predictor</li>
                        <li>Sell, rent or sub-license material from Paddy Pest Predictor</li>
                        <li>Reproduce, duplicate or copy material from Paddy Pest Predictor</li>
                    </ul>

                    <h4>3. User Content</h4>
                    <p>Our application allows you to upload images ("User Content"). You are solely responsible for the User Content that you post. By posting User Content, you grant us a non-exclusive, royalty-free license to use, modify, and display such content in connection with the service.</p>

                    <h4>4. Disclaimer</h4>
                    <p>The predictions and recommendations provided by this application are based on AI models and should be used for informational purposes only. We do not guarantee the accuracy of the predictions. Farmers should consult with agricultural experts before making any significant decisions based on the app's output.</p>
                </div>
                <div className="text-center mt-8">
                    <button onClick={() => onNavigate('/')} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                        Back
                    </button>
                </div>
            </div>
        </main>
    );
};

export default TermsOfService;
