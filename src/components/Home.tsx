import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  BookText,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Flower2,
  GraduationCap,
  Headphones,
  HeartHandshake,
  LockKeyhole,
  MessageCircleHeart,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Waves,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [dailyAyah, setDailyAyah] = useState<{ text: string; reference: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyAyah() {
      try {
        const response = await fetch('/api/data/daily-ayah');
        if (!response.ok) {
          throw new Error('Failed to fetch daily ayah');
        }
        const data = await response.json();
        setDailyAyah(data);
      } catch (error) {
        console.error('Error fetching daily ayah:', error);
        setDailyAyah({
          text: 'Verily, with every hardship comes ease.',
          reference: 'Ash-Sharh 94:6',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDailyAyah();
  }, []);

  const pillars = [
    {
      title: 'Moderated Sister Circles',
      eyebrow: 'Community',
      path: '/community',
      icon: MessageCircleHeart,
      accent: 'from-rose-500 to-rose-400',
      body: 'Private-feeling discussion spaces for marriage, identity, family life, emotional wellbeing, and everyday faith.',
    },
    {
      title: 'Structured Islamic Learning',
      eyebrow: 'Courses',
      path: '/courses',
      icon: GraduationCap,
      accent: 'from-emerald-500 to-teal-400',
      body: 'A calmer learning journey with lessons, progress, practical topics, and a path for women who want consistency.',
    },
    {
      title: 'Support, Dua, And Reflection',
      eyebrow: 'Care',
      path: '/dua',
      icon: HeartHandshake,
      accent: 'from-amber-500 to-orange-400',
      body: 'For difficult seasons, quiet needs, and moments when a sister needs prayer, reassurance, or a place to breathe.',
    },
    {
      title: 'A Living Resource Library',
      eyebrow: 'Library',
      path: '/knowledge',
      icon: BookText,
      accent: 'from-indigo-500 to-sky-400',
      body: 'Articles, PDF guides, audio, and knowledge resources gathered into one member-centered platform instead of scattered links.',
    },
  ];

  const socialProof = [
    { value: '12k+', label: 'Women reached through community-led growth' },
    { value: '340+', label: 'Course joiners building steady study habits' },
    { value: '95%', label: 'Members returning for support, reminders, and discussion' },
    { value: '24/7', label: 'Access to reflection, resources, and guided spaces' },
  ];

  const experienceFlow = [
    {
      step: '01',
      title: 'Join with calm, not overwhelm',
      body: 'A new member should immediately understand where to start: circles, support, learning, and trusted resources.',
      icon: CircleDashed,
    },
    {
      step: '02',
      title: 'Find the right kind of belonging',
      body: 'Some women come for questions, some for healing, some for sisterhood. The platform should make each path feel intentional.',
      icon: Users,
    },
    {
      step: '03',
      title: 'Stay for depth, not novelty',
      body: 'The real value is not trends. It is useful discussion, meaningful routines, authentic reminders, and steady growth.',
      icon: Waves,
    },
  ];

  const tailoredFor = [
    {
      title: 'Young women building confidence',
      body: 'Identity, modesty, friendship, boundaries, online life, and staying anchored to Allah while growing into adulthood.',
    },
    {
      title: 'Wives, mothers, and women carrying a lot',
      body: 'A realistic space for women balancing marriage, home, fatigue, study, and worship without performative pressure.',
    },
    {
      title: 'Reverts and women returning to faith',
      body: 'Gentle guidance, welcoming conversation, and practical support when someone needs a safe beginning or a fresh return.',
    },
    {
      title: 'Women seeking a better digital environment',
      body: 'Less noise, less exhibition, more adab, more substance, more sisterhood.',
    },
  ];

  const featureColumns = [
    {
      title: 'What Members Can Do',
      icon: ShieldCheck,
      items: [
        'Join conversations shaped around real Muslim women’s concerns',
        'Track courses and build consistent spiritual routines',
        'Save resources, audio, and reflections in one private account',
        'Ask for dua or offer support without the pressure of public posting',
      ],
    },
    {
      title: 'What Makes It Different',
      icon: Flower2,
      items: [
        'A women-centered digital tone instead of a generic app feel',
        'Moderation and trust as a product feature, not an afterthought',
        'Learning, care, and community designed as one connected system',
        'A platform that can grow into halaqahs, mentorship, and private circles',
      ],
    },
  ];

  return (
    <div className="space-y-28 pb-36">
      <section className="relative overflow-hidden rounded-[4rem] bg-[linear-gradient(135deg,#fff6f7_0%,#fffaf2_48%,#f2faf7_100%)] px-8 pb-16 pt-12 shadow-[0_45px_120px_-30px_rgba(15,23,42,0.18)] md:px-14 md:pb-24 md:pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_bottom,rgba(251,191,36,0.12),transparent_28%)]" />
          <div className="absolute left-0 top-0 h-full w-full opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl space-y-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 rounded-full border border-rose-200/80 bg-white/80 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-rose-600 shadow-lg shadow-rose-100/50 backdrop-blur-xl"
              >
                <Sparkles size={16} />
                Elevated Digital Sisterhood
              </motion.div>

              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="max-w-5xl text-6xl font-display font-bold leading-[0.9] text-slate-950 md:text-8xl xl:text-[6.8rem]"
                >
                  A serious Islamic platform for women who want{' '}
                  <span className="bg-gradient-to-r from-rose-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent italic">
                    depth, safety, and belonging
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="max-w-3xl text-xl leading-relaxed text-slate-600 md:text-2xl"
                >
                  Not another generic content site. Not another noisy social feed. FindIlm is designed as a
                  women-centered digital environment for discussion, learning, private growth, and practical Islamic support.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/women-section"
                  className="group inline-flex items-center gap-3 rounded-[1.8rem] bg-slate-950 px-10 py-5 text-lg font-bold text-white shadow-[0_18px_50px_rgba(15,23,42,0.25)] transition-all hover:bg-slate-900"
                >
                  Enter The Women's Space
                  <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-3 rounded-[1.8rem] border border-white/80 bg-white/80 px-10 py-5 text-lg font-bold text-slate-800 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-all hover:border-rose-200 hover:bg-rose-50/60"
                >
                  Explore Community
                  <MessageCircleHeart size={20} />
                </Link>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Moderated discussion circles', icon: ShieldCheck },
                  { label: 'Private-feeling member experience', icon: LockKeyhole },
                  { label: 'Learning, audio, and saved resources', icon: Headphones },
                  { label: 'Supportive dua and reflection spaces', icon: HeartHandshake },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 + idx * 0.05 }}
                    className="rounded-[2rem] border border-white/80 bg-white/72 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                      <item.icon size={22} />
                    </div>
                    <p className="text-sm font-bold leading-snug text-slate-700">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 }}
                className="rounded-[3.6rem] border border-white/80 bg-white/68 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.13)] backdrop-blur-xl"
              >
                <div className="overflow-hidden rounded-[3rem] border border-slate-200/60 bg-[linear-gradient(180deg,#1f1631_0%,#100d18_100%)] text-white">
                  <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300">Member Atmosphere</p>
                      <h3 className="mt-2 text-2xl font-bold">The Sisterhood Dashboard</h3>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                      Protected
                    </div>
                  </div>

                  <div className="grid gap-5 p-7">
                    <div className="rounded-[2.2rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300">Today’s circle</p>
                          <h4 className="mt-2 text-xl font-bold">“How do you build consistency when life is very full?”</h4>
                        </div>
                        <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-200">
                          <MessageCircleHeart size={24} />
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        Answers from women balancing study, home, marriage, children, fatigue, and faith without pretence.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ['12k+', 'Women reached'],
                        ['340+', 'Course joiners'],
                        ['86%', 'Members returning'],
                        ['9', 'Active support rooms'],
                      ].map(([value, label]) => (
                        <div key={label} className="rounded-[1.8rem] border border-white/8 bg-white/6 p-5">
                          <p className="text-3xl font-bold text-white">{value}</p>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[2.2rem] bg-[linear-gradient(135deg,rgba(244,114,182,0.16),rgba(16,185,129,0.1))] p-6 ring-1 ring-white/8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">Platform Principle</p>
                      <p className="mt-3 text-base leading-relaxed text-rose-50">
                        Safety, adab, thoughtful learning, and sincere sisterhood must be visible in the design and in the product model.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -left-10 top-16 rounded-[1.8rem] border border-emerald-100 bg-white px-5 py-4 shadow-xl shadow-emerald-100/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Live Halaqah Layer</p>
                <p className="mt-1 text-lg font-bold text-slate-900">Study, reflect, ask</p>
              </div>

              <div className="absolute -bottom-8 right-10 rounded-[1.8rem] border border-rose-100 bg-white px-5 py-4 shadow-xl shadow-rose-100/50">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">Community Care</p>
                <p className="mt-1 text-lg font-bold text-slate-900">Support without exposure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[4rem] border border-slate-200 bg-white px-10 py-16 text-center shadow-[0_35px_90px_-28px_rgba(15,23,42,0.16)] md:px-16 md:py-24"
        >
          <div className="absolute left-8 top-8 text-rose-50">
            <Quote size={220} />
          </div>
          <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

          <div className="relative z-10 space-y-10">
            <div className="inline-flex items-center gap-3 rounded-full bg-rose-50 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
              <Sparkles size={16} />
              Daily Reflection
            </div>

            {loading ? (
              <div className="mx-auto max-w-3xl animate-pulse space-y-8">
                <div className="h-12 w-full rounded-2xl bg-slate-100" />
                <div className="mx-auto h-12 w-4/5 rounded-2xl bg-slate-100" />
                <div className="mx-auto h-6 w-40 rounded-full bg-slate-100" />
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="mx-auto max-w-4xl text-4xl font-serif italic leading-[1.16] text-slate-800 md:text-6xl">
                  "{dailyAyah?.text}"
                </h2>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-1.5 w-16 rounded-full bg-rose-500" />
                  <p className="font-display text-2xl font-bold text-slate-500">{dailyAyah?.reference}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
              <Star size={14} />
              Core Product Pillars
            </div>
            <h2 className="text-5xl font-display font-bold leading-[0.98] text-slate-900 md:text-6xl">The website should feel like a real platform, not four feature cards</h2>
          </div>
          <p className="max-w-3xl text-xl leading-relaxed text-slate-500">
            The experience needs density: community, private support, learning systems, and a strong trust layer working together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {pillars.map((pillar, idx) => (
            <Link key={pillar.title} to={pillar.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all hover:border-rose-200"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${pillar.accent}`} />
                <div className="mb-10 flex items-start justify-between gap-6">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-[1.7rem] bg-gradient-to-br ${pillar.accent} text-white shadow-xl`}>
                    <pillar.icon size={30} />
                  </div>
                  <div className="rounded-full bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {pillar.eyebrow}
                  </div>
                </div>
                <h3 className="mb-4 text-3xl font-bold text-slate-900 transition-colors group-hover:text-rose-600">{pillar.title}</h3>
                <p className="mb-8 text-lg leading-relaxed text-slate-500">{pillar.body}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-rose-600 opacity-70 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                  Open this space
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[5rem] bg-slate-950 py-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-300">
                <Users size={14} />
                Member Experience
              </div>
              <h2 className="text-5xl font-display font-bold leading-[1.02] md:text-6xl">
                What a woman should feel when she enters this platform
              </h2>
            </div>
            <p className="max-w-3xl text-xl leading-relaxed text-slate-400">
              Seen. Safe. Guided. Not judged. Not flooded. Not lost. A real digital environment with both warmth and structure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {experienceFlow.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-[2.8rem] border border-white/8 bg-white/6 p-8 backdrop-blur-xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="text-4xl font-display font-bold text-white/20">{item.step}</div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                    <item.icon size={26} />
                  </div>
                </div>
                <h3 className="mb-4 text-3xl font-bold text-white">{item.title}</h3>
                <p className="leading-relaxed text-slate-400">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[4rem] bg-[linear-gradient(135deg,#fff7f8_0%,#ffffff_55%,#f4fbf8_100%)] p-10 shadow-2xl shadow-slate-200/40 md:p-14">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <CalendarClock size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">Member Journey Snapshot</p>
                <h3 className="mt-1 text-3xl font-bold text-slate-900">From first visit to steady belonging</h3>
              </div>
            </div>

            <div className="space-y-5">
              {[
                'Discover a page that clearly speaks to Muslim women and their real needs',
                'Join, explore a circle, save a resource, and begin a short structured course',
                'Return for reminders, support, and discussion rather than scrolling passively',
                'Grow into private community participation, study routines, and meaningful contribution',
              ].map((line, idx) => (
                <div key={line} className="flex items-start gap-4 rounded-[2rem] border border-white/90 bg-white/75 p-5 shadow-lg shadow-slate-200/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Stage {idx + 1}</p>
                    <p className="mt-1 text-lg font-medium leading-relaxed text-slate-700">{line}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {featureColumns.map((column) => (
              <div key={column.title} className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/35">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <column.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{column.title}</h3>
                </div>
                <div className="space-y-4">
                  {column.items.map((item) => (
                    <div key={item} className="flex items-start gap-4 rounded-[1.8rem] bg-slate-50 p-4">
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                      <p className="leading-relaxed text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
              <Quote size={14} />
              Platform Credibility
            </div>
            <h2 className="text-5xl font-display font-bold leading-[1.02] text-slate-900 md:text-6xl">This should look and feel like it can actually serve thousands of women</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {socialProof.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-[2.8rem] border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/30"
            >
              <p className="text-5xl font-display font-bold text-slate-950">{item.value}</p>
              <p className="mt-4 text-base leading-relaxed text-slate-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
