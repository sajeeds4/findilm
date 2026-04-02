import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  BookMarked, 
  History, 
  Award, 
  Flame, 
  Calendar,
  PenLine,
  ChevronRight,
  Loader2,
  Heart,
  Clock,
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, collection, query, where, onSnapshot, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../firebase';
import { Reflection } from '../types';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [newReflection, setNewReflection] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'reflections'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reflection[];
      setReflections(docs.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      }));
      setFetching(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reflections');
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflection.trim() || loading || !user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'reflections'), {
        uid: user.uid,
        content: newReflection,
        isPublic: false,
        createdAt: serverTimestamp(),
      });
      setNewReflection('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reflections');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 px-4">
        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-300 shadow-inner">
          <User size={64} />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-display font-bold text-slate-900">Your Journey Awaits</h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Sign in to access your personalized dashboard, track your spiritual progress, and save your favorite reflections.
          </p>
        </div>
        <button className="bg-brand-600 text-white px-10 py-4 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/20 flex items-center gap-3">
          Sign In Now
          <ArrowRight size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      {/* Profile Header */}
      <section className="relative bg-slate-900 rounded-[4rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-slate-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 text-brand-500/10 w-96 h-96 pointer-events-none">
          <Sparkles size={400} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="absolute -inset-4 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-all" />
            <img 
              src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=random`} 
              alt="Profile" 
              className="w-40 h-40 rounded-full border-8 border-white/10 p-1 relative z-10 shadow-2xl"
            />
            <div className="absolute bottom-2 right-2 bg-brand-600 text-white p-3 rounded-2xl border-4 border-slate-900 z-20 shadow-xl">
              <Award size={24} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h2 className="text-5xl font-display font-bold text-white tracking-tight">
                {profile?.displayName || 'Seeker of Knowledge'}
              </h2>
              <p className="text-slate-400 text-lg font-medium">{profile?.email}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-brand-400 flex items-center gap-2">
                <ShieldCheck size={14} />
                {profile?.role || 'Knowledge Seeker'}
              </div>
              <div className="bg-brand-500/20 border border-brand-500/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-brand-400 flex items-center gap-2">
                <Flame size={14} />
                7 Day Streak
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                <Target size={14} />
                Level 12
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white hover:bg-white/10 transition-all shadow-xl">
              <Settings size={28} />
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Stats & Activity */}
        <div className="lg:col-span-4 space-y-10">
          {/* Next Prayer Card */}
          <div className="bg-brand-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-brand-900/40 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform duration-700">
              <Clock size={200} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="px-4 py-2 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Next Prayer</div>
                <Clock size={24} className="text-white/60" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-brand-100 text-sm font-bold uppercase tracking-[0.2em]">Asr Prayer</p>
                <p className="text-7xl font-display font-bold">15:45</p>
                <p className="text-brand-100/60 text-xs font-bold uppercase tracking-widest">In 1 hour 20 minutes</p>
              </div>
              <button className="w-full bg-white text-brand-600 py-4 rounded-2xl font-bold text-sm hover:bg-brand-50 transition-all shadow-xl">
                Set Reminder
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <History className="text-brand-600" />
                Activity
              </h3>
              <TrendingUp size={20} className="text-slate-300" />
            </div>
            <div className="space-y-8">
              {[
                { title: 'Read Surah Al-Fatiha', time: '2 hours ago', icon: BookMarked, color: 'bg-blue-50 text-blue-600' },
                { title: 'Dua Request Shared', time: 'Yesterday', icon: Heart, color: 'bg-rose-50 text-rose-600' },
                { title: 'Salah Basics Lesson 1', time: '2 days ago', icon: Award, color: 'bg-brand-50 text-brand-600' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-5 group cursor-pointer">
                  <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <activity.icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{activity.title}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 rounded-2xl transition-all flex items-center justify-center gap-2 border border-brand-50">
              Full History <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Reflections Journal */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border border-slate-200 rounded-[4rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
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
              <div className="relative group">
                <textarea 
                  value={newReflection}
                  onChange={(e) => setNewReflection(e.target.value)}
                  placeholder="What are your thoughts or spiritual reflections today? Share your heart..."
                  className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none font-medium text-slate-700 leading-relaxed text-lg"
                />
                <div className="absolute bottom-8 right-10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  {newReflection.length} characters
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={!newReflection.trim() || loading}
                  className="bg-brand-600 text-white px-12 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/30 disabled:opacity-50 flex items-center gap-3 group"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} className="group-hover:scale-110 transition-transform" />}
                  Save Entry
                </button>
              </div>
            </form>

            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Previous Reflections</h4>
                <div className="text-xs font-bold text-brand-600 uppercase tracking-widest cursor-pointer hover:underline">View All</div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {fetching ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="animate-spin text-brand-600" size={40} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading entries...</p>
                  </div>
                ) : reflections.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-sm">
                      <PenLine size={32} />
                    </div>
                    <p className="text-slate-400 font-medium italic">Your journal is empty. Start your first entry above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {reflections.map((ref, idx) => (
                      <motion.div 
                        key={ref.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-slate-100 p-10 rounded-[3rem] relative group hover:border-brand-500 transition-all shadow-lg shadow-slate-200/30"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            <Calendar size={14} className="text-brand-600" />
                            {ref.createdAt ? format(ref.createdAt.toDate(), 'MMMM d, yyyy • h:mm a') : 'Just now'}
                          </div>
                          <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                            <Heart size={18} />
                          </button>
                        </div>
                        <p className="text-slate-700 text-lg leading-relaxed font-medium">{ref.content}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
