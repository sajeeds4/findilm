import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Search, Play, Pause, Info, Sparkles, Loader2, ChevronDown, List, Volume2, Volume1, VolumeX, Bookmark, Share2, SkipBack, SkipForward, Copy, Check } from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function Quran() {
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [surahsLoading, setSurahsLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [activeTafsirVerse, setActiveTafsirVerse] = useState<number | null>(null);
  const [tafsirCache, setTafsirCache] = useState<{ [key: number]: string }>({});
  const [isSurahListOpen, setIsSurahListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setSurahsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setExplanation(null);
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNum}/editions/quran-uthmani,en.sahih`)
      .then(res => res.json())
      .then(data => {
        setSurahData(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [selectedSurahNum]);

  const getExplanation = async (verseText: string, verseNum: number) => {
    if (tafsirCache[verseNum]) {
      setActiveTafsirVerse(activeTafsirVerse === verseNum ? null : verseNum);
      setExplanation(tafsirCache[verseNum]);
      return;
    }

    setExplaining(true);
    setActiveTafsirVerse(verseNum);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a beautiful, insightful, and spiritual tafsir (explanation) for the following Qur'anic verse from Surah ${surahData[1].englishName} (Verse ${verseNum}): "${verseText}". 
        Focus on:
        1. Linguistic beauty and meaning.
        2. Spiritual lessons for the soul.
        3. Practical applications in modern daily life.
        Use Markdown for formatting. Keep it concise but profound.`,
      });
      const text = response.text || "No explanation available.";
      setExplanation(text);
      setTafsirCache(prev => ({ ...prev, [verseNum]: text }));
    } catch (error) {
      console.error("Explanation error:", error);
      setExplanation("Failed to get explanation.");
    } finally {
      setExplaining(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleAudio = (ayahNumber: number) => {
    if (playingAyah === ayahNumber) {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
          setPlayingAyah(ayahNumber);
        } else {
          audioRef.current.pause();
          setPlayingAyah(null);
        }
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.ontimeupdate = null;
      }
      
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
      const audio = new Audio(audioUrl);
      audio.volume = isMuted ? 0 : volume;
      audioRef.current = audio;
      
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      
      audio.onended = () => {
        // Auto play next ayah if available
        const currentIdx = surahData[0].ayahs.findIndex((a: any) => a.number === ayahNumber);
        if (currentIdx !== -1 && currentIdx < surahData[0].ayahs.length - 1) {
          toggleAudio(surahData[0].ayahs[currentIdx + 1].number);
        } else {
          setPlayingAyah(null);
          setAudioProgress(0);
        }
      };

      audio.onerror = () => {
        setPlayingAyah(null);
        setAudioProgress(0);
      };

      audio.play().catch(err => {
        console.error("Playback failed:", err);
        setPlayingAyah(null);
      });
      setPlayingAyah(ayahNumber);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (!playingAyah || !surahData) return;
    const currentIdx = surahData[0].ayahs.findIndex((a: any) => a.number === playingAyah);
    if (direction === 'next' && currentIdx < surahData[0].ayahs.length - 1) {
      toggleAudio(surahData[0].ayahs[currentIdx + 1].number);
    } else if (direction === 'prev' && currentIdx > 0) {
      toggleAudio(surahData[0].ayahs[currentIdx - 1].number);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setAudioProgress(parseFloat(e.target.value));
    }
  };

  const copyAyah = (ayah: any, idx: number) => {
    const textToCopy = `${ayah.text}\n\n${surahData[1].ayahs[idx].text}\n\n— ${surahData[1].englishName} (${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedAyah(ayah.number);
      setTimeout(() => setCopiedAyah(null), 2000);
    });
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-40">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">The Holy Qur’an</h2>
          <p className="text-slate-500 text-lg max-w-xl">
            Explore the divine message with authentic Uthmani script, Sahih International translation, and AI-powered spiritual insights.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <button 
            onClick={() => setIsSurahListOpen(!isSurahListOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-xl shadow-slate-200/50 hover:border-brand-500 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <List size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Current Surah</p>
                <span className="font-bold text-slate-800">
                  {surahData ? `${surahData[1].number}. ${surahData[1].englishName}` : 'Select Surah'}
                </span>
              </div>
            </div>
            <ChevronDown size={20} className={`text-slate-400 transition-transform ${isSurahListOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSurahListOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 w-full md:w-[400px] mt-4 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search Surah by name or number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                  {surahsLoading ? (
                    <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-600" size={32} /></div>
                  ) : filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => {
                        setSelectedSurahNum(s.number);
                        setIsSurahListOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-2xl hover:bg-brand-50 transition-all flex items-center justify-between group ${selectedSurahNum === s.number ? 'bg-brand-50 text-brand-600' : 'text-slate-700'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${selectedSurahNum === s.number ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600'}`}>
                          {s.number}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{s.englishName}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{s.englishNameTranslation}</p>
                        </div>
                      </div>
                      <span className="font-serif text-2xl group-hover:text-brand-600 transition-colors">{s.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <Loader2 className="animate-spin text-brand-600" size={64} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Book size={24} className="text-brand-400" />
            </div>
          </div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Preparing Divine Verses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Reading Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Surah Banner */}
            <div className="bg-slate-950 text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1590076215667-873d3835415c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Islamic Pattern" 
                  className="w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              </div>

              <div className="relative z-10 text-center space-y-6">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-brand-400 font-serif text-4xl mb-8"
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </motion.p>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-serif font-bold mb-4"
                >
                  {surahData[0].name}
                </motion.h3>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="text-slate-300 font-display text-2xl tracking-tight">
                    {surahData[1].englishName} • <span className="text-brand-400 italic">{surahData[1].englishNameTranslation}</span>
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {surahData[0].revelationType}
                    </span>
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {surahData[0].numberOfAyahs} Verses
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Ayah List */}
            <div className="space-y-6">
              {surahData[0].ayahs.map((ayah: any, idx: number) => (
                <motion.div
                  key={ayah.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-white border border-slate-200 p-10 md:p-14 rounded-[2.5rem] hover:border-brand-500 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
                >
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-sm font-bold text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                        {ayah.numberInSurah}
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Verse Reference</p>
                        <p className="text-xs font-bold text-slate-600">{surahData[1].englishName} {ayah.numberInSurah}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-end gap-2">
                        <button 
                          onClick={() => toggleAudio(ayah.number)}
                          className={`p-3.5 rounded-2xl transition-all flex items-center gap-2 ${playingAyah === ayah.number ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50'}`}
                        >
                          {playingAyah === ayah.number ? <Pause size={20} fill="currentColor" /> : <Volume2 size={20} />}
                        </button>
                        {playingAyah === ayah.number && (
                          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-brand-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${audioProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => getExplanation(ayah.text, ayah.numberInSurah)}
                        className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all h-fit"
                        title="AI Tafsir"
                      >
                        <Sparkles size={20} />
                      </button>
                      <button 
                        onClick={() => copyAyah(ayah, idx)}
                        className={`p-3.5 rounded-2xl transition-all ${copiedAyah === ayah.number ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50'}`}
                        title="Copy Verse"
                      >
                        {copiedAyah === ayah.number ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                      <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                        <Bookmark size={20} />
                      </button>
                      <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-12">
                    <p className="text-5xl md:text-6xl font-serif text-right leading-[2] text-slate-900" dir="rtl">
                      {ayah.text}
                    </p>
                    <div className="pl-8 border-l-4 border-brand-100 group-hover:border-brand-500 transition-colors py-2">
                      <p className="text-slate-600 text-xl md:text-2xl leading-relaxed font-display">
                        {surahData[1].ayahs[idx].text}
                      </p>
                    </div>

                    {/* Inline Tafsir Section */}
                    <div className="pt-8">
                      {activeTafsirVerse === ayah.numberInSurah ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-brand-50/50 rounded-[2rem] p-8 border border-brand-100"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
                              <Sparkles size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">AI Spiritual Insights</p>
                              <p className="text-[10px] text-brand-600 uppercase tracking-widest font-bold">Verse {ayah.numberInSurah} Tafsir</p>
                            </div>
                          </div>
                          
                          {explaining && !tafsirCache[ayah.numberInSurah] ? (
                            <div className="flex items-center gap-3 py-4">
                              <Loader2 className="animate-spin text-brand-600" size={20} />
                              <p className="text-sm text-slate-500 italic">Consulting divine wisdom...</p>
                            </div>
                          ) : (
                            <div className="prose prose-slate prose-brand max-w-none prose-sm md:prose-base">
                              <ReactMarkdown>{tafsirCache[ayah.numberInSurah] || explanation || ''}</ReactMarkdown>
                            </div>
                          )}
                          
                          <button 
                            onClick={() => setActiveTafsirVerse(null)}
                            className="mt-6 text-xs font-bold text-brand-600 uppercase tracking-widest hover:text-brand-700 transition-colors"
                          >
                            Close Tafsir
                          </button>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => getExplanation(ayah.text, ayah.numberInSurah)}
                          className="flex items-center gap-3 px-6 py-3 bg-brand-50 text-brand-600 rounded-2xl hover:bg-brand-600 hover:text-white transition-all group/btn font-bold text-sm"
                        >
                          <Sparkles size={18} className="group-hover/btn:rotate-12 transition-transform" />
                          Show AI Tafsir
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar / AI Tafsir Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* AI Tafsir Card */}
              <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-brand-900/20">
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">AI Spiritual Guide</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Deep Insights & Tafsir</p>
                    </div>
                  </div>
                  
                  <div className="min-h-[300px] flex flex-col">
                    {explaining ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="relative">
                          <Loader2 className="animate-spin text-brand-600" size={48} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={16} className="text-brand-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-800 font-bold">Analyzing Divine Wisdom</p>
                          <p className="text-xs text-slate-400 italic">Consulting authentic classical and modern sources...</p>
                        </div>
                      </div>
                    ) : explanation ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1"
                      >
                        <div className="prose prose-slate prose-brand max-w-none">
                          <ReactMarkdown>{explanation}</ReactMarkdown>
                        </div>
                        <button 
                          onClick={() => setExplanation(null)}
                          className="mt-8 w-full py-3 rounded-2xl border border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                          Clear Explanation
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12">
                        <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-200">
                          <Info size={40} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-800 font-bold text-lg">Unlock Spiritual Depth</p>
                          <p className="text-slate-500 text-sm leading-relaxed max-w-[200px] mx-auto">
                            Select a verse and click the <Sparkles size={14} className="inline text-brand-600" /> icon to receive a beautiful AI-powered spiritual explanation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                <h4 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <Book size={24} className="text-brand-400" />
                  Popular Surahs
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { n: 1, name: 'Al-Fatiha', desc: 'The Opening' },
                    { n: 18, name: 'Al-Kahf', desc: 'The Cave' },
                    { n: 36, name: 'Ya-Sin', desc: 'The Heart of Quran' },
                    { n: 55, name: 'Ar-Rahman', desc: 'The Beneficent' },
                    { n: 67, name: 'Al-Mulk', desc: 'The Sovereignty' }
                  ].map((s) => (
                    <button 
                      key={s.n}
                      onClick={() => setSelectedSurahNum(s.n)}
                      className="text-left p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-white group-hover:text-brand-400 transition-colors">{s.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{s.desc}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-brand-600 group-hover:text-white transition-all">
                        <ChevronDown size={16} className="-rotate-90" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Audio Player */}
      <AnimatePresence>
        {playingAyah && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl shadow-slate-950/50">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Track Info */}
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-900/20">
                    <Volume2 size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white font-bold truncate">
                      {surahData?.[1]?.englishName}
                    </p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                      Verse {surahData?.[0]?.ayahs.find((a: any) => a.number === playingAyah)?.numberInSurah}
                    </p>
                  </div>
                </div>

                {/* Controls & Progress */}
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-center gap-6">
                    <button 
                      onClick={() => handleSkip('prev')}
                      disabled={!surahData || surahData[0].ayahs.findIndex((a: any) => a.number === playingAyah) === 0}
                      className="text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Previous Verse"
                    >
                      <SkipBack size={20} />
                    </button>
                    <button 
                      onClick={() => toggleAudio(playingAyah)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform shadow-lg"
                    >
                      {audioRef.current?.paused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                    </button>
                    <button 
                      onClick={() => handleSkip('next')}
                      disabled={!surahData || surahData[0].ayahs.findIndex((a: any) => a.number === playingAyah) === surahData[0].ayahs.length - 1}
                      className="text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Next Verse"
                    >
                      <SkipForward size={20} />
                    </button>
                  </div>
                  <div className="relative group">
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={audioProgress}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-500"
                    />
                    <div 
                      className="absolute top-0 left-0 h-1.5 bg-brand-500 rounded-full pointer-events-none transition-all"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>

                {/* Volume Controls */}
                <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
