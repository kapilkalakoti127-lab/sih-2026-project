import type {
  MaterialLot,
  Price,
  Recycler,
  Offer,
  HandoverRecord,
  Earnings,
  TraceabilityEvent,
  MaterialCategory,
  LotStatus,
  CollectorProfile,
} from '@/types';

export const DEMO_PHOTO_URL =
  'https://images.pexels.com/photos/163125/board-printed-circuit-board-computer-electronics-163125.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const MATERIAL_PHOTOS: Record<MaterialCategory, string> = {
  PCB: 'https://images.pexels.com/photos/163125/board-printed-circuit-board-computer-electronics-163125.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  Cable: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=compress&cs=tinysrgb&w=800',
  Battery: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=compress&cs=tinysrgb&w=800',
  LCD: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=compress&cs=tinysrgb&w=800',
  Motor: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=compress&cs=tinysrgb&w=800',
  'Mixed Plastic': 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=compress&cs=tinysrgb&w=800',
};

export const MATERIAL_CATEGORIES: readonly MaterialCategory[] = [
  'PCB',
  'Cable',
  'Battery',
  'LCD',
  'Motor',
  'Mixed Plastic',
] as const;

export const DEFAULT_PRICES: Record<MaterialCategory, Price> = {
  PCB: {
    material: 'PCB',
    referencePricePerKg: 320,
    minPricePerKg: 300,
    maxPricePerKg: 360,
    location: 'Pune',
    trend: 'up',
    trendPercent: 3,
  },
  Cable: {
    material: 'Cable',
    referencePricePerKg: 280,
    minPricePerKg: 260,
    maxPricePerKg: 310,
    location: 'Pune',
    trend: 'up',
    trendPercent: 5,
  },
  Battery: {
    material: 'Battery',
    referencePricePerKg: 190,
    minPricePerKg: 175,
    maxPricePerKg: 215,
    location: 'Pune',
    trend: 'stable',
    trendPercent: 1,
  },
  LCD: {
    material: 'LCD',
    referencePricePerKg: 120,
    minPricePerKg: 110,
    maxPricePerKg: 140,
    location: 'Pune',
    trend: 'down',
    trendPercent: 2,
  },
  Motor: {
    material: 'Motor',
    referencePricePerKg: 220,
    minPricePerKg: 200,
    maxPricePerKg: 245,
    location: 'Pune',
    trend: 'up',
    trendPercent: 4,
  },
  'Mixed Plastic': {
    material: 'Mixed Plastic',
    referencePricePerKg: 45,
    minPricePerKg: 40,
    maxPricePerKg: 55,
    location: 'Pune',
    trend: 'stable',
    trendPercent: 0,
  },
};

export const demoPrice: Price = DEFAULT_PRICES.PCB;

export const AUTHORIZED_RECYCLERS: Recycler[] = [
  {
    id: 'REC-002',
    name: 'Bharat Metals & E-Waste Processors',
    authorized: true,
    location: 'Hadapsar MIDC, Pune',
    distanceKm: 3.2,
    proximityKey: 'near',
    materialsAccepted: ['PCB', 'Cable', 'Motor', 'LCD', 'Battery', 'Mixed Plastic'],
    offeredPricePerKg: 360, // Highest rate nearby
    pickupAvailable: true,
    matchScore: 97,
    eprLicense: 'MPCB-HW-PUN-2025-1104',
    contactPerson: 'Anand Shinde (Logistics)',
    phone: '+91 97654 11234',
    notes: 'Local ward hub · 15 min collection arrival guarantee',
  },
  {
    id: 'REC-001',
    name: 'GreenCycle Authorized Recyclers',
    authorized: true,
    location: 'Bhosari MIDC Industrial Area, Pune',
    distanceKm: 14.5,
    proximityKey: 'mid',
    materialsAccepted: ['PCB', 'LCD', 'Mixed Plastic', 'Cable'],
    offeredPricePerKg: 345, // Medium rate, medium distance
    pickupAvailable: true,
    matchScore: 92,
    eprLicense: 'CPCB-EPR-MH-2024-0891',
    contactPerson: 'Vikram Joshi (Operations)',
    phone: '+91 98230 45671',
    notes: 'Central plant · Same-day scheduled truck pickup',
  },
  {
    id: 'REC-003',
    name: 'EcoVolt High-Capacity Circular Solutions',
    authorized: true,
    location: 'Chakan Mega Auto Hub Phase II, Pune Outer',
    distanceKm: 32.8,
    proximityKey: 'far',
    materialsAccepted: ['PCB', 'Battery', 'Motor', 'Cable', 'LCD', 'Mixed Plastic'],
    offeredPricePerKg: 330, // Regional mega facility rate
    pickupAvailable: true,
    matchScore: 86,
    eprLicense: 'CPCB-BAT-EPR-2024-0320',
    contactPerson: 'Sunita Patil (Compliance)',
    phone: '+91 98812 99876',
    notes: 'Regional bulk processing center · Next-day route collection',
  },
  {
    id: 'REC-004',
    name: 'CleanEarth Circular Resources',
    authorized: true,
    location: 'Pimpri-Chinchwad Tech Park',
    distanceKm: 19.0,
    proximityKey: 'mid',
    materialsAccepted: ['Mixed Plastic', 'LCD', 'Cable', 'PCB', 'Motor', 'Battery'],
    offeredPricePerKg: 335,
    pickupAvailable: false,
    matchScore: 84,
    eprLicense: 'MPCB-REG-2024-4432',
    contactPerson: 'Rajesh Kulkarni',
    phone: '+91 94220 54321',
    notes: 'Drop-off center facility only',
  },
];

