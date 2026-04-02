import { useState } from 'react';
import { motion } from 'motion/react';
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
  Compass
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function RevertSupport() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async (topic: string) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: `Provide a welcoming, supportive, and practical Islamic perspective for a new Muslim (revert) on the topic of: "${topic}". Focus on gradual learning, patience, and the beauty of the faith. Use authentic sources and a gentle tone.`,
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
    { title: "First Steps in Islam", icon: Compass, color: "bg-emerald-100 text-emerald-600" },
    { title: "Learning Salah", icon: Shield, color: "bg-blue-100 text-blue-600" },
    { title: "Family & Social Life", icon: Heart, color: "bg-rose-100 text-rose-600" },
    { title: "Dealing with Doubts", icon: HelpCircle, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="bg-emerald-50 border border-emerald-100 p-8 md:p-16 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-emerald-600" size={20} />
            <span className="text-emerald-700 font-bold uppercase tracking-widest text-xs">Welcome Home</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6 leading-tight">
            New to Islam? <br />
            <span className="text-emerald-600 italic">We're here for you.</span>
          </h2>
          <p className="text-emerald-800/70 text-lg mb-8 max-w-md">
            Whether you've just taken your Shahada or are still exploring, FindIlm provides the resources and community to support your journey.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
              Get a Mentor
            </button>
            <button className="bg-white text-emerald-600 border border-emerald-200 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors">
              Revert Basics Guide
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-300 rounded-full blur-3xl opacity-20 -mr-32 -mb-32"></div>
      </section>

      {/* AI Guidance Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-emerald-500" />
            AI Support for Reverts
          </h3>
          <p className="text-slate-500">
            Select a topic to receive a supportive Islamic perspective tailored for your journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => getAdvice(cat.title)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left"
              >
                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <cat.icon size={20} />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-emerald-600 text-sm">{cat.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
              <p className="text-slate-400 animate-pulse">Consulting authentic sources...</p>
            </div>
          ) : advice ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="prose prose-sm prose-emerald max-w-none"
            >
              <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
                <Quote size={24} />
                <span>Spiritual Guidance</span>
              </div>
              <ReactMarkdown>{advice}</ReactMarkdown>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-300">
                <Sparkles size={32} />
              </div>
              <p className="text-slate-400 max-w-xs">
                Select a category on the left to receive personalized Islamic guidance and encouragement for your new journey.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Revert Checklist */}
      <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
        <h3 className="text-2xl font-bold text-slate-800 mb-8">Your First 30 Days Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Learn the 5 Pillars", description: "Understand the core foundations of Islam.", status: "completed" },
            { title: "Master the Fatiha", description: "Learn the opening chapter of the Qur'an for prayer.", status: "in-progress" },
            { title: "Find a Local Masjid", description: "Connect with your local community.", status: "pending" },
            { title: "Learn Basic Wudu", description: "The ritual purification before prayer.", status: "pending" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${item.status === 'completed' ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 text-slate-300'}`}>
                {item.status === 'completed' && <CheckCircle size={16} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community & Mentorship */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Find a Mentor</h3>
            <p className="text-slate-400 mb-8">
              Connect with experienced Muslims who can guide you through the practical aspects of daily Islamic life.
            </p>
          </div>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors w-fit">
            Request a Mentor
          </button>
        </div>
        <div className="bg-emerald-600 text-white p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Revert Support Group</h3>
            <p className="text-emerald-100 mb-8">
              Join our weekly online sessions where reverts share their stories and learn together in a judgment-free space.
            </p>
          </div>
          <button className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors w-fit">
            Join Next Session
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800">Common Questions</h3>
        <div className="space-y-4">
          {[
            "How do I tell my family about my conversion?",
            "What if I can't pray all five prayers yet?",
            "Do I have to change my name?",
            "How do I handle social gatherings with alcohol?"
          ].map((q, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500 transition-all">
              <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{q}</span>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-all" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
