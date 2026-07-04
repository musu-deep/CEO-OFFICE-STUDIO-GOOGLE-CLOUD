import React, { useState } from 'react';
import { 
  Ship, 
  Truck, 
  Navigation, 
  Plus, 
  Anchor, 
  Compass, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  X,
  Gauge
} from 'lucide-react';
import { PlatformTheme } from '../types';

interface ArakLogisticViewProps {
  theme: PlatformTheme;
}

interface Shipment {
  id: string;
  type: 'بحرية' | 'برية';
  cargoName: string;
  vesselOrTruck: string;
  origin: string;
  destination: string;
  status: 'في عرض البحر' | 'قيد التحميل' | 'مكتمل التسليم' | 'تأخير مؤقت';
  eta: string;
}

export default function ArakLogisticView({ theme }: ArakLogisticViewProps) {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'sh-1',
      type: 'بحرية',
      cargoName: 'شحنة حديد التسليح الكبرى رقم 104',
      vesselOrTruck: 'سفينة أراك المجد (ARAK GLORY)',
      origin: 'ميناء الدمام، المملكة العربية السعودية',
      destination: 'ميناء الإسكندرية، جمهورية مصر العربية',
      status: 'في عرض البحر',
      eta: '2026-06-20'
    },
    {
      id: 'sh-2',
      type: 'برية',
      cargoName: 'إمدادات فنية ومعدات الحفر الفدرالية',
      vesselOrTruck: 'قافلة أراك البرية الرابعة (12 شاحنة)',
      origin: 'مستودعات المجموعة بجدة',
      destination: 'موقع الإنشاءات الإقليمي بالرياض',
      status: 'مكتمل التسليم',
      eta: '2026-06-15'
    },
    {
      id: 'sh-3',
      type: 'بحرية',
      cargoName: 'شحنة خام البليت الصناعي المستورد',
      vesselOrTruck: 'سفينة البحر الأحمر (RED SEA CARRIER)',
      origin: 'ميناء بيرايوس، اليونان',
      destination: 'ميناء جدة الإسلامي، السعودية',
      status: 'قيد التحميل',
      eta: '2026-06-26'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCargo, setNewCargo] = useState('');
  const [newType, setNewType] = useState<'بحرية' | 'برية'>('بحرية');
  const [newVessel, setNewVessel] = useState('');
  const [newDestination, setNewDestination] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCargo) return;

    const newShip: Shipment = {
      id: `sh-${Date.now()}`,
      type: newType,
      cargoName: newCargo,
      vesselOrTruck: newVessel || 'ناقلة أراك اللوجستية',
      origin: 'ميناء جدة الإسلامي، السعودية',
      destination: newDestination || 'ميناء الإسكندرية، مصر',
      status: 'قيد التحميل',
      eta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setShipments([newShip, ...shipments]);
    setShowModal(false);
    setNewCargo('');
    setNewVessel('');
    setNewDestination('');
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'vision_2030': return 'text-emerald-400';
      case 'golden_luxury': return 'text-amber-400';
      case 'midnight_navy': return 'text-blue-400';
      case 'spring': return 'text-lime-400';
    }
  };

  const getThemeBtnClass = () => {
    switch (theme) {
      case 'vision_2030': return 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'golden_luxury': return 'bg-amber-600 hover:bg-amber-500 text-slate-950';
      case 'midnight_navy': return 'bg-blue-600 hover:bg-blue-500 text-white';
      case 'spring': return 'bg-lime-600 hover:bg-lime-500 text-white';
    }
  };

  const getThemeBgClass = () => {
    switch (theme) {
      case 'vision_2030': return 'bg-emerald-950/20 border-emerald-900/40';
      case 'golden_luxury': return 'bg-amber-950/20 border-amber-900/40';
      case 'midnight_navy': return 'bg-blue-950/20 border-blue-900/40';
      case 'spring': return 'bg-lime-950/20 border-lime-900/40';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease_out] text-right">
      
      {/* Header exactly like Page 13 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex flex-col gap-1.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${getThemeTextClass()}`}>
            قطاعات النقل والشحن
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            لوحة أراك لوجستيك للشحن والملاحة
          </h2>
          <span className="text-xs text-slate-400">
            تتبع الشحنات البحرية، القوافل البرية، وإدارة عقود الإعفاء الجمركي المعتمدة لفرع جدة والموانئ الإقليمية
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-lg ${getThemeBtnClass()}`}
        >
          <Plus className="w-4 h-4" />
          <span>جدولة شحنة جديدة</span>
        </button>
      </div>

      {/* Grid counters exactly like Page 13 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">أسطول النقل النشط</span>
          <span className="text-3xl font-extrabold text-slate-100 font-sans">120+</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">الشحنات البحرية النشطة</span>
          <span className="text-3xl font-extrabold text-blue-500 font-sans">18</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">الشحنات البرية المعتمدة</span>
          <span className="text-3xl font-extrabold text-emerald-500 font-sans">45</span>
        </div>
        <div className="bg-[#121422] p-5 rounded-2xl border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">مؤشر الأداء التشغيلي</span>
          <span className="text-3xl font-extrabold text-amber-500 font-sans">94.8%</span>
        </div>
      </div>

      {/* Interactive Map Visual Mockup */}
      <div className="bg-[#121422] rounded-3xl border border-slate-800/80 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-4 left-4 bg-[#16182c] px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>تتبع حي بالأقمار الصناعية مفعل</span>
        </div>

        <h3 className="text-sm font-black text-slate-100 mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-500" />
          <span>خريطة تتبع الشحنات الإقليمية (أراك لوجستيك)</span>
        </h3>

        {/* Beautiful high-end vector graphics mimicking Page 13 map grid */}
        <div className="w-full h-48 bg-[#0b0c16] rounded-2xl border border-slate-800/60 relative flex items-center justify-center overflow-hidden">
          {/* Simulated ocean dotted lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Dotted route lines and ports */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Route Dammam -> Alex */}
            <path d="M 100,120 Q 300,50 600,100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,6" className="animate-[dash_10s_linear_infinite]" />
            {/* Route Jeddah -> Athens */}
            <path d="M 250,150 Q 400,80 500,40" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,6" />
          </svg>

          {/* Port Jeddah */}
          <div className="absolute bottom-1/4 left-1/3 text-right">
            <span className="w-3 h-3 bg-amber-500 rounded-full block border-2 border-slate-950 animate-ping absolute -top-1 -right-1"></span>
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full block border-2 border-slate-950"></span>
            <span className="text-[9px] text-slate-400 block mt-1 font-sans">ميناء جدة الإسلامي</span>
          </div>

          {/* Port Alex */}
          <div className="absolute top-1/3 right-1/4 text-right">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block border-2 border-slate-950"></span>
            <span className="text-[9px] text-slate-400 block mt-1 font-sans">ميناء الإسكندرية (مصر)</span>
          </div>

          {/* Active Vessel Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Ship className="w-4 h-4 text-amber-500 animate-bounce" />
            <div className="text-right">
              <span className="text-[9px] font-black text-slate-100 block">ARAK GLORY</span>
              <span className="text-[8px] text-slate-500 block">موقع عرض البحر الأحمر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments tracking List Cards */}
      <div className="space-y-4">
        {shipments.map((ship) => {
          const isSea = ship.type === 'بحرية';
          return (
            <div 
              key={ship.id}
              className="bg-[#121422] border border-slate-800/80 p-6 rounded-2xl relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700/80 transition-all duration-300 shadow-lg text-right overflow-hidden"
            >
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${
                isSea ? 'bg-amber-500' : 'bg-blue-500'
              }`}></div>

              {/* Status & ETA */}
              <div className="flex flex-col items-end gap-1.5 w-full md:w-auto justify-end order-2 md:order-1 flex-shrink-0">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  ship.status === 'مكتمل التسليم' ? 'bg-emerald-950 text-emerald-400' :
                  ship.status === 'في عرض البحر' ? 'bg-amber-950 text-amber-400' :
                  'bg-blue-950 text-blue-400'
                }`}>
                  {ship.status}
                </span>

                <span className="text-[11px] text-slate-500 font-sans">
                  تاريخ الوصول المتوقع: {ship.eta}
                </span>
              </div>

              {/* Detail Contents */}
              <div className="space-y-2 flex-1 pr-4 order-1 md:order-2">
                <div className="flex items-center gap-3 justify-start">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isSea ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                  }`}>
                    {isSea ? <Ship className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                    <span>شحنة {ship.type}</span>
                  </span>

                  <span className="text-[11px] text-slate-400 font-sans">
                    الناقل: {ship.vesselOrTruck}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-100">{ship.cargoName}</h3>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>المسار: </span>
                  <strong className="text-slate-300 font-bold">{ship.origin}</strong>
                  <span>←</span>
                  <strong className="text-amber-500 font-bold">{ship.destination}</strong>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Insert Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f111a] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease_out]">
            
            <div className="flex justify-between items-center bg-[#121522] px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Ship className="w-4 h-4 text-amber-500" />
                <span>جدولة شحنة لوجستية جديدة</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">نوع النقل</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#16182c] border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="بحرية">بحرية (ناقلات وسفن الشحن)</option>
                  <option value="برية">برية (شاحنات وقوافل النقل)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">اسم ومواصفات الشحنة</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: شحنة خام الحديد رقم 105" 
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">الناقل (السفينة / رقم القافلة)</label>
                <input 
                  type="text" 
                  placeholder="مثال: ناقلة أراك المجد" 
                  value={newVessel}
                  onChange={(e) => setNewVessel(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">ميناء / وجهة الوصول المتوقعة</label>
                <input 
                  type="text" 
                  placeholder="مثال: ميناء الإسكندرية، مصر" 
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-[#16182c] border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors text-slate-300"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${getThemeBtnClass()}`}
                >
                  جدولة وإطلاق الشحنة
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
