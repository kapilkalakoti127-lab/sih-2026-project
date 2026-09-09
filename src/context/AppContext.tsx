import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  Language,
  Role,
  MaterialLot,
  Price,
  Recycler,
  Offer,
  HandoverRecord,
  MaterialCategory,
  CollectorProfile,
} from '@/types';
import { translate } from '@/i18n/translations';
import {
  INITIAL_SEED_LOTS,
  INITIAL_SEED_OFFERS,
  INITIAL_SEED_HANDOVERS,
  DEFAULT_PRICES,
  AUTHORIZED_RECYCLERS,
  MATERIAL_PHOTOS,
  demoCollectorProfile,
} from '@/data/mockData';
import {
  fetchLots,
  fetchOffers,
  fetchHandovers,
  fetchRecyclers,
  fetchCollectorProfile,
  createLotApi,
  sendOfferApi,
  acceptOfferApi,
  declineOfferApi,
  completeHandoverApi,
  createCollectorProfileApi,
  createRecyclerApi,
  updateCollectorProfileApi,
  updateRecyclerApi,
  resetBackendDemo,
} from '@/services/api';

interface CreateLotInput {
  material: MaterialCategory;
  weightKg: number;
  photoUrl?: string;
  location?: string;
}

export interface CompleteHandoverOptions {
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash on Pickup';
  verifiedWeightKg?: number;
  vehicleNumber?: string;
  driverName?: string;
  upiId?: string;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  online: boolean;
  setOnline: (o: boolean) => void;
  t: (key: string) => string;

  // Bridge Shared Data
  lots: MaterialLot[];
  activeLotId: string | null;
  activeLot: MaterialLot | null;
  setActiveLotId: (id: string | null) => void;
  offers: Record<string, Offer>;
  handovers: Record<string, HandoverRecord>;
  prices: Record<MaterialCategory, Price>;
  recyclers: Recycler[];
  // Recycler Profile Management
  activeRecyclerId: string;
  activeRecycler: Recycler;
  setActiveRecyclerId: (id: string) => void;
  updateRecyclerProfile: (id: string, updates: Partial<Recycler>) => void;
  collectorProfile: CollectorProfile;
  updateCollectorProfile: (updates: Partial<CollectorProfile>) => void;
  registerCollector: (data: Partial<CollectorProfile>, freshData?: boolean) => Promise<CollectorProfile>;
  registerRecycler: (data: Partial<Recycler>) => Promise<Recycler>;
  bridgeNotification: string | null;
  clearNotification: () => void;

  // Bridge Actions
  createLot: (input: CreateLotInput) => MaterialLot;
  selectRecyclerForLot: (lotId: string, recyclerId: string) => void;
  sendOffer: (
    lotId: string,
    recyclerId: string,
    pricePerKg: number,
    pickupAvailable: boolean,
    notes?: string
  ) => void;
  acceptOffer: (lotId: string) => void;
  declineOffer: (lotId: string) => void;
  completeHandover: (
    lotId: string,
    optionsOrMethod?: 'UPI' | 'Bank Transfer' | 'Cash on Pickup' | CompleteHandoverOptions
  ) => void;
  syncOfflineLots: () => void;
  resetDemo: () => void;
}

