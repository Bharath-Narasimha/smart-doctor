# Smart Doctor - AI Medical Report Analysis

A React-based mobile application that uses AI to scan medical reports (PDFs/images), extract medical values, and predict disease risk using machine learning models.

## Features

- **AI-Powered Report Scanning**: Automatically extracts medical values from PDFs and images using OCR
- **Multi-Disease Support**: Heart Disease, Diabetes, Kidney Disease, and Liver Disease prediction
- **Smart Report Detection**: Automatically identifies report type based on content
- **Interactive Value Editing**: Review and edit extracted values before analysis
- **Real-time API Integration**: Connects to disease prediction API for instant results
- **Beautiful Results Display**: Structured presentation of risk assessment, factors, and recommendations
- **Mobile-First Design**: Optimized for mobile devices with responsive UI

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **OCR Processing**: Tesseract.js for image text extraction
- **PDF Processing**: PDF.js for PDF text extraction
- **API Integration**: Axios for HTTP requests
- **Containerization**: Docker + Docker Compose
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Disease Prediction API service running on port 8000

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-doctor
   ```

2. **Start the services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Ensure API is running on http://localhost:8000

## How It Works

### 1. Report Upload
- User uploads medical report (PDF or image)
- Supports: PDF, JPG, PNG, TIFF, BMP formats

### 2. AI Scanning
- **OCR Processing**: Uses Tesseract.js for image text extraction
- **PDF Processing**: Uses PDF.js for PDF text extraction
- **Report Type Detection**: Automatically identifies disease type based on content

### 3. Value Extraction
- **Heart Disease**: Extracts 13 parameters (age, sex, blood pressure, cholesterol, etc.)
- **Diabetes**: Extracts 8 parameters (glucose, insulin, BMI, etc.)
- **Kidney Disease**: Extracts 24 parameters (creatinine, urea, hemoglobin, etc.)
- **Liver Disease**: Extracts 10 parameters (bilirubin, ALT, AST, etc.)

### 4. User Review
- Displays extracted values with editable fields
- Shows confidence score for extraction accuracy
- Allows manual corrections before analysis

### 5. Disease Prediction
- Sends extracted values to appropriate API endpoint
- Receives comprehensive risk assessment
- Displays results with risk factors and recommendations

## API Integration

The app integrates with the Disease Prediction API service:

- **Health Check**: `/health` - API availability status
- **Heart Disease**: `/predict/heart` - Heart disease risk prediction
- **Diabetes**: `/predict/diabetes` - Diabetes risk prediction
- **Kidney Disease**: `/predict/kidney` - Kidney disease risk prediction
- **Liver Disease**: `/predict/liver` - Liver disease risk prediction

## Project Structure

```
src/
├── components/
│   ├── AppHeader.tsx          # App header component
│   ├── BottomNav.tsx          # Bottom navigation
│   ├── ExtractedValuesForm.tsx # Form for editing extracted values
│   └── DiseasePredictionResult.tsx # Results display component
├── pages/
│   ├── Home.tsx               # Home page
│   ├── UploadReport.tsx       # Main report analysis page
│   └── ...                    # Other pages
├── services/
│   ├── api.ts                 # API service for disease prediction
│   └── reportScanner.ts       # OCR and PDF processing service
└── main.tsx                   # App entry point
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Smart Doctor
```

### API Configuration

The API base URL can be configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

### Adding New Disease Types

1. **Update Report Scanner**: Add detection logic in `reportScanner.ts`
2. **Update API Service**: Add new prediction method in `api.ts`
3. **Update UI Components**: Modify forms and result displays
4. **Update Types**: Add new interfaces for parameters

### Customizing OCR

The OCR processing can be customized in `reportScanner.ts`:

- **Language Support**: Add new languages to Tesseract.js
- **Pattern Matching**: Improve regex patterns for value extraction
- **Confidence Scoring**: Adjust confidence calculation algorithms

## Docker Configuration

### Frontend Container

- **Base Image**: Node.js 18 Alpine
- **OCR Tools**: Tesseract, Poppler, ImageMagick
- **Port**: 3000
- **Build Process**: Multi-stage build for optimization

### API Container

- **Base Image**: Python with ML dependencies
- **Port**: 8000
- **Health Check**: Automatic health monitoring

## Troubleshooting

### Common Issues

1. **OCR Not Working**
   - Ensure Docker container has Tesseract installed
   - Check image format compatibility
   - Verify file size limits

2. **API Connection Failed**
   - Check if disease prediction API is running
   - Verify port 8000 is accessible
   - Check network configuration in Docker

3. **PDF Processing Errors**
   - Ensure PDF.js worker is properly configured
   - Check PDF file integrity
   - Verify PDF page limits

### Performance Optimization

- **Image Processing**: Limit image file sizes
- **PDF Processing**: Process only first 3 pages
- **Caching**: Implement result caching for repeated reports
- **Lazy Loading**: Load OCR libraries on demand

## Security Considerations

- **File Validation**: Strict file type and size validation
- **Input Sanitization**: Clean extracted values before API calls
- **Error Handling**: Graceful error handling without exposing sensitive data
- **CORS Configuration**: Proper CORS setup for API communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for educational and research purposes only. Medical predictions should not replace professional medical advice. Always consult with healthcare professionals for medical decisions.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation 