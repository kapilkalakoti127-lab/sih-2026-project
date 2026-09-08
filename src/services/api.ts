import type {
  MaterialLot,
  Price,
  Recycler,
  Offer,
  HandoverRecord,
  Earnings,
  MaterialCategory,
} from '@/types';
import {
  demoLot,
  demoPrice,
  demoRecycler,
  demoOffer,
  demoHandover,
  demoEarnings,
  DEMO_PHOTO_URL,
} from '@/data/mockData';

/**
 * API-ready service layer.
 * Each function returns mock data now but mirrors a future Spring Boot REST endpoint.
 * Replace the mock returns with fetch() calls to the backend without changing the UI.
 */

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// POST /api/lots
export async function createLot(
  material: MaterialCategory,
  weightKg: number,
  photoUrl: string
): Promise<MaterialLot> {
  const lot: MaterialLot = {
    ...demoLot,
    material,
    weightKg,
    photoUrl: photoUrl || DEMO_PHOTO_URL,
    status: 'Created',
  };
  return delay(lot);
}

// GET /api/prices
export async function getPrice(material: MaterialCategory): Promise<Price> {
  return delay({ ...demoPrice, material });
}

// GET /api/recyclers/match
export async function getRecyclerMatch(
  lotId: string
): Promise<Recycler> {
  return delay(demoRecycler);
}

// POST /api/offers
export async function acceptOffer(lotId: string): Promise<Offer> {
  return delay({ ...demoOffer, status: 'accepted' });
}

// POST /api/handover
export async function confirmHandover(lotId: string): Promise<HandoverRecord> {
  return delay(demoHandover);
}

// GET /api/earnings
export async function getEarnings(): Promise<Earnings> {
  return delay(demoEarnings);
}

// GET /api/lots/:id
export async function getLot(lotId: string): Promise<MaterialLot> {
  return delay(demoLot);
}
