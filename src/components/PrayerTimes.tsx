import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  Compass, 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon,
  Navigation,
  Loader2,
  Calendar,
  Utensils,
  MoonStar,
  ChevronRight,
  Info
} from 'lucide-react';

export default function PrayerTimes() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [times, setTimes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'ramadan'>('daily');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError("Location access denied. Using default (Mecca).");
          setLocation({ lat: 21.4225, lng: 39.8262 });
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLocation({ lat: 21.4225, lng: 39.8262 });
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetch(`https://api.aladhan.com/v1/timings?latitude=${location.lat}&longitude=${location.lng}&method=2`)
        .then(res => res.json())
        .then(data => {
          setTimes(data.data.timings);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch prayer times.");
          setLoading(false);
        });
    }
  }, [location]);

  const prayerList = [
    { name: 'Fajr', icon: CloudSun, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Sunrise', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Dhuhr', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Asr', icon: CloudSun, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Maghrib', icon: CloudMoon, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Isha', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest">
            <Clock size={14} />
            Worship Schedule
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">Prayer & Worship</h2>
          <div className="flex items-center gap-2 text-slate-500 text-lg">
            <MapPin size={20} className="text-brand-600" />
            <span>{location ? `Detected: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : 'Detecting your location...'}</span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Daily Times
          </button>
          <button 
            onClick={() => setActiveTab('ramadan')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ramadan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Ramadan Tools
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <Loader2 className="animate-spin text-brand-600" size={64} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass size={24} className="text-brand-400" />
            </div>
          </div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Calculating Sacred Timings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Times & Ramadan */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'daily' ? (
                <motion.div 
                  key="daily"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {prayerList.map((prayer, idx) => (
                    <motion.div
                      key={prayer.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-between group hover:border-brand-500 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 ${prayer.bg} rounded-3xl flex items-center justify-center ${prayer.color} group-hover:scale-110 transition-transform`}>
                          <prayer.icon size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{prayer.name}</h3>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Worship Time</p>
                        </div>
                      </div>
                      <div className="text-3xl font-mono font-bold text-slate-900 bg-slate-50 px-6 py-3 rounded-2xl group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        {times[prayer.name]}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="ramadan"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-slate-900 text-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest">
                          <MoonStar size={14} />
                          Ramadan 1447
                        </div>
                        <h3 className="text-4xl font-bold">Fasting Tracker</h3>
                        <p className="text-slate-400 leading-relaxed">
                          Track your fasts, plan your meals, and stay consistent with your worship during the holy month.
                        </p>
                        <div className="flex gap-4">
                          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Suhoor Ends</p>
                            <p className="text-2xl font-mono font-bold text-brand-400">{times.Fajr}</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex-1">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Iftar Starts</p>
                            <p className="text-2xl font-mono font-bold text-brand-400">{times.Maghrib}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold">Daily Checklist</h4>
                          <span className="text-xs text-brand-400 font-bold">4/6 Done</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            '5 Daily Prayers',
                            'Taraweeh Prayer',
                            'Quran Recitation',
                            'Morning/Evening Dhikr',
                            'Charity (Sadaqah)',
                            'Tahajjud'
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-brand-500/50 transition-all cursor-pointer group">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${i < 4 ? 'bg-brand-500 border-brand-500' : 'border-white/20 group-hover:border-brand-500'}`}>
                                {i < 4 && <div className="w-2 h-2 bg-white rounded-full"></div>}
                              </div>
                              <span className={`text-sm ${i < 4 ? 'text-white' : 'text-slate-400'}`}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] space-y-4 hover:border-brand-500 transition-all group">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Utensils size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900">Meal Planner</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Healthy Suhoor and Iftar recipes for sustained energy.</p>
                      <button className="text-brand-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Recipes <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] space-y-4 hover:border-brand-500 transition-all group">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Calendar size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900">Ramadan Planner</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Set spiritual goals and track your progress daily.</p>
                      <button className="text-brand-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Open Planner <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] space-y-4 hover:border-brand-500 transition-all group">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <Info size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900">Fasting Rules</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Quick guide on what breaks the fast and common FAQs.</p>
                      <button className="text-brand-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Guide <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Qibla & Calendar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Qibla Compass Card */}
              <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-600/20 rounded-xl flex items-center justify-center text-brand-400">
                        <Compass size={24} />
                      </div>
                      Qibla
                    </h3>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Live Direction
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-64 h-64 rounded-full border-[12px] border-white/5 flex items-center justify-center relative shadow-inner">
                      {/* Compass Ring */}
                      <div className="absolute inset-0 border-2 border-brand-500/20 rounded-full"></div>
                      
                      {/* Needle */}
                      <motion.div 
                        animate={{ rotate: 135 }}
                        transition={{ type: "spring", stiffness: 50 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="relative h-full w-full flex items-center justify-center">
                          <Navigation size={80} className="text-brand-500 fill-brand-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                          <div className="absolute top-0 w-2 h-4 bg-rose-500 rounded-full -mt-2"></div>
                        </div>
                      </motion.div>

                      {/* Center Info */}
                      <div className="text-center z-10 bg-slate-950 px-6 py-4 rounded-3xl border border-white/10 shadow-2xl">
                        <span className="text-4xl font-bold block">135°</span>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">South East</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-slate-400 text-sm leading-relaxed">
                      The Kaaba is located <span className="text-white font-bold">135.4°</span> from your current position in <span className="text-brand-400">Mecca, SA</span>.
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-600/10 to-transparent"></div>
              </div>

              {/* Hijri Calendar Card */}
              <div className="bg-brand-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center text-white">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Islamic Calendar</h4>
                      <p className="text-[10px] text-brand-200 uppercase tracking-widest font-bold">Hijri Date</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-4xl font-bold leading-tight">12 Ramadan 1447</p>
                    <p className="text-brand-200 font-medium text-lg">Wednesday, April 1, 2026</p>
                  </div>

                  <div className="pt-8 border-t border-white/20">
                    <div className="flex items-center gap-3 text-brand-100 italic text-sm leading-relaxed">
                      <div className="w-1 h-12 bg-brand-400 rounded-full"></div>
                      <p>"Prayer is the pillar of religion, and the key to every goodness."</p>
                    </div>
                  </div>
                </div>
                <MoonStar className="absolute -right-8 -bottom-8 text-white/10 w-48 h-48 rotate-12" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
