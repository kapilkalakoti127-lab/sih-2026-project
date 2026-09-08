export type MaterialCategory =
  | 'PCB'
  | 'Cable'
  | 'Battery'
  | 'LCD'
  | 'Motor'
  | 'Mixed Plastic';

export type LotStatus =
  | 'Created'
  | 'Priced'
  | 'Matched'
  | 'Offered'
  | 'Accepted'
  | 'HandedOver'
  | 'Completed';

export type PaymentStatus = 'Pending' | 'Paid';

export type Language = 'en' | 'hi' | 'mr';

export type Role = 'collector' | 'recycler' | null;

export interface MaterialLot {
  lotId: string;
  material: MaterialCategory;
  weightKg: number;
  photoUrl: string;
  location: string;
  createdAt: string;
  status: LotStatus;
  referencePricePerKg: number;
  estimatedValue: number;
  offeredPricePerKg?: number;
  totalOfferValue?: number;
  matchedRecyclerId?: string;
  handoverRef?: string;
  paymentStatus?: PaymentStatus;
  pickupAvailable?: boolean;
  completedAt?: string;
  isOfflineDraft?: boolean;
}

export interface Price {
  material: MaterialCategory;
  referencePricePerKg: number;
  minPricePerKg: number;
  maxPricePerKg: number;
  location: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface Recycler {
  id: string;
  name: string;
  authorized: boolean;
  location: string;
  materialsAccepted: MaterialCategory[];
  offeredPricePerKg: number;
  pickupAvailable: boolean;
  matchScore: number;
  eprLicense?: string;
  contactPerson?: string;
  phone?: string;
  distanceKm?: number;
  proximityKey?: 'near' | 'mid' | 'far';
  notes?: string;
}

export interface Offer {
  lotId: string;
  recycler: Recycler;
  offeredPricePerKg: number;
  totalValue: number;
  pickupAvailable: boolean;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
}

export interface HandoverRecord {
  lotId: string;
  material: MaterialCategory;
  weightKg: number;
  recyclerName: string;
  recyclerId?: string;
  location: string;
  dateTime: string;
  finalValue: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash on Pickup';
  handoverRef: string;
  confirmed: boolean;
  manifestId?: string;
  verifiedWeightKg?: number;
  vehicleNumber?: string;
  driverName?: string;
  upiId?: string;
}

export interface Transaction {
  lotId: string;
  material: MaterialCategory;
  amount: number;
  paymentStatus: PaymentStatus;
  date: string;
}

export interface Earnings {
  totalEarnings: number;
  paid: number;
  pending: number;
  transactions: Transaction[];
}

export interface TraceabilityEvent {
  step: string;
  label: string;
  completed: boolean;
}

export interface CollectorProfile {
  id: string; // Unique Scrap Collector ID, e.g. "KAB-MH-PUN-0842"
  name: string;
  phone: string;
  location: string;
  zone: string;
  upiId: string;
  registrationDate: string;
  kycStatus: 'Verified' | 'Pending';
  badgeTitle: string; // e.g. "Authorized Green Collector"
  totalLotsCompleted: number;
}

export type CollectorScreen =
  | 'home'
  | 'create'
  | 'match'
  | 'offer'
  | 'handover'
  | 'lotDetail'
  | 'mylot'
  | 'prices'
  | 'earnings'
  | 'profile';

export type RecyclerScreen =
  | 'dashboard'
  | 'incoming'
  | 'lotDetail'
  | 'transactions'
  | 'profile';
