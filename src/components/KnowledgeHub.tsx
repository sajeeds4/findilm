import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, CheckCircle2, Download, ExternalLink, Filter, Loader2, Search, Sparkles } from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { fetchKnowledgeCategories, fetchKnowledgeResources } from '../services/api';
import { KnowledgeCategory, KnowledgeResource } from '../types';

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([fetchKnowledgeCategories(), fetchKnowledgeResources()])
      .then(([categoryData, resourceData]) => {
        setCategories(categoryData);
        setResources(resourceData);
      })
      .finally(() => setFetching(false));
  }, []);

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
        config: { tools: [{ googleSearch: {} }] },
      });
      setAiResponse(response.text || 'No information found.');
    } catch (error) {
      console.error('Search error:', error);
      setAiResponse('Failed to retrieve information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === 'All' || resource.resource_type.toLowerCase() === activeCategory.toLowerCase().slice(0, -1);
      const matchesSearch = !searchQuery || `${resource.title} ${resource.description} ${resource.author}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [resources, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      <div className="relative bg-slate-950 text-white p-12 md:p-24 rounded-[3.5rem] shadow-2xl overflow-hidden group">
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">
            <Sparkles size={14} />
            AI-Powered Research
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-display font-bold leading-tight">Knowledge <span className="text-brand-400 italic">Hub</span></motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Access a backend-powered library of Islamic resources, plus AI research for deeper study.
          </motion.p>
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for any Islamic topic..." className="w-full pl-16 pr-40 py-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-2xl text-white placeholder:text-slate-500 font-medium" />
            <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-600 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-brand-900/40">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span className="hidden sm:inline">AI Research</span>
            </button>
          </motion.form>
        </div>
      </div>

      <AnimatePresence>
        {aiResponse && (
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }} className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-900/20"><BookOpen size={28} /></div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Research Overview</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Topic: {searchQuery}</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none"><ReactMarkdown>{aiResponse}</ReactMarkdown></div>
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 italic">
              <CheckCircle2 size={14} className="text-brand-500" />
              AI guidance should still be verified with trusted scholars.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-display font-bold text-slate-900">Browse Categories</h3>
            <p className="text-slate-500">Explore curated resources across different fields of Islamic knowledge.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Articles', 'Videos', 'PDFs', 'Audios'].map((tab) => (
              <button key={tab} onClick={() => setActiveCategory(tab)} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${activeCategory === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
              <div className="text-right mb-8">
                <span className="text-slate-900 text-xl font-bold block">{cat.resource_count}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Resources</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">{cat.name}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Backend-managed category for {cat.name.toLowerCase()}.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-brand-600" />
          <h3 className="text-3xl font-display font-bold text-slate-900">Library Resources</h3>
        </div>
        {fetching ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={40} /></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">{resource.resource_type}</span>
                  {resource.url ? <a href={resource.url} target="_blank" rel="noreferrer" className="text-brand-600"><ExternalLink size={18} /></a> : <Download size={18} className="text-slate-300" />}
                </div>
                <h4 className="text-2xl font-bold text-slate-900">{resource.title}</h4>
                <p className="text-slate-500">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{resource.author || resource.category.name}</span>
                  <span className="text-brand-600 font-bold flex items-center gap-2">Open <ArrowRight size={16} /></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
