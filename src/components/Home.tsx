import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Book, 
  Clock, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Upload, 
  Users, 
  Mic, 
  Search as SearchIcon,
  Quote,
  Library
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
    { title: "Read Qur’an", icon: Book, color: "bg-blue-500", path: "/quran" },
    { title: "Prayer Times", icon: Clock, color: "bg-emerald-500", path: "/prayer" },
    { title: "Dua Requests", icon: Heart, color: "bg-rose-500", path: "/dua" },
    { title: "Knowledge Hub", icon: Library, color: "bg-amber-500", path: "/knowledge" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-emerald-600 text-white p-8 md:p-16">
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Your Journey to <br />
            <span className="text-emerald-200">Authentic Knowledge</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-emerald-50 mb-8"
          >
            Explore the Qur'an, track your prayers, and connect with a community of seekers. All in one place.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/quran" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors">
              Start Reading
            </Link>
            <Link to="/auth" className="bg-emerald-700/50 backdrop-blur-md text-white border border-emerald-400 px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors">
              Join Community
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-10 -mr-48 -mb-48"></div>
      </section>

      {/* Daily Ayah Card */}
      <section>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-emerald-100">
            <Quote size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-4">
              <Sparkles size={20} />
              <span>Daily Reflection</span>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl md:text-3xl font-serif italic text-slate-800 mb-4 leading-relaxed">
                  "{dailyAyah?.text}"
                </p>
                <p className="text-slate-500 font-medium">— {dailyAyah?.reference}</p>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Quick Access Grid */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quick Access</h2>
            <p className="text-slate-500">Everything you need for your daily worship.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.path}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-200 p-6 rounded-3xl text-center hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-${feature.color.split('-')[1]}-200`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{feature.title}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community & AI Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mic className="text-emerald-400" />
              AI Spiritual Assistant
            </h3>
            <p className="text-slate-400 mb-6">
              Have a conversation with our AI scholar. Ask questions about Fiqh, Seerah, or get spiritual guidance.
            </p>
            <Link to="/assistant" className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-2 rounded-full font-bold hover:bg-emerald-500 transition-colors">
              Start Chatting <ArrowRight size={18} />
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Users className="text-emerald-600" />
              Community Support
            </h3>
            <p className="text-emerald-700/70 mb-6">
              Submit anonymous dua requests and support your brothers and sisters with an "Ameen".
            </p>
            <Link to="/dua" className="inline-flex items-center gap-2 bg-white text-emerald-600 border border-emerald-200 px-6 py-2 rounded-full font-bold hover:bg-emerald-100 transition-colors">
              View Requests <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
