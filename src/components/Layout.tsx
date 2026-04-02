import { ReactNode, useState } from 'react';
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
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import { auth, signOut } from '../firebase';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Qur’an', path: '/quran', icon: BookOpen },
    { name: 'Prayer', path: '/prayer', icon: Clock },
    { name: 'Knowledge', path: '/knowledge', icon: Library },
    { name: 'Courses', path: '/courses', icon: GraduationCap },
    { name: 'Audio', path: '/audio-podcasts', icon: Headphones },
    { name: 'Sisters', path: '/women-section', icon: Shield },
    { name: 'Reverts', path: '/revert-support', icon: UserPlus },
    { name: 'Dua', path: '/dua', icon: Heart },
    { name: 'Community', path: '/community', icon: MessageCircle },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar */}
      <nav className={`fixed top-0 w-full z-50 border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-emerald-600">FindIlm</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-500 ${
                    location.pathname === item.path ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <img 
                      src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}`} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border border-emerald-500"
                    />
                  </Link>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
              )}

              <button 
                className="md:hidden p-2"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-40 md:hidden pt-16 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-lg font-medium ${
                    location.pathname === item.path 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={24} />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-12 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-emerald-600">FindIlm</span>
              </div>
              <p className="text-slate-500 max-w-xs">
                Empowering Muslims worldwide with authentic knowledge and spiritual tools.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><Link to="/quran">Qur’an</Link></li>
                <li><Link to="/prayer">Prayer Times</Link></li>
                <li><Link to="/knowledge">Knowledge Hub</Link></li>
                <li><Link to="/courses">Courses</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} FindIlm. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
