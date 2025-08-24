import React from 'react';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react';
import { DiseasePredictionResponse } from '../services/api';

interface DiseasePredictionResultProps {
  result: DiseasePredictionResponse;
  onBack: () => void;
}

const DiseasePredictionResult: React.FC<DiseasePredictionResultProps> = ({
  result,
  onBack
}) => {
  const getRiskColor = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'high risk':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium risk':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low risk':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high risk':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium risk':
        return <Activity className="w-5 h-5" />;
      case 'low risk':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getDiseaseIcon = (disease: string) => {
    if (disease.toLowerCase().includes('heart')) return <Heart className="w-6 h-6" />;
    return <Activity className="w-6 h-6" />;
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            {getDiseaseIcon(result.disease)}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {result.disease} Analysis
        </h2>
        <p className="text-gray-600">
          AI-powered disease prediction based on your medical report
        </p>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
          <div className={`px-3 py-1 rounded-full border ${getRiskColor(result.prediction)}`}>
            <div className="flex items-center space-x-2">
              {getRiskIcon(result.prediction)}
              <span className="font-medium">{result.prediction}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {result.risk_percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Risk Percentage</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {result.confidence.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Confidence</div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      {result.additional_info.risk_factors.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Factors</h3>
          </div>
          <div className="space-y-2">
            {result.additional_info.risk_factors.map((factor, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-800">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.additional_info.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="space-y-2">
            {result.additional_info.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-800">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Model Information</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Model Confidence</span>
            <span className="font-medium text-gray-900">
              {(result.additional_info.model_confidence * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Analysis Time</span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {formatTimestamp(result.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Important Disclaimer</p>
            <p>
              This AI prediction is for informational purposes only and should not replace 
              professional medical advice. Always consult with healthcare professionals for 
              medical decisions and treatment plans.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onBack}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors"
      >
        Analyze Another Report
      </button>
    </div>
  );
};

export default DiseasePredictionResult;
