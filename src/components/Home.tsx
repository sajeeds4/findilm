import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Book, 
  Clock, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Mic, 
  Quote,
  Library,
  GraduationCap,
  Headphones,
  Shield,
  UserPlus,
  ChevronRight,
  Play,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ai, MODELS } from '../services/gemini';

export default function Home() {
  const [dailyAyah, setDailyAyah] = useState<{ text: string; reference: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyAyah() {
      try {
        const response = await ai.models.generateContent({
          model: MODELS.FLASH,
          contents: "Provide a beautiful and inspiring Qur'anic verse with its translation and reference (Surah:Ayah). Format as JSON: { \"text\": \"...\", \"reference\": \"...\" }",
          config: { responseMimeType: "application/json" }
        });
        const data = JSON.parse(response.text || '{}');
        setDailyAyah(data);
      } catch (error) {
        console.error("Error fetching daily ayah:", error);
        setDailyAyah({ 
          text: "Verily, with every hardship comes ease.", 
          reference: "Ash-Sharh 94:6" 
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDailyAyah();
  }, []);

  const features = [
    { title: "The Holy Qur’an", icon: Book, color: "bg-indigo-500", path: "/quran", desc: "Read and listen with AI-powered Tafsir and beautiful recitations." },
    { title: "Prayer Times", icon: Clock, color: "bg-emerald-500", path: "/prayer", desc: "Accurate prayer times, Qibla compass, and Ramadan tools." },
    { title: "Learning Paths", icon: GraduationCap, color: "bg-brand-600", path: "/courses", desc: "Structured Islamic courses from basics to advanced studies." },
    { title: "Audio Library", icon: Headphones, color: "bg-rose-500", path: "/audio-podcasts", desc: "Soul-stirring recitations, lectures, and daily reminders." },
  ];

  const secondaryFeatures = [
    { title: "Knowledge Hub", icon: Library, color: "text-amber-600", path: "/knowledge" },
    { title: "Sisters' Sanctuary", icon: Shield, color: "text-rose-600", path: "/women-section" },
    { title: "Revert Support", icon: UserPlus, color: "text-emerald-600", path: "/revert-support" },
    { title: "Dua Community", icon: Heart, color: "text-indigo-600", path: "/dua" },
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden rounded-[4rem] bg-slate-950 text-white p-8 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=2000" 
            alt="Islamic Architecture" 
            className="w-full h-full object-cover opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80"></div>
        </div>

        <div className="relative z-10 max-w-5xl text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-brand-400 text-sm font-bold shadow-2xl"
          >
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            <Sparkles size={18} />
            <span className="uppercase tracking-[0.2em]">The Future of Islamic Learning</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-9xl font-display font-bold mb-8 leading-[0.95] tracking-tight"
          >
            Grow Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-brand-500 italic">Faith & Knowledge</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-3xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            FindIlm is your premium AI-powered companion for a deeper, more meaningful connection with the Deen.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <Link to="/quran" className="group bg-brand-600 text-white px-12 py-5 rounded-[2rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-[0_20px_50px_rgba(13,148,136,0.4)] flex items-center gap-3">
              Explore the Qur’an <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/courses" className="bg-white/10 backdrop-blur-2xl text-white border border-white/20 px-12 py-5 rounded-[2rem] font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-3">
              <Play size={20} fill="currentColor" />
              Start Learning
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="pt-12 flex items-center justify-center gap-12 text-slate-400"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-white">50k+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest">Active Seekers</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-white">4.9/5</div>
              <div className="flex text-brand-400 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest">Authentic Content</div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Daily Reflection Section */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white border border-slate-200 rounded-[4rem] p-16 md:p-24 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] text-center overflow-hidden group"
        >
          <div className="absolute top-12 left-12 text-slate-50 group-hover:text-brand-50 transition-colors duration-700">
            <Quote size={240} />
          </div>
          
          <div className="relative z-10 space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-50 text-brand-600 rounded-full font-bold tracking-widest uppercase text-xs">
              <Sparkles size={18} />
              <span>Daily Reflection</span>
            </div>
            
            {loading ? (
              <div className="animate-pulse space-y-8 max-w-3xl mx-auto">
                <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
                <div className="h-12 bg-slate-100 rounded-2xl w-4/5 mx-auto"></div>
                <div className="h-6 bg-slate-100 rounded-full w-40 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-10">
                <h2 className="text-4xl md:text-6xl font-serif italic text-slate-800 leading-[1.2] max-w-4xl mx-auto">
                  "{dailyAyah?.text}"
                </h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-1.5 bg-brand-500 rounded-full"></div>
                  <p className="text-slate-500 font-bold text-2xl font-display">{dailyAyah?.reference}</p>
                </div>
              </div>
            )}
            
            <div className="pt-8">
              <button className="text-brand-600 font-bold flex items-center gap-2 mx-auto hover:gap-4 transition-all">
                Share this Reflection <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest">
              <Star size={14} />
              Core Pillars
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900">Explore FindIlm</h2>
            <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
              A comprehensive ecosystem designed to support every aspect of your spiritual and intellectual journey.
            </p>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            View All Features <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.path}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -15 }}
                className="h-full bg-white border border-slate-200 p-10 rounded-[3rem] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all group relative overflow-hidden"
              >
                <div className={`w-20 h-20 ${feature.color} rounded-[1.5rem] flex items-center justify-center mb-10 text-white shadow-2xl shadow-${feature.color.split('-')[1]}-200 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon size={40} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">{feature.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">{feature.desc}</p>
                
                <div className="flex items-center text-brand-600 font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  Enter Section <ArrowRight size={18} />
                </div>
                
                {/* Decorative background number */}
                <span className="absolute -bottom-10 -right-10 text-slate-50 text-9xl font-bold -z-0 group-hover:text-brand-50 transition-colors duration-500">0{idx + 1}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Secondary Features List */}
      <section className="bg-slate-950 py-32 rounded-[5rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-600/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-emerald-600/10 blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">
                  <Users size={14} />
                  Community Focused
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-bold leading-[1.1]">
                  A Holistic Path to <br />
                  <span className="text-brand-400 italic">Islamic Growth</span>
                </h2>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-xl">
                We believe spiritual growth flourishes through a balance of deep learning, consistent practice, and the support of a righteous community.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secondaryFeatures.map((item, idx) => (
                  <Link key={idx} to={item.path} className="flex items-center gap-5 p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-brand-500 hover:bg-white/10 transition-all group">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:bg-brand-500 group-hover:text-white transition-all`}>
                      <item.icon size={28} />
                    </div>
                    <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] bg-brand-600 rounded-[4rem] rotate-3 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                <img 
                  src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Islamic Art" 
                  className="w-full h-full object-cover -rotate-3 scale-110 group-hover:scale-100 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute -bottom-12 -left-12 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-xs hidden md:block text-slate-900"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner">
                    <Users size={32} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">12k+</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Active Seekers</div>
                  </div>
                </div>
                <p className="text-lg text-slate-600 italic leading-relaxed">
                  "FindIlm has completely transformed how I engage with my faith in the digital age."
                </p>
                <div className="mt-4 flex text-brand-500 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-[4rem] p-16 md:p-28 overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-500/20 text-brand-400 rounded-full font-bold uppercase tracking-widest text-xs border border-brand-500/30">
                <Mic size={18} />
                <span>AI Spiritual Assistant</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1]">
                Ask Anything, <br />
                <span className="text-slate-500 italic">Anytime.</span>
              </h2>
              <p className="text-slate-400 text-2xl leading-relaxed max-w-xl">
                Our advanced AI scholar provides instant, reliable answers to your questions about Fiqh, Seerah, and daily practice, backed by authentic sources.
              </p>
              <Link to="/assistant" className="inline-flex items-center gap-4 bg-brand-600 text-white px-12 py-5 rounded-[2rem] font-bold text-xl hover:bg-brand-700 transition-all shadow-[0_20px_50px_rgba(13,148,136,0.3)]">
                Start a Conversation <ArrowRight size={24} />
              </Link>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 bg-brand-600/10 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-72 h-72 bg-brand-600/20 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 bg-brand-600 flex items-center justify-center rounded-[2.5rem] shadow-[0_0_80px_rgba(13,148,136,0.6)] rotate-12">
                      <Sparkles size={80} className="text-white -rotate-12" />
                    </div>
                  </div>
                </div>
                {/* Floating tags */}
                <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl text-xs font-bold text-brand-400 shadow-2xl">Fiqh Expert</div>
                <div className="absolute bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 shadow-2xl">Seerah Guide</div>
                <div className="absolute bottom-1/2 -right-12 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 shadow-2xl">Dua Assistant</div>
              </div>
            </div>
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/10 to-transparent"></div>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
        </div>
      </section>
    </div>
  );
}
