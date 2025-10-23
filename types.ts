export interface PredictionResult {
  pest_detected: string;
  confidence: string;
  description: string;
  recommended_action: string;
}

export interface User {
  id: string;
  email: string;
  mobile: string;
  password?: string; // Password should not be stored in client-side state long-term
  role: 'farmer' | 'admin';
}