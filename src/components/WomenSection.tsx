import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  Compass,
  Flower,
  Heart,
  Loader2,
  Quote,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Waves,
} from 'lucide-react';
import { ai, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

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
      setAdvice(response.text || 'No advice available.');
    } catch (error) {
      console.error('Advice error:', error);
      setAdvice('Failed to retrieve guidance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { title: 'Marriage & Emotional Load', icon: Heart, color: 'bg-rose-50 text-rose-600' },
    { title: 'Hijab, Modesty & Visibility', icon: Shield, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Study, Work & Self-Development', icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
    { title: 'Identity, Confidence & Belonging', icon: Star, color: 'bg-indigo-50 text-indigo-600' },
  ];

  const sanctuaryColumns = [
    {
      title: 'What Women Need Here',
      icon: Compass,
      body: 'A place where discussion is not shallow, vulnerability is not exploited, and guidance is not reduced to slogans.',
      items: ['Sensitive questions', 'Real-life pressures', 'Faith-centered perspective'],
    },
    {
      title: 'What This Space Protects',
      icon: ShieldCheck,
      body: 'Adab, privacy, gentleness, and meaningful conversation should shape the atmosphere as much as the visuals do.',
      items: ['Moderation', 'Respectful tone', 'Private-feeling trust'],
    },
  ];

  const contentStreams = [
    {
      title: 'Marriage, family, and home life',
      body: 'Not idealized language, but grounded content for women living real responsibilities and relational complexity.',
    },
    {
      title: 'Identity in a digital world',
      body: 'How to remain anchored to deen while navigating visibility, confidence, work, friendship, and online expectations.',
    },
    {
      title: 'Quiet support and recovery',
      body: 'Some sisters do not need performance. They need dua, softness, a private path back, and trustworthy companionship.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32">
      <section className="relative overflow-hidden rounded-[4rem] bg-[linear-gradient(135deg,#fff6f8_0%,#fffdfa_52%,#f5fbf8_100%)] px-8 pb-16 pt-12 shadow-[0_45px_120px_-30px_rgba(15,23,42,0.16)] md:px-14 md:pb-24 md:pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_24%)]" />
          <div className="absolute left-0 top-0 h-full w-full opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-rose-600 shadow-lg shadow-rose-100/40 backdrop-blur-xl">
              <Flower size={16} />
              The Sanctuary Layer
            </div>

            <div className="space-y-5">
              <h2 className="max-w-4xl text-5xl font-display font-bold leading-[0.94] text-slate-950 md:text-7xl">
                The women’s space should feel{' '}
                <span className="bg-gradient-to-r from-rose-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent italic">
                  protective, intelligent, and deeply human
                </span>
              </h2>
              <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                This is where the site becomes a real platform for Muslim women. Not decorative “female branding,” but a
                meaningful environment for support, growth, and discussion with dignity.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/community"
                className="group inline-flex items-center gap-3 rounded-[1.8rem] bg-slate-950 px-10 py-5 text-lg font-bold text-white shadow-[0_18px_50px_rgba(15,23,42,0.25)] transition-all hover:bg-slate-900"
              >
                Join Discussion Circles
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dua"
                className="inline-flex items-center gap-3 rounded-[1.8rem] border border-white/80 bg-white/78 px-10 py-5 text-lg font-bold text-slate-800 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition-all hover:border-rose-200 hover:bg-rose-50/60"
              >
                Offer Or Request Support
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            {sanctuaryColumns.map((column, idx) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-[2.8rem] border border-white/80 bg-white/76 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-xl"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <column.icon size={26} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{column.title}</h3>
                </div>
                <p className="leading-relaxed text-slate-600">{column.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {column.items.map((item) => (
                    <span key={item} className="rounded-full bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="flex items-center gap-4 text-4xl font-display font-bold text-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                <Sparkles size={28} />
              </div>
              Advanced Guidance Layer
            </h3>
            <p className="text-lg font-medium leading-relaxed text-slate-500">
              Let women explore serious themes with a tone that is useful, literate, and emotionally aware.
            </p>
          </div>

          <div className="grid gap-4">
            {categories.map((cat) => (
              <button
                key={cat.title}
                onClick={() => getAdvice(cat.title)}
                className={`flex items-center justify-between rounded-[2rem] border-2 p-6 text-left transition-all ${
                  activeTopic === cat.title
                    ? 'border-rose-500 bg-rose-50 shadow-xl shadow-rose-100'
                    : 'border-slate-100 bg-white hover:border-rose-200 hover:bg-rose-50/50'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${cat.color}`}>
                    <cat.icon size={28} />
                  </div>
                  <span className={`text-xl font-bold ${activeTopic === cat.title ? 'text-rose-600' : 'text-slate-700'}`}>
                    {cat.title}
                  </span>
                </div>
                <ChevronRight size={24} className={activeTopic === cat.title ? 'text-rose-600' : 'text-slate-300'} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[4rem] border border-slate-200 bg-white p-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] md:p-16">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-rose-100/60 blur-[90px]" />
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-1 flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <Loader2 className="animate-spin text-rose-600" size={64} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Flower size={24} className="text-rose-400" />
                    </div>
                  </div>
                  <p className="animate-pulse text-xs font-bold uppercase tracking-widest text-slate-400">
                    Gathering thoughtful guidance...
                  </p>
                </motion.div>
              ) : advice ? (
                <motion.div key="advice" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex-1 space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                        <Quote size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">Muslimah Reflection</h4>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Topic: {activeTopic}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-xl bg-slate-50 p-3 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600">
                        <Bookmark size={20} />
                      </button>
                      <button className="rounded-xl bg-slate-50 p-3 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none font-medium leading-relaxed text-slate-700">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                  </div>

                  <div className="flex items-center gap-3 border-t border-slate-100 pt-8 text-xs italic text-slate-400">
                    <ShieldCheck size={16} className="text-rose-500" />
                    Guidance should remain compassionate, dignified, and rooted in authentic Islamic principles.
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex flex-1 flex-col justify-between">
                  <div className="grid gap-5 md:grid-cols-2">
                    {[
                      ['Private circles', 'For questions women may never ask in open comment sections'],
                      ['Faith and emotion together', 'A platform can be spiritually serious without becoming cold'],
                      ['Real-life topics', 'Marriage, modesty, burnout, confidence, friendship, and home'],
                      ['A gentler internet', 'The point is not virality. The point is nourishment'],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-[2rem] bg-slate-50 p-5">
                        <p className="text-lg font-bold text-slate-900">{title}</p>
                        <p className="mt-2 leading-relaxed text-slate-500">{body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-rose-50 text-rose-200 shadow-inner">
                      <Waves size={56} />
                    </div>
                    <h4 className="mt-6 text-3xl font-bold text-slate-900">Choose a topic to begin</h4>
                    <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-slate-500">
                      Use this panel for nuanced guidance on themes that matter deeply to Muslim women living real lives today.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[4rem] bg-slate-950 p-10 text-white shadow-[0_35px_90px_rgba(15,23,42,0.2)] md:p-14">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-300">
              <Users size={14} />
              The Culture Of The Space
            </div>
            <h3 className="text-5xl font-display font-bold leading-[1.02]">A real women’s platform is shaped by atmosphere as much as by features</h3>
            <p className="text-xl leading-relaxed text-slate-400">
              The tone should communicate dignity, emotional intelligence, trust, and a deeper kind of online companionship.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {contentStreams.map((stream, idx) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-[2.8rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/35"
            >
              <h3 className="text-2xl font-bold text-slate-900">{stream.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-500">{stream.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
