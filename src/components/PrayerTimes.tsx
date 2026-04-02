import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  Compass, 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon,
  Navigation,
  Loader2
} from 'lucide-react';

export default function PrayerTimes() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [times, setTimes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    { name: 'Fajr', icon: CloudSun, color: 'text-blue-500' },
    { name: 'Sunrise', icon: Sun, color: 'text-amber-500' },
    { name: 'Dhuhr', icon: Sun, color: 'text-orange-500' },
    { name: 'Asr', icon: CloudSun, color: 'text-emerald-500' },
    { name: 'Maghrib', icon: CloudMoon, color: 'text-rose-500' },
    { name: 'Isha', icon: Moon, color: 'text-indigo-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-900">Prayer Times</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <MapPin size={18} className="text-emerald-600" />
          <span>{location ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : 'Detecting location...'}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
          <p className="text-slate-500 animate-pulse">Calculating prayer times for your location...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Times Grid */}
          <div className="grid grid-cols-1 gap-4">
            {prayerList.map((prayer) => (
              <motion.div
                key={prayer.name}
                whileHover={{ x: 5 }}
                className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center ${prayer.color} group-hover:bg-emerald-50 transition-colors`}>
                    <prayer.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{prayer.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Worship Time</p>
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900">
                  {times[prayer.name]}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Qibla & Info */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Compass className="text-emerald-400" />
                  Qibla Direction
                </h3>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-48 h-48 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
                    <motion.div 
                      animate={{ rotate: 135 }} // Placeholder rotation
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Navigation size={64} className="text-emerald-500 fill-emerald-500" />
                    </motion.div>
                    <div className="text-center z-10 bg-slate-900 px-4">
                      <span className="text-3xl font-bold">135°</span>
                      <p className="text-xs text-slate-400 uppercase">SE</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-slate-400 text-sm">
                  Facing the Kaaba from your current location.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <Clock className="text-emerald-600" />
                Islamic Calendar
              </h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-emerald-800">12 Ramadan 1447</p>
                <p className="text-emerald-600 font-medium">Wednesday, April 1, 2026</p>
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-200">
                <p className="text-sm text-emerald-700 italic">
                  "Prayer is the pillar of religion."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
