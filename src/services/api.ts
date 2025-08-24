import axios from 'axios';

// Temporary CORS proxy to bypass CORS issues during development
const API_BASE_URL = 'http://localhost:8000';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export interface DiseasePredictionResponse {
  disease: string;
  risk_percentage: number;
  prediction: string;
  confidence: number;
  timestamp: string;
  additional_info: {
    risk_factors: string[];
    recommendations: string[];
    model_confidence: number;
  };
}

export interface HeartDiseaseParams {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface DiabetesParams {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
}

export interface KidneyDiseaseParams {
  age: number;
  bp: number;
  sg: number;
  al: number;
  su: number;
  rbc: string;
  pc: string;
  pcc: string;
  ba: string;
  bgr: number;
  bu: number;
  sc: number;
  sod: number;
  pot: number;
  hemo: number;
  pcv: number;
  wc: number;
  rc: number;
  htn: string;
  dm: string;
  cad: string;
  appet: string;
  pe: string;
  ane: string;
}

export interface LiverDiseaseParams {
  age: number;
  gender: string;
  total_bilirubin: number;
  direct_bilirubin: number;
  indirect_bilirubin?: number;
  alkaline_phosphotase: number;
  alamine_aminotransferase: number;
  aspartate_aminotransferase: number;
  sgot_sgpt_ratio?: number;
  ggt?: number;
  total_protiens: number;
  albumin: number;
  globulin?: number;
  albumin_and_globulin_ratio: number;
}

class DiseasePredictionAPI {
  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.data?.detail || error.message}`);
      }
      throw new Error('Network error occurred');
    }
  }

  async predictHeartDisease(params: HeartDiseaseParams): Promise<DiseasePredictionResponse> {
    return this.makeRequest<DiseasePredictionResponse>('/predict/heart', params);
  }

  async predictDiabetes(params: DiabetesParams): Promise<DiseasePredictionResponse> {
    return this.makeRequest<DiseasePredictionResponse>('/predict/diabetes', params);
  }

  async predictKidneyDisease(params: KidneyDiseaseParams): Promise<DiseasePredictionResponse> {
    return this.makeRequest<DiseasePredictionResponse>('/predict/kidney', params);
  }

  async predictLiverDisease(params: LiverDiseaseParams): Promise<DiseasePredictionResponse> {
    return this.makeRequest<DiseasePredictionResponse>('/predict/liver', params);
  }

  async checkHealth(): Promise<boolean> {
    try {
      // Try direct connection first
      const response = await axios.get(`${API_BASE_URL}/health`, { 
        timeout: 5000,
        // Add CORS headers for the request
        headers: {
          'Origin': 'http://localhost:5173'
        }
      });
      return response.status === 200;
    } catch (error) {
      console.log('Direct API connection failed, trying CORS proxy...');
      try {
        // Fallback to CORS proxy if direct connection fails
        const response = await axios.get(`${CORS_PROXY}${API_BASE_URL}/health`, { 
          timeout: 10000 
        });
        return response.status === 200;
      } catch (proxyError) {
        console.log('CORS proxy also failed:', proxyError);
        return false;
      }
    }
  }
}

export const diseasePredictionAPI = new DiseasePredictionAPI();
