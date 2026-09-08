import { useState, useRef } from 'react';
import {
  Camera,
  Check,
  ChevronLeft,
  Image as ImageIcon,
  Sparkles,
  Scale,
  Plus,
  Minus,
  MapPin,
  WifiOff,
  Mic,
  MicOff,
  Volume2,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  ScanLine,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MATERIAL_CATEGORIES, MATERIAL_PHOTOS, DEMO_PHOTO_URL } from '@/data/mockData';
import type { MaterialCategory } from '@/types';
import { classifyEwasteImage, processVoiceQuery, type ImageClassificationResult } from '@/services/aiService';
import { speak, startSpeechRecognition, isSpeechRecognitionSupported } from '@/services/speech';

interface CreateLotProps {
  onComplete: (material: MaterialCategory, weightKg: number) => void;
  onBack: () => void;
}

export function CreateLot({ onComplete, onBack }: CreateLotProps) {
  const { t, language, prices, createLot, online } = useApp();
  const [step, setStep] = useState(1);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCategory>('PCB');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [location, setLocation] = useState<string>('Pune (Hadapsar)');

  // AI Vision & Voice States
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiVisionResult, setAiVisionResult] = useState<ImageClassificationResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const materialIcons: Record<MaterialCategory, string> = {
    PCB: '🔌',
    Cable: '🔗',
    Battery: '🔋',
    LCD: '🖥️',
    Motor: '⚙️',
    'Mixed Plastic': '🧴',
  };

  const currentPhotoUrl = customPhotoUrl || MATERIAL_PHOTOS[selectedMaterial] || DEMO_PHOTO_URL;
  const currentRefPrice = prices[selectedMaterial]?.referencePricePerKg ?? 320;
  const estimatedValue = Math.round(weightKg * currentRefPrice);

  const handleAdjustWeight = (delta: number) => {
    setWeightKg((prev) => Math.max(1, Math.round((prev + delta) * 10) / 10));
  };

  // Image upload and AI Vision classification
  const handlePhotoUpload = async (file: File) => {
    setPhotoTaken(true);
    setIsAnalyzingImage(true);

    // Create local object URL for preview
    const localUrl = URL.createObjectURL(file);
    setCustomPhotoUrl(localUrl);

    try {
      const result = await classifyEwasteImage(file, selectedMaterial);
      setAiVisionResult(result);
      if (result.material) {
        setSelectedMaterial(result.material);
        // Play brief localized voice feedback
        const speechMsg =
          language === 'hi'
            ? `एआई ने पहचाना: ${result.material_name}, शुद्धता ${result.confidence_percentage}`
            : language === 'mr'
            ? `एआय ने ओळखले: ${result.material_name}, खात्री ${result.confidence_percentage}`
            : `AI recognized ${result.material_name} with ${result.confidence_percentage} confidence`;
        speak(speechMsg, language);
      }
    } catch (err) {
      console.error('AI classification error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const triggerDefaultCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setPhotoTaken(true);
    }
  };

  // Vernacular Voice Assistant
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      // Fallback simulation for unsupported browsers
      const sampleQueries = {
        hi: 'पाच किलो बैटरी का रेट बताओ',
        mr: 'दहा किलो केबल विकायची आहे',
        en: '10 kg computer PCB lot',
      };
      const simulatedQuery = sampleQueries[language] || sampleQueries.en;
      handleVoiceQuery(simulatedQuery);
      return;
    }

    setIsListening(true);
    setVoiceNotice(
      language === 'hi'
        ? 'बोलिए... (उदा. "10 किलो बैटरी" या "पाच किलो केबल")'
        : language === 'mr'
        ? 'बोला... (उदा. "५ किलो बॅटरी" किंवा "१० किलो केबल")'
        : 'Listening... (e.g. "10 kg battery" or "5 kg PCB")'
    );

    recognitionRef.current = startSpeechRecognition({
      language,
      onResult: (transcript) => {
        setIsListening(false);
        handleVoiceQuery(transcript);
      },
      onError: () => {
        setIsListening(false);
        setVoiceNotice(null);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleVoiceQuery = async (query: string) => {
    setVoiceNotice(`"${query}"`);
    try {
      const result = await processVoiceQuery(query, language);
      if (result.detected_material) {
        setSelectedMaterial(result.detected_material);
      }
      if (result.detected_weight_kg) {
        setWeightKg(result.detected_weight_kg);
      }
      // Speak AI response aloud
      if (result.spoken_response) {
        speak(result.spoken_response, language);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinish = () => {
    createLot({
      material: selectedMaterial,
      weightKg,
      photoUrl: currentPhotoUrl,
      location,
    });
    onComplete(selectedMaterial, weightKg);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Hidden File Picker for Real Camera/Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Back + Step indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {t('step')} {step} {t('of')} 3 —{' '}
            {step === 1 ? t('photograph') : step === 2 ? t('categorize') : t('weight')}
          </p>
        </div>
      </div>

      {/* Voice Assistant Mic Banner across all steps */}
      <div className="p-3 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-white/20'
            }`}
          >
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block text-white">
              {language === 'hi'
                ? 'आवाज से ई-वेस्ट जोड़ें'
                : language === 'mr'
                ? 'आवाजाने ई-कचरा नोंदवा'
                : 'Vernacular AI Voice Assistant'}
            </span>
            <span className="text-[11px] text-emerald-200 block truncate">
              {voiceNotice ||
                (language === 'hi'
                  ? 'बोलिए: "10 किलो बैटरी" या "5 किलो केबल"'
                  : language === 'mr'
                  ? 'बोला: "५ किलो बॅटरी" किंवा "१० किलो वायर"'
                  : 'Tap mic & speak e.g. "10 kg battery"')}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleVoice}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            isListening
              ? 'bg-red-600 text-white animate-bounce'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" /> Stop
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              {language === 'hi' ? 'बोलें' : language === 'mr' ? 'बोला' : 'Speak'}
            </>
          )}
        </button>
      </div>

      {/* Step 1 — Photograph with Real Capture & AI Vision */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t('photograph')}</h2>
              <p className="text-xs text-gray-500">
                Eco-Link AI will automatically identify the e-waste category.
              </p>
            </div>
            {!online && (
              <Badge variant="warning">
                <WifiOff className="w-3 h-3" /> Offline Mode
              </Badge>
            )}
          </div>

          <div
            onClick={triggerDefaultCamera}
            className="w-full aspect-square max-h-72 rounded-2xl border-2 border-dashed border-green-400 bg-green-50/70 flex flex-col items-center justify-center gap-3 hover:bg-green-100/70 transition-colors overflow-hidden relative cursor-pointer group"
          >
            {photoTaken ? (
              <>
                <img
                  src={currentPhotoUrl}
                  alt="E-waste"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* AI Laser Scanning Overlay Animation */}
                {isAnalyzingImage && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-10">
                    <div className="w-full h-1 bg-green-400 shadow-[0_0_15px_#22c55e] animate-pulse absolute top-1/2 -translate-y-1/2" />
                    <ScanLine className="w-10 h-10 text-green-400 animate-spin mb-2" />
                    <span className="text-xs font-bold tracking-wider uppercase text-green-300">
                      Eco-Link Vision AI Analyzing...
                    </span>
                    <span className="text-[10px] text-white/80 mt-1">
                      Detecting circuitry, copper traces & polymers
                    </span>
                  </div>
                )}

                {!isAnalyzingImage && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      Captured
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
                  <Camera className="w-8 h-8" strokeWidth={1.8} />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-bold text-green-900">
                    {t('camera_area')}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Click to capture from camera or choose photo from gallery
                  </p>
                </div>
                <span className="text-xs text-gray-800 bg-white px-3.5 py-1.5 rounded-full font-bold border border-green-200 shadow-xs flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-green-600" />
                  {t('tap_to_capture')}
                </span>
              </>
            )}
          </div>

          {/* AI Detection Preview Card if photo taken */}
          {photoTaken && (
            <Card className="p-3.5 bg-cyan-50/80 border-cyan-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-cyan-950">
                    AI Auto-Classified: {selectedMaterial}
                  </span>
                </div>
                <span className="text-[11px] font-bold font-mono bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                  {aiVisionResult?.confidence_percentage || '94% Match'}
                </span>
              </div>

              {aiVisionResult?.detected_features && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiVisionResult.detected_features.slice(0, 3).map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-white text-cyan-800 px-2 py-0.5 rounded-md border border-cyan-200"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-cyan-200/60 text-xs">
                <button
                  type="button"
                  onClick={triggerDefaultCamera}
                  className="text-cyan-800 font-semibold hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> {t('retake_photo')}
                </button>
                <span className="text-gray-500 text-[11px]">
                  Estimated ₹{prices[selectedMaterial]?.referencePricePerKg ?? 320}/kg
                </span>
              </div>
            </Card>
          )}

          <Button
            fullWidth
            size="lg"
            disabled={!photoTaken || isAnalyzingImage}
            onClick={() => setStep(2)}
          >
            {t('continue')}
          </Button>
        </div>
      )}

      {/* Step 2 — Categorize & AI Feature Inspection */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">{t('select_material')}</h2>
            <Badge variant="info">AI Verified</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {MATERIAL_CATEGORIES.map((mat) => {
              const isSelected = selectedMaterial === mat;
              const refPrice = prices[mat]?.referencePricePerKg ?? 0;
              return (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`rounded-2xl p-3.5 border-2 text-left transition-all duration-150 active:scale-[0.98] ${
                    isSelected
                      ? 'border-green-600 bg-green-50 shadow-sm ring-1 ring-green-600/30'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{materialIcons[mat]}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      ₹{refPrice}/kg
                    </span>
                  </div>
                  <p
                    className={`font-bold text-base ${
                      isSelected ? 'text-green-800' : 'text-gray-800'
                    }`}
                  >
                    {t(mat)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* AI Recognition & Hazard Advisory Card */}
          <Card className="bg-cyan-50 border-cyan-200 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-cyan-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-bold text-cyan-950">
                    {t('ai_suggestion_badge')}: {t(selectedMaterial)}
                  </p>
                  <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full font-mono">
                    {aiVisionResult?.confidence_percentage || '94% Confidence'}
                  </span>
                </div>
                <p className="text-xs text-cyan-900 mt-1 leading-relaxed">
                  {aiVisionResult?.safety_advisory?.[language] ||
                    aiVisionResult?.safety_advisory?.en ||
                    t('ai_verified_desc')}
                </p>
              </div>
            </div>

            {/* Hazardous components chips */}
            {aiVisionResult?.hazardous_elements && (
              <div className="pt-2 border-t border-cyan-200/70 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Hazard Control:
                </span>
                {aiVisionResult.hazardous_elements.map((el, i) => (
                  <span key={i} className="bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded font-medium">
                    {el}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <Button fullWidth size="lg" onClick={() => setStep(3)}>
            {t('confirm_material')}
          </Button>
        </div>
      )}

      {/* Step 3 — Weight, Location & Fair Valuation */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">{t('weight')}</h2>

          {/* Interactive Weight Display & Stepper */}
          <Card className="p-6 text-center">
            <Scale className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-3 my-3">
              <button
                onClick={() => handleAdjustWeight(-1)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800 transition-colors shadow-2xs"
                title="Decrease 1 kg"
              >
                <Minus className="w-6 h-6" />
              </button>
              <div className="flex items-baseline justify-center min-w-[140px]">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-28 text-center text-5xl font-black text-gray-800 border-b-2 border-gray-200 focus:outline-none focus:border-green-600 bg-transparent"
                />
                <span className="text-2xl font-bold text-gray-400 ml-1.5">kg</span>
              </div>
              <button
                onClick={() => handleAdjustWeight(1)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800 transition-colors shadow-2xs"
                title="Increase 1 kg"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center justify-center gap-2.5 mt-4 pt-3 border-t border-gray-100">
              {[+2, +5, +10].map((inc) => (
                <button
                  key={inc}
                  onClick={() => handleAdjustWeight(inc)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                >
                  +{inc} kg
                </button>
              ))}
            </div>
          </Card>

          {/* Location field */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm">
            <MapPin className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-gray-500 text-xs">{t('location')}:</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 font-semibold text-gray-800 focus:outline-none bg-transparent"
              placeholder="e.g. Pune (Hadapsar MIDC)"
            />
          </div>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">
                {t(selectedMaterial)} {t('reference_price')}
              </span>
              <span className="text-lg font-black text-green-700">
                ₹{currentRefPrice}/kg
              </span>
            </div>
          </Card>

          <Card className="bg-green-600 border-green-600 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-green-100 block">
                  {t('estimated_value')}
                </span>
                <span className="text-xs text-green-200">
                  {weightKg} kg × ₹{currentRefPrice}/kg
                </span>
              </div>
              <span className="text-2xl font-black text-white">
                ₹{estimatedValue.toLocaleString('en-IN')}
              </span>
            </div>
          </Card>

          {!online && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Offline Mode active: Lot will be saved locally and submitted to recyclers upon reconnecting.
            </div>
          )}

          <Button fullWidth size="lg" onClick={handleFinish}>
            {t('find_recycler')}
          </Button>
        </div>
      )}
    </div>
  );
}
