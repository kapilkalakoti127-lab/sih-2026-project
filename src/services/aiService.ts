/**
 * Eco-Link AI Service Client
 * ===========================
 * Connects frontend to Python AI Backend (Vision, Voice NLP, Price Intelligence)
 * with graceful offline-first fallback.
 */

import type { MaterialCategory, Language } from '@/types';
import { DEFAULT_PRICES } from '@/data/mockData';

const BACKEND_URL = 'http://localhost:5000';

export interface ImageClassificationResult {
  material: MaterialCategory;
  material_name: string;
  confidence: number;
  confidence_percentage: string;
  is_low_confidence?: boolean;
  warning?: string;
  probabilities: Record<string, number>;
  detected_features: string[];
  hazardous_elements: string[];
  hazard_level: 'Low' | 'Moderate' | 'High' | 'Severe';
  recovered_materials: string[];
  suggested_price_per_kg: number;
  safety_advisory: Record<string, string>;
  isOfflineFallback?: boolean;
}

export interface VoiceAssistResult {
  intent: 'create_lot' | 'query_price' | 'safety_help' | 'find_recycler';
  detected_material?: MaterialCategory | null;
  detected_weight_kg?: number | null;
  fallback_material?: MaterialCategory;
  fallback_weight_kg?: number;
  requires_confirmation?: boolean;
  missing_field?: 'weight' | 'material' | 'both' | null;
  unit_rate: number;
  estimated_total: number;
  spoken_response: string;
  hazard_level: string;
  safety_advisory: string;
  isOfflineFallback?: boolean;
}

export interface PriceIntelligenceResult {
  material: MaterialCategory;
  weight_kg: number;
  location: string;
  cluster_name: string;
  benchmark_price_per_kg: number;
  authorized_fair_rate_per_kg: number;
  average_market_price_per_kg: number;
  informal_dealer_rate_per_kg: number;
  formal_total_payout: number;
  informal_total_payout: number;
  average_total_payout: number;
  extra_collector_earnings: number;
  percentage_gain: number;
  price_range: {
    min_per_kg: number;
    max_per_kg: number;
    average_per_kg?: number;
    median_per_kg: number;
  };
  forecast_7_day: {
    trend: 'up' | 'down' | 'stable';
    pct: number;
    reason: string;
  };
  isOfflineFallback?: boolean;
}

// -----------------------------------------------------------------------------
// Offline Heuristic Fallback Generators
// -----------------------------------------------------------------------------
function getOfflineImageClassification(materialHint?: MaterialCategory): ImageClassificationResult {
  const mat: MaterialCategory = materialHint || 'PCB';
  const features: Record<MaterialCategory, string[]> = {
    PCB: ['Green Fiberglass Substrate', 'Gold/Copper Traces', 'SMD Chips'],
    Cable: ['Multi-strand Copper Core', 'PVC Insulating Jacket', 'Coiled Wire'],
    Battery: ['Lead Terminals', 'Lithium Cells', 'Acid Seal Enclosure'],
    LCD: ['Polarized Glass Matrix', 'Diffuser Layer', 'Thin Bezel'],
    Motor: ['Copper Wound Stator', 'Iron Lamination Stack', 'Rotor Spindle'],
    'Mixed Plastic': ['Molded ABS Enclosure', 'Polymer Ribs', 'Recycle Code'],
    Metal: ['Metallic Luster', 'Heavy Machined Surface', 'High Density'],
    'Chargers / Adapters': ['Molded Transformer Shell', 'Plug Pins', 'Insulated Cord'],
    'Other E-Waste': ['Mixed Assembly Scrap', 'Composite Components', 'Small Appliances'],
  };

  const hazards: Record<MaterialCategory, { level: 'Low' | 'Moderate' | 'High' | 'Severe'; elements: string[] }> = {
    PCB: { level: 'High', elements: ['Lead solder', 'Brominated flame retardants', 'Cadmium'] },
    Cable: { level: 'Moderate', elements: ['PVC plasticizers', 'Dioxins (when burnt)'] },
    Battery: { level: 'Severe', elements: ['Sulfuric acid', 'Cobalt', 'Lithium'] },
    LCD: { level: 'Moderate', elements: ['Mercury cold-cathode lamps', 'Indium'] },
    Motor: { level: 'Low', elements: ['Insulation resin', 'Machine oil'] },
    'Mixed Plastic': { level: 'Low', elements: ['Flame retardant additives'] },
    Metal: { level: 'Low', elements: ['Heavy metal traces', 'Machining lubricants'] },
    'Chargers / Adapters': { level: 'Low', elements: ['Flame retardants', 'Internal capacitors'] },
    'Other E-Waste': { level: 'Moderate', elements: ['Mixed heavy metal residues'] },
  };

  const isLowConfidence = mat === 'Other E-Waste';

  return {
    material: mat,
    material_name: mat,
    confidence: isLowConfidence ? 0.45 : 0.88,
    confidence_percentage: isLowConfidence ? '45%' : '88%',
    is_low_confidence: isLowConfidence,
    warning: isLowConfidence ? 'Low confidence — please verify material manually.' : undefined,
    probabilities: { [mat]: isLowConfidence ? 0.45 : 0.88 },
    detected_features: features[mat] || features['Other E-Waste'],
    hazardous_elements: hazards[mat]?.elements || hazards['Other E-Waste'].elements,
    hazard_level: hazards[mat]?.level || 'Moderate',
    recovered_materials: ['Copper', 'Gold', 'Silicon', 'Aluminum'],
    suggested_price_per_kg: DEFAULT_PRICES[mat]?.referencePricePerKg ?? 250,
    safety_advisory: {
      en: 'Deliver intact to verified recyclers. Strictly avoid burning or acid extraction.',
      hi: 'सामग्री को न जलाएं। सुरक्षित रीसाइक्लिंग के लिए अधिकृत केंद्र को दें।',
      mr: 'कचरा उघड्यावर जाळू नका. सुरक्षित विल्हेवाटीसाठी अधिकृत रीसायकलरकडे द्या.',
    },
    isOfflineFallback: true,
  };
}

