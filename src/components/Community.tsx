import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Users, 
  Shield, 
  Heart, 
  Share2, 
  MoreVertical,
  Plus,
  Search,
  Filter
} from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Marriage', 'Mental Health', 'Family', 'Reminders'];

  const posts = [
    {
      id: 1,
      author: "Sister Sarah",
      role: "Community Member",
      time: "2h ago",
      category: "Mental Health",
      title: "Finding peace in difficult times",
      content: "Assalamu Alaikum sisters, I wanted to share some verses that have helped me through a difficult week. Surah Ash-Sharh has been a constant reminder that with every hardship comes ease...",
      likes: 24,
      comments: 8,
      avatar: "https://ui-avatars.com/api/?name=Sarah&background=10b981&color=fff"
    },
    {
      id: 2,
      author: "Sister Fatima",
      role: "Moderator",
      time: "5h ago",
      category: "Reminders",
      title: "Daily Sunnah: The morning adhkar",
      content: "Don't forget to recite your morning adhkar today! They are a shield for us throughout the day. Which one is your favorite to recite?",
      likes: 42,
      comments: 15,
      avatar: "https://ui-avatars.com/api/?name=Fatima&background=059669&color=fff"
    },
    {
      id: 3,
      author: "Sister Amina",
      role: "Community Member",
      time: "1d ago",
      category: "Family",
      title: "Teaching kids about Ramadan",
      content: "I'm looking for creative ways to get my toddlers excited about Ramadan. Any suggestions for crafts or simple activities?",
      likes: 18,
      comments: 22,
      avatar: "https://ui-avatars.com/api/?name=Amina&background=34d399&color=fff"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-emerald-200" size={20} />
            <span className="text-emerald-100 font-bold uppercase tracking-widest text-xs">Safe Space • Sisters Only</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">FindIlm Community</h2>
          <p className="text-emerald-50 text-lg">
            Connect, share, and grow with sisters from around the world in a moderated, Islamic environment.
          </p>
        </div>
        <Users className="absolute -right-8 -bottom-8 text-emerald-500/20 w-64 h-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield className="text-emerald-400" size={18} />
              Community Rules
            </h3>
            <ul className="text-xs text-slate-400 space-y-3">
              <li>• Adhere to Islamic etiquette (Adab)</li>
              <li>• No sectarian discussions</li>
              <li>• Respect privacy and anonymity</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search discussions..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
              <Plus size={18} />
              New Post
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-emerald-100" />
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        {post.author}
                        {post.role === 'Moderator' && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">Mod</span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">{post.time} • {post.category}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3">{post.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{post.content}</p>
                
                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm">
                    <Heart size={18} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm">
                    <MessageSquare size={18} />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm ml-auto">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
