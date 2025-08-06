import Tesseract from 'tesseract.js';

export interface MedicalParameters {
  // Blood Test Parameters
  glucose?: number;
  cholesterol?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
  creatinine?: number;
  bun?: number;
  alt?: number;
  ast?: number;
  bilirubin?: number;
  hemoglobin?: number;
  wbc?: number;
  rbc?: number;
  platelets?: number;
  
  // Liver Function Test (LFT) Parameters
  sgpt?: number;
  sgot?: number;
  ggt?: number;
  sgotSgptRatio?: number;
  bilirubinTotal?: number;
  bilirubinDirect?: number;
  bilirubinIndirect?: number;
  
  // Vital Signs
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  
  // Other Parameters
  bmi?: number;
  weight?: number;
  height?: number;
  age?: number;
  albumin?: number;
  alkalinePhosphatase?: number;
  totalProtein?: number;
  globulin?: number;
  agRatio?: number;
  glomerularFiltrationRate?: number;
  urineAlbumin?: number;
  
  // Echocardiogram Parameters
  ejectionFraction?: number;
  lvMass?: number;
  strokeVolume?: number;
  endDiastolicVolume?: number;
  endSystolicVolume?: number;
  fractionalShortening?: number;
  
  // Extracted Text
  rawText: string;
}

export class OCRService {
  private static instance: OCRService;
  
