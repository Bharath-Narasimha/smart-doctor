import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Image, X, ArrowLeft, CheckCircle, Brain } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { OCRService } from '../services/OCRService'
import { MLModelService } from '../services/MLModelService'
import { MedicalParameters } from '../services/OCRService'
import { HealthAnalysis } from '../services/MLModelService'

const UploadReport: React.FC = () => {
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mlService, setMlService] = useState<MLModelService | null>(null)

  // Initialize ML service on component mount
  useEffect(() => {
    const initializeML = async () => {
      try {
        console.log('Initializing ML service...')
        const service = MLModelService.getInstance()
        await service.initializeModels()
        setMlService(service)
        console.log('ML service initialized successfully')
      } catch (error) {
        console.error('Failed to initialize ML models:', error)
        console.log('Continuing without ML models...')
        setMlService(MLModelService.getInstance())
      }
    }
    initializeML()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0])
      setError(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedFile || !mlService) {
      setError('Please upload a file and ensure ML service is ready')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log('Starting analysis for file:', uploadedFile.name)
      
      // Extract medical parameters using OCR
      const parameters = await OCRService.getInstance().extractMedicalParameters(uploadedFile)
      console.log('Extracted parameters:', parameters)
      
      // Analyze health using ML models
      const analysis = await mlService.analyzeHealth(parameters)
      console.log('Health analysis:', analysis)
      
      // Navigate to AI result page with the analysis data
      console.log('Navigating to AI result page...')
      navigate('/ai-result', {
        state: {
          analysis,
          parameters
        }
      })
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(`Failed to analyze the report: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the image is clear and try again.`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
  }

  return (
    <div className="mobile-container">
      <AppHeader />
      <div className="px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="slide-in">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold gradient-text">
              Upload Medical Report
            </h1>
          </div>
        </div>

        {/* Enhanced Upload Area */}
        <div className="space-y-6">
          <div
            className={`premium-card p-10 text-center transition-all duration-500 ${
              dragActive 
                ? 'border-2 border-blue-500 bg-blue-50 scale-105' 
                : uploadedFile 
                  ? 'border-2 border-green-500 bg-green-50'
                  : 'border-2 border-dashed border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!uploadedFile ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto float-animation">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Upload your medical report
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Drag and drop your file here, or click to browse
                  </p>
                  <label className="btn-primary px-8 py-4 inline-block cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Images</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto scale-animation">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    File uploaded successfully!
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-900 mb-1">Analysis Error</h4>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Analysis Button */}
          {uploadedFile && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !mlService}
              className="w-full btn-primary py-5 px-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner w-6 h-6"></div>
                  <span>Analyzing Report...</span>
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" />
                  <span>Analyze Report</span>
                </>
              )}
            </button>
          )}

          {/* Debug Info */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <p>ML Service: {mlService ? 'Ready' : 'Loading...'}</p>
            <p>File: {uploadedFile ? uploadedFile.name : 'None'}</p>
            <p>Can Analyze: {uploadedFile && mlService ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Enhanced Instructions */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-blue-900 text-lg">
              What we can analyze:
            </h3>
          </div>
          <ul className="space-y-3">
            {[
              "Blood test results and lab reports",
              "X-ray and MRI images", 
              "Prescription documents",
              "Medical certificates",
              "Health insurance documents"
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-3 stagger-item">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-blue-800 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Features Preview */}
        <div className="premium-card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">AI Analysis Features</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Smart Diagnosis</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Instant Results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadReport 