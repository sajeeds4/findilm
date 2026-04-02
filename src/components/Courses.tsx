import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle, 
  PlayCircle, 
  Award, 
  Clock, 
  Users, 
  ChevronRight,
  Lock,
  Star
} from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Courses() {
  const { user } = useAuth();
  
  const courses = [
    {
      id: 1,
      title: "Qur’an Basics",
      description: "Learn the fundamentals of Tajweed and correct pronunciation of the Arabic alphabet.",
      duration: "4 Weeks",
      students: 1240,
      rating: 4.9,
      level: "Beginner",
      image: "https://picsum.photos/seed/quran/800/400",
      lessons: 12
    },
    {
      id: 2,
      title: "Salah Masterclass",
      description: "A step-by-step guide to perfecting your prayer, from Wudu to the final Taslim.",
      duration: "2 Weeks",
      students: 850,
      rating: 4.8,
      level: "Beginner",
      image: "https://picsum.photos/seed/salah/800/400",
      lessons: 8
    },
    {
      id: 3,
      title: "Seerah Journey",
      description: "Explore the life and character of the Prophet Muhammad (PBUH) in depth.",
      duration: "6 Weeks",
      students: 2100,
      rating: 5.0,
      level: "Intermediate",
      image: "https://picsum.photos/seed/seerah/800/400",
      lessons: 24
    },
    {
      id: 4,
      title: "Fiqh for Women",
      description: "Understanding the rulings of worship and daily life specific to Muslim women.",
      duration: "4 Weeks",
      students: 560,
      rating: 4.7,
      level: "Intermediate",
      image: "https://picsum.photos/seed/women/800/400",
      lessons: 15
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-900">Learning Paths</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Structured courses designed by qualified teachers to help you grow in your faith and knowledge.
        </p>
      </div>

      {/* Featured Course */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[400px] flex items-center">
        <img 
          src="https://picsum.photos/seed/learning/1200/600" 
          alt="Featured Course" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 p-8 md:p-16 max-w-2xl">
          <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-6">
            Featured Course
          </div>
          <h3 className="text-4xl font-bold mb-4">The Foundations of Iman</h3>
          <p className="text-slate-300 text-lg mb-8">
            Deepen your understanding of the six pillars of faith in this comprehensive 8-week journey.
          </p>
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={18} className="text-emerald-400" />
              <span>8 Weeks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={18} className="text-emerald-400" />
              <span>3.2k Students</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award size={18} className="text-emerald-400" />
              <span>Certificate Included</span>
            </div>
          </div>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/50">
            Enroll Now
          </button>
        </div>
      </section>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className="relative h-48">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                {course.level}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {course.title}
                </h4>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Star size={16} fill="currentColor" />
                  {course.rating}
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <BookOpen size={14} />
                    {course.lessons} Lessons
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Clock size={14} />
                    {course.duration}
                  </div>
                </div>
                <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                  View Course <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Section (If logged in) */}
      {user && (
        <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-emerald-900">Your Progress</h3>
              <p className="text-emerald-700">You've completed 45% of your current courses. Keep going!</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">12</div>
                <div className="text-xs text-emerald-700 uppercase tracking-widest font-bold">Lessons Done</div>
              </div>
              <div className="w-px h-12 bg-emerald-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">2</div>
                <div className="text-xs text-emerald-700 uppercase tracking-widest font-bold">Certificates</div>
              </div>
            </div>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors">
              Continue Learning
            </button>
          </div>
        </section>
      )}

      {/* Lock Section */}
      {!user && (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Lock className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Track Your Progress</h3>
          <p className="text-slate-500 mb-6">Sign in to enroll in courses, track your lessons, and earn certificates.</p>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors">
            Sign In to Start
          </button>
        </div>
      )}
    </div>
  );
}
