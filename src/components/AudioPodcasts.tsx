import { useState } from 'react';
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
  Music
} from 'lucide-react';

export default function AudioPodcasts() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const tracks = [
    {
      id: 1,
      title: "Surah Al-Kahf Recitation",
      artist: "Sheikh Mishary Rashid Alafasy",
      duration: "24:15",
      category: "Qur'an",
      image: "https://picsum.photos/seed/mishary/200/200"
    },
    {
      id: 2,
      title: "The Importance of Patience",
      artist: "Mufti Menk",
      duration: "15:30",
      category: "Lectures",
      image: "https://picsum.photos/seed/menk/200/200"
    },
    {
      id: 3,
      title: "Morning Adhkar",
      artist: "FindIlm Audio",
      duration: "08:45",
      category: "Reminders",
      image: "https://picsum.photos/seed/adhkar/200/200"
    },
    {
      id: 4,
      title: "History of the Companions",
      artist: "Dr. Omar Suleiman",
      duration: "45:20",
      category: "Podcasts",
      image: "https://picsum.photos/seed/omar/200/200"
    }
  ];

  const handlePlay = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">Audio & Podcasts</h2>
          <p className="text-slate-500">Listen to beautiful recitations, lectures, and reminders.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search audio..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Featured Playlist */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-emerald-600 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-200 font-bold uppercase tracking-widest text-xs mb-4">
              <Music size={16} />
              <span>Featured Playlist</span>
            </div>
            <h3 className="text-4xl font-bold mb-4">Ramadan Reminders</h3>
            <p className="text-emerald-50 text-lg max-w-md">
              A curated collection of short lectures and recitations to keep you inspired throughout the holy month.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
              <Play size={20} fill="currentColor" />
              Play All
            </button>
            <button className="bg-emerald-700/50 backdrop-blur-md border border-emerald-400 p-3 rounded-full hover:bg-emerald-700 transition-colors">
              <Heart size={20} />
            </button>
          </div>
          <Headphones className="absolute -right-8 -bottom-8 text-emerald-500/20 w-64 h-64" />
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <List className="text-emerald-600" />
            Categories
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {["Qur'an Recitation", "Islamic Lectures", "Short Reminders", "Podcasts", "Nasheeds"].map((cat) => (
              <button key={cat} className="text-left text-sm p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group">
                <span className="font-bold text-slate-700 group-hover:text-emerald-600">{cat}</span>
                <span className="text-slate-400 text-xs">12+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Track List */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">Recent Tracks</h3>
        <div className="grid grid-cols-1 gap-4">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ x: 5 }}
              className={`bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all ${currentTrack?.id === track.id ? 'border-emerald-500 bg-emerald-50/30' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  <img src={track.image} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => handlePlay(track)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    {currentTrack?.id === track.id && isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{track.title}</h4>
                  <p className="text-sm text-slate-500">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                  <Clock size={16} />
                  {track.duration}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <Download size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <Share2 size={18} />
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
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-4xl bg-slate-900 text-white p-4 rounded-3xl shadow-2xl z-50 flex items-center gap-6"
          >
            <div className="flex items-center gap-4 flex-1">
              <img src={currentTrack.image} alt={currentTrack.title} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
              <div className="min-w-0">
                <h4 className="font-bold text-sm truncate">{currentTrack.title}</h4>
                <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-white transition-colors"><SkipBack size={20} fill="currentColor" /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-slate-400 hover:text-white transition-colors"><SkipForward size={20} fill="currentColor" /></button>
            </div>

            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-center gap-2 text-slate-400">
                <Volume2 size={18} />
                <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-emerald-500"></div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors"><List size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
