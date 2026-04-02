import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Shield, 
  Users, 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  HelpCircle, 
  MessageCircle, 
  Sparkles, 
  Star,
  Quote,
  Loader2,
  Compass,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  Share2,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function RevertSupport() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const getAdvice = async (topic: string) => {
    setActiveTopic(topic);
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a welcoming, supportive, and practical Islamic perspective for a new Muslim (revert) on the topic of: "${topic}". 
        Focus on:
        1. Gradual learning and patience (Tadreej).
        2. The beauty and simplicity of the faith.
        3. Practical steps for daily life.
        4. Encouragement and spiritual reassurance.
        Format in beautiful Markdown with clear headings and a gentle, welcoming tone.`,
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
    { title: "First Steps in Islam", icon: Compass, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
    { title: "Learning Salah", icon: Shield, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "Family & Social Life", icon: Heart, color: "bg-rose-50 text-rose-600", border: "border-rose-100" },
    { title: "Dealing with Doubts", icon: HelpCircle, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      {/* Hero Section */}
      <section className="relative bg-emerald-50 rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl shadow-emerald-100/50 group">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-300/20 rounded-full blur-[100px] -ml-48 -mb-48" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-200">
              <Sparkles size={16} />
              Welcome Home
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-emerald-950 leading-[1.1]">
              New to Islam? <br />
              <span className="text-emerald-600 italic">We're here for you.</span>
            </h2>
            <p className="text-emerald-800/70 text-xl leading-relaxed max-w-xl font-medium">
              Whether you've just taken your Shahada or are still exploring, FindIlm provides the resources and community to support your journey.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="bg-emerald-600 text-white px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3 group/btn">
                Get a Mentor
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-emerald-600 border border-emerald-200 px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-100">
                Revert Basics Guide
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative hidden lg:block">
            <div className="relative z-10 w-full aspect-square bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white/60 shadow-2xl flex items-center justify-center p-12">
              <div className="w-full h-full bg-emerald-600/10 rounded-[3rem] flex items-center justify-center relative overflow-hidden group/img">
                <Compass size={180} className="text-emerald-400 group-hover/img:rotate-45 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent" />
              </div>
            </div>
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-emerald-50 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mentorship</p>
                <p className="text-lg font-bold text-slate-900">1-on-1 Support</p>
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
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                <Sparkles size={28} />
              </div>
              Spiritual Path
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Select a topic to receive a supportive Islamic perspective tailored specifically for your new journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => getAdvice(cat.title)}
                className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all group text-left ${
                  activeTopic === cat.title 
                    ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-100' 
                    : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <cat.icon size={28} />
                  </div>
                  <span className={`text-xl font-bold transition-colors ${activeTopic === cat.title ? 'text-emerald-600' : 'text-slate-700 group-hover:text-emerald-600'}`}>
                    {cat.title}
                  </span>
                </div>
                <ChevronRight size={24} className={`transition-all ${activeTopic === cat.title ? 'text-emerald-600 translate-x-1' : 'text-slate-300 group-hover:text-emerald-400'}`} />
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
                    <Loader2 className="animate-spin text-emerald-600" size={64} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={24} className="text-emerald-400" />
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
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <Quote size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">Spiritual Guidance</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Topic: {activeTopic}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                        <Bookmark size={20} />
                      </button>
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-lg prose-emerald max-w-none font-medium leading-relaxed text-slate-700">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                  </div>
                  
                  <div className="pt-8 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400 italic">
                    <ShieldCheck size={16} className="text-emerald-500" />
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
                  <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-200 shadow-inner">
                    <Compass size={64} />
                  </div>
                  <div className="space-y-4 max-w-sm">
                    <h4 className="text-2xl font-bold text-slate-900">Welcome to the Path</h4>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                      Select a category on the left to receive personalized, compassionate Islamic guidance for your new journey.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Revert Checklist */}
      <section className="bg-white border border-slate-200 p-12 md:p-16 rounded-[4rem] shadow-2xl shadow-slate-200/50 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-display font-bold text-slate-900">Your First 30 Days</h3>
            <p className="text-slate-500 text-lg">A gentle roadmap to help you navigate your first steps in the faith.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm">
            <CheckCircle size={20} />
            25% Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Learn the 5 Pillars", description: "Understand the core foundations of Islam.", status: "completed" },
            { title: "Master the Fatiha", description: "Learn the opening chapter of the Qur'an for prayer.", status: "in-progress" },
            { title: "Find a Local Masjid", description: "Connect with your local community.", status: "pending" },
            { title: "Learn Basic Wudu", description: "The ritual purification before prayer.", status: "pending" },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-start gap-6 p-8 rounded-[2.5rem] border-2 transition-all ${item.status === 'completed' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${item.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                {item.status === 'completed' ? <CheckCircle size={24} /> : <div className="w-3 h-3 bg-slate-200 rounded-full" />}
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                {item.status === 'in-progress' && (
                  <div className="pt-4">
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-emerald-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community & Mentorship */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[4rem] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 space-y-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-xl">
              <Users size={32} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-display font-bold">Find a Mentor</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Connect with experienced Muslims who can guide you through the practical aspects of daily Islamic life.
              </p>
            </div>
            <button className="bg-emerald-600 text-white px-10 py-4 rounded-[1.5rem] font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40 flex items-center gap-3">
              Request a Mentor
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-emerald-600 text-white p-12 md:p-16 rounded-[4rem] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
          <div className="relative z-10 space-y-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center shadow-xl">
              <Calendar size={32} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-display font-bold">Support Group</h3>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Join our weekly online sessions where reverts share stories and learn together in a judgment-free space.
              </p>
            </div>
            <button className="bg-white text-emerald-600 px-10 py-4 rounded-[1.5rem] font-bold hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-700/40 flex items-center gap-3">
              Join Next Session
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <h3 className="text-4xl font-display font-bold text-slate-900">Common Questions</h3>
          <p className="text-slate-500 text-lg">Answers to the most frequent concerns of new Muslims.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "How do I tell my family about my conversion?",
            "What if I can't pray all five prayers yet?",
            "Do I have to change my name?",
            "How do I handle social gatherings?",
            "Where can I find halal food?",
            "How do I learn Arabic for prayer?"
          ].map((q, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ x: 10 }}
              className="bg-white border border-slate-200 p-8 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/50 transition-all"
            >
              <span className="text-lg font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{q}</span>
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                <ChevronRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
