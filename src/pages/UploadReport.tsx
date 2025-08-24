import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, ArrowLeft, CheckCircle, AlertCircle, Loader2, Brain } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import ExtractedValuesForm from '../components/ExtractedValuesForm';
import DiseasePredictionResult from '../components/DiseasePredictionResult';
import { reportScanner, ExtractedValues } from '../services/reportScanner';
import { diseasePredictionAPI, DiseasePredictionResponse } from '../services/api';

type ReportState = 'upload' | 'scanning' | 'extracted' | 'analyzing' | 'result' | 'error';

const UploadReport: React.FC = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<ReportState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedValues | null>(null);
  const [predictionResult, setPredictionResult] = useState<DiseasePredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setCurrentState('scanning');
    
    try {
      // Check API health first
      const isHealthy = await diseasePredictionAPI.checkHealth();
      setApiHealth(isHealthy);
      
      if (!isHealthy) {
        throw new Error('Disease prediction API is not available. Please ensure the API service is running.');
      }

      // Scan the report
      const scanResult = await reportScanner.scanReport(selectedFile);
      
      if (!scanResult.success) {
        throw new Error(scanResult.error || 'Failed to scan report');
      }
      
      setExtractedData(scanResult.data!);
      setCurrentState('extracted');
      
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process report');
      setCurrentState('error');
    }
  };

  const handleAnalyzeReport = async (values: Record<string, any>) => {
    if (!extractedData) return;
    
    setCurrentState('analyzing');
    
    try {
      let result: DiseasePredictionResponse;
      
      switch (extractedData.reportType) {
        case 'heart':
          result = await diseasePredictionAPI.predictHeartDisease(values as any);
          break;
        case 'diabetes':
          result = await diseasePredictionAPI.predictDiabetes(values as any);
          break;
        case 'kidney':
          result = await diseasePredictionAPI.predictKidneyDisease(values as any);
          break;
        case 'liver':
          result = await diseasePredictionAPI.predictLiverDisease(values as any);
          break;
        default:
          throw new Error('Unsupported report type');
      }
      
      setPredictionResult(result);
      setCurrentState('result');
      
    } catch (error) {
      console.log('API Error details:', error);
      
      let errorMsg = 'Failed to analyze report';
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Handle API error objects
        const errorObj = error as any;
        if (errorObj.response?.data) {
          errorMsg = `API Error: ${JSON.stringify(errorObj.response.data, null, 2)}`;
        } else {
          errorMsg = `API Error: ${JSON.stringify(error, null, 2)}`;
        }
      }
      
      setErrorMessage(errorMsg);
      setCurrentState('error');
    }
  };

  const handleBackToUpload = () => {
    setCurrentState('upload');
    setSelectedFile(null);
    setExtractedData(null);
    setPredictionResult(null);
    setErrorMessage('');
    setApiHealth(null);
  };

  const renderUploadState = () => (
    <>
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer block"
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Choose a medical report or drag it here
          </h3>
          <p className="text-gray-500 mb-4">
            PDF, JPG, PNG, TIFF, BMP files accepted
          </p>
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg inline-block">
            Browse Files
          </div>
        </label>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
          selectedFile
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Scan & Analyze Report
      </button>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How it works?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload your medical report (PDF or image)</li>
          <li>• AI will scan and extract medical values</li>
          <li>• Review and edit extracted values if needed</li>
          <li>• Get instant disease risk prediction</li>
        </ul>
      </div>
    </>
  );

  const renderScanningState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-blue-100 rounded-full">
          <Brain className="w-12 h-12 text-blue-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Scanning Report...
      </h3>
      <p className="text-gray-600 mb-6">
        Using AI to extract medical values from your report
      </p>
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="text-blue-600">Processing...</span>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-red-100 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Error Processing Report
      </h3>
      {/* Error Details */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
        <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
        <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
          {errorMessage}
        </pre>
      </div>
      <button
        onClick={handleBackToUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderContent = () => {
    switch (currentState) {
      case 'upload':
        return renderUploadState();
      case 'scanning':
        return renderScanningState();
      case 'extracted':
        return extractedData && (
          <ExtractedValuesForm
            extractedData={extractedData}
            onSubmit={handleAnalyzeReport}
            onCancel={handleBackToUpload}
          />
        );
      case 'analyzing':
        return (
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing Report...
            </h3>
            <p className="text-gray-600">
              Running AI disease prediction models
            </p>
          </div>
        );
      case 'result':
        return predictionResult && (
          <DiseasePredictionResult
            result={predictionResult}
            onBack={handleBackToUpload}
          />
        );
      case 'error':
        return renderErrorState();
      default:
        return renderUploadState();
    }
  };

  return (
    <div className="mobile-container">
      <AppHeader />
      
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Report Analysis</h1>
            <p className="text-gray-600">
              {currentState === 'upload' && 'Upload your medical reports for AI-powered analysis'}
              {currentState === 'scanning' && 'AI is scanning your report...'}
              {currentState === 'extracted' && 'Review extracted values'}
              {currentState === 'analyzing' && 'AI is analyzing your report...'}
              {currentState === 'result' && 'Analysis complete'}
              {currentState === 'error' && 'Error occurred'}
            </p>
          </div>
        </div>

        {/* API Health Status */}
        {apiHealth !== null && (
          <div className={`rounded-xl p-3 ${
            apiHealth ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {apiHealth ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                apiHealth ? 'text-green-800' : 'text-red-800'
              }`}>
                {apiHealth ? 'Disease Prediction API: Connected' : 'Disease Prediction API: Not Available'}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default UploadReport;
