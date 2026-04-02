import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Plus, 
  MessageCircle, 
  Shield, 
  Clock, 
  User as UserIcon,
  CheckCircle2,
  Loader2,
  Sparkles,
  Share2,
  MoreVertical,
  ArrowRight,
  Quote,
  Users
} from 'lucide-react';
import { db, collection, addDoc, query, onSnapshot, serverTimestamp, updateDoc, doc, increment, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { DuaRequest } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function DuaSupport() {
  const [requests, setRequests] = useState<DuaRequest[]>([]);
  const [newDua, setNewDua] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'duaRequests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DuaRequest[];
      setRequests(docs.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      }));
      setFetching(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'duaRequests');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDua.trim() || loading) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'duaRequests'), {
        uid: user?.uid || null,
        content: newDua,
        isAnonymous,
        ameenCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewDua('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'duaRequests');
    } finally {
      setLoading(false);
    }
  };

  const handleAmeen = async (requestId: string) => {
    try {
      const docRef = doc(db, 'duaRequests', requestId);
      await updateDoc(docRef, {
        ameenCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `duaRequests/${requestId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest">
            <Heart size={14} className="fill-current" />
            Community Support
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">Dua & Support</h2>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            "The dua of a Muslim for his brother in his absence is accepted." — Sahih Muslim. Share your requests and support others with your Ameens.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
              <Users size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Requests</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Submit Form */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 sticky top-32"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                <Plus size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">New Request</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative group">
                <textarea
                  value={newDua}
                  onChange={(e) => setNewDua(e.target.value)}
                  placeholder="What is your dua request? Share your heart with the community..."
                  className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none font-medium text-slate-700 leading-relaxed"
                  maxLength={1000}
                />
                <div className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {newDua.length} / 1000
                </div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isAnonymous ? 'bg-brand-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                      <Shield size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Post Anonymously</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Privacy Protected</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${isAnonymous ? 'bg-brand-600' : 'bg-slate-300'}`}
                  >
                    <motion.div 
                      animate={{ x: isAnonymous ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newDua.trim() || loading}
                  className="w-full bg-brand-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} className="group-hover:scale-110 transition-transform" />}
                  Submit Request
                </button>

                {!user && (
                  <p className="text-center text-xs text-amber-600 font-bold flex items-center justify-center gap-2">
                    <Clock size={14} />
                    Sign in to track and manage your requests
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Requests List */}
        <div className="lg:col-span-7 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                <Heart size={28} className="fill-current" />
              </div>
              Community Ameens
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
              <Clock size={18} />
              Recent First
            </div>
          </div>
          
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="animate-spin text-brand-600" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <MessageCircle size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">No requests yet</h4>
                <p className="text-slate-500 max-w-xs mx-auto">Be the first to share a dua request and let the community support you.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {requests.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:border-brand-500 transition-all flex flex-col relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 text-slate-50 -z-0 group-hover:text-brand-50 transition-colors duration-500">
                      <Quote size={120} />
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${req.isAnonymous ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                          {req.isAnonymous ? <Shield size={24} /> : <UserIcon size={24} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {req.isAnonymous ? 'Anonymous Seeker' : 'Community Member'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} />
                            {req.createdAt ? formatDistanceToNow(req.createdAt.toDate()) + ' ago' : 'Just now'}
                          </div>
                        </div>
                      </div>
                      <button className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <p className="text-2xl font-serif italic text-slate-700 mb-10 leading-relaxed relative z-10">
                      "{req.content}"
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=User${i}&background=random`} alt="User" />
                            </div>
                          ))}
                        </div>
                        <div className="text-sm font-bold text-brand-600">
                          {req.ameenCount} Ameens
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="p-4 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all shadow-sm">
                          <Share2 size={20} />
                        </button>
                        <button
                          onClick={() => handleAmeen(req.id)}
                          className="flex items-center gap-3 bg-rose-50 text-rose-600 px-8 py-4 rounded-[1.5rem] font-bold hover:bg-rose-100 transition-all shadow-lg shadow-rose-100 group/btn"
                        >
                          <Heart size={20} className="group-hover/btn:scale-110 transition-transform fill-current" />
                          Say Ameen
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