const STORAGE_KEY = 'ecolink_state_v2';

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Always open the main menu page first when the app loads
  const [role, setRole] = useState<Role>(null);

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ecolink_lang');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [online, setOnlineState] = useState<boolean>(true);

  // Initialize shared state from localStorage if available
  const [lots, setLots] = useState<MaterialLot[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lots`);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load lots from localStorage', e);
    }
    return INITIAL_SEED_LOTS;
  });

  const [activeLotId, setActiveLotId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activeLotId`);
      if (saved !== null) return saved || null;
    } catch {}
    return null;
  });

  const [offers, setOffers] = useState<Record<string, Offer>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return INITIAL_SEED_OFFERS;
  });

  const [handovers, setHandovers] = useState<Record<string, HandoverRecord>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_handovers`);
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return INITIAL_SEED_HANDOVERS;
  });

  const [prices] = useState<Record<MaterialCategory, Price>>(DEFAULT_PRICES);
  const [recyclers, setRecyclers] = useState<Recycler[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_recyclers`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return AUTHORIZED_RECYCLERS;
  });

  const [activeRecyclerId, setActiveRecyclerId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activeRecyclerId`);
      if (saved) return saved;
    } catch {}
    return AUTHORIZED_RECYCLERS[0]?.id || 'REC-002';
  });

  const activeRecycler =
    recyclers.find((r) => r.id === activeRecyclerId) || recyclers[0] || AUTHORIZED_RECYCLERS[0];

  // Update profiles
  const updateRecyclerProfile = (id: string, updates: Partial<Recycler>) => {
    setRecyclers((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...updates } : r));
      try {
        localStorage.setItem(`${STORAGE_KEY}_recyclers`, JSON.stringify(next));
      } catch {}
      return next;
    });
    updateRecyclerApi(id, updates).catch((err) => console.warn('Sync recycler profile err:', err));
  };

  const [collectorProfile, setCollectorProfile] = useState<CollectorProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_collector_profile`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return demoCollectorProfile;
  });

  const updateCollectorProfile = (updates: Partial<CollectorProfile>) => {
    setCollectorProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(`${STORAGE_KEY}_collector_profile`, JSON.stringify(next));
      } catch {}
      return next;
    });
    updateCollectorProfileApi(updates).catch((err) => console.warn('Sync collector profile err:', err));
  };

  const registerCollector = async (
    data: Partial<CollectorProfile>,
    freshData: boolean = true
  ): Promise<CollectorProfile> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newProfile: CollectorProfile = {
      id: data.id || `KAB-PUN-${randomSuffix}`,
      name: data.name || 'New Scrap Collector',
      phone: data.phone || '+91 98000 00000',
      location: data.location || 'Pune City',
      zone: data.zone || 'Zone-Central',
      upiId: data.upiId || `${(data.name || 'collector').toLowerCase().replace(/\s+/g, '')}@okaxis`,
      registrationDate: new Date().toISOString().split('T')[0],
      kycStatus: 'Verified',
      badgeTitle: 'Registered Green Collector',
      totalLotsCompleted: 0,
    };

    setCollectorProfile(newProfile);
    try {
      localStorage.setItem(`${STORAGE_KEY}_collector_profile`, JSON.stringify(newProfile));
    } catch {}

    if (freshData) {
      // Clear lots and offers for a fresh, clean account experience
      setLots([]);
      setOffers({});
      setHandovers({});
      setActiveLotId(null);
      try {
        localStorage.setItem(`${STORAGE_KEY}_lots`, JSON.stringify([]));
        localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify({}));
        localStorage.setItem(`${STORAGE_KEY}_handovers`, JSON.stringify({}));
        localStorage.removeItem(`${STORAGE_KEY}_activeLotId`);
      } catch {}
    }

    setBridgeNotification(`Welcome ${newProfile.name}! New collector account ${newProfile.id} created successfully.`);
    try {
      await createCollectorProfileApi({ ...newProfile, resetLotsForNewUser: freshData });
    } catch (err) {
      console.warn('Sync new collector account err:', err);
    }

    return newProfile;
  };

  const registerRecycler = async (data: Partial<Recycler>): Promise<Recycler> => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newRecycler: Recycler = {
      id: data.id || `REC-FAC-${randomSuffix}`,
      name: data.name || 'New Authorized Recycling Facility',
      authorized: true,
      location: data.location || 'Bhosari MIDC, Pune',
      distanceKm: data.distanceKm ?? 8.5,
      proximityKey: data.proximityKey || 'near',
      materialsAccepted: data.materialsAccepted || [
        'PCB',
        'Cable',
        'Battery',
        'LCD',
        'Motor',
        'Mixed Plastic',
        'Metal',
        'Chargers / Adapters',
        'Other E-Waste',
      ],
      offeredPricePerKg: data.offeredPricePerKg ?? 340,
      pickupAvailable: true,
      matchScore: 98,
      eprLicense: data.eprLicense || `CPCB-EPR-MH-${new Date().getFullYear()}-${randomSuffix}`,
      contactPerson: data.contactPerson || 'Facility Officer',
      phone: data.phone || '+91 98220 00000',
      notes: data.notes || 'State-of-the-art CPCB Authorized E-Waste Processing Plant',
    };

    setRecyclers((prev) => {
      const next = [newRecycler, ...prev.filter((r) => r.id !== newRecycler.id)];
      try {
        localStorage.setItem(`${STORAGE_KEY}_recyclers`, JSON.stringify(next));
      } catch {}
      return next;
    });

    setActiveRecyclerId(newRecycler.id);
    try {
      localStorage.setItem(`${STORAGE_KEY}_activeRecyclerId`, newRecycler.id);
    } catch {}

    setBridgeNotification(`Facility ${newRecycler.name} registered and activated under license ${newRecycler.eprLicense}.`);
    try {
      await createRecyclerApi(newRecycler);
    } catch (err) {
      console.warn('Sync new recycler facility err:', err);
    }

    return newRecycler;
  };

  // Initial fetch and continuous real-time sync from backend REST API
  useEffect(() => {
    let mounted = true;
    async function loadBackendData() {
      try {
        const [lotsData, recyclersData, profileData, offersData, handoversData] = await Promise.allSettled([
          fetchLots(),
          fetchRecyclers(),
          fetchCollectorProfile(),
          fetchOffers(),
          fetchHandovers(),
        ]);

        if (!mounted) return;

        if (lotsData.status === 'fulfilled') {
          setLots(lotsData.value);
          try {
            localStorage.setItem(`${STORAGE_KEY}_lots`, JSON.stringify(lotsData.value));
          } catch {}
        }
        if (recyclersData.status === 'fulfilled' && recyclersData.value.length > 0) {
          setRecyclers(recyclersData.value);
        }
        if (profileData.status === 'fulfilled' && profileData.value) {
          setCollectorProfile(profileData.value);
        }
        if (offersData.status === 'fulfilled') {
          setOffers(offersData.value);
          try {
            localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offersData.value));
          } catch {}
        }
        if (handoversData.status === 'fulfilled') {
          setHandovers(handoversData.value);
          try {
            localStorage.setItem(`${STORAGE_KEY}_handovers`, JSON.stringify(handoversData.value));
          } catch {}
        }
      } catch (err) {
        console.warn('Backend sync failed, staying offline-first:', err);
      }
    }

    loadBackendData();
    // Poll every 3 seconds to keep collector lots and recycler portal in continuous sync
    const interval = setInterval(loadBackendData, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Always keep menu page as the initial landing screen
  useEffect(() => {
    try {
      localStorage.removeItem('ecolink_role');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ecolink_lang', language);
    } catch {}
  }, [language]);

  // Persist lots, offers, handovers
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_lots`, JSON.stringify(lots));
    } catch {}
  }, [lots]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
    } catch {}
  }, [offers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_handovers`, JSON.stringify(handovers));
    } catch {}
  }, [handovers]);

  useEffect(() => {
    try {
      if (activeLotId) localStorage.setItem(`${STORAGE_KEY}_activeLotId`, activeLotId);
    } catch {}
  }, [activeLotId]);

  useEffect(() => {
    try {
      if (activeRecyclerId) localStorage.setItem(`${STORAGE_KEY}_activeRecyclerId`, activeRecyclerId);
    } catch {}
  }, [activeRecyclerId]);

  const [bridgeNotification, setBridgeNotification] = useState<string | null>(null);

  const clearNotification = () => setBridgeNotification(null);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (!bridgeNotification) return;
    const timer = setTimeout(() => {
      setBridgeNotification(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [bridgeNotification]);

  // Realtime cross-tab / multi-window sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEY}_lots` && e.newValue) {
        try {
          setLots(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === `${STORAGE_KEY}_offers` && e.newValue) {
        try {
          setOffers(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === `${STORAGE_KEY}_handovers` && e.newValue) {
        try {
          setHandovers(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === `${STORAGE_KEY}_activeLotId` && e.newValue) {
        setActiveLotId(e.newValue);
      }
      if (e.key === `${STORAGE_KEY}_collector_profile` && e.newValue) {
        try {
          setCollectorProfile(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === `${STORAGE_KEY}_recyclers` && e.newValue) {
        try {
          setRecyclers(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === `${STORAGE_KEY}_activeRecyclerId` && e.newValue) {
        setActiveRecyclerId(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeLot = lots.find((l) => l.lotId === activeLotId) || (lots.length > 0 ? lots[0] : null);

  const t = (key: string) => translate(key, language);

  const setOnline = (isOnline: boolean) => {
    setOnlineState(isOnline);
    if (isOnline) {
      // Auto-sync any offline drafts
      syncOfflineLots();
    }
  };

  const syncOfflineLots = () => {
    setLots((prev) =>
      prev.map((lot) => (lot.isOfflineDraft ? { ...lot, isOfflineDraft: false } : lot))
    );
  };

  const selectRecyclerForLot = (lotId: string, recyclerId: string) => {
    const recycler = recyclers.find((r) => r.id === recyclerId);
    if (!recycler) return;
    setLots((prev) =>
      prev.map((l) => (l.lotId === lotId ? { ...l, matchedRecyclerId: recyclerId } : l))
    );
    setOffers((prev) => {
      const existing = prev[lotId];
      if (!existing) return prev;
      return {
        ...prev,
        [lotId]: {
          ...existing,
          recycler: {
            ...recycler,
            offeredPricePerKg: existing.offeredPricePerKg,
          },
        },
      };
    });
  };

  const createLot = ({
    material,
    weightKg,
    photoUrl,
    location = 'Pune',
  }: CreateLotInput): MaterialLot => {
    const nextNum = lots.length + 1;
    const lotId = `EW-${String(nextNum).padStart(3, '0')}`;
    const priceRef = prices[material]?.referencePricePerKg ?? 250;
    const estimatedValue = Math.round(weightKg * priceRef);

    // Find the best authorized recycler that accepts this material
    const matchedRecycler =
      recyclers.find((r) => r.materialsAccepted.includes(material)) || recyclers[0];

    // Recycler typically offers 5-10% above benchmark for authorized sorting
    const recyclerOfferPrice = Math.round(
      priceRef > 100 ? priceRef + Math.round(priceRef * 0.08) : priceRef + 5
    );
    const totalOfferValue = Math.round(recyclerOfferPrice * weightKg);

    const newLot: MaterialLot = {
      lotId,
      material,
      weightKg,
      photoUrl: photoUrl || MATERIAL_PHOTOS[material] || MATERIAL_PHOTOS.PCB,
      location,
      createdAt: new Date().toISOString(),
      status: 'Created',
      referencePricePerKg: priceRef,
      estimatedValue,
      offeredPricePerKg: recyclerOfferPrice,
      totalOfferValue,
      matchedRecyclerId: matchedRecycler.id,
      pickupAvailable: true,
      isOfflineDraft: !online,
    };

    const initialOffer: Offer = {
      lotId,
      recycler: {
        ...matchedRecycler,
        offeredPricePerKg: recyclerOfferPrice,
      },
      offeredPricePerKg: recyclerOfferPrice,
      totalValue: totalOfferValue,
      pickupAvailable: true,
      status: 'pending',
      notes: `Authorized recycling by ${matchedRecycler.name}. Full CPCB Form-6 certificate provided.`,
    };

    setLots((prev) => [newLot, ...prev]);
    setOffers((prev) => ({ ...prev, [lotId]: initialOffer }));
    setActiveLotId(lotId);
    setBridgeNotification(`New Lot ${lotId} (${weightKg} kg ${material}) registered on the digital bridge!`);

    // Sync to SQLite backend asynchronously
    createLotApi(newLot).catch((err) => console.warn('Create lot API sync err:', err));
    sendOfferApi(initialOffer).catch((err) => console.warn('Initial offer sync err:', err));

    return newLot;
  };

  const sendOffer = (
    lotId: string,
    recyclerId: string,
    pricePerKg: number,
    pickupAvailable: boolean,
    notes?: string
  ) => {
    const lot = lots.find((l) => l.lotId === lotId);
    if (!lot) return;

    const recycler = recyclers.find((r) => r.id === recyclerId) || recyclers[0];
    const totalValue = Math.round(pricePerKg * lot.weightKg);

    const updatedOffer: Offer = {
      lotId,
      recycler: {
        ...recycler,
        offeredPricePerKg: pricePerKg,
        pickupAvailable,
      },
      offeredPricePerKg: pricePerKg,
      totalValue,
      pickupAvailable,
      status: 'pending',
      notes: notes || `Direct authorized offer from ${recycler.name}.`,
    };

    setOffers((prev) => ({ ...prev, [lotId]: updatedOffer }));
    setLots((prev) =>
      prev.map((l) =>
        l.lotId === lotId
          ? {
              ...l,
              status: 'Offered',
              offeredPricePerKg: pricePerKg,
              totalOfferValue: totalValue,
              matchedRecyclerId: recyclerId,
              pickupAvailable,
            }
          : l
      )
    );
    setBridgeNotification(`Recycler ${recycler.name} offered ₹${pricePerKg}/kg on Lot ${lotId}!`);
    sendOfferApi(updatedOffer).catch((err) => console.warn('Send offer API sync err:', err));
  };

  const acceptOffer = (lotId: string) => {
    const lot = lots.find((l) => l.lotId === lotId);
    if (!lot) return;

    const offer = offers[lotId];
    const recycler = offer?.recycler || recyclers.find((r) => r.id === lot.matchedRecyclerId) || recyclers[0];
    const totalValue = offer?.totalValue ?? lot.totalOfferValue ?? lot.estimatedValue;

    const randNum = Math.floor(10000 + Math.random() * 90000);
    const handoverRef = `HOF-PUN-2026-${randNum}`;
    const manifestId = `EPR-FORM6-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newHandover: HandoverRecord = {
      lotId,
      material: lot.material,
      weightKg: lot.weightKg,
      recyclerName: recycler.name,
      recyclerId: recycler.id,
      location: lot.location,
      dateTime: new Date().toISOString(),
      finalValue: totalValue,
      paymentStatus: 'Pending',
      paymentMethod: 'UPI',
      handoverRef,
      confirmed: false,
      manifestId,
      verifiedWeightKg: lot.weightKg,
      vehicleNumber: 'MH-12-QX-4891',
      driverName: 'Ramesh Shinde (Authorized Driver)',
      upiId: collectorProfile.upiId || 'kabadiwala@upi',
    };

    setOffers((prev) =>
      prev[lotId] ? { ...prev, [lotId]: { ...prev[lotId], status: 'accepted' } } : prev
    );

    setHandovers((prev) => ({ ...prev, [lotId]: newHandover }));

    setLots((prev) =>
      prev.map((l) =>
        l.lotId === lotId
          ? {
              ...l,
              status: 'Accepted',
              handoverRef,
              paymentStatus: 'Pending',
            }
          : l
      )
    );
    setBridgeNotification(`Collector accepted offer for Lot ${lotId}! Ready for authorized pickup.`);
    acceptOfferApi(lotId).catch((err) => console.warn('Accept offer API sync err:', err));
  };

  const declineOffer = (lotId: string) => {
    setOffers((prev) =>
      prev[lotId] ? { ...prev, [lotId]: { ...prev[lotId], status: 'declined' } } : prev
    );
    setBridgeNotification(`Offer declined for Lot ${lotId}.`);
    declineOfferApi(lotId).catch((err) => console.warn('Decline offer API sync err:', err));
  };

  const completeHandover = (
    lotId: string,
    optionsOrMethod: 'UPI' | 'Bank Transfer' | 'Cash on Pickup' | CompleteHandoverOptions = 'UPI'
  ) => {
    const options: CompleteHandoverOptions =
      typeof optionsOrMethod === 'string'
        ? { paymentMethod: optionsOrMethod }
        : optionsOrMethod || {};

    const paymentMethod = options.paymentMethod || 'UPI';
    const now = new Date().toISOString();
    const lot = lots.find((l) => l.lotId === lotId);

    const verifiedWeight = options.verifiedWeightKg ?? lot?.weightKg ?? 0;
    const rate = lot?.offeredPricePerKg || lot?.referencePricePerKg || 0;
    const calculatedFinalValue = Math.round(verifiedWeight * rate);

    setHandovers((prev) => {
      const existing = prev[lotId];
      if (!existing) {
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const handoverRef = lot?.handoverRef || `HOF-PUN-2026-${randNum}`;
        const manifestId = `EPR-FORM6-2026-${Math.floor(100 + Math.random() * 900)}`;
        return {
          ...prev,
          [lotId]: {
            lotId,
            material: lot?.material || 'PCB',
            weightKg: verifiedWeight,
            recyclerName: activeRecycler.name,
            recyclerId: activeRecycler.id,
            location: lot?.location || 'Pune',
            dateTime: now,
            finalValue: calculatedFinalValue,
            paymentStatus: 'Paid',
            paymentMethod,
            handoverRef,
            confirmed: true,
            manifestId,
            verifiedWeightKg: verifiedWeight,
            vehicleNumber: options.vehicleNumber || 'MH-12-QX-4891',
            driverName: options.driverName || 'Ramesh Shinde',
            upiId: options.upiId || collectorProfile.upiId || 'kabadiwala@upi',
          },
        };
      }
      return {
        ...prev,
        [lotId]: {
          ...existing,
          confirmed: true,
          paymentStatus: 'Paid',
          paymentMethod,
          dateTime: existing.dateTime || now,
          finalValue: calculatedFinalValue > 0 ? calculatedFinalValue : existing.finalValue,
          verifiedWeightKg: verifiedWeight,
          vehicleNumber: options.vehicleNumber || existing.vehicleNumber || 'MH-12-QX-4891',
          driverName: options.driverName || existing.driverName || 'Ramesh Shinde',
          upiId: options.upiId || existing.upiId || collectorProfile.upiId || 'kabadiwala@upi',
        },
      };
    });

    setLots((prev) =>
      prev.map((l) =>
        l.lotId === lotId
          ? {
              ...l,
              status: 'Completed',
              paymentStatus: 'Paid',
              completedAt: now,
              weightKg: verifiedWeight > 0 ? verifiedWeight : l.weightKg,
              totalOfferValue: calculatedFinalValue > 0 ? calculatedFinalValue : l.totalOfferValue,
            }
          : l
      )
    );

    setBridgeNotification(
      `Handover for ${lotId} confirmed! ₹${calculatedFinalValue.toLocaleString('en-IN')} paid via ${paymentMethod}. Form-6 manifest created.`
    );

    // Sync to SQLite backend asynchronously
    completeHandoverApi(lotId, {
      paymentMethod,
      verifiedWeightKg: verifiedWeight,
      vehicleNumber: options.vehicleNumber || 'MH-12-QX-4891',
      driverName: options.driverName || 'Ramesh Shinde',
      upiId: options.upiId || collectorProfile.upiId || 'kabadiwala@upi',
      finalValue: calculatedFinalValue,
    }).catch((err) => console.warn('Complete handover API sync err:', err));
  };

  const resetDemo = () => {
    localStorage.removeItem(`${STORAGE_KEY}_lots`);
    localStorage.removeItem(`${STORAGE_KEY}_offers`);
    localStorage.removeItem(`${STORAGE_KEY}_handovers`);
    localStorage.removeItem(`${STORAGE_KEY}_activeLotId`);
    localStorage.removeItem(`${STORAGE_KEY}_collector_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_recyclers`);
    localStorage.removeItem(`${STORAGE_KEY}_activeRecyclerId`);
    setLots(INITIAL_SEED_LOTS);
    setOffers(INITIAL_SEED_OFFERS);
    setHandovers(INITIAL_SEED_HANDOVERS);
    setCollectorProfile(demoCollectorProfile);
    setRecyclers(AUTHORIZED_RECYCLERS);
    setActiveRecyclerId(AUTHORIZED_RECYCLERS[0]?.id || 'REC-002');
    setActiveLotId(INITIAL_SEED_LOTS[0]?.lotId ?? null);
    setBridgeNotification('Demo reset to clean baseline state.');
    resetBackendDemo().catch((err) => console.warn('Reset backend demo err:', err));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        online,
        setOnline,
        t,
        lots,
        activeLotId,
        activeLot,
        setActiveLotId,
        offers,
        handovers,
        prices,
        recyclers,
        activeRecyclerId,
        activeRecycler,
        setActiveRecyclerId,
        updateRecyclerProfile,
        collectorProfile,
        updateCollectorProfile,
        registerCollector,
        registerRecycler,
        bridgeNotification,
        clearNotification,
        createLot,
        selectRecyclerForLot,
        sendOffer,
        acceptOffer,
        declineOffer,
        completeHandover,
        syncOfflineLots,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
