/**
 * Eco-Link Full-Stack REST API Client
 * ===================================
 * Connects frontend state to Python Flask backend & SQLite database (:5000)
 * with graceful offline-first fallback.
 */

import type {
  MaterialLot,
  Price,
  Recycler,
  Offer,
  HandoverRecord,
  Earnings,
  MaterialCategory,
  CollectorProfile,
} from '@/types';
import {
  INITIAL_SEED_LOTS,
  INITIAL_SEED_OFFERS,
  INITIAL_SEED_HANDOVERS,
  DEFAULT_PRICES,
  AUTHORIZED_RECYCLERS,
  demoCollectorProfile,
} from '@/data/mockData';

const BASE_URL = 'http://localhost:5000/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// -----------------------------------------------------------------------------
// Lots API
// -----------------------------------------------------------------------------

export async function fetchLots(status?: string): Promise<MaterialLot[]> {
  try {
    const url = status ? `/lots?status=${encodeURIComponent(status)}` : '/lots';
    return await fetchJson<MaterialLot[]>(url);
  } catch (error) {
    console.warn('Backend unavailable, using cached lots:', error);
    return INITIAL_SEED_LOTS;
  }
}

export async function fetchLot(lotId: string): Promise<MaterialLot | null> {
  try {
    return await fetchJson<MaterialLot>(`/lots/${encodeURIComponent(lotId)}`);
  } catch (error) {
    console.warn(`Backend unavailable for lot ${lotId}:`, error);
    return INITIAL_SEED_LOTS.find((l) => l.lotId === lotId) || null;
  }
}

export async function createLotApi(lotData: Partial<MaterialLot>): Promise<MaterialLot> {
  try {
    return await fetchJson<MaterialLot>('/lots', {
      method: 'POST',
      body: JSON.stringify(lotData),
    });
  } catch (error) {
    console.warn('Backend unavailable, creating local lot:', error);
    const newLot: MaterialLot = {
      lotId: `EW-${String(Math.floor(100 + Math.random() * 900))}`,
      material: lotData.material || 'PCB',
      weightKg: lotData.weightKg || 5,
      photoUrl: lotData.photoUrl || '',
      location: lotData.location || 'Pune',
      createdAt: new Date().toISOString(),
      status: 'Created',
      referencePricePerKg: lotData.referencePricePerKg || 320,
      estimatedValue: lotData.estimatedValue || 1600,
      offeredPricePerKg: lotData.offeredPricePerKg,
      totalOfferValue: lotData.totalOfferValue,
      matchedRecyclerId: lotData.matchedRecyclerId || 'REC-001',
      pickupAvailable: true,
      isOfflineDraft: true,
    };
    return newLot;
  }
}

// -----------------------------------------------------------------------------
// Recyclers & Profiles API
// -----------------------------------------------------------------------------

export async function fetchRecyclers(): Promise<Recycler[]> {
  try {
    return await fetchJson<Recycler[]>('/recyclers');
  } catch (error) {
    console.warn('Backend unavailable, using default recyclers:', error);
    return AUTHORIZED_RECYCLERS;
  }
}

export async function updateRecyclerApi(id: string, updates: Partial<Recycler>): Promise<Recycler> {
  try {
    return await fetchJson<Recycler>(`/recyclers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  } catch (error) {
    console.warn(`Backend unavailable, updating local recycler ${id}:`, error);
    const found = AUTHORIZED_RECYCLERS.find((r) => r.id === id) || AUTHORIZED_RECYCLERS[0];
    return { ...found, ...updates };
  }
}

export async function fetchCollectorProfile(): Promise<CollectorProfile> {
  try {
    return await fetchJson<CollectorProfile>('/profiles/collector');
  } catch (error) {
    console.warn('Backend unavailable, using default collector profile:', error);
    return demoCollectorProfile;
  }
}

export async function updateCollectorProfileApi(
  updates: Partial<CollectorProfile>
): Promise<CollectorProfile> {
  try {
    return await fetchJson<CollectorProfile>('/profiles/collector', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  } catch (error) {
    console.warn('Backend unavailable, updating local collector profile:', error);
    return { ...demoCollectorProfile, ...updates } as CollectorProfile;
  }
}

export async function createCollectorProfileApi(
  data: Partial<CollectorProfile> & { resetLotsForNewUser?: boolean }
): Promise<CollectorProfile> {
  try {
    return await fetchJson<CollectorProfile>('/profiles/collector', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('Backend unavailable, creating local collector account:', error);
    return { ...demoCollectorProfile, ...data } as CollectorProfile;
  }
}

export async function createRecyclerApi(
  data: Partial<Recycler>
): Promise<Recycler> {
  try {
    return await fetchJson<Recycler>('/recyclers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('Backend unavailable, creating local recycler facility:', error);
    return { ...AUTHORIZED_RECYCLERS[0], ...data } as Recycler;
  }
}

// -----------------------------------------------------------------------------
// Offers & Handover API
// -----------------------------------------------------------------------------

export async function fetchOffers(): Promise<Record<string, Offer>> {
  try {
    return await fetchJson<Record<string, Offer>>('/offers');
  } catch (error) {
    console.warn('Backend unavailable, using cached offers:', error);
    return INITIAL_SEED_OFFERS;
  }
}

export async function sendOfferApi(offerData: any): Promise<Offer> {
  try {
    return await fetchJson<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  } catch (error) {
    console.warn('Backend unavailable, creating local offer:', error);
    return offerData;
  }
}

export async function acceptOfferApi(lotId: string): Promise<any> {
  try {
    return await fetchJson<any>(`/offers/${encodeURIComponent(lotId)}/accept`, {
      method: 'POST',
    });
  } catch (error) {
    console.warn(`Backend unavailable, accepting offer locally for ${lotId}:`, error);
    return { lotId, status: 'Accepted' };
  }
}

export async function declineOfferApi(lotId: string): Promise<any> {
  try {
    return await fetchJson<any>(`/offers/${encodeURIComponent(lotId)}/decline`, {
      method: 'POST',
    });
  } catch (error) {
    console.warn(`Backend unavailable, declining offer locally for ${lotId}:`, error);
    return { lotId, status: 'declined' };
  }
}

export async function fetchHandovers(): Promise<Record<string, HandoverRecord>> {
  try {
    return await fetchJson<Record<string, HandoverRecord>>('/handovers');
  } catch (error) {
    console.warn('Backend unavailable, using cached handovers:', error);
    return INITIAL_SEED_HANDOVERS;
  }
}

export async function completeHandoverApi(lotId: string, options: any): Promise<any> {
  try {
    return await fetchJson<any>(`/handovers/${encodeURIComponent(lotId)}/complete`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  } catch (error) {
    console.warn(`Backend unavailable, completing handover locally for ${lotId}:`, error);
    return { lotId, confirmed: true };
  }
}

export async function fetchTransactions(): Promise<any[]> {
  try {
    return await fetchJson<any[]>('/transactions');
  } catch (error) {
    console.warn('Backend unavailable, using empty transactions:', error);
    return [];
  }
}

export async function resetBackendDemo(): Promise<void> {
  try {
    await fetchJson<any>('/reset', { method: 'POST' });
  } catch (error) {
    console.warn('Backend reset failed:', error);
  }
}
