import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Shield, 
  Users, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  Star,
  Quote,
  Loader2,
  ShieldCheck,
  Flower,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function WomenSection() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const getAdvice = async (topic: string) => {
    setActiveTopic(topic);
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a compassionate, empowering, and authentic Islamic perspective for Muslim women on the topic of: "${topic}". 
        Focus on:
        1. Spiritual growth and self-development.
        2. The high status and honor of women in Islam.
        3. Practical advice for the modern Muslimah.
        4. References from the Qur'an and Sunnah.
        Format in beautiful Markdown with clear headings and a gentle, encouraging tone.`,
      });
      setAdvice(response.text || "No advice available.");
    } catch (error) {
      console.error("Advice error:", error);
      setAdvice("Failed to retrieve guidance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: "Hijab & Modesty", icon: Shield, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
    { title: "Marriage Guidance", icon: Heart, color: "bg-rose-50 text-rose-600", border: "border-rose-100" },
    { title: "Women's Rights", icon: BookOpen, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "Personal Growth", icon: Star, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      {/* Hero Section */}
      <section className="relative bg-rose-50 rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl shadow-rose-100/50 group">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-300/20 rounded-full blur-[100px] -ml-48 -mb-48" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest border border-rose-200">
              <Flower size={16} />
              Sisters' Sanctuary
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-rose-950 leading-[1.1]">
              Empowering the <br />
              <span className="text-rose-600 italic">Muslimah Journey</span>
            </h2>
            <p className="text-rose-800/70 text-xl leading-relaxed max-w-xl font-medium">
              A dedicated space for sisters to find authentic guidance, connect with a global community, and grow in their faith and character.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="bg-rose-600 text-white px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 flex items-center gap-3 group/btn">
                Join Sisters' Forum
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-rose-600 border border-rose-200 px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-rose-50 transition-all shadow-lg shadow-rose-100">
                Explore Resources
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative hidden lg:block">
            <div className="relative z-10 w-full aspect-square bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white/60 shadow-2xl flex items-center justify-center p-12">
              <div className="w-full h-full bg-rose-600/10 rounded-[3rem] flex items-center justify-center relative overflow-hidden group/img">
                <Users size={180} className="text-rose-400 group-hover/img:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-600/20 to-transparent" />
              </div>
            </div>
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-rose-50 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Community</p>
                <p className="text-lg font-bold text-slate-900">12k+ Sisters</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Guidance Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <h3 className="text-4xl font-display font-bold text-slate-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                <Sparkles size={28} />
              </div>
              Divine Guidance
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Select a topic to receive a compassionate Islamic perspective tailored specifically for the modern Muslimah.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => getAdvice(cat.title)}
                className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all group text-left ${
                  activeTopic === cat.title 
                    ? 'bg-rose-50 border-rose-500 shadow-xl shadow-rose-100' 
                    : 'bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/50'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <cat.icon size={28} />
                  </div>
                  <span className={`text-xl font-bold transition-colors ${activeTopic === cat.title ? 'text-rose-600' : 'text-slate-700 group-hover:text-rose-600'}`}>
                    {cat.title}
                  </span>
                </div>
                <ChevronRight size={24} className={`transition-all ${activeTopic === cat.title ? 'text-rose-600 translate-x-1' : 'text-slate-300 group-hover:text-rose-400'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-[4rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 relative overflow-hidden min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <Loader2 className="animate-spin text-rose-600" size={64} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Flower size={24} className="text-rose-400" />
                    </div>
                  </div>
                  <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Consulting Sacred Sources...</p>
                </motion.div>
              ) : advice ? (
                <motion.div
                  key="advice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 space-y-10"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                        <Quote size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">Spiritual Reflection</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Topic: {activeTopic}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <Bookmark size={20} />
                      </button>
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-lg prose-rose max-w-none font-medium leading-relaxed text-slate-700">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400 italic">
                    <ShieldCheck size={16} className="text-rose-500" />
                    Guidance provided is based on authentic Islamic principles and scholarly consensus.
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-32 h-32 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-200 shadow-inner">
                    <Sparkles size={64} />
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <h4 className="text-2xl font-bold text-slate-900">Ready to Guide You</h4>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      Select a category on the left to receive personalized, compassionate Islamic guidance for your journey.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-display font-bold text-slate-900">Curated for You</h3>
            <p className="text-slate-500 text-lg">In-depth articles and videos exploring the roles and legacy of women in Islam.</p>
          </div>
          <button className="text-rose-600 font-bold text-sm flex items-center gap-2 group">
            View All Content <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "The Legacy of Khadija (RA)", category: "Seerah", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600", time: "8 min read" },
            { title: "Balancing Career & Deen", category: "Modern Life", image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600", time: "12 min read" },
            { title: "Modesty in the Digital Age", category: "Hijab", image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600", time: "6 min read" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12 }}
              className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:border-rose-500 transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                  {item.category}
                </div>
              </div>
              <div className="p-10 space-y-6">
                <h4 className="text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">{item.title}</h4>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2"><BookOpen size={16} className="text-rose-500" /> {item.time}</span>
                  </div>
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-slate-900 text-white rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-600/10 to-transparent pointer-events-none" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-5xl font-display font-bold leading-tight">Sisters' <br /> <span className="text-rose-400 italic">Discussion Forum</span></h3>
              <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                Connect with a global community of sisters. Share experiences, ask questions, and support each other in a safe, moderated environment.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Marriage & Family", count: "124 active discussions", icon: Heart, color: "bg-rose-600" },
                { title: "Sisters' Halaqahs", count: "Find local events near you", icon: Users, color: "bg-emerald-600" }
              ].map((forum, i) => (
                <div key={i} className="flex items-center gap-6 bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className={`w-14 h-14 ${forum.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <forum.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{forum.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{forum.count}</p>
                  </div>
                  <ChevronRight size={24} className="ml-auto text-white/20 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-square bg-rose-600/5 rounded-full flex items-center justify-center p-16 border border-rose-500/10">
            <div className="w-full h-full bg-rose-600/10 rounded-full flex items-center justify-center relative group">
              <MessageCircle size={160} className="text-rose-500/40 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-rose-600 rounded-full blur-3xl opacity-20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