export const demoRecycler: Recycler = AUTHORIZED_RECYCLERS[0];

export const demoLot: MaterialLot = {
  lotId: 'EW-001',
  material: 'PCB',
  weightKg: 5,
  photoUrl: DEMO_PHOTO_URL,
  location: 'Pune',
  createdAt: '2026-09-08T10:30:00',
  status: 'Completed',
  referencePricePerKg: 320,
  estimatedValue: 1600,
  offeredPricePerKg: 350,
  totalOfferValue: 1750,
  matchedRecyclerId: 'REC-001',
  handoverRef: 'HOF-PUN-2026-00123',
  paymentStatus: 'Paid',
  pickupAvailable: true,
  completedAt: '2026-09-08T14:45:00',
};

export const demoOffer: Offer = {
  lotId: 'EW-001',
  recycler: demoRecycler,
  offeredPricePerKg: 350,
  totalValue: 1750,
  pickupAvailable: true,
  status: 'accepted',
  notes: 'Authorized safe handling at Bhosari facility. Free pickup included.',
};

export const demoHandover: HandoverRecord = {
  lotId: 'EW-001',
  material: 'PCB',
  weightKg: 5,
  recyclerName: 'GreenCycle Authorized Recyclers',
  recyclerId: 'REC-001',
  location: 'Pune',
  dateTime: '2026-09-08T14:45:00',
  finalValue: 1750,
  paymentStatus: 'Paid',
  paymentMethod: 'UPI',
  handoverRef: 'HOF-PUN-2026-00123',
  confirmed: true,
  manifestId: 'EPR-FORM6-2026-081',
};

export const demoEarnings: Earnings = {
  totalEarnings: 1750,
  paid: 1750,
  pending: 0,
  transactions: [
    {
      lotId: 'EW-001',
      material: 'PCB',
      amount: 1750,
      paymentStatus: 'Paid',
      date: '2026-09-08',
    },
  ],
};

export const traceabilityEvents: TraceabilityEvent[] = [
  { step: '1', label: 'Collector creates lot', completed: true },
  { step: '2', label: 'PCB identified', completed: true },
  { step: '3', label: 'Weight recorded', completed: true },
  { step: '4', label: 'Price estimated', completed: true },
  { step: '5', label: 'Recycler matched', completed: true },
  { step: '6', label: 'Offer accepted', completed: true },
  { step: '7', label: 'Handover confirmed', completed: true },
  { step: '8', label: 'Payment recorded', completed: true },
];

export function getTraceabilityEventsForLot(
  lot: MaterialLot,
  _handover?: HandoverRecord
): TraceabilityEvent[] {
  const statusRanks: Record<LotStatus, number> = {
    Created: 4,
    Priced: 4,
    Matched: 5,
    Offered: 5,
    Accepted: 6,
    HandedOver: 7,
    Completed: 8,
  };

  const currentRank = statusRanks[lot.status] ?? 4;

  return [
    { step: '1', label: 'Collector creates lot', completed: currentRank >= 1 },
    { step: '2', label: `${lot.material} identified & categorized`, completed: currentRank >= 2 },
    { step: '3', label: `Weight recorded (${lot.weightKg} kg)`, completed: currentRank >= 3 },
    { step: '4', label: `Price estimated (₹${lot.referencePricePerKg}/kg)`, completed: currentRank >= 4 },
    { step: '5', label: 'Authorized recycler matched', completed: currentRank >= 5 },
    { step: '6', label: 'Recycler offer accepted', completed: currentRank >= 6 },
    { step: '7', label: 'Physical handover & weighing confirmed', completed: currentRank >= 7 },
    { step: '8', label: 'Digital payment & EPR Form-6 issued', completed: currentRank >= 8 },
  ];
}

export const INITIAL_SEED_LOTS: MaterialLot[] = [
  demoLot,
  {
    lotId: 'EW-002',
    material: 'Cable',
    weightKg: 8,
    photoUrl: MATERIAL_PHOTOS.Cable,
    location: 'Pune (Hadapsar)',
    createdAt: '2026-09-08T11:45:00',
    status: 'Offered',
    referencePricePerKg: 280,
    estimatedValue: 2240,
    offeredPricePerKg: 300,
    totalOfferValue: 2400,
    matchedRecyclerId: 'REC-002',
    pickupAvailable: true,
  },
];

export const INITIAL_SEED_OFFERS: Record<string, Offer> = {
  'EW-001': demoOffer,
  'EW-002': {
    lotId: 'EW-002',
    recycler: AUTHORIZED_RECYCLERS[1],
    offeredPricePerKg: 300,
    totalValue: 2400,
    pickupAvailable: true,
    status: 'pending',
    notes: 'Authorized cable processing at Hadapsar MIDC. Pickup truck scheduled.',
  },
};

export const INITIAL_SEED_HANDOVERS: Record<string, HandoverRecord> = {
  'EW-001': demoHandover,
};

export const demoCollectorProfile: CollectorProfile = {
  id: 'KAB-MH-PUN-0842',
  name: 'Ramesh Kumar (कबाड़ीवाला)',
  phone: '+91 98234 56789',
  location: 'Pune (Hadapsar Ward 14)',
  zone: 'Pune South-East Cluster',
  upiId: 'ramesh.kumar@okhdfcbank',
  registrationDate: '12 Jan 2024',
  kycStatus: 'Verified',
  badgeTitle: 'Authorized Green Collector',
  totalLotsCompleted: 19,
};
