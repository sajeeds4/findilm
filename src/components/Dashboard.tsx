import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award, BookMarked, Calendar, Clock, Flame, Loader2, PenLine, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../AuthContext';
import { createReflection, fetchDashboardSummary, fetchPrayerTimes, fetchReflections } from '../services/api';
import { Reflection } from '../types';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [newReflection, setNewReflection] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [prayerCard, setPrayerCard] = useState<{ name: string; time: string } | null>(null);

  const load = async () => {
    const [summaryData, reflectionData] = await Promise.all([fetchDashboardSummary(), fetchReflections()]);
    setSummary(summaryData);
    setReflections(reflectionData);
  };

  useEffect(() => {
    if (!user) return;
    load()
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [user]);

  useEffect(() => {
    if (!user || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
          const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
          const next = order.find((name) => data.timings[name]);
          if (next) {
            setPrayerCard({ name: next, time: data.timings[next] });
          }
        } catch (error) {
          console.error(error);
        }
      },
      () => setPrayerCard({ name: 'Asr', time: '15:45' }),
    );
  }, [user]);

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflection.trim() || loading) return;
    setLoading(true);
    try {
      await createReflection({ content: newReflection, isPublic: false });
      setNewReflection('');
      await load();
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 px-4">
        <h2 className="text-4xl font-display font-bold text-slate-900">Your Journey Awaits</h2>
        <p className="text-slate-500 text-lg max-w-md">Sign in to access your personalized dashboard, reflections, progress, and saved activity.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      <section className="relative bg-slate-900 rounded-[4rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-slate-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 text-brand-500/10 w-96 h-96 pointer-events-none">
          <Sparkles size={400} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <img
            src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=0D9488&color=fff`}
            alt="Profile"
            className="w-36 h-36 rounded-full border-8 border-white/10"
          />
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h2 className="text-5xl font-display font-bold text-white">{profile?.displayName || 'Seeker of Knowledge'}</h2>
              <p className="text-slate-400 text-lg font-medium">{profile?.email}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Pill icon={ShieldCheck} text={profile?.role || 'user'} />
              <Pill icon={Flame} text={`${summary?.stats?.reflections || 0} reflections`} />
              <Pill icon={Target} text={`${summary?.stats?.courseEnrollments || 0} enrollments`} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-brand-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-brand-900/40">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="px-4 py-2 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Next Prayer</div>
                <Clock size={24} className="text-white/60" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-brand-100 text-sm font-bold uppercase tracking-[0.2em]">{prayerCard?.name || 'Prayer'}</p>
                <p className="text-7xl font-display font-bold">{prayerCard?.time || '--:--'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><BookMarked className="text-brand-600" /> Growth Snapshot</h3>
            <StatRow label="Reflections" value={String(summary?.stats?.reflections || 0)} />
            <StatRow label="Public reflections" value={String(summary?.stats?.publicReflections || 0)} />
            <StatRow label="Dua requests" value={String(summary?.stats?.duaRequests || 0)} />
            <StatRow label="Avg. course progress" value={`${Math.round(summary?.stats?.averageProgress || 0)}%`} />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border border-slate-200 rounded-[4rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                    <PenLine size={28} />
                  </div>
                  Spiritual Journal
                </h3>
                <p className="text-slate-400 font-medium">Document your growth and reflections on your spiritual journey.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                <Calendar size={14} />
                {format(new Date(), 'MMMM yyyy')}
              </div>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-6">
              <textarea
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                placeholder="What are your thoughts or spiritual reflections today?"
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none font-medium text-slate-700 leading-relaxed text-lg"
              />
              <div className="flex justify-end">
                <button type="submit" disabled={!newReflection.trim() || loading} className="bg-brand-600 text-white px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/30 disabled:opacity-50 flex items-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
                  Save Entry
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Previous Reflections</h4>
              {fetching ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-600" size={36} /></div>
              ) : reflections.length === 0 ? (
                <div className="text-slate-500 bg-slate-50 rounded-[2rem] p-8">No journal entries yet.</div>
              ) : (
                reflections.map((reflection) => (
                  <motion.div key={reflection.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                    <p className="text-slate-700 text-lg leading-relaxed">{reflection.content}</p>
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {format(new Date(reflection.createdAt), 'PPP p')}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-brand-400 flex items-center gap-2">
      <Icon size={14} />
      {text}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
