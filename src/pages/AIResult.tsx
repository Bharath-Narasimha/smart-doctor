import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Download, Share2, Heart, TrendingUp, AlertTriangle, User, MessageCircle, Calendar } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import AIAnalysis from '../components/AIAnalysis'
import { HealthAnalysis } from '../services/MLModelService'
import { MedicalParameters } from '../services/OCRService'

interface LocationState {
  analysis: HealthAnalysis
  parameters: MedicalParameters
}

const AIResult: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null)
  const [parameters, setParameters] = useState<MedicalParameters | null>(null)

  useEffect(() => {
    const state = location.state as LocationState
    if (state?.analysis && state?.parameters) {
      setAnalysis(state.analysis)
      setParameters(state.parameters)
    } else {
      // If no data, redirect back to upload
      navigate('/upload')
    }
  }, [location, navigate])

  const handleDownload = () => {
    if (!analysis || !parameters) return

    const reportData = {
      timestamp: new Date().toISOString(),
      overallHealthScore: analysis.overallHealthScore,
      diseaseRisks: analysis.diseaseRisks,
      recommendations: analysis.recommendations,
      nextSteps: analysis.nextSteps,
      extractedParameters: parameters
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Health Analysis Results',
          text: `My overall health score is ${analysis?.overallHealthScore}%. Check out my detailed health analysis!`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (!analysis || !parameters) {
    return (
      <div className="mobile-container">
        <AppHeader />
        <div className="px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analysis results...</p>
          </div>
        </div>
      </div>
    )
  }

  const criticalRisks = analysis.diseaseRisks.filter(risk => risk.severity === 'Critical')
  const highRisks = analysis.diseaseRisks.filter(risk => risk.severity === 'High')

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <div className="px-6 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/upload')}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold gradient-text">Health Analysis</h1>
          <div className="flex space-x-1">
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-600 hover:text-blue-600"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-gray-600 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Alerts */}
        {criticalRisks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-medium text-red-900 mb-1">Critical Alert</h4>
                <p className="text-xs text-red-800">
                  {criticalRisks.length} condition{criticalRisks.length > 1 ? 's' : ''} require{criticalRisks.length > 1 ? '' : 's'} immediate attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {highRisks.length > 0 && criticalRisks.length === 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-medium text-orange-900 mb-1">High Risk Alert</h4>
                <p className="text-xs text-orange-800">
                  {highRisks.length} condition{highRisks.length > 1 ? 's' : ''} show{highRisks.length > 1 ? '' : 's'} elevated risk levels.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Component */}
        <AIAnalysis 
          analysis={analysis} 
          parameters={parameters}
        />

        {/* Simplified Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/doctors')}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <User className="w-4 h-4 mr-2" />
            Find a Doctor
          </button>
          
          <button
            onClick={() => navigate('/symptoms')}
            className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Symptom Advice
          </button>
        </div>

        {/* Compact Information */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-xs font-medium text-gray-900 mb-2">About This Analysis</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• AI-powered analysis based on medical data</p>
            <p>• Risk estimates for informational purposes only</p>
            <p>• Always consult healthcare professionals</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIResult 