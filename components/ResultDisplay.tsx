import React from 'react';
// Fix: Correctly import the PredictionResult type from the updated types.ts file.
import type { PredictionResult } from '../types';

interface ResultDisplayProps {
  result: PredictionResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const isHealthy = result.pest_detected.toLowerCase() === 'healthy';

  const titleBgColor = isHealthy ? 'bg-green-100' : 'bg-orange-100';
  const titleTextColor = isHealthy ? 'text-green-800' : 'text-orange-800';
  const borderColor = isHealthy ? 'border-green-300' : 'border-orange-300';
  const icon = isHealthy ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  const formattedAction = (result.recommended_action || '')
    .split(/-\s/g)
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map((item, index) => (
      <li key={index} className="flex items-start space-x-3">
        <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{item}</span>
      </li>
    ));

  return (
    <div className={`bg-white rounded-2xl shadow-xl border ${borderColor} overflow-hidden animate-fade-in`}>
      <div className={`p-4 ${titleBgColor} flex items-center space-x-4`}>
        {icon}
        <div>
          <h2 className={`text-2xl font-bold ${titleTextColor}`}>
            {result.pest_detected}
          </h2>
          <p className={`font-semibold ${titleTextColor} opacity-80`}>
            Confidence: {result.confidence}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {result.description}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Recommended Actions</h3>
          <ul className="space-y-3 text-gray-600">
            {formattedAction}
          </ul>
        </div>
      </div>
    </div>
  );
};

const AnimationStyles = () => (
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `}</style>
)


const ResultDisplayWithAnimation: React.FC<ResultDisplayProps> = (props) => (
    <>
        <AnimationStyles />
        <ResultDisplay {...props} />
    </>
);

export default ResultDisplayWithAnimation;
