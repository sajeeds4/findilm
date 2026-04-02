import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Compass, Loader2, MapPin } from 'lucide-react';
import { fetchPrayerTimes } from '../services/api';

export default function PrayerTimes() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => {
          setError('Location access denied. Using default (Mecca).');
          setLocation({ lat: 21.4225, lng: 39.8262 });
        },
      );
    } else {
      setError('Geolocation not supported.');
      setLocation({ lat: 21.4225, lng: 39.8262 });
    }
  }, []);

  useEffect(() => {
    if (!location) return;
    fetchPrayerTimes(location.lat, location.lng)
      .then((data) => setTimes(data.timings))
      .catch(() => setError('Failed to fetch prayer times.'))
      .finally(() => setLoading(false));
  }, [location]);

  const prayerList = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest"><Clock size={14} /> Worship Schedule</div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">Prayer & Worship</h2>
          <div className="flex items-center gap-2 text-slate-500 text-lg">
            <MapPin size={20} className="text-brand-600" />
            <span>{location ? `Detected: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : 'Detecting your location...'}</span>
          </div>
          {error && <p className="text-sm text-amber-600 font-bold">{error}</p>}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <Loader2 className="animate-spin text-brand-600" size={64} />
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Calculating Sacred Timings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {prayerList.map((prayer, idx) => (
              <motion.div key={prayer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{prayer}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Worship Time</p>
                </div>
                <div className="text-3xl font-mono font-bold text-slate-900 bg-slate-50 px-6 py-3 rounded-2xl">{times?.[prayer] || '--:--'}</div>
              </motion.div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-8"><Compass className="text-brand-400" size={26} /><h3 className="text-2xl font-bold">Qibla</h3></div>
              <p className="text-slate-400 leading-relaxed">Prayer times are now served through the Django backend, which also caches results for faster repeat lookups.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
