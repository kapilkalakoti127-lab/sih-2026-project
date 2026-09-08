import { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  PackageCheck,
  Phone,
  UserRound,
  Award,
  Edit2,
  Save,
  X,
  Smartphone,
  IndianRupee,
  Share2,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { MaterialCategory } from '@/types';

const ALL_CATEGORIES: MaterialCategory[] = ['PCB', 'Cable', 'Battery', 'LCD', 'Motor', 'Mixed Plastic'];

export function RecyclerProfile() {
  const {
    t,
    recyclers,
    activeRecycler,
    activeRecyclerId,
    setActiveRecyclerId,
    updateRecyclerProfile,
    collectorProfile,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(activeRecycler.name);
  const [eprLicense, setEprLicense] = useState(activeRecycler.eprLicense || '');
  const [contactPerson, setContactPerson] = useState(activeRecycler.contactPerson || '');
  const [phone, setPhone] = useState(activeRecycler.phone || '');
  const [location, setLocation] = useState(activeRecycler.location);
  const [offeredPricePerKg, setOfferedPricePerKg] = useState(activeRecycler.offeredPricePerKg);
  const [notes, setNotes] = useState(activeRecycler.notes || '');
  const [materialsAccepted, setMaterialsAccepted] = useState<MaterialCategory[]>(
    activeRecycler.materialsAccepted
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync edit form if active facility changes
  useEffect(() => {
    setName(activeRecycler.name);
    setEprLicense(activeRecycler.eprLicense || '');
    setContactPerson(activeRecycler.contactPerson || '');
    setPhone(activeRecycler.phone || '');
    setLocation(activeRecycler.location);
    setOfferedPricePerKg(activeRecycler.offeredPricePerKg);
    setNotes(activeRecycler.notes || '');
    setMaterialsAccepted(activeRecycler.materialsAccepted);
    setIsEditing(false);
  }, [activeRecyclerId, activeRecycler]);

  const handleToggleMaterial = (mat: MaterialCategory) => {
    setMaterialsAccepted((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleSave = () => {
    updateRecyclerProfile(activeRecycler.id, {
      name,
      eprLicense,
      contactPerson,
      phone,
      location,
      offeredPricePerKg,
      notes,
      materialsAccepted,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setName(activeRecycler.name);
    setEprLicense(activeRecycler.eprLicense || '');
    setContactPerson(activeRecycler.contactPerson || '');
    setPhone(activeRecycler.phone || '');
    setLocation(activeRecycler.location);
    setOfferedPricePerKg(activeRecycler.offeredPricePerKg);
    setNotes(activeRecycler.notes || '');
    setMaterialsAccepted(activeRecycler.materialsAccepted);
    setIsEditing(false);
  };

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('profile')} & Legal Facility Credentials
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            CPCB / SPCB Authorized Legal E-Waste Recycler Profile & Compliance Registry.
          </p>
        </div>

        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 self-start sm:self-auto font-bold"
          >
            <Edit2 className="w-4 h-4 text-green-700" />
            Edit Facility Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button variant="outline" onClick={handleCancel} className="p-2">
              <X className="w-4 h-4 text-gray-500" />
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-1.5 font-bold">
              <Save className="w-4 h-4" /> Save Credentials
            </Button>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm font-bold text-green-800 flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          Recycler Facility Profile & Authorized Rates updated successfully!
        </div>
      )}

      {/* Facility Switcher Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
          Authorized Recycler Facilities in Network ({recyclers.length})
        </label>
        <div className="grid sm:grid-cols-3 gap-3">
          {recyclers.map((rec) => {
            const isActive = rec.id === activeRecyclerId;
            return (
              <button
                key={rec.id}
                onClick={() => setActiveRecyclerId(rec.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isActive
                    ? 'border-green-600 bg-green-50/60 shadow-xs ring-2 ring-green-600/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-sm text-gray-800 truncate block">
                    {rec.name}
                  </span>
                  {isActive && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-green-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate">{rec.location.split(',')[0]}</span>
                  <span className="font-bold text-green-700 font-mono">₹{rec.offeredPricePerKg}/kg</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">{rec.proximityKey?.toUpperCase()} · {rec.distanceKm} km</span>
                  <Badge variant={isActive ? 'success' : 'neutral'} className="text-[10px] py-0 px-1.5">
                    {isActive ? 'Active Portal' : 'Switch'}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Recycler Facility Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center shrink-0 shadow-inner">
              <Building2 className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-800">{activeRecycler.name}</h2>
                <Badge variant="success">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t('verified_authorized')}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Facility ID: {activeRecycler.id} · CPCB Authorized Dismantler & Recycler
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-right">
              <span className="text-[11px] text-gray-400 uppercase font-semibold block">Base Offer Rate</span>
              <span className="text-lg font-black text-green-700">₹{activeRecycler.offeredPricePerKg}/kg</span>
            </div>
          </div>
        </div>

        {/* Editing Form vs Display */}
        {isEditing ? (
          <div className="pt-6 space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Company / Facility Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">CPCB / SPCB EPR License No.</label>
                <input
                  type="text"
                  value={eprLicense}
                  onChange={(e) => setEprLicense(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-mono font-semibold text-gray-800 focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Authorized Operations Officer</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-800 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Dispatch / Logistics Helpline Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-mono font-medium text-gray-800 focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Plant / Dismantling Facility Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-800 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Benchmark Offer Rate (₹ / kg)</label>
                <input
                  type="number"
                  value={offeredPricePerKg}
                  onChange={(e) => setOfferedPricePerKg(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-bold font-mono text-gray-800 focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-2">
                Authorized Material Categories Accepted:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const checked = materialsAccepted.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleMaterial(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        checked
                          ? 'bg-green-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Logistics / Collection Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <Button fullWidth onClick={handleSave}>
                Save Profile Changes
              </Button>
              <Button variant="outline" fullWidth onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-4 text-sm">
            <div className="flex items-center gap-3.5">
              <Award className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('epr_reg')} / Compliance License</p>
                <p className="font-semibold text-gray-800 font-mono">
                  {activeRecycler.eprLicense || 'CPCB-EPR-MH-2024-0891'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('location')} & Operating MIDC</p>
                <p className="font-semibold text-gray-800">{activeRecycler.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <PackageCheck className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('materials_accepted')}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeRecycler.materialsAccepted.map((mat) => (
                    <span
                      key={mat}
                      className="px-2.5 py-0.5 rounded-md bg-green-50 border border-green-200 text-green-800 text-xs font-semibold"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <Truck className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">{t('pickup_available')}</p>
                <p className="font-semibold text-green-700">
                  {activeRecycler.notes || 'Doorstep weigh-and-pay collection available across Pune'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <UserRound className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Authorized Facility In-Charge</p>
                <p className="font-semibold text-gray-800">
                  {activeRecycler.contactPerson || 'Authorized Officer'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <Phone className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Dispatch Helpline</p>
                <p className="font-semibold text-gray-800 font-mono">
                  {activeRecycler.phone || '+91 98230 45671'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Connected Scrap Collector Bridge Box */}
      <Card className="p-5 border-2 border-green-500/40 bg-gradient-to-r from-emerald-50 via-green-50 to-white">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">Active Digital Bridge Connection</h3>
                <span className="inline-flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Direct channel between this legal recycler facility and local informal collectors.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-green-200 grid sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-gray-400 block text-[11px]">Assigned Scrap Collector:</span>
            <span className="font-bold text-gray-800 text-sm">{collectorProfile.name}</span>
            <span className="text-[10px] font-mono text-green-700 block font-bold">
              ID: {collectorProfile.id}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[11px]">Collector Ward & Phone:</span>
            <span className="font-medium text-gray-800 block truncate">{collectorProfile.location}</span>
            <span className="text-[11px] font-mono text-gray-500 block">{collectorProfile.phone}</span>
          </div>

          <div>
            <span className="text-gray-400 block text-[11px]">Verified Payout UPI ID:</span>
            <span className="font-bold text-green-700 font-mono text-xs block truncate">
              {collectorProfile.upiId}
            </span>
            <span className="text-[10px] text-gray-400">Pre-linked for scale payment</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
