import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Heart, Loader2, Plus, Shield, Sparkles, User as UserIcon, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../AuthContext';
import { createDua, fetchDuas, toggleDuaAmeen } from '../services/api';
import { DuaRequest } from '../types';

export default function DuaSupport() {
  const [requests, setRequests] = useState<DuaRequest[]>([]);
  const [newDua, setNewDua] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { user } = useAuth();

  const load = async () => {
    const data = await fetchDuas();
    setRequests(data);
  };

  useEffect(() => {
    load().finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDua.trim() || loading) return;
    setLoading(true);
    try {
      await createDua({ content: newDua, isAnonymous });
      setNewDua('');
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleAmeen = async (requestId: string) => {
    await toggleDuaAmeen(requestId);
    await load();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest">
            <Heart size={14} className="fill-current" />
            Community Support
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">Dua & Support</h2>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">Share your requests and support others with your Ameens in a compassionate space.</p>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600"><Users size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Requests</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 sticky top-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600"><Plus size={24} /></div>
              <h3 className="text-2xl font-bold text-slate-900">New Request</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <textarea
                value={newDua}
                onChange={(e) => setNewDua(e.target.value)}
                placeholder="What is your dua request?"
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none font-medium text-slate-700 leading-relaxed"
                maxLength={1000}
              />
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAnonymous ? 'bg-brand-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Post Anonymously</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Privacy Protected</div>
                  </div>
                </div>
                <button type="button" onClick={() => setIsAnonymous(!isAnonymous)} className={`w-12 h-6 rounded-full ${isAnonymous ? 'bg-brand-600' : 'bg-slate-300'}`} />
              </div>
              <button disabled={!newDua.trim() || loading || !user} className="w-full bg-brand-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 disabled:opacity-50 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                Submit Request
              </button>
              {!user && <p className="text-center text-xs text-amber-600 font-bold">Sign in to submit a dua request.</p>}
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="animate-spin text-brand-600" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading requests...</p>
            </div>
          ) : (
            requests.map((req, idx) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${req.isAnonymous ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                      {req.isAnonymous ? <Shield size={24} /> : <UserIcon size={24} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{req.displayName || 'Community Member'}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(req.createdAt))} ago
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-serif italic text-slate-700 mb-10 leading-relaxed">"{req.content}"</p>
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <div className="text-sm font-bold text-slate-500">{req.ameenCount} Ameens</div>
                  <button disabled={!user} onClick={() => handleAmeen(req.id)} className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-bold disabled:opacity-50">
                    Say Ameen
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
