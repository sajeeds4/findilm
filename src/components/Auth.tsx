import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Chrome, ShieldCheck, Sparkles, Loader2, CheckCircle2, Globe, Heart, BookOpen } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error("Auth error:", error);
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/');
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
      setError("Server connection failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Content */}
        <div className="hidden lg:block space-y-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-100"
            >
              <Sparkles size={14} />
              <span>Join 12,000+ Seekers Worldwide</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl font-display font-bold text-slate-900 leading-[1.1]"
            >
              Start Your <br />
              <span className="text-brand-600 italic relative">
                Spiritual Legacy
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                </svg>
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 leading-relaxed max-w-lg"
            >
              Create an account to track your progress, save your favorite verses, and connect with a global community of knowledge seekers.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-8"
          >
            {[
              { icon: <BookOpen size={20} />, title: "Personalized Paths", desc: "Tailored learning" },
              { icon: <Globe size={20} />, title: "Global Community", desc: "Connect with others" },
              { icon: <Heart size={20} />, title: "Dua Support", desc: "Ask and give Ameens" },
              { icon: <ShieldCheck size={20} />, title: "Private Space", desc: "Safe and moderated" }
            ].map((feature, idx) => (
              <div key={idx} className="space-y-3 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/30 hover:border-brand-500 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{feature.title}</div>
                  <div className="text-xs text-slate-400 font-medium">{feature.desc}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=User${i}&background=random`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-slate-400">
              <span className="text-brand-600">4.9/5</span> rating from our community
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-[4rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 relative"
        >
          <div className="absolute top-10 right-10 text-slate-50 -z-0">
            <Sparkles size={120} />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl font-display font-bold text-slate-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 text-lg">
                {isLogin ? 'Sign in to continue your journey.' : 'Join us and start growing today.'}
              </p>
            </div>

            <div className="space-y-8">
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 py-5 rounded-[1.5rem] font-bold text-slate-700 hover:bg-slate-50 hover:border-brand-500 transition-all disabled:opacity-50 group shadow-sm"
              >
                <Chrome size={24} className="text-brand-600 group-hover:scale-110 transition-transform" />
                Continue with Google
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                  <span className="px-6 bg-white text-slate-400">Or use email</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">!</div>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleEmailAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. seeker@findilm.com"
                      required
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    {isLogin && (
                      <button type="button" className="text-[10px] font-bold text-brand-600 uppercase tracking-widest hover:underline">Forgot?</button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/30 flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'} 
                      <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-4">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-slate-500 font-medium hover:text-brand-600 transition-colors group"
                >
                  {isLogin ? (
                    <>New to FindIlm? <span className="text-brand-600 font-bold group-hover:underline">Sign Up Free</span></>
                  ) : (
                    <>Already have an account? <span className="text-brand-600 font-bold group-hover:underline">Sign In</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