  private constructor() {}
  
  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  public async extractMedicalParameters(file: File): Promise<MedicalParameters> {
    try {
      console.log('Starting OCR processing...');
      
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m: any) => console.log(m)
        }
      );

      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);

      return this.parseMedicalParameters(extractedText);
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Failed to process medical report');
    }
  }

  private parseMedicalParameters(text: string): MedicalParameters {
    const parameters: MedicalParameters = { rawText: text };
    
    // Convert text to lowercase for easier matching
    const lowerText = text.toLowerCase();
    
    // Enhanced pattern matching for medical report tables
    // Look for patterns like "TEST: VALUE" or "TEST: VALUE UNIT" or "TEST: VALUE (REF RANGE)"
    
    // Glucose/Blood Sugar - multiple patterns
    const glucosePatterns = [
      /(?:glucose|blood sugar|sugar)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl|mmol\/l).*glucose/i,
      /glucose.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of glucosePatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.glucose = parseFloat(match[1]);
        break;
      }
    }
    
    // Cholesterol - multiple patterns
    const cholesterolPatterns = [
      /(?:total cholesterol|cholesterol)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*cholesterol/i,
      /cholesterol.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of cholesterolPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.cholesterol = parseFloat(match[1]);
        break;
      }
    }
    
    // HDL
    const hdlPatterns = [
      /(?:hdl|high-density lipoprotein)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*hdl/i,
      /hdl.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of hdlPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.hdl = parseFloat(match[1]);
        break;
      }
    }
    
    // LDL
    const ldlPatterns = [
      /(?:ldl|low-density lipoprotein)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*ldl/i,
      /ldl.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of ldlPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.ldl = parseFloat(match[1]);
        break;
      }
    }
    
    // Triglycerides
    const triglyceridesPatterns = [
      /(?:triglycerides|tg)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*triglycerides/i,
      /triglycerides.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of triglyceridesPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.triglycerides = parseFloat(match[1]);
        break;
      }
    }
    
    // Creatinine
    const creatininePatterns = [
      /(?:creatinine|cr)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*creatinine/i,
      /creatinine.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of creatininePatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.creatinine = parseFloat(match[1]);
        break;
      }
    }
    
    // BUN
    const bunPatterns = [
      /(?:bun|blood urea nitrogen|urea)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*(?:bun|urea)/i,
      /(?:bun|urea).*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of bunPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.bun = parseFloat(match[1]);
        break;
      }
    }
    
    // ALT/SGPT - Liver Function Test
    const altPatterns = [
      /(?:alt|alanine aminotransferase|sgpt)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:iu\/l|u\/l).*(?:alt|sgpt)/i,
      /(?:alt|sgpt).*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of altPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.alt = parseFloat(match[1]);
        parameters.sgpt = parseFloat(match[1]); // SGPT is the same as ALT
        break;
      }
    }
    
    // AST/SGOT - Liver Function Test
    const astPatterns = [
      /(?:ast|aspartate aminotransferase|sgot)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:iu\/l|u\/l).*(?:ast|sgot)/i,
      /(?:ast|sgot).*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of astPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.ast = parseFloat(match[1]);
        parameters.sgot = parseFloat(match[1]); // SGOT is the same as AST
        break;
      }
    }
    
    // GGT - Gamma Glutamyl Transferase
    const ggtPatterns = [
      /(?:ggt|gamma glutamyl transferase)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:u\/l).*ggt/i,
      /ggt.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of ggtPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.ggt = parseFloat(match[1]);
        break;
      }
    }
    
    // SGOT/SGPT Ratio
    const ratioPatterns = [
      /(?:sgot\/sgpt|ast\/alt)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*ratio.*(?:sgot\/sgpt|ast\/alt)/i,
      /(?:sgot\/sgpt|ast\/alt).*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of ratioPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.sgotSgptRatio = parseFloat(match[1]);
        break;
      }
    }
    
    // Bilirubin - Total, Direct, Indirect
    const bilirubinTotalPatterns = [
      /(?:bilirubin total|total bilirubin|tbil)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*bilirubin.*total/i,
      /bilirubin.*total.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of bilirubinTotalPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.bilirubin = parseFloat(match[1]);
        parameters.bilirubinTotal = parseFloat(match[1]);
        break;
      }
    }
    
    const bilirubinDirectPatterns = [
      /(?:bilirubin direct|direct bilirubin)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*bilirubin.*direct/i,
      /bilirubin.*direct.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of bilirubinDirectPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.bilirubinDirect = parseFloat(match[1]);
        break;
      }
    }
    
    const bilirubinIndirectPatterns = [
      /(?:bilirubin indirect|indirect bilirubin)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/dl).*bilirubin.*indirect/i,
      /bilirubin.*indirect.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of bilirubinIndirectPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.bilirubinIndirect = parseFloat(match[1]);
        break;
      }
    }
    
    // Hemoglobin
    const hemoglobinPatterns = [
      /(?:hemoglobin|hb|hgb)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:g\/dl).*hemoglobin/i,
      /hemoglobin.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of hemoglobinPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.hemoglobin = parseFloat(match[1]);
        break;
      }
    }
    
    // WBC
    const wbcPatterns = [
      /(?:wbc|white blood cells|leukocytes)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:cells\/ul|k\/ul).*wbc/i,
      /wbc.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of wbcPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.wbc = parseFloat(match[1]);
        break;
      }
    }
    
    // RBC
    const rbcPatterns = [
      /(?:rbc|red blood cells|erythrocytes)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:cells\/ul|m\/ul).*rbc/i,
      /rbc.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of rbcPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.rbc = parseFloat(match[1]);
        break;
      }
    }
    
    // Platelets
    const plateletsPatterns = [
      /(?:platelets|plt)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:cells\/ul|k\/ul).*platelets/i,
      /platelets.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of plateletsPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.platelets = parseFloat(match[1]);
        break;
      }
    }
    
    // Blood Pressure - multiple patterns
    const bpPatterns = [
      /(?:blood pressure|bp)[:\s]*(\d+)\s*\/\s*(\d+)/i,
      /(\d+)\s*\/\s*(\d+)\s*(?:mmhg).*blood pressure/i,
      /(\d+)\s*\/\s*(\d+)\s*(?:mmhg)/i
    ];
    for (const pattern of bpPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.bloodPressure = `${match[1]}/${match[2]}`;
        break;
      }
    }
    
    // Heart Rate - multiple patterns
    const hrPatterns = [
      /(?:heart rate|hr|pulse)[:\s]*(\d+)/i,
      /(\d+)\s*(?:bpm).*heart rate/i,
      /(\d+)\s*(?:bpm)/i
    ];
    for (const pattern of hrPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.heartRate = parseInt(match[1]);
        break;
      }
    }
    
    // SPO2
    const spo2Patterns = [
      /(?:spo2|oxygen saturation)[:\s]*(\d+)/i,
      /(\d+)\s*%.*spo2/i,
      /(\d+)\s*%.*oxygen/i
    ];
    for (const pattern of spo2Patterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.spo2 = parseInt(match[1]);
        break;
      }
    }
    
    // Temperature
    const tempPatterns = [
      /(?:temperature|temp)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:°c|°f).*temperature/i,
      /temperature.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of tempPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.temperature = parseFloat(match[1]);
        break;
      }
    }
    
    // BMI - multiple patterns
    const bmiPatterns = [
      /(?:bmi|body mass index)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:kg\/m2|kg\/m²).*bmi/i,
      /bmi.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of bmiPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.bmi = parseFloat(match[1]);
        break;
      }
    }
    
    // Weight - multiple patterns
    const weightPatterns = [
      /(?:weight|wt)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:kg|lbs).*weight/i,
      /weight.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of weightPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.weight = parseFloat(match[1]);
        break;
      }
    }
    
    // Height - multiple patterns
    const heightPatterns = [
      /(?:height|ht)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:m|cm|ft).*height/i,
      /height.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of heightPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.height = parseFloat(match[1]);
        break;
      }
    }
    
    // Age - multiple patterns
    const agePatterns = [
      /(?:age)[:\s]*(\d+)/i,
      /(\d+)\s*(?:years?|y).*age/i,
      /age.*?(\d+)/i
    ];
    for (const pattern of agePatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.age = parseInt(match[1]);
        break;
      }
    }
    
    // Albumin
    const albuminPatterns = [
      /(?:albumin|alb)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:g\/dl).*albumin/i,
      /albumin.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of albuminPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.albumin = parseFloat(match[1]);
        break;
      }
    }
    
    // Alkaline Phosphatase
    const alpPatterns = [
      /(?:alkaline phosphatase|alp)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:u\/l).*alkaline phosphatase/i,
      /alkaline phosphatase.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of alpPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.alkalinePhosphatase = parseFloat(match[1]);
        break;
      }
    }
    
    // Total Protein
    const proteinPatterns = [
      /(?:total protein|protein)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:g\/dl).*total protein/i,
      /total protein.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of proteinPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.totalProtein = parseFloat(match[1]);
        break;
      }
    }
    
    // Globulin
    const globulinPatterns = [
      /(?:globulin)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:g\/dl).*globulin/i,
      /globulin.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of globulinPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.globulin = parseFloat(match[1]);
        break;
      }
    }
    
    // A:G Ratio
    const agRatioPatterns = [
      /(?:a\s*:\s*g\s*ratio|ag\s*ratio)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*ratio.*a\s*:\s*g/i,
      /a\s*:\s*g.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of agRatioPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.agRatio = parseFloat(match[1]);
        break;
      }
    }
    
    // Glomerular Filtration Rate
    const gfrPatterns = [
      /(?:gfr|glomerular filtration rate)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:ml\/min).*gfr/i,
      /gfr.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of gfrPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.glomerularFiltrationRate = parseFloat(match[1]);
        break;
      }
    }
    
    // Urine Albumin
    const urineAlbuminPatterns = [
      /(?:urine albumin|microalbumin)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*(?:mg\/l).*urine albumin/i,
      /urine albumin.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of urineAlbuminPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.urineAlbumin = parseFloat(match[1]);
        break;
      }
    }
    
    // Echocardiogram Parameters
    // Ejection Fraction
    const efPatterns = [
      /(?:ef|ejection fraction)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*%.*ef/i,
      /ef.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of efPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.ejectionFraction = parseFloat(match[1]);
        break;
      }
    }
    
    // LV Mass
    const lvMassPatterns = [
      /(?:lv mass|lv mass \(cubed\))[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*g.*lv mass/i,
      /lv mass.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of lvMassPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.lvMass = parseFloat(match[1]);
        break;
      }
    }
    
    // Stroke Volume
    const svPatterns = [
      /(?:sv|stroke volume)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*ml.*sv/i,
      /sv.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of svPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.strokeVolume = parseFloat(match[1]);
        break;
      }
    }
    
    // End Diastolic Volume
    const edvPatterns = [
      /(?:edv|end diastolic volume)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*ml.*edv/i,
      /edv.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of edvPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.endDiastolicVolume = parseFloat(match[1]);
        break;
      }
    }
    
    // End Systolic Volume
    const esvPatterns = [
      /(?:esv|end systolic volume)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*ml.*esv/i,
      /esv.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of esvPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.endSystolicVolume = parseFloat(match[1]);
        break;
      }
    }
    
    // Fractional Shortening
    const fsPatterns = [
      /(?:fs|fractional shortening)[:\s]*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*%.*fs/i,
      /fs.*?(\d+(?:\.\d+)?)/i
    ];
    for (const pattern of fsPatterns) {
      const match = text.match(pattern);
      if (match) {
        parameters.fractionalShortening = parseFloat(match[1]);
        break;
      }
    }
    
    return parameters;
  }
}

export default OCRService; 