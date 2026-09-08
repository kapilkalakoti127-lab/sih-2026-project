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
  detected_material: MaterialCategory;
  detected_weight_kg: number;
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
  informal_dealer_rate_per_kg: number;
  formal_total_payout: number;
  informal_total_payout: number;
  extra_collector_earnings: number;
  percentage_gain: number;
  price_range: {
    min_per_kg: number;
    max_per_kg: number;
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
  };

  const hazards: Record<MaterialCategory, { level: 'Low' | 'Moderate' | 'High' | 'Severe'; elements: string[] }> = {
    PCB: { level: 'High', elements: ['Lead solder', 'Brominated flame retardants', 'Cadmium'] },
    Cable: { level: 'Moderate', elements: ['PVC plasticizers', 'Dioxins (when burnt)'] },
    Battery: { level: 'Severe', elements: ['Sulfuric acid', 'Cobalt', 'Lithium'] },
    LCD: { level: 'Moderate', elements: ['Mercury cold-cathode lamps', 'Indium'] },
    Motor: { level: 'Low', elements: ['Insulation resin', 'Machine oil'] },
    'Mixed Plastic': { level: 'Low', elements: ['Flame retardant additives'] },
  };

  return {
    material: mat,
    material_name: mat,
    confidence: 0.93,
    confidence_percentage: '93%',
    probabilities: { [mat]: 0.93 },
    detected_features: features[mat],
    hazardous_elements: hazards[mat].elements,
    hazard_level: hazards[mat].level,
    recovered_materials: ['Copper', 'Gold', 'Silicon'],
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
  const formalPayout = Math.round(weightKg * fairRate);
  const informalPayout = Math.round(weightKg * informal);

  return {
    material,
    weight_kg: weightKg,
    location: location || 'Pune',
    cluster_name: 'Pune Industrial Cluster',
    benchmark_price_per_kg: base,
    authorized_fair_rate_per_kg: fairRate,
    informal_dealer_rate_per_kg: informal,
    formal_total_payout: formalPayout,
    informal_total_payout: informalPayout,
    extra_collector_earnings: formalPayout - informalPayout,
    percentage_gain: Math.round(((formalPayout - informalPayout) / Math.max(1, informalPayout)) * 100),
    price_range: {
      min_per_kg: Math.round(base * 0.9),
      max_per_kg: Math.round(base * 1.15),
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
  try {
    let response: Response;
    if (typeof imageFileOrBase64 === 'string') {
      response = await fetch(`${BACKEND_URL}/api/ai/classify-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageFileOrBase64 }),
      });
    } else {
      const formData = new FormData();
      formData.append('photo', imageFileOrBase64);
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
    return getOfflineImageClassification(materialHint);
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
    // Simple client-side fallback
    let mat: MaterialCategory = 'PCB';
    const q = query.toLowerCase();
    if (q.includes('battery') || q.includes('बैटरी') || q.includes('बॅटरी')) mat = 'Battery';
    else if (q.includes('cable') || q.includes('तार') || q.includes('वायर')) mat = 'Cable';
    else if (q.includes('lcd') || q.includes('स्क्रीन') || q.includes('कांच')) mat = 'LCD';
    else if (q.includes('motor') || q.includes('मोटर') || q.includes('पंप')) mat = 'Motor';
    else if (q.includes('plastic') || q.includes('प्लास्टिक')) mat = 'Mixed Plastic';

    const weightMatch = query.match(/(\d+(?:\.\d+)?)/);
    const weightKg = weightMatch ? parseFloat(weightMatch[1]) : 5.0;
    const rate = DEFAULT_PRICES[mat]?.referencePricePerKg ?? 250;
    const total = Math.round(weightKg * rate);

    let spoken = `Got it! Detected ${weightKg} kg of ${mat}. Estimated value is ₹${total}.`;
    if (language === 'hi') {
      spoken = `समझ गया! ${weightKg} किलो ${mat} पहचाना गया। अनुमानित कीमत ₹${total} है।`;
    } else if (language === 'mr') {
      spoken = `समजले! ${weightKg} किलो ${mat} नोंदवले. अंदाजे रक्कम ₹${total} मिळेल.`;
    }

    return {
      intent: 'create_lot',
      detected_material: mat,
      detected_weight_kg: weightKg,
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
