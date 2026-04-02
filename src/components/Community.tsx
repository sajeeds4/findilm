import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Users, 
  Shield, 
  Heart, 
  Share2, 
  MoreVertical,
  Plus,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Bookmark,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['All', 'Marriage', 'Mental Health', 'Family', 'Reminders', 'Education'];

  const posts = [
    {
      id: 1,
      author: "Sister Sarah",
      role: "Community Member",
      time: "2h ago",
      category: "Mental Health",
      title: "Finding peace in difficult times",
      content: "Assalamu Alaikum sisters, I wanted to share some verses that have helped me through a difficult week. Surah Ash-Sharh has been a constant reminder that with every hardship comes ease. How do you all maintain your tawakkul when things get overwhelming?",
      likes: 24,
      comments: 8,
      avatar: "https://ui-avatars.com/api/?name=Sarah&background=10b981&color=fff",
      isLiked: false,
      isBookmarked: true
    },
    {
      id: 2,
      author: "Sister Fatima",
      role: "Moderator",
      time: "5h ago",
      category: "Reminders",
      title: "Daily Sunnah: The morning adhkar",
      content: "Don't forget to recite your morning adhkar today! They are a shield for us throughout the day. Which one is your favorite to recite? I personally find great comfort in 'Hasbiyallahu la ilaha illa Huwa...'",
      likes: 42,
      comments: 15,
      avatar: "https://ui-avatars.com/api/?name=Fatima&background=059669&color=fff",
      isLiked: true,
      isBookmarked: false
    },
    {
      id: 3,
      author: "Sister Amina",
      role: "Community Member",
      time: "1d ago",
      category: "Family",
      title: "Teaching kids about Ramadan",
      content: "I'm looking for creative ways to get my toddlers excited about Ramadan. Any suggestions for crafts or simple activities? We've started a small 'good deeds' jar but I'd love more ideas!",
      likes: 18,
      comments: 22,
      avatar: "https://ui-avatars.com/api/?name=Amina&background=34d399&color=fff",
      isLiked: false,
      isBookmarked: false
    }
  ];

  const filteredPosts = posts.filter(post => 
    (activeTab === 'All' || post.category === activeTab) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32">
      {/* Hero Header */}
      <div className="relative bg-slate-900 rounded-[4rem] p-12 md:p-20 overflow-hidden shadow-2xl shadow-slate-900/40">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 text-brand-500/10 w-96 h-96 pointer-events-none">
          <Users size={400} />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-500/20">
            <Shield size={14} />
            Safe Space • Moderated Community
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
            Connect, Share, and <span className="text-brand-400">Grow Together</span>
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
            Join a global community of sisters dedicated to learning, supporting one another, and living a life inspired by faith.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-brand-600 text-white px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-900/40 flex items-center gap-3 group">
              <Plus size={24} />
              Start a Discussion
            </button>
            <button className="bg-white/10 text-white border border-white/10 px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-3">
              <TrendingUp size={24} />
              Trending Topics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-10">
          <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Categories</h3>
              <Filter size={18} className="text-slate-400" />
            </div>
            <div className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab 
                      ? 'bg-brand-50 text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <ArrowRight size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-slate-900/30 space-y-6">
            <div className="flex items-center gap-3 text-brand-400">
              <Shield size={24} />
              <h3 className="text-lg font-bold">Community Rules</h3>
            </div>
            <div className="space-y-4">
              {[
                "Adhere to Islamic etiquette (Adab)",
                "No sectarian discussions",
                "Respect privacy and anonymity",
                "Report inappropriate content"
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mt-0.5">
                    <CheckCircle2 size={12} />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{rule}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5">
              Read Full Guidelines
            </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-9 space-y-12">
          {/* Search & Stats */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={22} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions, questions, or reminders..."
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-xl shadow-slate-200/30 font-medium text-slate-700"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                    <img src={`https://ui-avatars.com/api/?name=User${i}&background=random`} alt="User" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  +2k
                </div>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Online Now
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-slate-200 p-10 rounded-[3.5rem] shadow-xl shadow-slate-200/50 hover:border-brand-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={post.avatar} alt={post.author} className="w-16 h-16 rounded-[1.5rem] border-4 border-brand-50 shadow-lg" />
                        {post.role === 'Moderator' && (
                          <div className="absolute -bottom-2 -right-2 bg-brand-600 text-white p-1.5 rounded-lg shadow-lg">
                            <Shield size={14} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                          {post.author}
                          {post.role === 'Moderator' && (
                            <span className="bg-brand-50 text-brand-600 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Moderator</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                          <Clock size={14} />
                          {post.time}
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="text-brand-600">{post.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`p-4 rounded-2xl transition-all ${post.isBookmarked ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-50'}`}>
                        <Bookmark size={20} className={post.isBookmarked ? 'fill-current' : ''} />
                      </button>
                      <button className="p-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <h3 className="text-3xl font-display font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-8">
                      <button className={`flex items-center gap-3 font-bold text-sm transition-all group/btn ${post.isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>
                        <div className={`p-3 rounded-xl transition-all ${post.isLiked ? 'bg-rose-50' : 'bg-slate-50 group-hover/btn:bg-rose-50'}`}>
                          <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                        </div>
                        {post.likes} <span className="hidden sm:inline">Likes</span>
                      </button>
                      <button className="flex items-center gap-3 text-slate-500 hover:text-brand-600 transition-all font-bold text-sm group/btn">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover/btn:bg-brand-50 transition-all">
                          <MessageSquare size={20} />
                        </div>
                        {post.comments} <span className="hidden sm:inline">Comments</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm hover:bg-brand-600 transition-all shadow-xl shadow-slate-900/20 group/share">
                      <Share2 size={18} className="group-hover/share:scale-110 transition-transform" />
                      Share Discussion
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6">
                  <Search size={48} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">No discussions found</h4>
                <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or category filters to find what you're looking for.</p>
              </div>
            )}

            <div className="flex justify-center pt-10">
              <button className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-brand-600 transition-all">
                Load More Discussions
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
