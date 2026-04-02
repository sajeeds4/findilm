import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Search, Play, Pause, Info, Sparkles, Loader2, ChevronDown, List } from 'lucide-react';
import { ai, MODELS } from '../services/gemini';

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
  const [isSurahListOpen, setIsSurahListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    setExplaining(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a brief, beautiful tafsir (explanation) for the following Qur'anic verse from Surah ${surahData[1].englishName} (Verse ${verseNum}): "${verseText}". Focus on spiritual lessons and practical applications.`,
      });
      setExplanation(response.text || "No explanation available.");
    } catch (error) {
      console.error("Explanation error:", error);
      setExplanation("Failed to get explanation.");
    } finally {
      setExplaining(false);
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">The Holy Qur’an</h2>
          <p className="text-slate-500">Read the most authentic Uthmani script with Sahih International translation.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <button 
            onClick={() => setIsSurahListOpen(!isSurahListOpen)}
            className="w-full flex items-center justify-between px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <List size={18} className="text-emerald-600" />
              <span className="font-bold text-slate-700">
                {surahData ? `${surahData[1].number}. ${surahData[1].englishName}` : 'Select Surah'}
              </span>
            </div>
            <ChevronDown size={18} className={`text-slate-400 transition-transform ${isSurahListOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSurahListOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search Surah..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {surahsLoading ? (
                    <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></div>
                  ) : filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => {
                        setSelectedSurahNum(s.number);
                        setIsSurahListOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 hover:bg-emerald-50 transition-colors flex items-center justify-between group ${selectedSurahNum === s.number ? 'bg-emerald-50 text-emerald-600' : 'text-slate-700'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 w-6">{s.number}</span>
                        <div>
                          <p className="font-bold text-sm">{s.englishName}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">{s.englishNameTranslation}</p>
                        </div>
                      </div>
                      <span className="font-serif text-lg group-hover:text-emerald-600">{s.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
          <p className="text-slate-500">Loading Surah Content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 text-center">
                <p className="text-emerald-200 font-serif text-2xl mb-4">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <h3 className="text-4xl font-bold mb-2">{surahData[0].name}</h3>
                <p className="text-emerald-100 font-medium tracking-wide">
                  {surahData[1].englishName} • {surahData[1].englishNameTranslation}
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {surahData[0].revelationType}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {surahData[0].numberOfAyahs} Ayahs
                  </span>
                </div>
              </div>
              <Book className="absolute -right-4 -bottom-4 text-emerald-500/30 w-48 h-48" />
            </div>

            <div className="space-y-4">
              {surahData[0].ayahs.map((ayah: any, idx: number) => (
                <motion.div
                  key={ayah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 1) }}
                  className="bg-white border border-slate-200 p-8 rounded-3xl hover:border-emerald-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      {ayah.numberInSurah}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                        <Play size={20} />
                      </button>
                      <button 
                        onClick={() => getExplanation(ayah.text, ayah.numberInSurah)}
                        className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                      >
                        <Info size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-4xl font-serif text-right mb-8 leading-[1.8] text-slate-800" dir="rtl">
                    {ayah.text}
                  </p>
                  <div className="pl-4 border-l-4 border-emerald-100 group-hover:border-emerald-500 transition-colors">
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {surahData[1].ayahs[idx].text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm sticky top-24">
              <div className="flex items-center gap-3 text-emerald-600 font-bold mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-lg">AI Spiritual Guide</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              
              {explaining ? (
                <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse"></div>
                  <p className="text-xs text-center text-slate-400 mt-4 italic">Consulting authentic sources...</p>
                </div>
              ) : explanation ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl"
                >
                  <p className="text-slate-700 leading-relaxed italic font-serif text-lg">
                    {explanation}
                  </p>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Info size={32} />
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Select a verse and click the info icon to receive a beautiful AI-powered spiritual explanation and practical lesson.
                  </p>
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Book size={18} className="text-emerald-600" />
                  Popular Surahs
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { n: 1, name: 'Al-Fatiha' },
                    { n: 18, name: 'Al-Kahf' },
                    { n: 36, name: 'Ya-Sin' },
                    { n: 55, name: 'Ar-Rahman' },
                    { n: 67, name: 'Al-Mulk' }
                  ].map((s) => (
                    <button 
                      key={s.n}
                      onClick={() => setSelectedSurahNum(s.n)}
                      className="text-left text-sm p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-emerald-600">{s.name}</span>
                      <ChevronDown size={14} className="text-slate-300 -rotate-90" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
