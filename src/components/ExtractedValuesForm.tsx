import React, { useState } from 'react';
import { Edit3, Check, X, AlertCircle } from 'lucide-react';
import { ExtractedValues } from '../services/reportScanner';

interface ExtractedValuesFormProps {
  extractedData: ExtractedValues;
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
}

const ExtractedValuesForm: React.FC<ExtractedValuesFormProps> = ({
  extractedData,
  onSubmit,
  onCancel
}) => {
  const [values, setValues] = useState<Record<string, any>>(extractedData.values);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(String(currentValue || ''));
  };

  const handleSave = (field: string) => {
    const newValues = { ...values };
    
    // Convert value based on field type
    if (field === 'age' || field === 'sex' || field === 'cp' || field === 'trestbps' || 
        field === 'chol' || field === 'fbs' || field === 'restecg' || field === 'thalach' || 
        field === 'exang' || field === 'slope' || field === 'ca' || field === 'thal' ||
        field === 'pregnancies' || field === 'glucose' || field === 'blood_pressure' ||
        field === 'skin_thickness' || field === 'insulin' || field === 'bp' || field === 'bgr' ||
        field === 'bu' || field === 'sc' || field === 'sod' || field === 'pot' || field === 'hemo' ||
        field === 'pcv' || field === 'wc' || field === 'rc' || field === 'alkaline_phosphotase' ||
        field === 'alamine_aminotransferase' || field === 'aspartate_aminotransferase') {
      newValues[field] = parseInt(editValue) || 0;
    } else if (field === 'oldpeak' || field === 'bmi' || field === 'diabetes_pedigree_function' ||
               field === 'sg' || field === 'al' || field === 'su' || field === 'total_bilirubin' ||
               field === 'direct_bilirubin' || field === 'total_protiens' || field === 'albumin' ||
               field === 'albumin_and_globulin_ratio') {
      newValues[field] = parseFloat(editValue) || 0;
    } else {
      newValues[field] = editValue;
    }
    
    setValues(newValues);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      age: 'Age',
      sex: 'Sex (1=Male, 0=Female)',
      cp: 'Chest Pain Type',
      trestbps: 'Blood Pressure (mm Hg)',
      chol: 'Cholesterol (mg/dl)',
      fbs: 'Fasting Blood Sugar >120',
      restecg: 'ECG Results',
      thalach: 'Max Heart Rate',
      exang: 'Exercise Angina',
      oldpeak: 'ST Depression',
      slope: 'Slope',
      ca: 'Vessels',
      thal: 'Thalassemia',
      pregnancies: 'Pregnancies',
      glucose: 'Glucose (mg/dl)',
      blood_pressure: 'Blood Pressure (mm Hg)',
      skin_thickness: 'Skin Thickness (mm)',
      insulin: 'Insulin (mu U/ml)',
      bmi: 'BMI',
      diabetes_pedigree_function: 'Diabetes Pedigree',
      bp: 'Blood Pressure (mm Hg)',
      sg: 'Specific Gravity',
      al: 'Albumin',
      su: 'Sugar',
      rbc: 'Red Blood Cells',
      pc: 'Pus Cells',
      pcc: 'Pus Cell Clumps',
      ba: 'Bacteria',
      bgr: 'Blood Glucose Random',
      bu: 'Blood Urea',
      sc: 'Serum Creatinine',
      sod: 'Sodium',
      pot: 'Potassium',
      hemo: 'Hemoglobin',
      pcv: 'Packed Cell Volume',
      wc: 'White Blood Cell Count',
      rc: 'Red Blood Cell Count',
      htn: 'Hypertension',
      dm: 'Diabetes Mellitus',
      cad: 'Coronary Artery Disease',
      appet: 'Appetite',
      pe: 'Pedal Edema',
      ane: 'Anemia',
      gender: 'Gender',
      total_bilirubin: 'Total Bilirubin',
      direct_bilirubin: 'Direct Bilirubin',
      alkaline_phosphotase: 'Alkaline Phosphatase',
      alamine_aminotransferase: 'ALT',
      aspartate_aminotransferase: 'AST',
      total_protiens: 'Total Proteins',
      albumin: 'Albumin',
      albumin_and_globulin_ratio: 'Albumin/Globulin Ratio'
    };
    return labels[field] || field;
  };

  const getFieldValue = (field: string, value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const renderField = (field: string, value: any) => {
    const isEditing = editingField === field;
    
    return (
      <div key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">{getFieldLabel(field)}</label>
          {isEditing ? (
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                autoFocus
              />
              <button
                onClick={() => handleSave(field)}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-900 font-medium">
                {getFieldValue(field, value)}
              </span>
              <button
                onClick={() => handleEdit(field, value)}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getReportTypeDisplay = (type: string): string => {
    const types: Record<string, string> = {
      heart: 'Heart Disease',
      diabetes: 'Diabetes',
      kidney: 'Kidney Disease',
      liver: 'Liver Disease'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">
              Report Type: {getReportTypeDisplay(extractedData.reportType)}
            </h3>
            <p className="text-sm text-blue-700">
              Confidence: {extractedData.confidence.toFixed(1)}% - Review and edit values below
            </p>
          </div>
        </div>
      </div>

      {/* Extracted Values */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Extracted Medical Values</h4>
        {Object.entries(values).map(([field, value]) => renderField(field, value))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => onSubmit(values)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
        >
          Analyze Report
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExtractedValuesForm;
