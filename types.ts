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
  password?: string; // Password should not typically be stored on the frontend user object
  role: 'admin' | 'farmer';
}
