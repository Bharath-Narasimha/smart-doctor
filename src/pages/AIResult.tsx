import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, User, MessageCircle, Calendar } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import AIResultCard from '../components/AIResultCard'

const AIResult: React.FC = () => {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const result = {
    disease: "Pneumonia",
    confidence: 87,
    severity: "medium",
    isSerious: true,
    isCurable: true,
    specialist: "Pulmonologist",
    recommendations: [
      "Immediate consultation with a pulmonologist recommended",
      "Complete the prescribed antibiotic course",
      "Rest and maintain proper hydration",
      "Monitor oxygen levels regularly"
    ]
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mobile-container">
      <AppHeader />
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            AI Analysis Result
          </h1>
        </div>

        {/* Main Result Card */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {result.disease}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                  {result.severity.toUpperCase()} SEVERITY
                </span>
                <span className="text-sm text-gray-600">
                  {result.confidence}% confidence
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Quick Assessment */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">
                {result.isSerious ? 'Serious' : 'Not Serious'}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">
                {result.isCurable ? 'Curable' : 'Chronic'}
              </p>
            </div>
          </div>

          {/* Specialist Recommendation */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Recommended Specialist
                </p>
                <p className="text-blue-600 font-semibold">{result.specialist}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3">
          {/* Recommendations Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <button
              onClick={() => toggleSection('recommendations')}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">Recommendations</span>
              <Clock className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.includes('recommendations') ? 'rotate-180' : ''
              }`} />
            </button>
            {expandedSections.includes('recommendations') && (
              <div className="px-4 pb-4">
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Treatment Plan Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <button
              onClick={() => toggleSection('treatment')}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">Treatment Plan</span>
              <Clock className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSections.includes('treatment') ? 'rotate-180' : ''
              }`} />
            </button>
            {expandedSections.includes('treatment') && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">Immediate Actions</h5>
                    <p className="text-sm text-green-700">Schedule appointment with pulmonologist within 48 hours</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Medications</h5>
                    <p className="text-sm text-blue-700">Complete prescribed antibiotic course as directed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/chat-report')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with AI about this report</span>
          </button>
          <button 
            onClick={() => navigate('/doctors')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Find and Book Specialist</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIResult 