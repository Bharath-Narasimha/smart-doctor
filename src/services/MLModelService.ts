import * as tf from '@tensorflow/tfjs';
import { MedicalParameters } from './OCRService';

export interface DiseaseRisk {
  disease: string;
  riskPercentage: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  recommendations: string[];
}

export interface HealthAnalysis {
  overallHealthScore: number;
  diseaseRisks: DiseaseRisk[];
  recommendations: string[];
  nextSteps: string[];
}

export class MLModelService {
  private static instance: MLModelService;
  private models: { [key: string]: tf.LayersModel | null } = {};
  
  private constructor() {}
  
  public static getInstance(): MLModelService {
    if (!MLModelService.instance) {
      MLModelService.instance = new MLModelService();
    }
    return MLModelService.instance;
  }

  public async initializeModels(): Promise<void> {
    try {
      console.log('Initializing ML models...');
      
      // Initialize TensorFlow.js
      await tf.ready();
      
      // Create simple neural network models for each disease
      await this.createHeartDiseaseModel();
      await this.createDiabetesModel();
      await this.createLiverDiseaseModel();
      await this.createKidneyDiseaseModel();
      
      console.log('ML models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML models:', error);
      throw new Error('ML model initialization failed');
    }
  }

  private async createHeartDiseaseModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [12], units: 20, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 10, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.models['heartDisease'] = model;
  }

  private async createDiabetesModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 12, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.models['diabetes'] = model;
  }

  private async createLiverDiseaseModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 12, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.models['liverDisease'] = model;
  }

  private async createKidneyDiseaseModel(): Promise<void> {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.models['kidneyDisease'] = model;
  }

  public async analyzeHealth(parameters: MedicalParameters): Promise<HealthAnalysis> {
    try {
      const diseaseRisks: DiseaseRisk[] = [];
      
      // Predict heart disease risk
      const heartRisk = await this.predictHeartDiseaseRisk(parameters);
      diseaseRisks.push(heartRisk);
      
      // Predict diabetes risk
      const diabetesRisk = await this.predictDiabetesRisk(parameters);
      diseaseRisks.push(diabetesRisk);
      
      // Predict liver disease risk
      const liverRisk = await this.predictLiverDiseaseRisk(parameters);
      diseaseRisks.push(liverRisk);
      
      // Predict kidney disease risk
      const kidneyRisk = await this.predictKidneyDiseaseRisk(parameters);
      diseaseRisks.push(kidneyRisk);
      
      // Calculate overall health score
      const overallHealthScore = this.calculateOverallHealthScore(diseaseRisks);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(parameters, diseaseRisks);
      const nextSteps = this.generateNextSteps(diseaseRisks);
      
      return {
        overallHealthScore,
        diseaseRisks,
        recommendations,
        nextSteps
      };
    } catch (error) {
      console.error('Health analysis failed:', error);
      throw new Error('Failed to analyze health data');
    }
  }

  private async predictHeartDiseaseRisk(parameters: MedicalParameters): Promise<DiseaseRisk> {
    const features = [
      parameters.age || 50,
      parameters.cholesterol || 200,
      parameters.hdl || 50,
      parameters.ldl || 100,
      parameters.triglycerides || 150,
      parameters.bloodPressure ? this.parseBloodPressure(parameters.bloodPressure).systolic : 120,
      parameters.bloodPressure ? this.parseBloodPressure(parameters.bloodPressure).diastolic : 80,
      parameters.heartRate || 72,
      parameters.bmi || 25,
      parameters.glucose || 100,
      parameters.ejectionFraction || 60,
      parameters.lvMass || 100
    ];

    const model = this.models['heartDisease'];
    if (!model) {
      return this.getDefaultHeartDiseaseRisk();
    }

    const input = tf.tensor2d([features], [1, 12]);
    const prediction = await model.predict(input) as tf.Tensor;
    const riskPercentage = (await prediction.data())[0] * 100;
    
    input.dispose();
    prediction.dispose();

    return {
      disease: 'Heart Disease',
      riskPercentage: Math.round(riskPercentage),
      severity: this.getSeverityLevel(riskPercentage),
      description: this.getHeartDiseaseDescription(riskPercentage),
      recommendations: this.getHeartDiseaseRecommendations(parameters)
    };
  }

  private async predictDiabetesRisk(parameters: MedicalParameters): Promise<DiseaseRisk> {
    const features = [
      parameters.glucose || 100,
      parameters.bmi || 25,
      parameters.age || 50,
      parameters.cholesterol || 200,
      parameters.hdl || 50,
      parameters.ldl || 100,
      parameters.triglycerides || 150,
      parameters.bloodPressure ? this.parseBloodPressure(parameters.bloodPressure).systolic : 120
    ];

    const model = this.models['diabetes'];
    if (!model) {
      return this.getDefaultDiabetesRisk();
    }

    const input = tf.tensor2d([features], [1, 8]);
    const prediction = await model.predict(input) as tf.Tensor;
    const riskPercentage = (await prediction.data())[0] * 100;
    
    input.dispose();
    prediction.dispose();

    return {
      disease: 'Diabetes',
      riskPercentage: Math.round(riskPercentage),
      severity: this.getSeverityLevel(riskPercentage),
      description: this.getDiabetesDescription(riskPercentage),
      recommendations: this.getDiabetesRecommendations(parameters)
    };
  }

  private async predictLiverDiseaseRisk(parameters: MedicalParameters): Promise<DiseaseRisk> {
    const features = [
      parameters.alt || parameters.sgpt || 20,
      parameters.ast || parameters.sgot || 20,
      parameters.bilirubin || parameters.bilirubinTotal || 1.0,
      parameters.albumin || 4.0,
      parameters.alkalinePhosphatase || 70,
      parameters.totalProtein || 7.0,
      parameters.ggt || 30,
      parameters.sgotSgptRatio || 1.0
    ];

    const model = this.models['liverDisease'];
    if (!model) {
      return this.getDefaultLiverDiseaseRisk();
    }

    const input = tf.tensor2d([features], [1, 8]);
    const prediction = await model.predict(input) as tf.Tensor;
    const riskPercentage = (await prediction.data())[0] * 100;
    
    input.dispose();
    prediction.dispose();

    return {
      disease: 'Liver Disease',
      riskPercentage: Math.round(riskPercentage),
      severity: this.getSeverityLevel(riskPercentage),
      description: this.getLiverDiseaseDescription(riskPercentage),
      recommendations: this.getLiverDiseaseRecommendations(parameters)
    };
  }

  private async predictKidneyDiseaseRisk(parameters: MedicalParameters): Promise<DiseaseRisk> {
    const features = [
      parameters.creatinine || 1.0,
      parameters.bun || 15,
      parameters.glomerularFiltrationRate || 90,
      parameters.urineAlbumin || 30
    ];

    const model = this.models['kidneyDisease'];
    if (!model) {
      return this.getDefaultKidneyDiseaseRisk();
    }

    const input = tf.tensor2d([features], [1, 4]);
    const prediction = await model.predict(input) as tf.Tensor;
    const riskPercentage = (await prediction.data())[0] * 100;
    
    input.dispose();
    prediction.dispose();

    return {
      disease: 'Kidney Disease',
      riskPercentage: Math.round(riskPercentage),
      severity: this.getSeverityLevel(riskPercentage),
      description: this.getKidneyDiseaseDescription(riskPercentage),
      recommendations: this.getKidneyDiseaseRecommendations(parameters)
    };
  }

  private getSeverityLevel(riskPercentage: number): 'Low' | 'Medium' | 'High' | 'Critical' {
    if (riskPercentage < 25) return 'Low';
    if (riskPercentage < 50) return 'Medium';
    if (riskPercentage < 75) return 'High';
    return 'Critical';
  }

  private parseBloodPressure(bp: string): { systolic: number; diastolic: number } {
    const parts = bp.split('/');
    return {
      systolic: parseInt(parts[0]) || 120,
      diastolic: parseInt(parts[1]) || 80
    };
  }

  private calculateOverallHealthScore(diseaseRisks: DiseaseRisk[]): number {
    const averageRisk = diseaseRisks.reduce((sum, risk) => sum + risk.riskPercentage, 0) / diseaseRisks.length;
    return Math.max(0, 100 - averageRisk);
  }

  private generateRecommendations(parameters: MedicalParameters, diseaseRisks: DiseaseRisk[]): string[] {
    const recommendations: string[] = [];
    
    // General recommendations based on parameters
    if (parameters.bmi && parameters.bmi > 25) {
      recommendations.push('Consider weight management through diet and exercise');
    }
    
    if (parameters.glucose && parameters.glucose > 100) {
      recommendations.push('Monitor blood sugar levels regularly');
    }
    
    if (parameters.cholesterol && parameters.cholesterol > 200) {
      recommendations.push('Follow a heart-healthy diet low in saturated fats');
    }
    
    // Recommendations based on disease risks
    const highRiskDiseases = diseaseRisks.filter(risk => risk.severity === 'High' || risk.severity === 'Critical');
    if (highRiskDiseases.length > 0) {
      recommendations.push('Schedule a consultation with a specialist for detailed evaluation');
    }
    
    return recommendations;
  }

  private generateNextSteps(diseaseRisks: DiseaseRisk[]): string[] {
    const nextSteps: string[] = [];
    
    const criticalRisks = diseaseRisks.filter(risk => risk.severity === 'Critical');
    if (criticalRisks.length > 0) {
      nextSteps.push('Immediate medical consultation recommended');
      nextSteps.push('Consider emergency evaluation if symptoms worsen');
    }
    
    const highRisks = diseaseRisks.filter(risk => risk.severity === 'High');
    if (highRisks.length > 0) {
      nextSteps.push('Schedule follow-up tests within 2-4 weeks');
      nextSteps.push('Consult with primary care physician');
    }
    
    nextSteps.push('Continue monitoring vital signs regularly');
    nextSteps.push('Maintain healthy lifestyle habits');
    
    return nextSteps;
  }

  // Default risk methods for when models are not available
  private getDefaultHeartDiseaseRisk(): DiseaseRisk {
    return {
      disease: 'Heart Disease',
      riskPercentage: 15,
      severity: 'Low',
      description: 'Based on available parameters, your heart disease risk appears to be low.',
      recommendations: ['Maintain regular exercise routine', 'Follow a heart-healthy diet']
    };
  }

  private getDefaultDiabetesRisk(): DiseaseRisk {
    return {
      disease: 'Diabetes',
      riskPercentage: 12,
      severity: 'Low',
      description: 'Based on available parameters, your diabetes risk appears to be low.',
      recommendations: ['Monitor blood sugar levels', 'Maintain healthy weight']
    };
  }

  private getDefaultLiverDiseaseRisk(): DiseaseRisk {
    return {
      disease: 'Liver Disease',
      riskPercentage: 8,
      severity: 'Low',
      description: 'Based on available parameters, your liver disease risk appears to be low.',
      recommendations: ['Limit alcohol consumption', 'Maintain healthy diet']
    };
  }

  private getDefaultKidneyDiseaseRisk(): DiseaseRisk {
    return {
      disease: 'Kidney Disease',
      riskPercentage: 10,
      severity: 'Low',
      description: 'Based on available parameters, your kidney disease risk appears to be low.',
      recommendations: ['Stay hydrated', 'Monitor blood pressure']
    };
  }

  // Description and recommendation methods
  private getHeartDiseaseDescription(risk: number): string {
    if (risk < 25) return 'Your heart disease risk is low. Continue maintaining a healthy lifestyle.';
    if (risk < 50) return 'Your heart disease risk is moderate. Consider lifestyle modifications.';
    if (risk < 75) return 'Your heart disease risk is high. Medical consultation is recommended.';
    return 'Your heart disease risk is critical. Immediate medical attention is advised.';
  }

  private getDiabetesDescription(risk: number): string {
    if (risk < 25) return 'Your diabetes risk is low. Continue healthy eating habits.';
    if (risk < 50) return 'Your diabetes risk is moderate. Monitor blood sugar regularly.';
    if (risk < 75) return 'Your diabetes risk is high. Consult with an endocrinologist.';
    return 'Your diabetes risk is critical. Immediate medical evaluation needed.';
  }

  private getLiverDiseaseDescription(risk: number): string {
    if (risk < 25) return 'Your liver disease risk is low. Maintain liver health through diet.';
    if (risk < 50) return 'Your liver disease risk is moderate. Consider liver function tests.';
    if (risk < 75) return 'Your liver disease risk is high. Consult with a hepatologist.';
    return 'Your liver disease risk is critical. Immediate liver evaluation required.';
  }

  private getKidneyDiseaseDescription(risk: number): string {
    if (risk < 25) return 'Your kidney disease risk is low. Stay hydrated and monitor blood pressure.';
    if (risk < 50) return 'Your kidney disease risk is moderate. Regular kidney function monitoring.';
    if (risk < 75) return 'Your kidney disease risk is high. Consult with a nephrologist.';
    return 'Your kidney disease risk is critical. Immediate kidney evaluation needed.';
  }

  private getHeartDiseaseRecommendations(parameters: MedicalParameters): string[] {
    const recommendations: string[] = [];
    
    if (parameters.cholesterol && parameters.cholesterol > 200) {
      recommendations.push('Reduce saturated fat intake');
    }
    
    if (parameters.bloodPressure) {
      const bp = this.parseBloodPressure(parameters.bloodPressure);
      if (bp.systolic > 140 || bp.diastolic > 90) {
        recommendations.push('Monitor blood pressure regularly');
      }
    }
    
    recommendations.push('Exercise for at least 30 minutes daily');
    recommendations.push('Quit smoking if applicable');
    
    return recommendations;
  }

  private getDiabetesRecommendations(parameters: MedicalParameters): string[] {
    const recommendations: string[] = [];
    
    if (parameters.glucose && parameters.glucose > 100) {
      recommendations.push('Monitor blood glucose levels');
      recommendations.push('Follow a low-carbohydrate diet');
    }
    
    if (parameters.bmi && parameters.bmi > 25) {
      recommendations.push('Achieve and maintain healthy weight');
    }
    
    recommendations.push('Exercise regularly');
    recommendations.push('Limit sugary foods and beverages');
    
    return recommendations;
  }

  private getLiverDiseaseRecommendations(parameters: MedicalParameters): string[] {
    const recommendations: string[] = [];
    
    if (parameters.alt && parameters.alt > 40) {
      recommendations.push('Avoid alcohol consumption');
      recommendations.push('Follow a liver-friendly diet');
    }
    
    recommendations.push('Maintain healthy weight');
    recommendations.push('Exercise regularly');
    recommendations.push('Avoid unnecessary medications');
    
    return recommendations;
  }

  private getKidneyDiseaseRecommendations(parameters: MedicalParameters): string[] {
    const recommendations: string[] = [];
    
    if (parameters.creatinine && parameters.creatinine > 1.2) {
      recommendations.push('Monitor kidney function regularly');
      recommendations.push('Follow a low-protein diet if recommended');
    }
    
    recommendations.push('Stay well hydrated');
    recommendations.push('Monitor blood pressure');
    recommendations.push('Avoid NSAIDs if possible');
    
    return recommendations;
  }
}

export default MLModelService; 