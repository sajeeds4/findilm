import { useState } from 'react';
import { motion } from 'motion/react';
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
  Loader2
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function WomenSection() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async (topic: string) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a compassionate and empowering Islamic perspective for Muslim women on the topic of: "${topic}". Focus on self-development, modesty, and the high status of women in Islam. Use authentic sources.`,
      });
      setAdvice(response.text || "No advice available.");
    } catch (error) {
      console.error("Advice error:", error);
      setAdvice("Failed to get advice.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: "Hijab & Modesty", icon: Shield, color: "bg-emerald-100 text-emerald-600" },
    { title: "Marriage Guidance", icon: Heart, color: "bg-rose-100 text-rose-600" },
    { title: "Women's Rights", icon: BookOpen, color: "bg-blue-100 text-blue-600" },
    { title: "Personal Development", icon: Star, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="bg-rose-50 border border-rose-100 p-8 md:p-16 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-rose-600" size={20} />
            <span className="text-rose-700 font-bold uppercase tracking-widest text-xs">Sisters' Sanctuary</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-rose-900 mb-6 leading-tight">
            Empowering the <br />
            <span className="text-rose-600 italic">Muslimah Journey</span>
          </h2>
          <p className="text-rose-800/70 text-lg mb-8 max-w-md">
            A dedicated space for sisters to find guidance, connect with others, and grow in their faith and character.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
              Join Sisters' Forum
            </button>
            <button className="bg-white text-rose-600 border border-rose-200 px-8 py-3 rounded-full font-bold hover:bg-rose-50 transition-colors">
              Explore Resources
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-300 rounded-full blur-3xl opacity-20 -mr-32 -mb-32"></div>
      </section>

      {/* AI Guidance Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-rose-500" />
            AI Guidance for Sisters
          </h3>
          <p className="text-slate-500">
            Select a topic to receive a compassionate Islamic perspective tailored for sisters.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => getAdvice(cat.title)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-500 hover:bg-rose-50 transition-all group text-left"
              >
                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <cat.icon size={20} />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-rose-600 text-sm">{cat.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="animate-spin text-rose-600" size={40} />
              <p className="text-slate-400 animate-pulse">Consulting authentic sources...</p>
            </div>
          ) : advice ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="prose prose-sm prose-rose max-w-none"
            >
              <div className="flex items-center gap-2 text-rose-600 font-bold mb-4">
                <Quote size={24} />
                <span>Spiritual Reflection</span>
              </div>
              <ReactMarkdown>{advice}</ReactMarkdown>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300">
                <Sparkles size={32} />
              </div>
              <p className="text-slate-400 max-w-xs">
                Select a category on the left to receive personalized Islamic guidance and encouragement.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Articles */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Featured Content</h3>
            <p className="text-slate-500">Curated articles and videos for the modern Muslimah.</p>
          </div>
          <button className="text-rose-600 font-bold text-sm flex items-center gap-1">
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "The Legacy of Khadija (RA)", category: "Seerah", image: "https://picsum.photos/seed/legacy/600/400" },
            { title: "Balancing Career & Deen", category: "Life", image: "https://picsum.photos/seed/balance/600/400" },
            { title: "Modesty in the Digital Age", category: "Hijab", image: "https://picsum.photos/seed/modesty/600/400" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-48">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-600">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors mb-4">{item.title}</h4>
                <div className="flex items-center gap-4 text-slate-400 text-xs">
                  <span className="flex items-center gap-1"><BookOpen size={14} /> 5 min read</span>
                  <span className="flex items-center gap-1"><Video size={14} /> Video available</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Highlights */}
      <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Sisters' Discussion Forum</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Connect with a global community of sisters. Share experiences, ask questions, and support each other in a safe, moderated environment.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Marriage & Family</h4>
                  <p className="text-xs text-slate-500">124 active discussions</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Sisters' Halaqahs</h4>
                  <p className="text-xs text-slate-500">Find local events near you</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square bg-rose-600/10 rounded-full flex items-center justify-center p-12 border border-rose-500/20">
            <div className="w-full h-full bg-rose-600/20 rounded-full flex items-center justify-center animate-pulse">
              <Users size={120} className="text-rose-400" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
