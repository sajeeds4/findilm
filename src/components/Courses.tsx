import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award, BookOpen, Clock, Loader2, Play, Sparkles, Star, Users } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { enrollInCourse, fetchCourses, fetchFeaturedCourses } from '../services/api';
import { Course } from '../types';

export default function Courses() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (category = activeFilter) => {
    const [courseData, featuredData] = await Promise.all([
      fetchCourses(category),
      fetchFeaturedCourses(),
    ]);
    setCourses(courseData);
    setFeaturedCourse(featuredData[0] || courseData[0] || null);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) load().catch(console.error);
  }, [activeFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      <section className="relative rounded-[3.5rem] overflow-hidden bg-slate-950 text-white min-h-[500px] flex items-center group shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img src={featuredCourse?.image || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200'} alt="Featured Course" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-12 md:p-24 max-w-3xl space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/20 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/30">
            <Sparkles size={14} />
            Featured Path
          </motion.div>
          <h3 className="text-5xl md:text-7xl font-display font-bold leading-tight">{featuredCourse?.title || 'Learning Path'}</h3>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">{featuredCourse?.description}</p>
          <div className="flex flex-wrap gap-8">
            <InfoStat icon={Clock} label="Duration" value={featuredCourse?.duration || '--'} />
            <InfoStat icon={Users} label="Students" value={`${featuredCourse?.students || 0} joined`} />
            <InfoStat icon={Award} label="Level" value={featuredCourse?.level || '--'} />
          </div>
          <button disabled={!user || !featuredCourse} onClick={() => featuredCourse && enrollInCourse(featuredCourse.slug)} className="bg-brand-600 text-white px-10 py-4 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 flex items-center gap-2 disabled:opacity-50">
            Enroll Now <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-widest"><BookOpen size={14} /> Learning Paths</div>
          <h2 className="text-5xl font-display font-bold text-slate-900">Structured Courses</h2>
          <p className="text-slate-500 text-lg">Designed by qualified teachers to help you grow in faith and knowledge.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {['All', 'Quran', 'Fiqh', 'History'].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeFilter === filter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{filter}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {courses.map((course, idx) => (
            <motion.div key={course.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.06 }} className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:border-brand-500 transition-all group">
              <div className="relative h-72">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest">{course.level}</div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-brand-400 font-bold text-sm bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full"><Star size={14} fill="currentColor" />{course.rating}</div>
                  <div className="flex items-center gap-1 text-white font-bold text-sm bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full"><Users size={14} />{course.students}</div>
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-3xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{course.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{course.description}</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest"><BookOpen size={16} className="text-brand-600" />{course.lessonsCount} Lessons</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest"><Clock size={16} className="text-brand-600" />{course.duration}</div>
                  </div>
                  <button disabled={!user} onClick={() => enrollInCourse(course.slug)} className="px-5 py-3 bg-brand-600 text-white rounded-2xl font-bold disabled:opacity-50">Enroll</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-400"><Icon size={20} /></div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}
