import type { Language } from '@/types';

/**
 * Speech utility that accurately handles Hindi (hi-IN), Marathi (mr-IN), and English (en-IN)
 * with authentic native Indian voices, correct pronunciation rate, and Devanagari fallback.
 */

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export function getBestVoice(lang: Language): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Direct exact BCP-47 match
  if (lang === 'mr') {
    const mrVoice = voices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l === 'mr-in' || l === 'mr' || /marathi/i.test(v.name);
    });
    if (mrVoice) return mrVoice;

    // Marathi uses Devanagari script; if no native Marathi TTS engine is present,
    // Hindi voices pronounce Devanagari accurately with an authentic Indian accent
    const hiFallback = voices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l === 'hi-in' || l === 'hi' || /hindi|kalpana|hemant|swara/i.test(v.name);
    });
    if (hiFallback) return hiFallback;
  }

  if (lang === 'hi') {
    const hiVoice = voices.find((v) => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l === 'hi-in' || l === 'hi' || /hindi|kalpana|hemant|swara|madhur/i.test(v.name);
    });
    if (hiVoice) return hiVoice;
  }

  // Indian English or general English
  const inEnVoice = voices.find((v) => {
    const l = v.lang.toLowerCase().replace('_', '-');
    return l === 'en-in' || /india|neerja|prabhat|ravi/i.test(v.name);
  });
  if (inEnVoice) return inEnVoice;

  return voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
}

export function speak(text: string, lang: Language = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Cancel prior utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Set BCP-47 language tag
  if (lang === 'hi') {
    utterance.lang = 'hi-IN';
    utterance.rate = 0.86;
    utterance.pitch = 1.0;
  } else if (lang === 'mr') {
    utterance.lang = 'mr-IN';
    utterance.rate = 0.86;
    utterance.pitch = 1.0;
  } else {
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
  }

  const voice = getBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  // If voices haven't loaded yet in Chrome, wait for onvoiceschanged
  const currentVoices = window.speechSynthesis.getVoices();
  if (!currentVoices || currentVoices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
      const v = getBestVoice(lang);
      if (v) utterance.voice = v;
      window.speechSynthesis.speak(utterance);
    };
    return;
  }

  window.speechSynthesis.speak(utterance);
}

// -----------------------------------------------------------------------------
// Speech Recognition (Speech-to-Text) for Vernacular Voice Input
// -----------------------------------------------------------------------------

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function startSpeechRecognition({
  language,
  onResult,
  onError,
  onEnd,
}: {
  language: Language;
  onResult: (transcript: string) => void;
  onError?: (err: any) => void;
  onEnd?: () => void;
}): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    console.warn('SpeechRecognition is not supported in this browser.');
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  if (language === 'hi') {
    recognition.lang = 'hi-IN';
  } else if (language === 'mr') {
    recognition.lang = 'mr-IN';
  } else {
    recognition.lang = 'en-IN';
  }

  recognition.onresult = (event: any) => {
    const transcript = event.results[0]?.[0]?.transcript;
    if (transcript) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
  } catch (err) {
    console.error('Failed to start recognition:', err);
    if (onError) onError(err);
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {}
    },
  };
}

