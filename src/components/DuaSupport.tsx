import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Plus, 
  MessageCircle, 
  Shield, 
  Clock, 
  User as UserIcon,
  CheckCircle2,
  Loader2
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
      setRequests(docs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-900">Dua & Support</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          "The dua of a Muslim for his brother in his absence is accepted." (Sahih Muslim)
        </p>
      </div>

      {/* Submit Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={newDua}
              onChange={(e) => setNewDua(e.target.value)}
              placeholder="What is your dua request?"
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              maxLength={1000}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400">
              {newDua.length}/1000
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isAnonymous ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Shield size={16} />
                {isAnonymous ? 'Anonymous' : 'Public'}
              </button>
              {!user && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Clock size={12} />
                  Sign in to track your requests
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!newDua.trim() || loading}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-200 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>

      {/* Requests List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Heart className="text-rose-500" />
          Community Requests
        </h3>
        
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500">No requests yet. Be the first to ask for a dua.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {req.isAnonymous ? <Shield size={14} /> : <UserIcon size={14} />}
                    {req.isAnonymous ? 'Anonymous' : 'Community Member'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {req.createdAt ? formatDistanceToNow(req.createdAt.toDate()) + ' ago' : 'Just now'}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 flex-1 italic">"{req.content}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <CheckCircle2 size={18} />
                    <span>{req.ameenCount} Ameens</span>
                  </div>
                  <button
                    onClick={() => handleAmeen(req.id)}
                    className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-rose-100 transition-colors"
                  >
                    <Heart size={16} />
                    Say Ameen
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
