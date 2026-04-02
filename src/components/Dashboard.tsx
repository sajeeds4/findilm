import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Clock
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
      setReflections(docs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
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
      <div className="text-center py-24 space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Please sign in to view your dashboard</h2>
        <p className="text-slate-500">Track your progress, save bookmarks, and write reflections.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Profile Header */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}`} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-emerald-500 p-1"
          />
          <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full border-4 border-white">
            <Award size={20} />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">{profile?.displayName || 'Seeker of Knowledge'}</h2>
          <p className="text-slate-500">{profile?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {profile?.role || 'User'}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame size={12} /> 7 Day Streak
            </span>
          </div>
        </div>
        <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors">
          <Settings size={24} />
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Activity */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <History className="text-emerald-600" />
              Recent Activity
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Read Surah Al-Fatiha', time: '2 hours ago', icon: BookMarked },
                { title: 'Submitted a Dua Request', time: 'Yesterday', icon: Heart },
                { title: 'Completed "Salah Basics" Lesson 1', time: '2 days ago', icon: Award },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <activity.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-emerald-600 font-bold text-sm hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-2">
              View Full History <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold">Next Prayer</h3>
              <Clock size={20} />
            </div>
            <div className="text-center py-4">
              <p className="text-emerald-200 text-sm uppercase tracking-widest font-bold">Asr Prayer</p>
              <p className="text-5xl font-bold my-2">15:45</p>
              <p className="text-emerald-100 text-sm">In 1 hour 20 minutes</p>
            </div>
            <button className="w-full mt-6 bg-white/20 backdrop-blur-md border border-white/30 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors">
              Set Reminder
            </button>
          </div>
        </div>

        {/* Right Column: Reflections Journal */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PenLine className="text-emerald-600" />
              Reflection Journal
            </h3>
            
            <form onSubmit={handleSaveReflection} className="space-y-4 mb-12">
              <textarea 
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                placeholder="What are your thoughts or spiritual reflections today?"
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={!newReflection.trim() || loading}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  Save Reflection
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Previous Entries</h4>
              
              {fetching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                </div>
              ) : reflections.length === 0 ? (
                <p className="text-slate-400 text-center py-8 italic">No reflections saved yet. Start your journey today.</p>
              ) : (
                <div className="space-y-4">
                  {reflections.map((ref) => (
                    <motion.div 
                      key={ref.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-50 border border-slate-100 p-6 rounded-2xl relative group"
                    >
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                        <Calendar size={14} />
                        {ref.createdAt ? format(ref.createdAt.toDate(), 'MMMM d, yyyy • h:mm a') : 'Just now'}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{ref.content}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
