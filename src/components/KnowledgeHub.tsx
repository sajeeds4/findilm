import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  FileText, 
  Video, 
  Headphones, 
  Download, 
  ExternalLink, 
  Sparkles,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: 'Qur’an Studies', count: 124, icon: FileText, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Hadith', count: 85, icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { name: 'Fiqh', count: 62, icon: FileText, color: 'bg-amber-100 text-amber-600' },
    { name: 'Seerah', count: 45, icon: Video, color: 'bg-rose-100 text-rose-600' },
    { name: 'Duas', count: 210, icon: Headphones, color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Women in Islam', count: 38, icon: FileText, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a comprehensive and authentic overview of the following Islamic topic: "${searchQuery}". Include key points, relevant Qur'anic verses or Hadiths, and practical takeaways. Format in Markdown.`,
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
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header & Search */}
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-slate-900">Knowledge Hub</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Access a vast library of authentic Islamic resources, articles, and media.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for any Islamic topic (e.g., 'The life of Khadija RA')..."
            className="w-full pl-16 pr-32 py-5 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-lg shadow-slate-200/50"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            AI Search
          </button>
        </form>
      </div>

      {/* AI Response Section */}
      {aiResponse && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-xl shadow-emerald-100/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles size={12} />
              AI Generated Overview
            </div>
          </div>
          <div className="prose prose-emerald max-w-none">
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400 italic">Sources: Qur'an, Sahih Hadith, and verified scholarly works.</p>
            <button 
              onClick={() => setAiResponse(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              Clear Search
            </button>
          </div>
        </motion.div>
      )}

      {/* Categories Grid */}
      <section>
        <h3 className="text-2xl font-bold text-slate-800 mb-8">Browse Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 p-6 rounded-3xl hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <cat.icon size={28} />
                </div>
                <span className="text-slate-400 text-sm font-medium">{cat.count} Resources</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors mb-2">{cat.name}</h4>
              <p className="text-slate-500 text-sm mb-4">Explore curated articles and media related to {cat.name.toLowerCase()}.</p>
              <div className="flex items-center text-emerald-600 font-bold text-sm">
                View All <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Featured PDF Library</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Download verified Islamic books and guides for offline study. Our library is curated by students of knowledge.
            </p>
            <div className="space-y-4">
              {[
                "Fortress of the Muslim (Hisn al-Muslim)",
                "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
                "40 Hadith Nawawi with Explanation"
              ].map((book, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="text-emerald-400" size={20} />
                    <span className="font-medium text-sm">{book}</span>
                  </div>
                  <button className="p-2 bg-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-emerald-600/20 rounded-full flex items-center justify-center p-8 border border-emerald-500/20">
              <div className="w-full h-full bg-emerald-600/40 rounded-full flex items-center justify-center p-8 animate-pulse">
                <Library size={120} className="text-emerald-400" />
              </div>
            </div>
            {/* Floating icons */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
            >
              <Headphones size={24} className="text-emerald-400" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-0 left-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
            >
              <Video size={24} className="text-emerald-400" />
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
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
      strokeWidth="2" 
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
