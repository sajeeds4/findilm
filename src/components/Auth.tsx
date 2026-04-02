import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  Heart,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

type JoinGoal = 'community' | 'learning' | 'support' | 'private';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [joinGoal, setJoinGoal] = useState<JoinGoal>('community');
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const stepReady = useMemo(() => {
    if (signupStep === 1) {
      return displayName.trim().length > 1;
    }
    return email.trim() && password.trim() && password === confirmPassword;
  }, [signupStep, displayName, email, password, confirmPassword]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await register(email, password, displayName);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const joinGoals = [
    {
      id: 'community' as const,
      title: 'Join private sister circles',
      body: 'I want conversations, belonging, and women who understand my context.',
      icon: Users,
    },
    {
      id: 'learning' as const,
      title: 'Build a steadier learning life',
      body: 'I want structured courses, resources, and a consistent study rhythm.',
      icon: BookOpen,
    },
    {
      id: 'support' as const,
      title: 'Find support and gentle care',
      body: 'I need dua, reflection, encouragement, and emotionally safe spaces.',
      icon: Heart,
    },
    {
      id: 'private' as const,
      title: 'Use a calmer, safer platform',
      body: 'I want a more private-feeling alternative to open social media spaces.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative min-h-[92vh] overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#fff6f8_0%,#fffbf4_48%,#f4fbf8_100%)]" />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-[-8%] top-[8%] h-80 w-80 rounded-full bg-rose-200/45 blur-[130px]" />
        <div className="absolute right-[-10%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-emerald-200/35 blur-[130px]" />
        <div className="absolute bottom-[-12%] left-[28%] h-[30rem] w-[30rem] rounded-full bg-amber-100/55 blur-[150px]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-between rounded-[4rem] bg-[linear-gradient(155deg,#111827_0%,#1f1631_58%,#0d1720_100%)] p-12 text-white shadow-[0_40px_100px_-25px_rgba(15,23,42,0.45)]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-300 backdrop-blur-xl">
              <Sparkles size={14} />
              Member Onboarding
            </div>
            <div className="space-y-5">
              <h1 className="text-6xl font-display font-bold leading-[0.94]">
                Join a calmer digital space for Muslim women
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-slate-300">
                This onboarding should feel like entering a serious platform: thoughtful, safe, and intentionally designed for belonging, learning, and support.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {[
              'Moderated circles for sensitive and meaningful discussion',
              'Courses, saved resources, audio, reflection, and support in one member account',
              'A private-feeling alternative to open, noisy social media spaces',
            ].map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-[2rem] border border-white/8 bg-white/6 p-5">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                  <CheckCircle2 size={18} />
                </div>
                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ['12k+', 'Women reached'],
              ['340+', 'Course joiners'],
              ['24', 'Active discussion rooms'],
              ['4.9/5', 'Community trust rating'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.8rem] border border-white/8 bg-white/6 p-5">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-[4rem] border border-white/80 bg-white/80 shadow-[0_35px_90px_-20px_rgba(15,23,42,0.16)] backdrop-blur-xl"
        >
          <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
            {!isLogin && (
              <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#fff9fb_0%,#fff 100%)] p-8 lg:border-b-0 lg:border-r">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">Step {signupStep} of 2</p>
                    <h2 className="mt-2 text-3xl font-display font-bold text-slate-900">
                      {signupStep === 1 ? 'Tell us how you want to use the platform' : 'Create your secure account'}
                    </h2>
                  </div>

                  <div className="flex gap-3">
                    {[1, 2].map((step) => (
                      <div key={step} className={`h-2 flex-1 rounded-full ${signupStep >= step ? 'bg-rose-500' : 'bg-slate-100'}`} />
                    ))}
                  </div>

                  {signupStep === 1 ? (
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">What should your account help you do first?</label>
                      <div className="space-y-3">
                        {joinGoals.map((goal) => (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => setJoinGoal(goal.id)}
                            className={`w-full rounded-[1.8rem] border p-4 text-left transition-all ${
                              joinGoal === goal.id ? 'border-rose-300 bg-rose-50 shadow-sm' : 'border-slate-200 bg-white hover:border-rose-200'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${joinGoal === goal.id ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <goal.icon size={20} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{goal.title}</div>
                                <div className="mt-1 text-sm text-slate-500">{goal.body}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">What should sisters call you?</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Sumaiya Rahman"
                          className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 font-medium text-slate-700 outline-none focus:border-rose-300"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-[1.8rem] bg-slate-50 p-5">
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">Chosen onboarding direction</div>
                        <div className="mt-2 text-lg font-bold text-slate-900">
                          {joinGoals.find((goal) => goal.id === joinGoal)?.title}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full rounded-[1.5rem] border border-slate-200 bg-white py-4 pl-14 pr-5 font-medium text-slate-700 outline-none focus:border-rose-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className="w-full rounded-[1.5rem] border border-slate-200 bg-white py-4 pl-14 pr-5 font-medium text-slate-700 outline-none focus:border-rose-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat your password"
                          className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 font-medium text-slate-700 outline-none focus:border-rose-300"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {signupStep === 2 && (
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="rounded-[1.4rem] border border-slate-200 px-6 py-3 font-bold text-slate-600"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={!stepReady}
                      onClick={() => signupStep === 1 && setSignupStep(2)}
                      className={`rounded-[1.4rem] px-6 py-3 font-bold ${signupStep === 1 ? 'bg-slate-950 text-white disabled:opacity-40' : 'hidden'}`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 md:p-12">
              <div className="space-y-8">
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
                    {isLogin ? 'Member Sign In' : 'Account Creation'}
                  </div>
                  <h2 className="text-4xl font-display font-bold text-slate-900">
                    {isLogin ? 'Welcome back to your private sisterhood space' : 'Complete your onboarding'}
                  </h2>
                  <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-500">
                    {isLogin
                      ? 'Sign in to continue into your discussions, courses, saved resources, and reflections.'
                      : 'Your account gives you access to community rooms, learning paths, support spaces, and a calmer online experience.'}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Globe, title: 'Global sister circles' },
                    { icon: Heart, title: 'Support and dua spaces' },
                    { icon: ShieldCheck, title: 'Private-feeling trust' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[1.8rem] bg-slate-50 p-5 text-center">
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                        <item.icon size={18} />
                      </div>
                      <div className="text-sm font-bold text-slate-700">{item.title}</div>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-[1.8rem] border border-rose-100 bg-rose-50 p-5 text-sm font-bold text-rose-600"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleEmailAuth} className="space-y-5">
                  {isLogin && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                            className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 py-4 pl-14 pr-5 font-medium text-slate-700 outline-none focus:border-rose-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Password</label>
                          <button type="button" className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
                            Secure sign in
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 py-4 pl-14 pr-5 font-medium text-slate-700 outline-none focus:border-rose-300"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {!isLogin && signupStep === 2 && (
                    <div className="rounded-[1.8rem] border border-emerald-100 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-800">
                      Your onboarding focus is saved for this session and helps us shape a more intentional member experience.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (!isLogin && signupStep !== 2)}
                    className="flex w-full items-center justify-center gap-3 rounded-[1.7rem] bg-rose-600 py-5 text-lg font-bold text-white shadow-[0_18px_40px_rgba(225,29,72,0.22)] transition-all hover:bg-rose-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        {isLogin ? 'Enter The Platform' : 'Create My Account'}
                        <ArrowRight size={22} />
                      </>
                    )}
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-6 text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setSignupStep(1);
                    }}
                    className="font-medium text-slate-500 transition-colors hover:text-rose-600"
                  >
                    {isLogin ? (
                      <>New here? <span className="font-bold text-rose-600">Create your member account</span></>
                    ) : (
                      <>Already part of the network? <span className="font-bold text-rose-600">Sign in</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
