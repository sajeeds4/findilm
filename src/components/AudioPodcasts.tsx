import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Headphones, List, Loader2, Pause, Play, Search } from 'lucide-react';
import { fetchEpisodes } from '../services/api';
import { PodcastEpisode } from '../types';

export default function AudioPodcasts() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchEpisodes().then(setEpisodes).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => episodes.filter((episode) => `${episode.title} ${episode.speaker}`.toLowerCase().includes(query.toLowerCase())), [episodes, query]);

  const handlePlay = (episode: PodcastEpisode) => {
    if (currentTrack?.id === episode.id) {
      if (audioRef.current?.paused) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(episode.audio_url || '');
    audio.onended = () => setIsPlaying(false);
    audio.play().catch(console.error);
    audioRef.current = audio;
    setCurrentTrack(episode);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-100"><Headphones size={14} /> Audio Library</div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight">Audio & <span className="text-brand-600">Podcasts</span></h2>
          <p className="text-slate-500 text-lg max-w-xl font-medium">Listen to recitations, lectures, and daily reminders from the FindIlm backend library.</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search recitations, scholars..." className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-xl shadow-slate-200/50 font-medium" />
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-slate-950 text-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">Featured Playlist</div>
            <h3 className="text-5xl md:text-7xl font-display font-bold leading-tight">{episodes.find((episode) => episode.is_featured)?.title || 'Featured Audio'}</h3>
            <p className="text-slate-400 text-xl max-w-md leading-relaxed font-medium">{episodes.find((episode) => episode.is_featured)?.description || 'Curated spiritual listening for your day.'}</p>
          </div>
        </div>
        <div className="lg:col-span-4 bg-white border border-slate-200 p-10 rounded-[4rem] shadow-2xl shadow-slate-200/50 space-y-6">
          <h3 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-4"><div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600"><List size={28} /></div> Library Stats</h3>
          <div className="rounded-[2rem] bg-slate-50 p-6">
            <div className="text-sm text-slate-500">Available episodes</div>
            <div className="text-4xl font-bold text-slate-900 mt-2">{episodes.length}</div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-display font-bold text-slate-900">Recent Tracks</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((track, idx) => (
              <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={`bg-white border border-slate-200 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between group hover:border-brand-500 transition-all ${currentTrack?.id === track.id ? 'border-brand-500 bg-brand-50/30' : ''}`}>
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="w-28 h-28 rounded-[2rem] bg-slate-100 flex items-center justify-center shrink-0">
                    <Headphones size={44} className="text-brand-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-display font-bold text-slate-900">{track.title}</h4>
                    <p className="text-slate-500 text-lg font-medium">{track.speaker}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 mt-8 md:mt-0">
                  <div className="flex items-center gap-3 text-slate-400 font-bold text-lg"><Clock size={22} className="text-brand-600" />{track.duration}</div>
                  <button onClick={() => handlePlay(track)} className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center">
                    {currentTrack?.id === track.id && isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
