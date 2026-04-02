import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle, 
  PlayCircle, 
  Award, 
  Clock, 
  Users, 
  ChevronRight,
  Lock,
  Star,
  Sparkles,
  BarChart3,
  Trophy,
  ArrowRight,
  Play
} from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Courses() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const courses = [
    {
      id: 1,
      title: "Qur’an Basics",
      description: "Learn the fundamentals of Tajweed and correct pronunciation of the Arabic alphabet with expert guidance.",
      duration: "4 Weeks",
      students: 1240,
      rating: 4.9,
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
      lessons: 12,
      category: "Quran"
    },
    {
      id: 2,
      title: "Salah Masterclass",
      description: "A comprehensive step-by-step guide to perfecting your prayer, from Wudu to the final Taslim.",
      duration: "2 Weeks",
      students: 850,
      rating: 4.8,
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800",
      lessons: 8,
      category: "Fiqh"
    },
    {
      id: 3,
      title: "Seerah Journey",
      description: "Explore the life and character of the Prophet Muhammad (PBUH) in depth through authentic narrations.",
      duration: "6 Weeks",
      students: 2100,
      rating: 5.0,
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
      lessons: 24,
      category: "History"
    },
    {
      id: 4,
      title: "Fiqh for Women",
      description: "Understanding the rulings of worship and daily life specific to Muslim women in the modern world.",
      duration: "4 Weeks",
      students: 560,
      rating: 4.7,
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
      lessons: 15,
      category: "Fiqh"
    }
  ];

  const filteredCourses = activeFilter === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-[3.5rem] overflow-hidden bg-slate-950 text-white min-h-[500px] flex items-center group shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" 
            alt="Featured Course" 
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-12 md:p-24 max-w-3xl space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30"
          >
            <Sparkles size={14} />
            Featured Path
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight"
          >
            The Foundations <br /> of <span className="text-brand-400 italic">Iman</span>
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed"
          >
            Deepen your understanding of the six pillars of faith in this comprehensive 8-week journey designed for spiritual growth.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-400">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Duration</p>
                <p className="font-bold">8 Weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-400">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Students</p>
                <p className="font-bold">3.2k Joined</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-400">
                <Award size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Reward</p>
                <p className="font-bold">Certificate</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button className="bg-brand-600 text-white px-10 py-4 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 flex items-center gap-2 group/btn">
              Enroll Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/10 backdrop-blur-xl text-white px-10 py-4 rounded-[1.5rem] font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Play size={18} className="fill-white" /> Watch Trailer
            </button>
          </motion.div>
        </div>
      </section>

      {/* Filter & Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest">
            <BookOpen size={14} />
            Learning Paths
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900">Structured Courses</h2>
          <p className="text-slate-500 text-lg">Designed by qualified teachers to help you grow in faith and knowledge.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {['All', 'Quran', 'Fiqh', 'History'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeFilter === filter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, idx) => (
            <motion.div
              layout
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:border-brand-500 transition-all group"
            >
              <div className="relative h-72">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                  {course.level}
                </div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-brand-400 font-bold text-sm bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <Star size={14} fill="currentColor" />
                    {course.rating}
                  </div>
                  <div className="flex items-center gap-1 text-white font-bold text-sm bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <Users size={14} />
                    {course.students}
                  </div>
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-3xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-slate-500 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                      <BookOpen size={16} className="text-brand-600" />
                      {course.lessons} Lessons
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                      <Clock size={16} className="text-brand-600" />
                      {course.duration}
                    </div>
                  </div>
                  <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Section (If logged in) */}
      <AnimatePresence>
        {user ? (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white rounded-[3.5rem] p-12 md:p-16 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest">
                  <BarChart3 size={14} />
                  Learning Progress
                </div>
                <h3 className="text-4xl font-bold">Your Journey</h3>
                <p className="text-slate-400 text-lg max-w-md">You've completed 45% of your current courses. Consistency is the key to mastery.</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-12">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-brand-400">12</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Lessons Completed</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/10"></div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-brand-400">2</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Certificates Earned</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/10"></div>
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-brand-400">840</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">XP Points</div>
                </div>
              </div>
              
              <button className="bg-brand-600 text-white px-10 py-5 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 flex items-center gap-2">
                Continue Learning <ArrowRight size={20} />
              </button>
            </div>
            <Trophy className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64 rotate-12" />
          </motion.section>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200 space-y-8"
          >
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto shadow-xl">
              <Lock size={48} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-slate-900">Track Your Progress</h3>
              <p className="text-slate-500 text-lg max-w-md mx-auto">Sign in to enroll in courses, track your lessons, and earn certificates to showcase your achievements.</p>
            </div>
            <button className="bg-brand-600 text-white px-10 py-4 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40">
              Sign In to Start Learning
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
