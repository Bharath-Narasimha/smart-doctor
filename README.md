# Smart Doctor - AI-Powered Medical Assistant

A comprehensive mobile-first web application that uses advanced AI technology to analyze medical reports and provide health insights.

## 🚀 New AI Features

### OCR (Optical Character Recognition)
- **Tesseract.js Integration**: Advanced text extraction from medical reports
- **Medical Parameter Extraction**: Automatically extracts key health metrics including:
  - Blood test parameters (glucose, cholesterol, HDL, LDL, triglycerides, creatinine, BUN, ALT, AST, bilirubin, hemoglobin, WBC, RBC, platelets)
  - Vital signs (blood pressure, heart rate, temperature)
  - Body metrics (BMI, weight, height, age)
  - Liver function tests (albumin, alkaline phosphatase, total protein)
  - Kidney function tests (glomerular filtration rate, urine albumin)

### Machine Learning Disease Risk Prediction
- **TensorFlow.js Models**: Pre-trained neural networks for disease risk assessment
- **Multi-Disease Analysis**: Risk prediction for:
  - Heart Disease
  - Diabetes
  - Liver Disease
  - Kidney Disease
- **Personalized Recommendations**: AI-generated health advice and next steps
- **Risk Severity Levels**: Low, Medium, High, and Critical risk classifications

### Advanced Health Analytics
- **Overall Health Score**: Comprehensive health assessment (0-100%)
- **Disease-Specific Risk Percentages**: Detailed risk analysis for each condition
- **Smart Recommendations**: Personalized lifestyle and medical advice
- **Actionable Next Steps**: Clear guidance for follow-up actions

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **OCR**: Tesseract.js
- **Machine Learning**: TensorFlow.js
- **Charts**: Chart.js + React-Chartjs-2
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📱 Features

### Core Functionality
- **Medical Report Upload**: Drag & drop support for PDF, JPG, PNG files
- **AI-Powered Analysis**: Automated health parameter extraction and risk assessment
- **Interactive Results**: Beautiful, responsive UI with progress indicators
- **Health Timeline**: Track your health journey over time
- **Doctor Finder**: Locate nearby medical specialists
- **Symptom Chat**: AI-powered symptom analysis

### User Experience
- **Mobile-First Design**: Optimized for mobile devices
- **Real-time Processing**: Live progress updates during analysis
- **Error Handling**: Graceful error management with user-friendly messages
- **Data Export**: Download analysis results as JSON
- **Share Functionality**: Share results with healthcare providers

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-doctor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Usage

### Uploading Medical Reports
1. Navigate to the "Upload Report" section
2. Drag and drop your medical report (PDF, JPG, PNG) or click to browse
3. Click "Analyze Report with AI"
4. Wait for OCR processing and ML analysis
5. Review your personalized health insights

### Understanding Results
- **Overall Health Score**: Your comprehensive health rating
- **Disease Risk Analysis**: Individual risk assessments for major conditions
- **Extracted Parameters**: Key health metrics found in your report
- **Recommendations**: Personalized health advice
- **Next Steps**: Actionable follow-up guidance

## 🔧 Technical Architecture

### Services
- **OCRService**: Handles text extraction from medical reports
- **MLModelService**: Manages TensorFlow.js models and predictions
- **AIAnalysis**: Displays comprehensive health analysis results

### Components
- **ReportUpload**: File upload and processing interface
- **AIAnalysis**: Results display with charts and recommendations
- **AIResult**: Dedicated results page with sharing capabilities

## ⚠️ Important Disclaimers

- **Informational Purpose Only**: This AI analysis is for informational purposes only
- **Not Medical Advice**: Always consult qualified healthcare providers for medical decisions
- **Data Privacy**: Medical data is processed locally and not stored on servers
- **Accuracy**: Results are estimates based on available parameters

## 🎯 Future Enhancements

- [ ] Integration with electronic health records (EHR)
- [ ] Real-time health monitoring
- [ ] Telemedicine integration
- [ ] Advanced imaging analysis (X-ray, MRI)
- [ ] Medication interaction checking
- [ ] Health goal tracking
- [ ] Family health history integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Note**: This application is designed to assist with health monitoring and should be used in conjunction with professional medical care. 