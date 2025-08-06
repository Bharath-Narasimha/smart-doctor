import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Image, X, Brain, Loader } from 'lucide-react'
import OCRService, { MedicalParameters } from '../services/OCRService'
import MLModelService, { HealthAnalysis } from '../services/MLModelService'
import AIAnalysis from './AIAnalysis'

const ReportUpload: React.FC = () => {
  const navigate = useNavigate()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedParameters, setExtractedParameters] = useState<MedicalParameters | null>(null)
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mlService, setMlService] = useState<MLModelService | null>(null)

  useEffect(() => {
    const initializeMLService = async () => {
      try {
        console.log('Initializing ML service...')
        const service = MLModelService.getInstance()
        await service.initializeModels()
        setMlService(service)
        console.log('ML service initialized successfully')
      } catch (error) {
        console.error('Failed to initialize ML service:', error)
        // Don't set error immediately, try to continue with basic functionality
        console.log('Continuing without ML models...')
        setMlService(MLModelService.getInstance()) // Still set the service instance
      }
    }

    initializeMLService()
  }, [])

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles(prev => [...prev, ...newFiles])
      setError(null)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setExtractedParameters(null)
    setHealthAnalysis(null)
    setError(null)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-600" />
    }
    return <FileText className="w-6 h-6 text-blue-600" />
  }

  const analyzeReport = async () => {
    if (uploadedFiles.length === 0 || !mlService) {
      console.log('Cannot analyze: files=', uploadedFiles.length, 'mlService=', !!mlService)
      return
    }

    setIsProcessing(true)
    setError(null)
    setExtractedParameters(null)
    setHealthAnalysis(null)

    try {
      // Process the first uploaded file
      const file = uploadedFiles[0]
      console.log('File to process:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      const ocrService = OCRService.getInstance()
      
      console.log('Starting OCR processing for file:', file.name)
      const parameters = await ocrService.extractMedicalParameters(file)
      setExtractedParameters(parameters)
      
      console.log('Extracted parameters:', parameters)
      console.log('Number of extracted parameters:', Object.keys(parameters).filter(key => key !== 'rawText' && parameters[key as keyof MedicalParameters] !== undefined).length)
      
      // Analyze health using ML models
      console.log('Starting ML analysis...')
      const analysis = await mlService.analyzeHealth(parameters)
      setHealthAnalysis(analysis)
      
      console.log('Health analysis completed:', analysis)
      
      // Navigate to AI result page with the analysis data
      console.log('Navigating to AI result page...')
      navigate('/ai-result', { 
        state: { 
          analysis: analysis, 
          parameters: parameters 
        } 
      })
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(`Failed to analyze the report: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the image is clear and try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const canAnalyze = uploadedFiles.length > 0 && !isProcessing && mlService

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Medical Report
        </h3>
        <p className="text-sm text-gray-600">
          Upload X-ray, CT, blood report (PDF/JPG/PNG) for AI-powered analysis
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFileUpload(e.dataTransfer.files)
        }}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <label className="text-blue-600 cursor-pointer">
            browse
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">
          Supports PDF, JPG, PNG up to 10MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-red-500"
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analyze Button */}
      <button
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center ${
          canAnalyze
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={analyzeReport}
        disabled={!canAnalyze}
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Report...
          </>
        ) : (
          <>
            <Brain className="w-5 h-5 mr-2" />
            Analyze Report with AI
          </>
        )}
      </button>

      {/* AI Analysis Results */}
      {isProcessing && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Your Report
            </h3>
            <p className="text-sm text-gray-600">
              Our AI is extracting medical parameters and analyzing your health data...
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {healthAnalysis && extractedParameters && !isProcessing && (
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold gradient-text mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2" />
              AI Health Analysis Results
            </h3>
            <AIAnalysis 
              analysis={healthAnalysis} 
              parameters={extractedParameters}
            />
          </div>
        </div>
      )}

      {/* Processing Steps Info */}
      {!isProcessing && !healthAnalysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">What happens during analysis?</h4>
          <ul className="space-y-2 text-xs text-blue-800">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
              <span>OCR technology extracts medical parameters from your report</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
              <span>AI models analyze risk for heart disease, diabetes, liver, and kidney conditions</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
              <span>Personalized recommendations and next steps are generated</span>
            </li>
          </ul>
          
          {/* Debug Info */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>ML Service: {mlService ? '✅ Ready' : '❌ Not Ready'}</p>
            <p>Files Uploaded: {uploadedFiles.length}</p>
            <p>Can Analyze: {canAnalyze ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportUpload 