import { useState } from 'react';
import {
  UserRound,
  ShieldCheck,
  QrCode,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Award,
  PackageCheck,
  Wallet,
  CheckCircle2,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CollectorProfileProps {
  onBack?: () => void;
}

export function CollectorProfile({ onBack }: CollectorProfileProps = {}) {
  const { t, collectorProfile, updateCollectorProfile, lots, handovers } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(collectorProfile.name);
  const [phone, setPhone] = useState(collectorProfile.phone);
  const [location, setLocation] = useState(collectorProfile.location);
  const [upiId, setUpiId] = useState(collectorProfile.upiId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Completed lots count & stats
  const completedLots = lots.filter((l) => l.status === 'Completed').length;
  const totalWeightRecycled = lots
    .filter((l) => l.status === 'Completed')
    .reduce((sum, l) => sum + (handovers[l.lotId]?.verifiedWeightKg || l.weightKg), 0);

  const totalEarned = lots
    .filter((l) => l.status === 'Completed')
    .reduce((sum, l) => {
      const h = handovers[l.lotId];
      return sum + (h?.finalValue || l.totalOfferValue || l.estimatedValue);
    }, 0);

  const handleSave = () => {
    updateCollectorProfile({
      name,
      phone,
      location,
      upiId,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setName(collectorProfile.name);
    setPhone(collectorProfile.phone);
    setLocation(collectorProfile.location);
    setUpiId(collectorProfile.upiId);
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black border border-gray-200 shadow-2xs"
            >
              <span>←</span>
              <span>{t('back_btn')}</span>
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">{t('collector_profile')}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              CPCB / SPCB Authorized Informal Collector Identity
            </p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 font-bold"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" onClick={handleCancel} className="p-1.5">
              <X className="w-4 h-4 text-gray-500" />
            </Button>
            <Button size="sm" onClick={handleSave} className="flex items-center gap-1">
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-green-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          Profile updated successfully!
        </div>
      )}

      {/* Digital ID Card (Pass / Badge) */}
      <Card className="p-0 overflow-hidden border-2 border-green-500/80 shadow-md bg-gradient-to-br from-green-700 via-emerald-800 to-slate-900 text-white relative">
        {/* Decorative corner seal */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-bl-full pointer-events-none" />

        {/* Top bar */}
        <div className="px-5 py-3 bg-slate-900 border-b border-emerald-600/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-slate-900 font-black text-[11px]">
              ✓
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-emerald-300">
              Government Circular Economy Registry
            </span>
          </div>
          <span className="text-[10px] font-bold text-white bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            E-Waste Rules 2022
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            {/* Avatar / Photo */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <UserRound className="w-9 h-9 text-emerald-200" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-black text-white truncate">
                  {collectorProfile.name}
                </h2>
                <span className="inline-flex items-center gap-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> {collectorProfile.kycStatus}
                </span>
              </div>

              {/* Unique ID Highlight */}
              <div className="mt-1.5 inline-block bg-slate-950 border-2 border-emerald-400 px-3 py-1 rounded-lg">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block leading-none">
                  {t('unique_id')}
                </span>
                <span className="font-mono text-sm font-black text-emerald-100 tracking-wider">
                  {collectorProfile.id}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-700/50 text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-emerald-800/40">
              <span className="text-emerald-300 text-[11px] font-bold block">{t('location')}</span>
              <span className="font-bold text-white truncate block">{collectorProfile.location}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-emerald-800/40">
              <span className="text-emerald-300 text-[11px] font-bold block">Cluster Zone</span>
              <span className="font-bold text-white truncate block">{collectorProfile.zone}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-emerald-800/40">
              <span className="text-emerald-300 text-[11px] font-bold block">Phone / Helpline</span>
              <span className="font-bold text-white font-mono block">{collectorProfile.phone}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-emerald-800/40">
              <span className="text-emerald-300 text-[11px] font-bold block">Registered On</span>
              <span className="font-bold text-white block">{collectorProfile.registrationDate}</span>
            </div>
          </div>

          {/* Digital QR Barcode for Recycler On-site Scanning */}
          <div className="bg-slate-950 rounded-xl p-3 flex items-center justify-between border border-emerald-500/40">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center shadow-sm">
                <QrCode className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Collector Verification QR</span>
                <span className="text-[11px] font-semibold text-emerald-300">Authorized pickup scan key</span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-black bg-emerald-500 text-slate-950 px-2 py-1 rounded">
              VERIFIED
            </span>
          </div>
        </div>
      </Card>

      {/* Editable Details Form (when editing) */}
      {isEditing && (
        <Card className="p-4 space-y-3 bg-amber-50/60 border-amber-200">
          <h3 className="font-bold text-sm text-gray-800">Edit Profile Information</h3>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-medium font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Operating Ward / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Default UPI ID (for direct payments)</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-medium font-mono"
            />
          </div>
          <Button fullWidth size="md" onClick={handleSave} className="mt-2">
            Save Changes
          </Button>
        </Card>
      )}

      {/* Collector Statistics */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="p-3">
          <PackageCheck className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <span className="text-xl font-black text-gray-800 block">
            {collectorProfile.totalLotsCompleted + completedLots}
          </span>
          <span className="text-[11px] font-bold text-gray-500 uppercase">Lots Sold</span>
        </Card>
        <Card className="p-3">
          <Award className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
          <span className="text-xl font-black text-gray-800 block">
            {totalWeightRecycled + 45} kg
          </span>
          <span className="text-[11px] font-bold text-gray-500 uppercase">Recycled</span>
        </Card>
        <Card className="p-3">
          <Wallet className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <span className="text-lg font-black text-gray-800 block">
            ₹{(totalEarned + 14350).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Paid</span>
        </Card>
      </div>

      {/* Direct Payment / Payout Config */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-bold text-gray-800 block">{t('payment_upi')}</span>
              <span className="text-xs text-gray-500 font-mono">{collectorProfile.upiId}</span>
            </div>
          </div>
          <Badge variant="success">Instant Payout</Badge>
        </div>
        <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          Authorized recyclers disburse payments directly to this UPI address immediately upon on-site scale weight verification.
        </p>
      </Card>

      {/* Environmental & Formalization Certificate */}
      <Card className="p-4 bg-emerald-50/60 border-emerald-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Formalization Benefits Active</h4>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              As a registered informal collector on Kabadiwala Connect, you receive legal immunity from informal hazardous waste handling penalties, direct pricing premiums, and instant UPI bank settlement.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

