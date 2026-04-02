import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Clock, 
  Library, 
  Heart, 
  MessageCircle, 
  User, 
  Menu, 
  X, 
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  GraduationCap,
  Headphones,
  Shield,
  UserPlus,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Qur’an', path: '/quran', icon: BookOpen },
    { name: 'Prayer', path: '/prayer', icon: Clock },
    { name: 'Knowledge', path: '/knowledge', icon: Library },
    { name: 'Courses', path: '/courses', icon: GraduationCap },
    { name: 'Audio', path: '/audio-podcasts', icon: Headphones },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? `py-3 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} border-b shadow-lg backdrop-blur-xl` 
          : 'py-6 bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/20 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <span className={`text-2xl font-display font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>FindIlm</span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                      location.pathname === item.path 
                        ? 'bg-brand-50 text-brand-600' 
                        : `text-slate-500 hover:text-brand-600 hover:bg-brand-50/50`
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin-panel"
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                      location.pathname === '/admin-panel'
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50/50'
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 mr-2">
                <button className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <Search size={20} />
                </button>
                <button className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <Bell size={20} />
                </button>
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-500'}`}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              
              <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{profile?.displayName || 'User'}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Seeker</div>
                    </div>
                    <img 
                      src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=0D9488&color=fff`} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-xl border-2 border-brand-500 shadow-lg group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="bg-brand-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/20"
                >
                  Sign In
                </Link>
              )}

              <button 
                className={`lg:hidden p-2.5 rounded-xl ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className={`fixed inset-0 z-[60] lg:hidden ${isDark ? 'bg-slate-950' : 'bg-white'}`}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">F</span>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-brand-600">FindIlm</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-slate-100 rounded-xl">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 p-5 rounded-2xl text-xl font-bold transition-all ${
                      location.pathname === item.path 
                        ? 'bg-brand-50 text-brand-600' 
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${location.pathname === item.path ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <item.icon size={24} />
                    </div>
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin-panel"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 p-5 rounded-2xl text-xl font-bold transition-all ${
                      location.pathname === '/admin-panel'
                        ? 'bg-brand-50 text-brand-600'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${location.pathname === '/admin-panel' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <LayoutDashboard size={24} />
                    </div>
                    Admin Panel
                  </Link>
                )}
              </div>

              <div className="pt-8 border-t space-y-4">
                {!user && (
                  <Link 
                    to="/auth" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg"
                  >
                    Sign In to Account
                  </Link>
                )}
                <div className="flex justify-center gap-6 text-slate-400">
                  <Instagram size={24} />
                  <Twitter size={24} />
                  <Facebook size={24} />
                  <Youtube size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-20 px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t pt-24 pb-12 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/20">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <span className="text-2xl font-display font-bold tracking-tight text-brand-600">FindIlm</span>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                Empowering the global Muslim community with authentic knowledge, spiritual tools, and a supportive environment for growth.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-500 transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Platform</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link to="/quran" className="hover:text-brand-600 transition-colors">The Holy Qur’an</Link></li>
                <li><Link to="/prayer" className="hover:text-brand-600 transition-colors">Prayer Times</Link></li>
                <li><Link to="/knowledge" className="hover:text-brand-600 transition-colors">Knowledge Hub</Link></li>
                <li><Link to="/courses" className="hover:text-brand-600 transition-colors">Learning Paths</Link></li>
                <li><Link to="/audio-podcasts" className="hover:text-brand-600 transition-colors">Audio Library</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Community</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link to="/women-section" className="hover:text-brand-600 transition-colors">Sisters' Sanctuary</Link></li>
                <li><Link to="/revert-support" className="hover:text-brand-600 transition-colors">Revert Support</Link></li>
                <li><Link to="/dua" className="hover:text-brand-600 transition-colors">Dua Community</Link></li>
                <li><Link to="/community" className="hover:text-brand-600 transition-colors">Discussion Forums</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Stay Inspired</h4>
              <p className="text-slate-500">Join our newsletter for weekly spiritual reflections and platform updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-500 transition-all font-medium"
                />
                <button className="bg-brand-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/20">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-bold">
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-brand-600 transition-colors">Cookie Policy</Link>
            </div>
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} FindIlm. Crafted with</span>
              <Heart size={14} className="text-red-500 fill-current" />
              <span>for the Ummah.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
