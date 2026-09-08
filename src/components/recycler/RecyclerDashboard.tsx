import {
  Inbox,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ArrowRight,
  TrendingUp,
  Building2,
  ShieldCheck,
  Share2,
  UserRound,
  Truck,
  IndianRupee,
  FileCheck,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { RecyclerScreen, MaterialCategory } from '@/types';

interface DashboardProps {
  onNavigate: (screen: RecyclerScreen) => void;
}

export function RecyclerDashboard({ onNavigate }: DashboardProps) {
  const {
    t,
    lots,
    handovers,
    activeRecycler,
    collectorProfile,
    setActiveLotId,
  } = useApp();

  // Compute live operational metrics
  const newLots = lots.filter(
    (l) => l.status === 'Created' || l.status === 'Priced' || l.status === 'Matched'
  );
  const offeredLots = lots.filter((l) => l.status === 'Offered');
  const acceptedLots = lots.filter((l) => l.status === 'Accepted');
  const completedLots = lots.filter((l) => l.status === 'Completed');

  const processedValue = lots.reduce((sum, l) => {
    if (l.status === 'Completed' || l.status === 'Accepted') {
      const h = handovers[l.lotId];
      return sum + (h?.finalValue || l.totalOfferValue || l.estimatedValue);
    }
    return sum;
  }, 0);

  const totalKgProcessed = lots
    .filter((l) => l.status === 'Completed')
    .reduce((sum, l) => sum + (handovers[l.lotId]?.verifiedWeightKg || l.weightKg), 0);

  const stats = [
    {
      label: t('new_lots'),
      sublabel: 'Needs recycler bid',
      value: String(newLots.length),
      icon: Inbox,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      action: () => onNavigate('incoming'),
    },
    {
      label: 'Accepted by Collector',
      sublabel: 'Ready for truck / scale',
      value: String(acceptedLots.length),
      icon: Clock3,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      action: () => {
        if (acceptedLots[0]) {
          setActiveLotId(acceptedLots[0].lotId);
          onNavigate('lotDetail');
        } else {
          onNavigate('incoming');
        }
      },
    },
    {
      label: t('completed'),
      sublabel: 'Form-6 manifests generated',
      value: String(completedLots.length),
      icon: PackageCheck,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      action: () => onNavigate('transactions'),
    },
    {
      label: 'Channel Volume',
      sublabel: `${totalKgProcessed} kg safely diverted`,
      value: `₹${processedValue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      action: () => onNavigate('transactions'),
    },
  ];

  // Most urgent lot needing recycler attention
  const urgentLot =
    acceptedLots[0] ||
    newLots[0] ||
    offeredLots[0] ||
    lots[0];

  const handleReviewLot = (lotId: string) => {
    setActiveLotId(lotId);
    onNavigate('lotDetail');
  };

  // Materials intake breakdown
  const materialsSummary: { category: MaterialCategory; count: number; totalKg: number }[] = [
    'PCB',
    'Cable',
    'Battery',
    'LCD',
    'Motor',
    'Mixed Plastic',
  ].map((cat) => {
    const matLots = lots.filter((l) => l.material === cat);
    return {
      category: cat as MaterialCategory,
      count: matLots.length,
      totalKg: matLots.reduce((acc, l) => acc + l.weightKg, 0),
    };
  });

  return (
    <div className="p-5 lg:p-8 space-y-6 max-w-5xl">
      {/* Top Facility Banner */}
      <Card className="p-5 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white border-none shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {activeRecycler.name}
                </h1>
                <Badge variant="success" className="bg-green-500 text-white border-none text-[10px] py-0 px-2">
                  <ShieldCheck className="w-3 h-3" /> EPR Verified
                </Badge>
              </div>
              <p className="text-xs text-gray-300 mt-1 font-mono">
                License: {activeRecycler.eprLicense || 'CPCB-EPR-MH-2024-0891'} · {activeRecycler.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 justify-between md:justify-end">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                Facility In-Charge
              </span>
              <span className="text-xs font-semibold text-gray-200">
                {activeRecycler.contactPerson || 'Authorized Officer'}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('profile')}
              className="border-white/30 text-white hover:bg-white/10 hover:text-white text-xs font-bold"
            >
              Switch / Edit Facility
            </Button>
          </div>
        </div>
      </Card>

      {/* Connected Digital Bridge Bar */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center shrink-0">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">
                Connected Collector: {collectorProfile.name}
              </span>
              <span className="font-mono text-[11px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                {collectorProfile.id}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 block">
              Ward: {collectorProfile.location} · Payout UPI: {collectorProfile.upiId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-green-800 bg-white/80 px-2.5 py-1 rounded-lg border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <span>Realtime Digital Bridge Sync Active</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              onClick={stat.action}
              className={`p-4 sm:p-5 border ${stat.border} hover:shadow-sm cursor-pointer transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-800">{stat.value}</p>
              <p className="text-xs font-bold text-gray-700 mt-1">{stat.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{stat.sublabel}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Urgent Attention / Action Card */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800 text-base">Immediate Action Required</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Lots submitted by local scrap collectors requiring offer or scale verification.
              </p>
            </div>
            <Badge variant={acceptedLots.length > 0 ? 'success' : newLots.length > 0 ? 'warning' : 'info'}>
              {acceptedLots.length > 0
                ? `${acceptedLots.length} Ready for Scale Handover`
                : `${newLots.length} Needs Pricing`}
            </Badge>
          </div>

          {urgentLot ? (
            <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 border border-green-200">
                    {urgentLot.photoUrl ? (
                      <img
                        src={urgentLot.photoUrl}
                        alt={urgentLot.material}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Inbox className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-base">
                        {urgentLot.lotId} · {urgentLot.material}
                      </h3>
                      <Badge
                        variant={
                          urgentLot.status === 'Accepted'
                            ? 'success'
                            : urgentLot.status === 'Completed'
                            ? 'neutral'
                            : urgentLot.status === 'Offered'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {urgentLot.status === 'Accepted' ? 'Collector Accepted' : urgentLot.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Submitted by: <span className="font-bold text-gray-700">{collectorProfile.name}</span> ({collectorProfile.id})
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-gray-400 block font-medium">Estimated / Offered Payout</span>
                  <span className="text-xl font-bold text-gray-800">
                    ₹{(urgentLot.totalOfferValue || urgentLot.estimatedValue).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-200/80">
                <div className="p-2 rounded-lg bg-white border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Net Weight:</span>
                  <span className="font-bold text-gray-800">{urgentLot.weightKg} kg</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Benchmark Rate:</span>
                  <span className="font-bold text-gray-800">₹{urgentLot.referencePricePerKg}/kg</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Offered Rate:</span>
                  <span className="font-bold text-green-700">
                    ₹{urgentLot.offeredPricePerKg || activeRecycler.offeredPricePerKg}/kg
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-gray-400">
                  Received {new Date(urgentLot.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>

                <Button size="sm" onClick={() => handleReviewLot(urgentLot.lotId)}>
                  {urgentLot.status === 'Accepted'
                    ? 'Verify Handover & Pay'
                    : urgentLot.status === 'Offered'
                    ? 'Review Sent Offer'
                    : 'Configure Official Offer'}{' '}
                  <ArrowRight className="w-4 h-4 ml-1 inline" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-8 text-center">
              No pending collector lots right now.
            </p>
          )}

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => onNavigate('incoming')}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-colors"
            >
              <span className="text-xs font-bold text-gray-800 block">All Incoming Lots</span>
              <span className="text-[11px] text-gray-400">{lots.length} active lots</span>
            </button>
            <button
              onClick={() => onNavigate('transactions')}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-colors"
            >
              <span className="text-xs font-bold text-gray-800 block">Form-6 Manifests</span>
              <span className="text-[11px] text-gray-400">{completedLots.length} legal records</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition-colors col-span-2 sm:col-span-1"
            >
              <span className="text-xs font-bold text-gray-800 block">Facility Pricing</span>
              <span className="text-[11px] text-green-700 font-bold font-mono">₹{activeRecycler.offeredPricePerKg}/kg base</span>
            </button>
          </div>
        </Card>

        {/* Materials Intake Category Breakdown */}
        <Card className="p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-green-700" />
                <h3 className="font-bold text-gray-800 text-sm">Material Channel Breakdown</h3>
              </div>
              <span className="text-[11px] font-bold text-green-700">CPCB Safe Scope</span>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Authorized materials collected and processed by this facility.
            </p>

            <div className="space-y-2.5">
              {materialsSummary.map((item) => {
                const isAccepted = activeRecycler.materialsAccepted.includes(item.category);
                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{item.category}</span>
                      {isAccepted ? (
                        <span className="text-[9px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                          Accepted
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                          Not Authorized
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800 font-mono">{item.totalKg} kg</span>
                      <span className="text-[10px] text-gray-400 block">({item.count} lots)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>100% legally recorded with CPCB Form-6 manifests</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