function getOfflinePriceIntelligence(
  material: MaterialCategory,
  weightKg: number,
  location: string
): PriceIntelligenceResult {
  const base = DEFAULT_PRICES[material]?.referencePricePerKg ?? 250;
  const informal = Math.round(base * 0.8);
  const fairRate = Math.round(base * 1.08);
  const avgRate = Math.round((base + informal + fairRate) / 3);
  const formalPayout = Math.round(weightKg * fairRate);
  const informalPayout = Math.round(weightKg * informal);
  const avgPayout = Math.round(weightKg * avgRate);

  return {
    material,
    weight_kg: weightKg,
    location: location || 'Pune',
    cluster_name: 'Pune Industrial Cluster',
    benchmark_price_per_kg: base,
    authorized_fair_rate_per_kg: fairRate,
    average_market_price_per_kg: avgRate,
    informal_dealer_rate_per_kg: informal,
    formal_total_payout: formalPayout,
    informal_total_payout: informalPayout,
    average_total_payout: avgPayout,
    extra_collector_earnings: formalPayout - informalPayout,
    percentage_gain: Math.round(((formalPayout - informalPayout) / Math.max(1, informalPayout)) * 100),
    price_range: {
      min_per_kg: Math.round(base * 0.9),
      max_per_kg: Math.round(base * 1.15),
      average_per_kg: avgRate,
      median_per_kg: fairRate,
    },
    forecast_7_day: {
      trend: 'up',
      pct: 3.5,
      reason: 'Industrial demand for recycled secondary metals remains strong.',
    },
    isOfflineFallback: true,
  };
}

// -----------------------------------------------------------------------------
// Public AI Methods with Automatic Network Detection
// -----------------------------------------------------------------------------

/**
 * Classify an e-waste photograph using the Computer Vision model.
 */
