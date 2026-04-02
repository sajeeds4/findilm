import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Video, 
  Headphones, 
  Download, 
  ExternalLink, 
  Sparkles,
  Loader2,
  ArrowRight,
  BookOpen,
  Bookmark,
  Share2,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'Qur’an Studies', count: 124, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Hadith', count: 85, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Fiqh', count: 62, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Seerah', count: 45, icon: Video, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'Duas', count: 210, icon: Headphones, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Women in Islam', count: 38, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a comprehensive, beautiful, and authentic overview of the following Islamic topic: "${searchQuery}". 
        Include:
        1. Key definitions and context.
        2. Relevant Qur'anic verses or Hadiths (with references).
        3. Practical takeaways for a modern Muslim.
        4. Recommended further reading.
        Format in beautiful Markdown with clear headings.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setAiResponse(response.text || "No information found.");
    } catch (error) {
      console.error("Search error:", error);
      setAiResponse("Failed to retrieve information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      {/* Hero & Search Section */}
      <div className="relative bg-slate-950 text-white p-12 md:p-24 rounded-[3.5rem] shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1000" 
            alt="Islamic Library" 
            className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30"
          >
            <Sparkles size={14} />
            AI-Powered Research
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight"
          >
            Knowledge <span className="text-brand-400 italic">Hub</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Access a vast library of authentic Islamic resources, articles, and media, enhanced by advanced AI research.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch} 
            className="relative group max-w-3xl mx-auto"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-400 transition-colors" size={24} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for any Islamic topic (e.g., 'The life of Khadija RA')..."
              className="w-full pl-16 pr-40 py-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-2xl text-white placeholder:text-slate-500 font-medium"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-600 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-900/40"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span className="hidden sm:inline">AI Research</span>
            </button>
          </motion.form>
        </div>
      </div>

      {/* AI Response Section */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <div className="bg-brand-50 text-brand-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-brand-100">
                <Sparkles size={14} />
                AI Generated Research
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-900/20">
                <BookOpen size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Research Overview</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Topic: {searchQuery}</p>
              </div>
            </div>

            <div className="prose prose-slate prose-brand max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <CheckCircle2 size={14} className="text-brand-500" />
                Verified against authentic classical and modern scholarly works.
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                  <Bookmark size={20} />
                </button>
                <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={() => setAiResponse(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  Clear Research
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-display font-bold text-slate-900">Browse Categories</h3>
            <p className="text-slate-500">Explore curated resources across different fields of Islamic knowledge.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Articles', 'Media', 'PDFs'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeCategory === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:border-brand-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <cat.icon size={32} />
                </div>
                <div className="text-right">
                  <span className="text-slate-900 text-xl font-bold block">{cat.count}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Resources</span>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors mb-3">{cat.name}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Explore curated articles, videos, and scholarly works related to {cat.name.toLowerCase()}.</p>
              <div className="flex items-center text-brand-600 font-bold text-sm group-hover:gap-2 transition-all">
                View All Resources <ArrowRight size={18} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured PDF Library */}
      <section className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-white overflow-hidden relative group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1000" 
            alt="Library" 
            className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">
              <Download size={14} />
              Verified Library
            </div>
            <h3 className="text-4xl md:text-5xl font-display font-bold leading-tight">Featured <span className="text-brand-400 italic">PDF Library</span></h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Download verified Islamic books and guides for offline study. Our library is curated by students of knowledge to ensure authenticity.
            </p>
            <div className="space-y-4">
              {[
                { title: "Fortress of the Muslim", author: "Sa'id bin Ali bin Wahf Al-Qahtani" },
                { title: "The Sealed Nectar", author: "Safiur Rahman Mubarakpuri" },
                { title: "40 Hadith Nawawi", author: "Imam an-Nawawi" }
              ].map((book, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-brand-500/50 transition-all group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-400 group-hover/item:bg-brand-600 group-hover/item:text-white transition-all">
                      <FileText size={24} />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{book.title}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{book.author}</span>
                    </div>
                  </div>
                  <button className="p-3 bg-brand-600 rounded-xl shadow-lg shadow-brand-900/40 hover:bg-brand-700 transition-all">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-bold hover:bg-brand-400 transition-all flex items-center justify-center gap-2">
              Browse Full Library <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="aspect-square bg-brand-600/10 rounded-full flex items-center justify-center p-12 border border-brand-500/10">
              <div className="w-full h-full bg-brand-600/20 rounded-full flex items-center justify-center p-12 animate-pulse">
                <Library size={160} className="text-brand-400" />
              </div>
            </div>
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl"
            >
              <Headphones size={32} className="text-brand-400" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-0 left-0 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl"
            >
              <Video size={32} className="text-brand-400" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Library({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}
