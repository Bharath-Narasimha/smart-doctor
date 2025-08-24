import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedValues {
  reportType: 'heart' | 'diabetes' | 'kidney' | 'liver' | 'unknown';
  values: Record<string, any>;
  confidence: number;
}

export interface ScanResult {
  success: boolean;
  data?: ExtractedValues;
  error?: string;
}

class ReportScanner {
  private async extractTextFromImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await Tesseract.recognize(
            e.target?.result as string,
            'eng',
            {
              logger: m => console.log(m),
            }
          );
          resolve(result.data.text);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  private async extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // Limit to first 3 pages
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  }

  private identifyReportType(text: string): 'heart' | 'diabetes' | 'kidney' | 'liver' | 'unknown' {
    const lowerText = text.toLowerCase();
    
    // PRIORITY 1: Look for explicit report type in title/header (most reliable)
    if (lowerText.includes('liver function test') || lowerText.includes('lft') || 
        lowerText.includes('liver report') || lowerText.includes('hepatic')) {
      return 'liver';
    }
    
    if (lowerText.includes('diabetes') || lowerText.includes('diabetic') || 
        lowerText.includes('diabetes report') || lowerText.includes('glucose test')) {
      return 'diabetes';
    }
    
    if (lowerText.includes('kidney') || lowerText.includes('renal') || 
        lowerText.includes('kidney function test') || lowerText.includes('kft')) {
      return 'kidney';
    }
    
    if (lowerText.includes('heart') || lowerText.includes('cardiac') || 
        lowerText.includes('ecg') || lowerText.includes('electrocardiogram') ||
        lowerText.includes('heart function test')) {
      return 'heart';
    }
    
    // PRIORITY 2: Fallback to specific medical terms if title is unclear
    if (lowerText.includes('bilirubin') || lowerText.includes('sgpt') || 
        lowerText.includes('sgot') || lowerText.includes('alkaline phosphatase')) {
      return 'liver';
    }
    
    if (lowerText.includes('creatinine') || lowerText.includes('urea') || 
        lowerText.includes('glomerular') || lowerText.includes('nephrology')) {
      return 'kidney';
    }
    
    if (lowerText.includes('insulin') || lowerText.includes('hba1c') || 
        lowerText.includes('glycated hemoglobin')) {
      return 'diabetes';
    }
    
    if (lowerText.includes('chest pain') || lowerText.includes('angina') || 
        lowerText.includes('coronary') || lowerText.includes('myocardial')) {
      return 'heart';
    }
    
    return 'unknown';
  }

  private extractHeartDiseaseValues(text: string): Record<string, any> {
    const values: Record<string, any> = {};
    
    // Extract age
    const ageMatch = text.match(/(?:age|Age|AGE)[\s:]*(\d+)/);
    if (ageMatch) values.age = parseInt(ageMatch[1]);
    
    // Extract sex (1 for male, 0 for female)
    if (text.toLowerCase().includes('male')) values.sex = 1;
    else if (text.toLowerCase().includes('female')) values.sex = 0;
    
    // Extract chest pain type
    const cpMatch = text.match(/(?:chest pain|CP)[\s:]*(\d+)/);
    if (cpMatch) values.cp = parseInt(cpMatch[1]);
    
    // Extract blood pressure
    const bpMatch = text.match(/(?:blood pressure|BP|trestbps)[\s:]*(\d+)/);
    if (bpMatch) values.trestbps = parseInt(bpMatch[1]);
    
    // Extract cholesterol
    const cholMatch = text.match(/(?:cholesterol|chol)[\s:]*(\d+)/);
    if (cholMatch) values.chol = parseInt(cholMatch[1]);
    
    // Extract fasting blood sugar
    const fbsMatch = text.match(/(?:fasting blood sugar|FBS|glucose)[\s:]*(\d+)/);
    if (fbsMatch) values.fbs = parseInt(fbsMatch[1]) > 120 ? 1 : 0;
    
    // Extract ECG results
    const ecgMatch = text.match(/(?:ECG|restecg)[\s:]*(\d+)/);
    if (ecgMatch) values.restecg = parseInt(ecgMatch[1]);
    
    // Extract max heart rate
    const hrMatch = text.match(/(?:heart rate|HR|thalach)[\s:]*(\d+)/);
    if (hrMatch) values.thalach = parseInt(hrMatch[1]);
    
    // Extract exercise angina
    if (text.toLowerCase().includes('exercise angina') || text.toLowerCase().includes('exang')) {
      values.exang = text.toLowerCase().includes('yes') ? 1 : 0;
    }
    
    // Extract ST depression
    const stMatch = text.match(/(?:ST depression|oldpeak)[\s:]*([\d.]+)/);
    if (stMatch) values.oldpeak = parseFloat(stMatch[1]);
    
    // Extract slope
    const slopeMatch = text.match(/(?:slope)[\s:]*(\d+)/);
    if (slopeMatch) values.slope = parseInt(slopeMatch[1]);
    
    // Extract vessels
    const vesselsMatch = text.match(/(?:vessels|ca)[\s:]*(\d+)/);
    if (vesselsMatch) values.ca = parseInt(vesselsMatch[1]);
    
    // Extract thalassemia
    const thalMatch = text.match(/(?:thalassemia|thal)[\s:]*(\d+)/);
    if (thalMatch) values.thal = parseInt(thalMatch[1]);
    
    return values;
  }

  private extractDiabetesValues(text: string): Record<string, any> {
    const values: Record<string, any> = {};
    
    console.log('🔍 Extracting Diabetes Values...');
    
    // Extract age
    const ageMatch = text.match(/(?:age|Age|AGE)[\s:]*(\d+)/);
    if (ageMatch) {
      values.age = parseInt(ageMatch[1]);
      console.log('✅ Age extracted:', values.age);
    } else {
      console.log('❌ Age not found');
    }
    
    // Extract pregnancies
    const pregMatch = text.match(/(?:pregnancies|pregnancy)[\s:]*(\d+)/);
    if (pregMatch) {
      values.pregnancies = parseInt(pregMatch[1]);
      console.log('✅ Pregnancies extracted:', values.pregnancies);
    } else {
      console.log('❌ Pregnancies not found');
    }
    
    // Extract glucose
    const glucoseMatch = text.match(/(?:glucose|Glucose|GLUCOSE)[\s:]*(\d+)/);
    if (glucoseMatch) {
      values.glucose = parseInt(glucoseMatch[1]);
      console.log('✅ Glucose extracted:', values.glucose);
    } else {
      console.log('❌ Glucose not found');
    }
    
    // Extract blood pressure
    const bpMatch = text.match(/(?:blood pressure|BP)[\s:]*(\d+)/);
    if (bpMatch) {
      values.blood_pressure = parseInt(bpMatch[1]);
      console.log('✅ Blood Pressure extracted:', values.blood_pressure);
    } else {
      console.log('❌ Blood Pressure not found');
    }
    
    // Extract skin thickness
    const skinMatch = text.match(/(?:skin thickness|skin)[\s:]*(\d+)/);
    if (skinMatch) {
      values.skin_thickness = parseInt(skinMatch[1]);
      console.log('✅ Skin Thickness extracted:', values.skin_thickness);
    } else {
      console.log('❌ Skin Thickness not found');
    }
    
    // Extract insulin
    const insulinMatch = text.match(/(?:insulin|Insulin|INSULIN)[\s:]*(\d+)/);
    if (insulinMatch) {
      values.insulin = parseInt(insulinMatch[1]);
      console.log('✅ Insulin extracted:', values.insulin);
    } else {
      console.log('❌ Insulin not found');
    }
    
    // Extract BMI
    const bmiMatch = text.match(/(?:BMI|bmi|Body Mass Index)[\s:]*([\d.]+)/);
    if (bmiMatch) {
      values.bmi = parseFloat(bmiMatch[1]);
      console.log('✅ BMI extracted:', values.bmi);
    } else {
      console.log('❌ BMI not found');
    }
    
    // Extract diabetes pedigree function
    const pedigreeMatch = text.match(/(?:diabetes pedigree|pedigree)[\s:]*([\d.]+)/);
    if (pedigreeMatch) {
      values.diabetes_pedigree_function = parseFloat(pedigreeMatch[1]);
      console.log('✅ Diabetes Pedigree extracted:', values.diabetes_pedigree_function);
    } else {
      console.log('❌ Diabetes Pedigree not found');
    }
    
    console.log('📊 Final extracted values:', values);
    console.log('🔢 Total values extracted:', Object.keys(values).length);
    
    return values;
  }

  private extractKidneyDiseaseValues(text: string): Record<string, any> {
    const values: Record<string, any> = {};
    
    console.log('🔍 Extracting Kidney Disease Values...');
    console.log('📄 Text to analyze:', text.substring(0, 300) + '...');
    
    // Extract age
    const ageMatch = text.match(/(?:age|Age|AGE)[\s:]*(\d+)/);
    if (ageMatch) {
      values.age = parseFloat(ageMatch[1]);
      console.log('✅ Age extracted:', values.age);
    } else {
      console.log('❌ Age not found');
    }
    
    // Extract blood pressure
    const bpMatch = text.match(/(?:blood pressure|BP|bp)[\s:]*(\d+)/);
    if (bpMatch) {
      values.bp = parseFloat(bpMatch[1]);
      console.log('✅ Blood Pressure extracted:', values.bp);
    } else {
      console.log('❌ Blood Pressure not found');
    }
    
    // Extract BUN (Blood Urea Nitrogen)
    const bunMatch = text.match(/(?:BUN|bun|blood urea nitrogen)[\s:]*([\d.]+)/);
    if (bunMatch) {
      values.bu = parseFloat(bunMatch[1]);
      console.log('✅ BUN extracted:', values.bu);
    } else {
      console.log('❌ BUN not found');
    }
    
    // Extract Serum Urea
    const ureaMatch = text.match(/(?:serum urea|urea|SERUM UREA)[\s:]*([\d.]+)/);
    if (ureaMatch) {
      values.bu = parseFloat(ureaMatch[1]); // Using bu field for urea
      console.log('✅ Serum Urea extracted:', values.bu);
    } else {
      console.log('❌ Serum Urea not found');
    }
    
    // Extract Serum Creatinine
    const creatMatch = text.match(/(?:serum creatinine|creatinine|SERUM CREATININE)[\s:]*([\d.]+)/);
    if (creatMatch) {
      values.sc = parseFloat(creatMatch[1]);
      console.log('✅ Serum Creatinine extracted:', values.sc);
    } else {
      console.log('❌ Serum Creatinine not found');
    }
    
    // Extract EGFR
    const egfrMatch = text.match(/(?:EGFR|egfr)[\s:]*([\d.]+)/);
    if (egfrMatch) {
      values.egfr = parseFloat(egfrMatch[1]);
      console.log('✅ EGFR extracted:', values.egfr);
    } else {
      console.log('❌ EGFR not found');
    }
    
    // Extract Serum Calcium
    const calciumMatch = text.match(/(?:serum calcium|calcium|SERUM CALCIUM)[\s:]*([\d.]+)/);
    if (calciumMatch) {
      values.calcium = parseFloat(calciumMatch[1]);
      console.log('✅ Serum Calcium extracted:', values.calcium);
    } else {
      console.log('❌ Serum Calcium not found');
    }
    
    // Extract Serum Potassium
    const potMatch = text.match(/(?:serum potassium|potassium|SERUM POTASSIUM)[\s:]*([\d.]+)/);
    if (potMatch) {
      values.pot = parseFloat(potMatch[1]);
      console.log('✅ Serum Potassium extracted:', values.pot);
    } else {
      console.log('❌ Serum Potassium not found');
    }
    
    // Extract Serum Sodium
    const sodMatch = text.match(/(?:serum sodium|sodium|SERUM SODIUM)[\s:]*([\d.]+)/);
    if (sodMatch) {
      values.sod = parseFloat(sodMatch[1]);
      console.log('✅ Serum Sodium extracted:', values.sod);
    } else {
      console.log('❌ Serum Sodium not found');
    }
    
    // Extract Serum Uric Acid
    const uricMatch = text.match(/(?:serum uric acid|uric acid|SERUM URIC ACID)[\s:]*([\d.]+)/);
    if (uricMatch) {
      values.uric_acid = parseFloat(uricMatch[1]);
      console.log('✅ Serum Uric Acid extracted:', values.uric_acid);
    } else {
      console.log('❌ Serum Uric Acid not found');
    }
    
    // Extract Urea/Creatinine Ratio
    const ureaCreatRatioMatch = text.match(/(?:urea.*creatinine ratio|UREA.*CREATININE RATIO)[\s:]*([\d.]+)/);
    if (ureaCreatRatioMatch) {
      values.urea_creatinine_ratio = parseFloat(ureaCreatRatioMatch[1]);
      console.log('✅ Urea/Creatinine Ratio extracted:', values.urea_creatinine_ratio);
    } else {
      console.log('❌ Urea/Creatinine Ratio not found');
    }
    
    // Extract BUN/Creatinine Ratio
    const bunCreatRatioMatch = text.match(/(?:BUN.*creatinine ratio|bun.*creatinine ratio)[\s:]*([\d.]+)/);
    if (bunCreatRatioMatch) {
      values.bun_creatinine_ratio = parseFloat(bunCreatRatioMatch[1]);
      console.log('✅ BUN/Creatinine Ratio extracted:', values.bun_creatinine_ratio);
    } else {
      console.log('❌ BUN/Creatinine Ratio not found');
    }
    
    // Extract specific gravity
    const sgMatch = text.match(/(?:specific gravity|SG|sg)[\s:]*([\d.]+)/);
    if (sgMatch) {
      values.sg = parseFloat(sgMatch[1]);
      console.log('✅ Specific Gravity extracted:', values.sg);
    } else {
      console.log('❌ Specific Gravity not found');
    }
    
    // Extract albumin
    const alMatch = text.match(/(?:albumin|AL|al)[\s:]*(\d+)/);
    if (alMatch) {
      values.al = parseFloat(alMatch[1]);
      console.log('✅ Albumin extracted:', values.al);
    } else {
      console.log('❌ Albumin not found');
    }
    
    // Extract sugar
    const suMatch = text.match(/(?:sugar|SU|su)[\s:]*(\d+)/);
    if (suMatch) {
      values.su = parseFloat(suMatch[1]);
      console.log('✅ Sugar extracted:', values.su);
    } else {
      console.log('❌ Sugar not found');
    }
    
    // Extract red blood cells
    if (text.toLowerCase().includes('normal rbc') || text.toLowerCase().includes('rbc normal')) {
      values.rbc = 'normal';
      console.log('✅ RBC extracted: normal');
    } else if (text.toLowerCase().includes('abnormal rbc') || text.toLowerCase().includes('rbc abnormal')) {
      values.rbc = 'abnormal';
      console.log('✅ RBC extracted: abnormal');
    } else {
      console.log('❌ RBC not found');
    }
    
    // Extract pus cells
    if (text.toLowerCase().includes('normal pc') || text.toLowerCase().includes('pc normal')) {
      values.pc = 'normal';
      console.log('✅ Pus Cells extracted: normal');
    } else if (text.toLowerCase().includes('abnormal pc') || text.toLowerCase().includes('pc abnormal')) {
      values.pc = 'abnormal';
      console.log('✅ Pus Cells extracted: abnormal');
    } else {
      console.log('❌ Pus Cells not found');
    }
    
    // Extract pus cell clumps
    if (text.toLowerCase().includes('pcc present')) {
      values.pcc = 'present';
      console.log('✅ PCC extracted: present');
    } else if (text.toLowerCase().includes('pcc notpresent') || text.toLowerCase().includes('pcc not present')) {
      values.pcc = 'notpresent';
      console.log('✅ PCC extracted: notpresent');
    } else {
      console.log('❌ PCC not found');
    }
    
    // Extract bacteria
    if (text.toLowerCase().includes('ba present')) {
      values.ba = 'present';
      console.log('✅ Bacteria extracted: present');
    } else if (text.toLowerCase().includes('ba notpresent') || text.toLowerCase().includes('ba not present')) {
      values.ba = 'notpresent';
      console.log('✅ Bacteria extracted: notpresent');
    } else {
      console.log('❌ Bacteria not found');
    }
    
    // Extract blood glucose random
    const bgrMatch = text.match(/(?:blood glucose|BGR|bgr)[\s:]*(\d+)/);
    if (bgrMatch) {
      values.bgr = parseFloat(bgrMatch[1]);
      console.log('✅ Blood Glucose extracted:', values.bgr);
    } else {
      console.log('❌ Blood Glucose not found');
    }
    
    // Extract hemoglobin
    const hemoMatch = text.match(/(?:hemoglobin|HEMO|hemo)[\s:]*([\d.]+)/);
    if (hemoMatch) {
      values.hemo = parseFloat(hemoMatch[1]);
      console.log('✅ Hemoglobin extracted:', values.hemo);
    } else {
      console.log('❌ Hemoglobin not found');
    }
    
    // Extract packed cell volume
    const pcvMatch = text.match(/(?:packed cell volume|PCV|pcv)[\s:]*(\d+)/);
    if (pcvMatch) {
      values.pcv = parseFloat(pcvMatch[1]);
      console.log('✅ PCV extracted:', values.pcv);
    } else {
      console.log('❌ PCV not found');
    }
    
    // Extract white blood cell count
    const wcMatch = text.match(/(?:white blood cell|WBC|wc)[\s:]*(\d+)/);
    if (wcMatch) {
      values.wc = parseFloat(wcMatch[1]);
      console.log('✅ WBC extracted:', values.wc);
    } else {
      console.log('❌ WBC not found');
    }
    
    // Extract red blood cell count
    const rcMatch = text.match(/(?:red blood cell count|RBC|rc)[\s:]*([\d.]+)/);
    if (rcMatch) {
      values.rc = parseFloat(rcMatch[1]);
      console.log('✅ RBC Count extracted:', values.rc);
    } else {
      console.log('❌ RBC Count not found');
    }
    
    // Extract hypertension
    if (text.toLowerCase().includes('hypertension') || text.toLowerCase().includes('htn')) {
      values.htn = text.toLowerCase().includes('yes') ? 'yes' : 'no';
      console.log('✅ Hypertension extracted:', values.htn);
    } else {
      console.log('❌ Hypertension not found');
    }
    
    // Extract diabetes mellitus
    if (text.toLowerCase().includes('diabetes mellitus') || text.toLowerCase().includes('dm')) {
      values.dm = text.toLowerCase().includes('yes') ? 'yes' : 'no';
      console.log('✅ Diabetes Mellitus extracted:', values.dm);
    } else {
      console.log('❌ Diabetes Mellitus not found');
    }
    
    // Extract coronary artery disease
    if (text.toLowerCase().includes('coronary artery disease') || text.toLowerCase().includes('cad')) {
      values.cad = text.toLowerCase().includes('yes') ? 'yes' : 'no';
      console.log('✅ CAD extracted:', values.cad);
    } else {
      console.log('❌ CAD not found');
    }
    
    // Extract appetite
    if (text.toLowerCase().includes('good appetite')) {
      values.appet = 'good';
      console.log('✅ Appetite extracted: good');
    } else if (text.toLowerCase().includes('poor appetite')) {
      values.appet = 'poor';
      console.log('✅ Appetite extracted: poor');
    } else {
      console.log('❌ Appetite not found');
    }
    
    // Extract pedal edema
    if (text.toLowerCase().includes('pedal edema') || text.toLowerCase().includes('pe')) {
      values.pe = text.toLowerCase().includes('yes') ? 'yes' : 'no';
      console.log('✅ Pedal Edema extracted:', values.pe);
    } else {
      console.log('❌ Pedal Edema not found');
    }
    
    // Extract anemia
    if (text.toLowerCase().includes('anemia') || text.toLowerCase().includes('ane')) {
      values.ane = text.toLowerCase().includes('yes') ? 'yes' : 'no';
      console.log('✅ Anemia extracted:', values.ane);
    } else {
      console.log('❌ Anemia not found');
    }
    
    console.log('📊 Final extracted values:', values);
    console.log('🔢 Total values extracted:', Object.keys(values).length);
    
    return values;
  }

  private extractLiverDiseaseValues(text: string): Record<string, any> {
    const values: Record<string, any> = {};
    
    console.log('🔍 Extracting Liver Disease Values...');
    console.log('📄 Text to analyze:', text.substring(0, 300) + '...');
    
    // Extract age
    const ageMatch = text.match(/(?:age|Age|AGE)[\s:]*(\d+)/);
    if (ageMatch) {
      values.age = parseInt(ageMatch[1]);
      console.log('✅ Age extracted:', values.age);
    } else {
      console.log('❌ Age not found');
    }
    
    // Extract gender
    if (text.toLowerCase().includes('male')) {
      values.gender = 'Male';
      console.log('✅ Gender extracted: Male');
    } else if (text.toLowerCase().includes('female')) {
      values.gender = 'Female';
      console.log('✅ Gender extracted: Female');
    } else {
      console.log('❌ Gender not found');
    }
    
    // Extract total bilirubin
    const tbMatch = text.match(/(?:total bilirubin|TB|BILIRUBIN TOTAL)[\s:]*([\d.]+)/);
    if (tbMatch) {
      values.total_bilirubin = parseFloat(tbMatch[1]);
      console.log('✅ Total Bilirubin extracted:', values.total_bilirubin);
    } else {
      console.log('❌ Total Bilirubin not found');
    }
    
    // Extract direct bilirubin
    const dbMatch = text.match(/(?:direct bilirubin|DB|BILIRUBIN DIRECT)[\s:]*([\d.]+)/);
    if (dbMatch) {
      values.direct_bilirubin = parseFloat(dbMatch[1]);
      console.log('✅ Direct Bilirubin extracted:', values.direct_bilirubin);
    } else {
      console.log('❌ Direct Bilirubin not found');
    }
    
    // Extract indirect bilirubin
    const ibMatch = text.match(/(?:indirect bilirubin|IB|BILIRUBIN INDIRECT)[\s:]*([\d.]+)/);
    if (ibMatch) {
      values.indirect_bilirubin = parseFloat(ibMatch[1]);
      console.log('✅ Indirect Bilirubin extracted:', values.indirect_bilirubin);
    } else {
      console.log('❌ Indirect Bilirubin not found');
    }
    
    // Extract alkaline phosphatase
    const alpMatch = text.match(/(?:alkaline phosphatase|ALP|ALKALINE PHOSPHATASE)[\s:]*(\d+)/);
    if (alpMatch) {
      values.alkaline_phosphotase = parseInt(alpMatch[1]);
      console.log('✅ Alkaline Phosphatase extracted:', values.alkaline_phosphotase);
    } else {
      console.log('❌ Alkaline Phosphatase not found');
    }
    
    // Extract ALT (SGPT)
    const altMatch = text.match(/(?:ALT|alt|alanine aminotransferase|SGPT|sgpt)[\s:]*(\d+)/);
    if (altMatch) {
      values.alamine_aminotransferase = parseInt(altMatch[1]);
      console.log('✅ ALT/SGPT extracted:', values.alamine_aminotransferase);
    } else {
      console.log('❌ ALT/SGPT not found');
    }
    
    // Extract AST (SGOT)
    const astMatch = text.match(/(?:AST|ast|aspartate aminotransferase|SGOT|sgot)[\s:]*(\d+)/);
    if (astMatch) {
      values.aspartate_aminotransferase = parseInt(astMatch[1]);
      console.log('✅ AST/SGOT extracted:', values.aspartate_aminotransferase);
    } else {
      console.log('❌ AST/SGOT not found');
    }
    
    // Extract SGOT/SGPT Ratio
    const sgptRatioMatch = text.match(/(?:SGOT.*SGPT RATIO|sgot.*sgpt ratio)[\s:]*([\d.]+)/);
    if (sgptRatioMatch) {
      values.sgot_sgpt_ratio = parseFloat(sgptRatioMatch[1]);
      console.log('✅ SGOT/SGPT Ratio extracted:', values.sgot_sgpt_ratio);
    } else {
      console.log('❌ SGOT/SGPT Ratio not found');
    }
    
    // Extract GGT (Gamma Glutamyl Transferase)
    const ggtMatch = text.match(/(?:GGT|ggt|gamma glutamyl transferase|GAMMA GLUTAMYL TRANSFERASE)[\s:]*(\d+)/);
    if (ggtMatch) {
      values.ggt = parseInt(ggtMatch[1]);
      console.log('✅ GGT extracted:', values.ggt);
    } else {
      console.log('❌ GGT not found');
    }
    
    // Extract total proteins
    const tpMatch = text.match(/(?:total proteins|TP|TOTAL PROTEINS)[\s:]*([\d.]+)/);
    if (tpMatch) {
      values.total_protiens = parseFloat(tpMatch[1]);
      console.log('✅ Total Proteins extracted:', values.total_protiens);
    } else {
      console.log('❌ Total Proteins not found');
    }
    
    // Extract albumin
    const albMatch = text.match(/(?:albumin|Albumin|ALBUMIN)[\s:]*([\d.]+)/);
    if (albMatch) {
      values.albumin = parseFloat(albMatch[1]);
      console.log('✅ Albumin extracted:', values.albumin);
    } else {
      console.log('❌ Albumin not found');
    }
    
    // Extract globulin
    const globMatch = text.match(/(?:globulin|GLOBULIN)[\s:]*([\d.]+)/);
    if (globMatch) {
      values.globulin = parseFloat(globMatch[1]);
      console.log('✅ Globulin extracted:', values.globulin);
    } else {
      console.log('❌ Globulin not found');
    }
    
    // Extract albumin/globulin ratio
    const agMatch = text.match(/(?:albumin globulin ratio|A.*G RATIO|A\/G)[\s:]*([\d.]+)/);
    if (agMatch) {
      values.albumin_and_globulin_ratio = parseFloat(agMatch[1]);
      console.log('✅ A/G Ratio extracted:', values.albumin_and_globulin_ratio);
    } else {
      console.log('❌ A/G Ratio not found');
    }
    
    console.log('📊 Final extracted values:', values);
    console.log('🔢 Total values extracted:', Object.keys(values).length);
    
    return values;
  }

  async scanReport(file: File): Promise<ScanResult> {
    try {
      console.log('🚀 === STARTING REPORT SCAN ===');
      console.log('📁 File type:', file.type);
      console.log('📄 File name:', file.name);
      console.log('📏 File size:', (file.size / 1024).toFixed(2), 'KB');
      
      let extractedText = '';
      
      if (file.type === 'application/pdf') {
        console.log('📖 Processing PDF file...');
        extractedText = await this.extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        console.log('🖼️ Processing image file...');
        extractedText = await this.extractTextFromImage(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or image file.');
      }
      
      const reportType = this.identifyReportType(extractedText);
      
      // Debug logging
      console.log('🔍 === REPORT SCANNING START ===');
      console.log('📄 Extracted text preview:', extractedText.substring(0, 300) + '...');
      console.log('🎯 Detected report type:', reportType);
      console.log('📊 Text length:', extractedText.length, 'characters');
      
      if (reportType === 'unknown') {
        return {
          success: false,
          error: 'Could not identify report type. Please ensure the report contains clear medical terminology.'
        };
      }
      
      let extractedValues: Record<string, any> = {};
      
      console.log('🔍 Calling extraction function for:', reportType, 'disease...');
      
      switch (reportType) {
        case 'heart':
          extractedValues = this.extractHeartDiseaseValues(extractedText);
          break;
        case 'diabetes':
          extractedValues = this.extractDiabetesValues(extractedText);
          break;
        case 'kidney':
          extractedValues = this.extractKidneyDiseaseValues(extractedText);
          break;
        case 'liver':
          extractedValues = this.extractLiverDiseaseValues(extractedText);
          break;
      }
      
      // Calculate confidence based on how many values were extracted
      const expectedParams = this.getExpectedParamsCount(reportType);
      const extractedCount = Object.keys(extractedValues).length;
      const confidence = Math.min((extractedCount / expectedParams) * 100, 100);
      
      console.log('📊 === EXTRACTION RESULTS ===');
      console.log('🎯 Report Type:', reportType);
      console.log('✅ Values Extracted:', extractedValues);
      console.log('🔢 Count:', extractedCount, '/', expectedParams);
      console.log('📈 Confidence:', confidence.toFixed(1) + '%');
      console.log('🔍 === REPORT SCANNING COMPLETE ===');
      
      return {
        success: true,
        data: {
          reportType,
          values: extractedValues,
          confidence
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scan report'
      };
    }
  }

  private getExpectedParamsCount(reportType: string): number {
    switch (reportType) {
      case 'heart': return 13;
      case 'diabetes': return 8;
      case 'kidney': return 24;
      case 'liver': return 12; // Updated to match API requirements
      default: return 1;
    }
  }
}

export const reportScanner = new ReportScanner();
