# Smart Doctor - AI Report Analysis Demo

## 🚀 Quick Demo Guide

This guide shows you how to test the AI-powered medical report analysis system.

## Prerequisites

1. **Disease Prediction API**: Ensure the API service is running on `http://localhost:8000`
2. **Frontend App**: The React app should be running (either via Docker or `npm run dev`)

## Demo Flow

### 1. Start the Application

```bash
# Option 1: Docker (Recommended)
docker-compose up --build

# Option 2: Local Development
npm run dev
```

### 2. Navigate to Report Analysis

1. Open the app in your browser
2. Go to the "Upload Report" section
3. You'll see the AI Report Analysis interface

### 3. Test with Sample Reports

#### Heart Disease Report Test
- Upload a PDF or image containing heart-related medical data
- Look for keywords: "heart", "cardiac", "ECG", "chest pain"
- The AI should detect it as a heart disease report
- Extract values like: age, blood pressure, cholesterol, etc.

#### Diabetes Report Test
- Upload a report with diabetes-related data
- Look for keywords: "glucose", "insulin", "diabetes", "HbA1c"
- The AI should detect it as a diabetes report
- Extract values like: glucose, blood pressure, BMI, etc.

#### Kidney Disease Report Test
- Upload a report with kidney-related data
- Look for keywords: "creatinine", "urea", "kidney", "renal"
- The AI should detect it as a kidney disease report
- Extract values like: creatinine, blood urea, hemoglobin, etc.

#### Liver Disease Report Test
- Upload a report with liver-related data
- Look for keywords: "bilirubin", "ALT", "AST", "liver"
- The AI should detect it as a liver disease report
- Extract values like: bilirubin, ALT, AST, albumin, etc.

### 4. AI Processing Steps

1. **File Upload**: Drag & drop or browse for medical reports
2. **OCR Scanning**: AI scans the document using Tesseract.js
3. **Report Detection**: Automatically identifies disease type
4. **Value Extraction**: Extracts relevant medical parameters
5. **User Review**: Shows extracted values for editing
6. **API Analysis**: Sends data to disease prediction API
7. **Results Display**: Shows comprehensive risk assessment

### 5. Expected Results

After successful analysis, you should see:

- **Risk Assessment**: High/Medium/Low risk classification
- **Risk Percentage**: Numerical risk score (0-100%)
- **Confidence Score**: AI confidence in the prediction
- **Risk Factors**: Specific factors contributing to risk
- **Recommendations**: Personalized health advice
- **Model Information**: Technical details about the analysis

## Sample Test Data

### Heart Disease Parameters
```json
{
  "age": 63,
  "sex": 1,
  "cp": 3,
  "trestbps": 145,
  "chol": 233,
  "fbs": 1,
  "restecg": 0,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 2.3,
  "slope": 0,
  "ca": 0,
  "thal": 1
}
```

### Diabetes Parameters
```json
{
  "pregnancies": 6,
  "glucose": 148,
  "blood_pressure": 72,
  "skin_thickness": 35,
  "insulin": 0,
  "bmi": 33.6,
  "diabetes_pedigree_function": 0.627,
  "age": 50
}
```

## Troubleshooting

### Common Issues

1. **API Not Available**
   - Check if disease prediction API is running on port 8000
   - Verify API health endpoint: `http://localhost:8000/health`

2. **OCR Not Working**
   - Ensure Docker container has Tesseract installed
   - Check image format compatibility (JPG, PNG, TIFF, BMP)

3. **PDF Processing Errors**
   - Verify PDF file integrity
   - Check if PDF.js worker is properly configured

4. **Build Errors**
   - Run `npm install` to install dependencies
   - Check for TypeScript compilation errors

### Performance Tips

- **Image Quality**: Use high-quality images for better OCR results
- **File Size**: Keep files under 10MB for optimal processing
- **Text Clarity**: Ensure medical values are clearly visible
- **Format**: Prefer PDFs over images when possible

## API Endpoints

The system integrates with these disease prediction endpoints:

- `POST /predict/heart` - Heart disease prediction
- `POST /predict/diabetes` - Diabetes prediction  
- `POST /predict/kidney` - Kidney disease prediction
- `POST /predict/liver` - Liver disease prediction

## Security Notes

- All processing happens locally in the browser
- Medical data is not stored on servers
- API calls are made directly to your local disease prediction service
- No sensitive information is logged or transmitted

## Next Steps

1. **Customize Extraction**: Modify regex patterns in `reportScanner.ts`
2. **Add New Diseases**: Extend the system for additional conditions
3. **Improve OCR**: Add support for more languages and formats
4. **Enhance UI**: Customize the results display components

---

**Note**: This is a demonstration system for educational purposes. Always consult healthcare professionals for medical decisions.
