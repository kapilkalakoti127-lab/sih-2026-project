import { useState, useEffect } from 'react';
import {
  MapPin,
  Package,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ChevronLeft,
  IndianRupee,
  Calendar,
  Sparkles,
  QrCode,
  FileCheck,
  UserRound,
  Phone,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { demoLot, demoRecycler } from '@/data/mockData';

interface RecyclerLotDetailProps {
  onSendOffer: () => void;
  onBack: () => void;
}

export function RecyclerLotDetail({ onSendOffer, onBack }: RecyclerLotDetailProps) {
  const {
    t,
    activeLot,
    offers,
    handovers,
    recyclers,
    activeRecycler,
    collectorProfile,
    sendOffer,
    completeHandover,
  } = useApp();

  const currentLot = activeLot || demoLot;
  const currentOffer = offers[currentLot.lotId];
  const currentHandover = handovers[currentLot.lotId];
  const currentRecycler =
    (currentOffer && currentOffer.recycler) ||
    (activeRecycler.materialsAccepted.includes(currentLot.material) ? activeRecycler : null) ||
    recyclers.find((r) => r.materialsAccepted.includes(currentLot.material)) ||
    activeRecycler ||
    recyclers[0] ||
    demoRecycler;

  const defaultPrice =
    currentOffer?.offeredPricePerKg ||
    currentLot.offeredPricePerKg ||
    Math.round(currentLot.referencePricePerKg * 1.08);

  const [offerPrice, setOfferPrice] = useState<number>(defaultPrice);
  const [pickupAvailable, setPickupAvailable] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>(
    currentOffer?.notes || `Authorized recycling at ${currentRecycler.location}. Safe e-waste handling.`
  );
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash on Pickup'>('UPI');
  const [verifiedWeightKg, setVerifiedWeightKg] = useState<number>(currentLot.weightKg);
  const [vehicleNumber, setVehicleNumber] = useState<string>('MH-12-QX-4891');
  const [driverName, setDriverName] = useState<string>(currentRecycler.contactPerson ? `${currentRecycler.contactPerson} (Logistics)` : 'Ramesh Shinde (Driver)');
  const [upiId, setUpiId] = useState<string>(collectorProfile.upiId || 'kabadiwala@upi');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Sync upiId whenever collectorProfile changes
  useEffect(() => {
    if (collectorProfile.upiId) {
      setUpiId(collectorProfile.upiId);
    }
  }, [collectorProfile.upiId]);

  const effectiveRate = currentOffer?.offeredPricePerKg || currentLot.offeredPricePerKg || offerPrice;
  const totalCalculated = Math.round(offerPrice * currentLot.weightKg);
  const verifiedTotal = Math.round(verifiedWeightKg * effectiveRate);
  const isAccepted = currentLot.status === 'Accepted';
  const isCompleted = currentLot.status === 'Completed';

  const handleSendOffer = () => {
    sendOffer(currentLot.lotId, currentRecycler.id, offerPrice, pickupAvailable, notes);
    setStatusNotice(`Official offer of ₹${offerPrice}/kg (Total: ₹${totalCalculated.toLocaleString('en-IN')}) sent to collector!`);
    setTimeout(() => {
      onSendOffer();
    }, 1200);
  };

  const handleCompleteHandover = () => {
    completeHandover(currentLot.lotId, {
      paymentMethod,
      verifiedWeightKg,
      vehicleNumber,
      driverName,
      upiId,
    });
    setStatusNotice(`Physical handover confirmed! Scale weight ${verifiedWeightKg} kg verified. ₹${verifiedTotal.toLocaleString('en-IN')} disbursed via ${paymentMethod}.`);
  };

  return (
    <div className="p-5 lg:p-8 space-y-5 max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> {t('back')}
      </button>

      {/* Header with status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">{currentLot.lotId}</h1>
          <Badge
            variant={
              isCompleted
                ? 'success'
                : isAccepted
                ? 'success'
                : currentLot.status === 'Offered'
                ? 'info'
                : 'warning'
            }
          >
            {currentLot.status}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">
          Created: {new Date(currentLot.createdAt).toLocaleString('en-IN')}
        </span>
      </div>

      {statusNotice && (
        <Card className="bg-green-50 border-green-300 p-4 animate-pulse">
          <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        </Card>
      )}

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Collector Lot Information */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-gray-800">Collector Lot Details</h2>
          </div>

          <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
            {currentLot.photoUrl ? (
              <img
                src={currentLot.photoUrl}
                alt={currentLot.material}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <Row label={t('material')} value={currentLot.material} />
            <Row label={t('weight')} value={`${currentLot.weightKg} kg`} />
            <Row
              label={t('location')}
              value={currentLot.location}
              icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
            />
            <Row
              label="Scrap Reference Rate"
              value={`₹${currentLot.referencePricePerKg}/kg`}
            />
            <Row
              label={t('estimated_value')}
              value={`₹${currentLot.estimatedValue.toLocaleString('en-IN')}`}
            />
          </div>

          {/* Connected Informal Scrap Collector Profile */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block mb-2">
              Registered Scrap Collector Details
            </span>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                    <UserRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">
                      {collectorProfile.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {collectorProfile.id}
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px] py-0 px-1.5 font-bold">
                  <ShieldCheck className="w-3 h-3" /> {collectorProfile.kycStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200/60">
                <div>
                  <span className="text-[10px] text-gray-400 block">Collector Phone:</span>
                  <span className="font-mono text-gray-700 text-[11px] block">{collectorProfile.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Default UPI Address:</span>
                  <span className="font-mono font-bold text-green-700 text-[11px] block truncate">
                    {collectorProfile.upiId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recycler Offer / Handover Action Center */}
        <div className="space-y-5">
          {!isAccepted && !isCompleted ? (
            /* Configure & Send Offer */
            <Card className="p-5 border-green-200 bg-green-50/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <h2 className="font-bold text-gray-800">Configure Your Offer</h2>
                </div>
                <Badge variant="info">Recycler Bid</Badge>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Offered Price per kg (₹)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-green-600"
                    />
                    <button
                      onClick={() => setOfferPrice((p) => p + 10)}
                      className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold hover:bg-gray-50 text-green-700"
                    >
                      +₹10
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Benchmark is ₹{currentLot.referencePricePerKg}/kg. Higher rates incentivize informal collectors to choose legal recycling.
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                  <span className="text-gray-600 font-medium">Total Payout to Collector:</span>
                  <span className="text-xl font-bold text-green-700">
                    ₹{totalCalculated.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pickup"
                    checked={pickupAvailable}
                    onChange={(e) => setPickupAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="pickup" className="text-xs text-gray-700 font-medium cursor-pointer">
                    Free doorstep collection vehicle included
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Notes for Collector / Driver:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="pt-2">
                  <Button fullWidth onClick={handleSendOffer}>
                    {currentLot.status === 'Offered' ? 'Update & Resend Offer' : 'Send Official Offer to Collector'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : isAccepted && !isCompleted ? (
            /* Collector Accepted! Handover & Weighing Verification */
            <Card className="p-5 border-green-300 bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h2 className="font-bold text-green-900">Collector Accepted Offer!</h2>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                The collector has agreed to ₹{effectiveRate}/kg. Verify scale weight on-site, enter transport details, and release digital payment.
              </p>

              <div className="space-y-3.5 text-sm">
                {/* Handover Ref verification */}
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 block">Collector Handover Code:</span>
                  <span className="text-sm font-bold font-mono text-gray-800">
                    {currentLot.handoverRef || currentHandover?.handoverRef || 'HOF-PUN-2026-XXXXX'}
                  </span>
                </div>

                {/* Physical scale weighing */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    On-Site Scale Weight Verification (kg):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVerifiedWeightKg((w) => Math.max(0.5, Math.round((w - 0.5) * 10) / 10))}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="0.1"
                      value={verifiedWeightKg}
                      onChange={(e) => setVerifiedWeightKg(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                      className="flex-1 p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-center text-gray-800 focus:outline-none focus:border-green-600"
                    />
                    <button
                      onClick={() => setVerifiedWeightKg((w) => Math.round((w + 0.5) * 10) / 10)}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Estimated was {currentLot.weightKg} kg · Verified {verifiedWeightKg} kg × ₹{effectiveRate}/kg
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-600 font-medium">Final Verified Payout:</span>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{verifiedTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Transport / Driver info */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Vehicle No.</label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Driver Name</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Payment Mode:
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 focus:outline-none"
                  >
                    <option value="UPI">Instant UPI Transfer (Linked Account)</option>
                    <option value="Bank Transfer">Direct Bank NEFT / IMPS</option>
                    <option value="Cash on Pickup">Cash on Pickup with Digital Form-6 Receipt</option>
                  </select>
                </div>

                {paymentMethod === 'UPI' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Collector UPI ID / VPA
                      </label>
                      <span className="text-[10px] text-green-700 font-medium">
                        Linked: {collectorProfile.name}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 font-mono"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Button fullWidth onClick={handleCompleteHandover}>
                    Confirm Scale Weight & Release Payment (₹{verifiedTotal.toLocaleString('en-IN')})
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            /* Completed Status */
            <Card className="p-5 border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-green-600" />
                <h2 className="font-bold text-green-900">Transaction Completed</h2>
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Status" value="Paid & Handed Over" />
                <Row
                  label="Disbursed Amount"
                  value={`₹${(currentHandover?.finalValue || verifiedTotal).toLocaleString('en-IN')}`}
                  highlight
                />
                <Row label="Collector" value={`${collectorProfile.name} (${collectorProfile.id})`} />
                <Row label="Verified Weight" value={`${currentHandover?.verifiedWeightKg || currentLot.weightKg} kg`} />
                <Row label="Payment Method" value={currentHandover?.paymentMethod || 'UPI'} />
                {currentHandover?.vehicleNumber && (
                  <Row label="Vehicle No." value={currentHandover.vehicleNumber} />
                )}
                {currentHandover?.manifestId && (
                  <Row label="CPCB Manifest" value={currentHandover.manifestId} />
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-green-200">
                <span className="text-xs text-green-800 font-semibold block">
                  ✓ Compliant with E-Waste (Management) Rules, 2022
                </span>
              </div>
            </Card>
          )}

          {/* Authorization Credential Badge */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800">{currentRecycler.name}</p>
                  <Badge variant="success" className="text-[10px] py-0 px-1">Authorized</Badge>
                </div>
                <p className="text-gray-500 mt-0.5 font-mono">
                  EPR License: {currentRecycler.eprLicense || 'CPCB-EPR-MH-2024-0891'}
                </p>
                <p className="text-gray-500 mt-0.5">
                  Plant: {currentRecycler.location}
                </p>
                <p className="text-gray-400 mt-0.5">
                  Accepted Materials: {currentRecycler.materialsAccepted.join(', ')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-semibold flex items-center gap-1 ${
          highlight ? 'text-green-700 text-base' : 'text-gray-800'
        }`}
      >
        {icon}
        {value}
      </span>
    </div>
  );
}