export async function classifyEwasteImage(
  imageFileOrBase64: File | string,
  materialHint?: MaterialCategory
): Promise<ImageClassificationResult> {
  const fileName = typeof imageFileOrBase64 !== 'string' ? imageFileOrBase64.name : '';
  let fallbackHint = materialHint;
  if (!fallbackHint && fileName) {
    const fn = fileName.toLowerCase();
    if (fn.includes('pcb') || fn.includes('circuit') || fn.includes('motherboard')) fallbackHint = 'PCB';
    else if (fn.includes('cable') || fn.includes('wire') || fn.includes('cord')) fallbackHint = 'Cable';
    else if (fn.includes('battery') || fn.includes('cell') || fn.includes('lead') || fn.includes('lithium')) fallbackHint = 'Battery';
    else if (fn.includes('lcd') || fn.includes('screen') || fn.includes('display') || fn.includes('monitor')) fallbackHint = 'LCD';
    else if (fn.includes('motor') || fn.includes('stator') || fn.includes('coil') || fn.includes('pump')) fallbackHint = 'Motor';
    else if (fn.includes('plastic') || fn.includes('casing') || fn.includes('cabinet')) fallbackHint = 'Mixed Plastic';
    else if (fn.includes('metal') || fn.includes('iron') || fn.includes('steel') || fn.includes('aluminum')) fallbackHint = 'Metal';
    else if (fn.includes('charger') || fn.includes('adapter') || fn.includes('plug')) fallbackHint = 'Chargers / Adapters';
  }

  try {
    let response: Response;
    if (typeof imageFileOrBase64 === 'string') {
      response = await fetch(`${BACKEND_URL}/api/ai/classify-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: imageFileOrBase64,
          filename: fallbackHint || fileName || ''
        }),
      });
    } else {
      const formData = new FormData();
      formData.append('photo', imageFileOrBase64);
      formData.append('filename', fileName || fallbackHint || '');
      response = await fetch(`${BACKEND_URL}/api/ai/classify-image`, {
        method: 'POST',
        body: formData,
      });
    }

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('AI Backend unreachable for image classification, using offline-first AI model:', error);
    return getOfflineImageClassification(fallbackHint);
  }
}

/**
 * Process a vernacular speech query in Hindi, Marathi, or English.
 */
export async function processVoiceQuery(
  query: string,
  language: Language = 'en'
): Promise<VoiceAssistResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/voice-assist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('AI Backend unreachable for voice assist, using offline rule engine:', error);
    // Offline rule engine fallback
    let detectedMat: MaterialCategory | null = null;
    const q = query.toLowerCase();
    if (q.includes('battery') || q.includes('बैटरी') || q.includes('बॅटरी')) detectedMat = 'Battery';
    else if (q.includes('cable') || q.includes('wire') || q.includes('तार') || q.includes('वायर')) detectedMat = 'Cable';
    else if (q.includes('lcd') || q.includes('screen') || q.includes('स्क्रीन') || q.includes('कांच')) detectedMat = 'LCD';
    else if (q.includes('motor') || q.includes('मोटर') || q.includes('पंप')) detectedMat = 'Motor';
    else if (q.includes('plastic') || q.includes('प्लास्टिक') || q.includes('प्लॅस्टिक')) detectedMat = 'Mixed Plastic';
    else if (q.includes('metal') || q.includes('लोहा') || q.includes('धातू') || q.includes('धातु')) detectedMat = 'Metal';
    else if (q.includes('charger') || q.includes('adapter') || q.includes('चार्जर') || q.includes('अडॅप्टर')) detectedMat = 'Chargers / Adapters';
    else if (q.includes('pcb') || q.includes('circuit') || q.includes('सर्किट') || q.includes('मदरबोर्ड') || q.includes('component') || q.includes('chip') || q.includes('ic') || q.includes('कंपोनेंट')) detectedMat = 'PCB';

    // Normalize devanagari digits
    const devDigits = '०१२३४५६७८९';
    let qNorm = query;
    for (let i = 0; i < devDigits.length; i++) {
      qNorm = qNorm.split(devDigits[i]).join(String(i));
    }

    const weightMatch = qNorm.match(/(\d+(?:\.\d+)?)/);
    const detectedWeight: number | null = weightMatch ? parseFloat(weightMatch[1]) : null;

    const requiresConfirmation = !detectedMat || !detectedWeight;
    const missingField = !detectedMat && !detectedWeight ? 'both' : !detectedMat ? 'material' : !detectedWeight ? 'weight' : null;

    const fallbackMat: MaterialCategory = detectedMat || 'Other E-Waste';
    const fallbackWt: number = detectedWeight || 5.0;
    const rate = DEFAULT_PRICES[fallbackMat]?.referencePricePerKg ?? 250;
    const total = Math.round(fallbackWt * rate);

    let spoken = `Got it! Detected ${fallbackWt} kg of ${fallbackMat}. Estimated value is ₹${total}.`;
    if (requiresConfirmation) {
      if (missingField === 'weight') {
        spoken = language === 'hi' ? `${fallbackMat} पहचाना गया। कृपया वजन बताएं (उदा. 5 किलो)।` : language === 'mr' ? `${fallbackMat} ओळखले. कृपया वजन सांगा (उदा. ५ किलो).` : `Detected ${fallbackMat}. Please specify or confirm the weight.`;
      } else if (missingField === 'material') {
        spoken = language === 'hi' ? `${fallbackWt} किलो वजन दर्ज किया गया। कृपया सामग्री चुनें।` : language === 'mr' ? `${fallbackWt} किलो वजन नोंदवले. कृपया सामग्री निवडा.` : `Recorded ${fallbackWt} kg. Please select the material category.`;
      } else {
        spoken = language === 'hi' ? 'सामग्री और वजन स्पष्ट नहीं हो सके। कृपया दोबारा बोलें।' : language === 'mr' ? 'सामग्री आणि वजन स्पष्ट समजले नाही. पुन्हा बोला.' : 'Could not detect material or weight clearly. Please speak again.';
      }
    } else if (language === 'hi') {
      spoken = `समझ गया! ${fallbackWt} किलो ${fallbackMat} पहचाना गया। अनुमानित कीमत ₹${total} है।`;
    } else if (language === 'mr') {
      spoken = `समजले! ${fallbackWt} किलो ${fallbackMat} नोंदवले. अंदाजे रक्कम ₹${total} मिळेल.`;
    }

    return {
      intent: 'create_lot',
      detected_material: detectedMat,
      detected_weight_kg: detectedWeight,
      fallback_material: fallbackMat,
      fallback_weight_kg: fallbackWt,
      requires_confirmation: requiresConfirmation,
      missing_field: missingField,
      unit_rate: rate,
      estimated_total: total,
      spoken_response: spoken,
      hazard_level: 'Moderate',
      safety_advisory: 'Handle safely and hand over to authorized recyclers.',
      isOfflineFallback: true,
    };
  }
}

/**
 * Fetch dynamic price intelligence, cluster premiums, and 7-day trend forecasts.
 */
export async function getAiPriceIntelligence(
  material: MaterialCategory,
  weightKg: number = 10,
  location: string = 'Pune'
): Promise<PriceIntelligenceResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/price-intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ material, weightKg, location }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('AI Backend unreachable for price intelligence, using offline estimator:', error);
    return getOfflinePriceIntelligence(material, weightKg, location);
  }
}
