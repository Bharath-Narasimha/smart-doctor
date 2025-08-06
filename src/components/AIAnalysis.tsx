import React, { useState } from 'react';
import { Heart, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { HealthAnalysis, DiseaseRisk } from '../services/MLModelService';
import { MedicalParameters } from '../services/OCRService';

interface AIAnalysisProps {
  analysis: HealthAnalysis;
  parameters: MedicalParameters;
  isLoading?: boolean;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis, parameters, isLoading = false }) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    healthScore: true,
    diseaseRisks: true,
    parameters: false,
    recommendations: false,
    nextSteps: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      case 'Critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Analyzing Your Health Data
          </h3>
          <p className="text-xs text-gray-600">
            Our AI is processing your medical report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Health Score - Always visible */}
      <div className="premium-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold gradient-text">Overall Health Score</h3>
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${getHealthScoreColor(analysis.overallHealthScore)} mb-2`}>
            {analysis.overallHealthScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                analysis.overallHealthScore >= 80 ? 'bg-green-500' :
                analysis.overallHealthScore >= 60 ? 'bg-yellow-500' :
                analysis.overallHealthScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${analysis.overallHealthScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600">
            {analysis.overallHealthScore >= 80 ? 'Excellent health status' :
             analysis.overallHealthScore >= 60 ? 'Good health with room for improvement' :
             analysis.overallHealthScore >= 40 ? 'Moderate health concerns detected' : 'Health attention required'}
          </p>
        </div>
      </div>

      {/* Disease Risk Analysis - Collapsible */}
      <div className="premium-card p-4">
        <button 
          onClick={() => toggleSection('diseaseRisks')}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="text-base font-bold gradient-text flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Disease Risk Analysis
          </h3>
          {expandedSections.diseaseRisks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expandedSections.diseaseRisks && (
          <div className="space-y-3">
            {analysis.diseaseRisks.map((risk, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900">{risk.disease}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getSeverityColor(risk.severity)}`}>
                    {getSeverityIcon(risk.severity)}
                    <span className="ml-1">{risk.severity}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl font-bold text-gray-900">{risk.riskPercentage}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        risk.severity === 'Low' ? 'bg-green-500' :
                        risk.severity === 'Medium' ? 'bg-yellow-500' :
                        risk.severity === 'High' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${risk.riskPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{risk.description}</p>
                
                {risk.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-gray-900">Key Recommendations:</h5>
                    <ul className="space-y-1">
                      {risk.recommendations.slice(0, 2).map((rec, recIndex) => (
                        <li key={recIndex} className="text-xs text-gray-600 flex items-start">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extracted Parameters - Collapsible */}
      {Object.keys(parameters).length > 1 && (
        <div className="premium-card p-4">
          <button 
            onClick={() => toggleSection('parameters')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-base font-bold gradient-text">Extracted Parameters</h3>
            {expandedSections.parameters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSections.parameters && (
            <div className="grid grid-cols-3 gap-3">
              {parameters.glucose && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.glucose}</div>
                  <div className="text-xs text-gray-600">Glucose</div>
                </div>
              )}
              {parameters.cholesterol && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.cholesterol}</div>
                  <div className="text-xs text-gray-600">Cholesterol</div>
                </div>
              )}
              {parameters.hdl && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.hdl}</div>
                  <div className="text-xs text-gray-600">HDL</div>
                </div>
              )}
              {parameters.ldl && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.ldl}</div>
                  <div className="text-xs text-gray-600">LDL</div>
                </div>
              )}
              {parameters.creatinine && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.creatinine}</div>
                  <div className="text-xs text-gray-600">Creatinine</div>
                </div>
              )}
              {parameters.bmi && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.bmi}</div>
                  <div className="text-xs text-gray-600">BMI</div>
                </div>
              )}
              {parameters.sgpt && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.sgpt}</div>
                  <div className="text-xs text-gray-600">SGPT</div>
                </div>
              )}
              {parameters.sgot && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.sgot}</div>
                  <div className="text-xs text-gray-600">SGOT</div>
                </div>
              )}
              {parameters.bilirubinTotal && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.bilirubinTotal}</div>
                  <div className="text-xs text-gray-600">Bilirubin</div>
                </div>
              )}
              {parameters.ejectionFraction && (
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{parameters.ejectionFraction}%</div>
                  <div className="text-xs text-gray-600">EF</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* General Recommendations - Collapsible */}
      {analysis.recommendations.length > 0 && (
        <div className="premium-card p-4">
          <button 
            onClick={() => toggleSection('recommendations')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-base font-bold gradient-text">General Recommendations</h3>
            {expandedSections.recommendations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSections.recommendations && (
            <ul className="space-y-2">
              {analysis.recommendations.slice(0, 5).map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="text-xs text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Next Steps - Collapsible */}
      {analysis.nextSteps.length > 0 && (
        <div className="premium-card p-4">
          <button 
            onClick={() => toggleSection('nextSteps')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-base font-bold gradient-text">Next Steps</h3>
            {expandedSections.nextSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSections.nextSteps && (
            <ul className="space-y-2">
              {analysis.nextSteps.slice(0, 3).map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="text-xs text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Compact Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <AlertTriangle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-blue-900 mb-1">Important Disclaimer</h4>
            <p className="text-xs text-blue-800">
              This AI analysis is for informational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis; 