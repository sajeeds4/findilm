import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Headphones, 
  List, 
  Search, 
  Heart, 
  Share2, 
  Download,
  Clock,
  Music,
  ChevronRight,
  MoreVertical,
  Mic2,
  Radio,
  Sparkles,
  Bookmark,
  VolumeX,
  Maximize2
} from 'lucide-react';

export default function AudioPodcasts() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    {
      id: 1,
      title: "Surah Al-Kahf Recitation",
      artist: "Sheikh Mishary Rashid Alafasy",
      duration: "24:15",
      category: "Qur'an",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3"
    },
    {
      id: 2,
      title: "The Importance of Patience",
      artist: "Mufti Menk",
      duration: "15:30",
      category: "Lectures",
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=400",
      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3"
    },
    {
      id: 3,
      title: "Morning Adhkar",
      artist: "FindIlm Audio",
      duration: "08:45",
      category: "Reminders",
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400",
      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3"
    },
    {
      id: 4,
      title: "History of the Companions",
      artist: "Dr. Omar Suleiman",
      duration: "45:20",
      category: "Podcasts",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3"
    }
  ];

  const handlePlay = (track: any) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 0.5 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-100">
            <Headphones size={14} />
            Audio Library
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">Audio & <span className="text-brand-600">Podcasts</span></h2>
          <p className="text-slate-500 text-lg max-w-xl font-medium">Listen to beautiful recitations, inspiring lectures, and daily reminders from world-renowned scholars.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search recitations, scholars..."
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-xl shadow-slate-200/50 font-medium"
          />
        </div>
      </div>

      {/* Featured & Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 text-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group flex flex-col justify-between min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1200" 
              alt="Featured" 
              className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">
              <Radio size={14} />
              Featured Playlist
            </div>
            <h3 className="text-5xl md:text-7xl font-display font-bold leading-tight">Ramadan <br /> <span className="text-brand-400 italic">Reminders</span></h3>
            <p className="text-slate-400 text-xl max-w-md leading-relaxed font-medium">
              A curated collection of short lectures and soul-stirring recitations to keep your heart connected throughout the holy month.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <button className="bg-brand-600 text-white px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 flex items-center gap-3 group/btn">
              <Play size={28} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" />
              Play All Tracks
            </button>
            <button className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-[1.5rem] hover:bg-white/20 transition-all">
              <Heart size={28} className="text-brand-400" />
            </button>
          </div>
          <Headphones className="absolute -right-12 -bottom-12 text-brand-500/10 w-96 h-96 rotate-12 pointer-events-none" />
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 p-10 rounded-[4rem] shadow-2xl shadow-slate-200/50 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                <List size={28} />
              </div>
              Categories
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-brand-600 transition-colors">Explore All</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: "Qur'an Recitation", icon: Music, count: 124, color: "text-blue-600 bg-blue-50" },
              { name: "Islamic Lectures", icon: Mic2, count: 85, color: "text-purple-600 bg-purple-50" },
              { name: "Short Reminders", icon: Sparkles, count: 210, color: "text-amber-600 bg-amber-50" },
              { name: "Podcasts", icon: Radio, count: 45, color: "text-rose-600 bg-rose-50" },
              { name: "Nasheeds", icon: Headphones, count: 32, color: "text-emerald-600 bg-emerald-50" }
            ].map((cat) => (
              <button key={cat.name} className="text-left p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-brand-500 hover:bg-brand-50 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center transition-colors shadow-sm`}>
                    <cat.icon size={24} />
                  </div>
                  <span className="font-bold text-slate-700 text-lg group-hover:text-brand-600 transition-colors">{cat.name}</span>
                </div>
                <span className="text-slate-400 text-xs font-bold bg-white px-4 py-1.5 rounded-full shadow-sm">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Track List */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-display font-bold text-slate-900">Recent Tracks</h3>
            <p className="text-slate-500 text-lg font-medium">The latest additions to our growing audio library.</p>
          </div>
          <button className="text-brand-600 font-bold text-sm flex items-center gap-2 group">
            View All Tracks <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tracks.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white border border-slate-200 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between group hover:border-brand-500 transition-all ${currentTrack?.id === track.id ? 'border-brand-500 bg-brand-50/30 ring-4 ring-brand-500/5' : ''}`}
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                  <img src={track.image} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-opacity ${currentTrack?.id === track.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={() => handlePlay(track)}
                      className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-700 transition-all scale-110"
                    >
                      {currentTrack?.id === track.id && isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200">{track.category}</span>
                  </div>
                  <h4 className="text-3xl font-display font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{track.title}</h4>
                  <p className="text-slate-500 text-lg font-medium">{track.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-4 text-slate-400 font-bold text-lg">
                  <Clock size={24} className="text-brand-600" />
                  {track.duration}
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-5 bg-slate-50 rounded-[1.5rem] text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm">
                    <Download size={24} />
                  </button>
                  <button className="p-5 bg-slate-50 rounded-[1.5rem] text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm">
                    <Heart size={24} />
                  </button>
                  <button className="p-5 bg-slate-50 rounded-[1.5rem] text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm">
                    <MoreVertical size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mini Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-6xl bg-slate-950/95 backdrop-blur-3xl text-white p-8 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] z-50 border border-white/10"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex items-center gap-6 flex-1 min-w-0 w-full md:w-auto">
                <img src={currentTrack.image} alt={currentTrack.title} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-2xl ring-2 ring-white/10" referrerPolicy="no-referrer" />
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-xl truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-slate-400 font-medium truncate">{currentTrack.artist}</p>
                </div>
                <button className="ml-auto md:ml-4 text-slate-500 hover:text-brand-400 transition-colors">
                  <Heart size={24} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 flex-[2] w-full">
                <div className="flex items-center gap-10">
                  <button className="text-slate-500 hover:text-white transition-colors"><SkipBack size={28} fill="currentColor" /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center hover:bg-brand-700 transition-all shadow-2xl shadow-brand-900/40 scale-110 group/play"
                  >
                    {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                  </button>
                  <button className="text-slate-500 hover:text-white transition-colors"><SkipForward size={28} fill="currentColor" /></button>
                </div>
                <div className="w-full flex items-center gap-6">
                  <span className="text-xs font-bold text-slate-500 w-12 text-right">0:00</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative group/progress cursor-pointer">
                    <motion.div 
                      className="absolute inset-0 bg-brand-500" 
                      style={{ width: `${progress}%` }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ left: `${progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-12">{currentTrack.duration}</span>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
                <div className="flex items-center gap-4 text-slate-400 group/vol">
                  <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
                    <div className="h-full bg-brand-500" style={{ width: isMuted ? '0%' : `${volume}%` }}></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-white/10">
                    <Bookmark size={20} />
                  </button>
                  <button className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-white/10">
                    <Maximize2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
