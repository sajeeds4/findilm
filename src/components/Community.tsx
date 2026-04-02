import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  FileText,
  Filter,
  Flame,
  Heart,
  Link2,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Upload,
  Users,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../AuthContext';
import {
  createCommunityPost,
  createCommunityReply,
  createSharedContent,
  fetchCommunityCategories,
  fetchCommunityPosts,
  fetchMySharedContent,
  fetchSharedContent,
  toggleCommunityBookmark,
  toggleCommunityLike,
  uploadCommunityAttachment,
} from '../services/api';
import { CommunityCategory, CommunityPost, CommunityReply, SharedContent } from '../types';

export default function Community() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [sharedContent, setSharedContent] = useState<SharedContent[]>([]);
  const [myUploads, setMyUploads] = useState<SharedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', categorySlug: '' });
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postFileCaption, setPostFileCaption] = useState('');
  const [composerLoading, setComposerLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [shareForm, setShareForm] = useState({
    title: '',
    description: '',
    contentType: 'document' as SharedContent['content_type'],
    category: '',
    externalUrl: '',
    isPublic: true,
  });
  const [sharedFile, setSharedFile] = useState<File | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [openReplyForms, setOpenReplyForms] = useState<Record<string, boolean>>({});
  const [replyLoadingKey, setReplyLoadingKey] = useState<string | null>(null);
  const { user } = useAuth();

  const load = async (category = activeTab, search = searchQuery) => {
    const requests: Promise<any>[] = [
      fetchCommunityCategories(),
      fetchCommunityPosts({
        category: category === 'All' ? undefined : category.toLowerCase().replace(/\s+/g, '-'),
        search,
      }),
      fetchSharedContent(),
    ];
    if (user) {
      requests.push(fetchMySharedContent());
    }
    const [categoryData, postData, sharedData, myUploadsData] = await Promise.all(requests);
    setCategories(categoryData);
    setPosts(postData);
    setSharedContent(sharedData);
    setMyUploads(myUploadsData || []);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) load().catch(console.error);
  }, [activeTab, searchQuery, user]);

  const tabs = ['All', ...categories.map((c) => c.name)];
  const featuredPosts = useMemo(() => posts.slice(0, 2), [posts]);
  const activeCategoryName = activeTab === 'All' ? 'All Rooms' : activeTab;

  const submitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categorySlug) return;
    setComposerLoading(true);
    setShareError(null);
    try {
      const created = await createCommunityPost(newPost);
      if (postFile) {
        await uploadCommunityAttachment(created.id, postFile, postFileCaption);
      }
      setNewPost({ title: '', content: '', categorySlug: '' });
      setPostFile(null);
      setPostFileCaption('');
      setShowComposer(false);
      await load();
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Unable to publish your thread.');
    } finally {
      setComposerLoading(false);
    }
  };

  const submitSharedContent = async () => {
    if (!user) {
      setShareError('Sign in to upload community resources.');
      return;
    }
    if (!shareForm.title.trim()) {
      setShareError('Add a title before sharing.');
      return;
    }
    if (!sharedFile && !shareForm.externalUrl.trim()) {
      setShareError('Add a file or a link to share with the community.');
      return;
    }

    setShareLoading(true);
    setShareError(null);
    setShareSuccess(null);
    try {
      await createSharedContent({
        title: shareForm.title,
        description: shareForm.description,
        contentType: shareForm.contentType,
        category: shareForm.category,
        externalUrl: shareForm.externalUrl,
        isPublic: shareForm.isPublic,
        file: sharedFile,
      });
      setShareForm({
        title: '',
        description: '',
        contentType: 'document',
        category: '',
        externalUrl: '',
        isPublic: true,
      });
      setSharedFile(null);
      setShareSuccess('Your contribution was submitted and is now waiting for moderation review.');
      await load();
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Unable to upload your contribution.');
    } finally {
      setShareLoading(false);
    }
  };

  const toggleReplyForm = (key: string) => {
    setOpenReplyForms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setReplyDraft = (key: string, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const submitReply = async (postId: number, key: string, parentId?: number) => {
    const content = (replyDrafts[key] || '').trim();
    if (!content) return;
    setReplyLoadingKey(key);
    try {
      await createCommunityReply(postId, { content, parentId: parentId ?? null });
      setReplyDrafts((prev) => ({ ...prev, [key]: '' }));
      setOpenReplyForms((prev) => ({ ...prev, [key]: false }));
      await load();
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Unable to post your reply.');
    } finally {
      setReplyLoadingKey(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      <section className="relative overflow-hidden rounded-[4rem] bg-[linear-gradient(145deg,#110f1f_0%,#1e1632_40%,#0c1821_100%)] px-8 pb-12 pt-10 text-white shadow-[0_40px_110px_-20px_rgba(15,23,42,0.45)] md:px-12 md:pb-16 md:pt-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[-8%] top-[10%] h-72 w-72 rounded-full bg-rose-500/18 blur-[120px]" />
          <div className="absolute right-[-6%] top-[6%] h-80 w-80 rounded-full bg-emerald-400/14 blur-[130px]" />
          <div className="absolute bottom-[-12%] left-[28%] h-96 w-96 rounded-full bg-indigo-400/10 blur-[150px]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:74px_74px]" />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-300 backdrop-blur-xl">
              <Shield size={14} />
              Private Network Feeling
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-display font-bold leading-[0.94] md:text-7xl">
                A sisterhood network for meaningful Islamic conversation
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-slate-300">
                Not a noisy public forum. Not a random feed. A moderated network of rooms, reflections, support, and lived discussions for Muslim women who want depth and adab online.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowComposer((v) => !v)}
                className="group inline-flex items-center gap-3 rounded-[1.7rem] bg-rose-600 px-9 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(225,29,72,0.25)] transition-all hover:bg-rose-700"
              >
                <Plus size={22} />
                Start A New Thread
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button className="inline-flex items-center gap-3 rounded-[1.7rem] border border-white/10 bg-white/8 px-9 py-4 text-lg font-bold text-white backdrop-blur-xl transition-all hover:bg-white/12">
                <Flame size={20} />
                Trending Rooms
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Protected atmosphere', icon: LockKeyhole },
                { label: 'Moderated rooms', icon: Shield },
                { label: 'High-signal discussions', icon: Sparkles },
                { label: 'Supportive sister circles', icon: Users },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                    <item.icon size={20} />
                  </div>
                  <p className="text-sm font-bold leading-snug text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2.8rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-300">Room Pulse</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">This week’s active conversations</h3>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                  Live
                </div>
              </div>
              <div className="space-y-3">
                {(featuredPosts.length ? featuredPosts : [{ id: 0, title: 'Loading conversations...', category: { name: 'Rooms' } } as any]).map((post) => (
                  <div key={post.id} className="rounded-[1.8rem] border border-white/8 bg-white/7 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {post.category?.name || 'Community'} room
                    </div>
                    <div className="mt-2 text-lg font-bold text-white">{post.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                ['126', 'today’s replies'],
                ['12k+', 'women reached'],
                ['24', 'active rooms'],
                ['98%', 'moderated visibility'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.9rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showComposer && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.16)]"
          >
            <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
                  Thoughtful Posting
                </div>
                <h3 className="text-4xl font-display font-bold text-slate-900">Open a new room thread with intention</h3>
                <div className="space-y-3 text-slate-500">
                  <p>Use this space for sincere questions, reminders, reflections, or discussions other sisters can genuinely benefit from.</p>
                  <p>Threads work best when they are specific, respectful, and rooted in adab.</p>
                </div>
                <div className="space-y-3">
                  {[
                    'Ask something real, not performative',
                    'Protect your privacy and the privacy of others',
                    'Avoid sectarian or inflammatory framing',
                  ].map((rule) => (
                    <div key={rule} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <CheckCircle2 size={18} className="mt-0.5 text-rose-500" />
                      <p className="text-slate-600">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <input
                  className="w-full rounded-[1.6rem] border border-slate-200 px-5 py-4 text-lg"
                  placeholder="Write a clear title for your discussion"
                  value={newPost.title}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  className="min-h-48 w-full rounded-[1.8rem] border border-slate-200 px-5 py-4 text-lg"
                  placeholder="What do you want sisters to reflect on, respond to, or support you with?"
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                />
                <select
                  className="w-full rounded-[1.4rem] border border-slate-200 px-5 py-4"
                  value={newPost.categorySlug}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, categorySlug: e.target.value }))}
                >
                  <option value="">Choose a room</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <Paperclip size={16} className="text-rose-500" />
                    Optional attachment for this thread
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr]">
                    <input
                      type="file"
                      onChange={(e) => setPostFile(e.target.files?.[0] || null)}
                      className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    />
                    <input
                      type="text"
                      value={postFileCaption}
                      onChange={(e) => setPostFileCaption(e.target.value)}
                      placeholder="Attachment caption"
                      className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    disabled={!user}
                    onClick={submitPost}
                    className="rounded-[1.5rem] bg-slate-950 px-8 py-4 font-bold text-white disabled:opacity-50"
                  >
                    {composerLoading ? 'Publishing...' : 'Publish Thread'}
                  </button>
                  <button
                    onClick={() => setShowComposer(false)}
                    className="rounded-[1.5rem] border border-slate-200 bg-white px-8 py-4 font-bold text-slate-600"
                  >
                    Close Composer
                  </button>
                </div>
                {shareError && <p className="text-sm font-medium text-rose-600">{shareError}</p>}
                {!user && <p className="text-sm font-medium text-amber-700">Sign in to open a discussion thread.</p>}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="space-y-6">
          <div className="rounded-[2.6rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Rooms</h3>
              <Filter size={18} className="text-slate-400" />
            </div>
            <div className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-bold transition-all ${
                    activeTab === tab ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab}</span>
                  {activeTab === tab && <ArrowRight size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2.6rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/30">
            <div className="mb-5 flex items-center gap-3 text-rose-300">
              <Shield size={22} />
              <h3 className="text-lg font-bold">Network Culture</h3>
            </div>
            <div className="space-y-4">
              {[
                'Adhere to Islamic etiquette (Adab)',
                'No sectarian discussions or pile-ons',
                'Respect privacy, anonymity, and emotional boundaries',
                'Report anything exploitative or harmful',
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-rose-300">
                    <CheckCircle2 size={12} />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-8">
          <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rooms, discussions, reminders, or sensitive topics..."
                  className="w-full rounded-[1.7rem] border border-slate-200 bg-slate-50 py-5 pl-16 pr-8 font-medium text-slate-700 outline-none focus:border-rose-300"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {posts.length} visible threads
                </div>
                <div className="rounded-full bg-rose-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
                  {activeCategoryName}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-rose-600" size={42} />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-[3rem] border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-300">
                  <MessageSquare size={36} />
                </div>
                <h3 className="mt-6 text-3xl font-display font-bold text-slate-900">No threads in this room yet</h3>
                <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-slate-500">
                  Start a thoughtful conversation and set the tone for a more useful, calmer digital sisterhood.
                </p>
              </div>
            ) : (
              posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-8 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.18)] transition-all hover:border-rose-200"
                >
                  <div className="mb-7 flex items-start justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=e11d48&color=fff`}
                        alt={post.author}
                        className="h-16 w-16 rounded-[1.5rem] border-4 border-rose-50 shadow-lg"
                      />
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-xl font-bold text-slate-900">{post.author}</h4>
                          {post.role === 'Moderator' && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                              Moderator
                            </span>
                          )}
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            {post.category.name}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                          {formatDistanceToNow(new Date(post.createdAt))} ago
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCommunityBookmark(post.id).then(() => load())}
                      className={`rounded-2xl p-4 transition-all ${
                        post.isBookmarked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                      }`}
                    >
                      <Bookmark size={20} className={post.isBookmarked ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-display font-bold leading-tight text-slate-900 transition-colors group-hover:text-rose-600">
                      {post.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-600">{post.content}</p>
                    {post.attachments?.length > 0 && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {post.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-[1.6rem] border border-rose-100 bg-rose-50/70 px-4 py-4 text-slate-700 transition-all hover:border-rose-200"
                          >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                              <Paperclip size={18} />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-bold text-slate-900">
                                {attachment.caption || 'Community attachment'}
                              </div>
                              <div className="text-sm text-slate-500">Open file</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 pt-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => toggleCommunityLike(post.id).then(() => load())}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${
                          post.isLiked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                      >
                        <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                        {post.likes} likes
                      </button>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 font-bold text-slate-500">
                        <MessageSquare size={18} />
                        {post.comments} replies
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-400">Private network style discussion feed</div>
                  </div>

                  <div className="mt-8 rounded-[2.2rem] bg-slate-50 p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Threaded Discussion</div>
                        <div className="mt-1 text-lg font-bold text-slate-900">{post.comments} replies in this conversation</div>
                      </div>
                      <button
                        onClick={() => toggleReplyForm(`post-${post.id}`)}
                        className="rounded-[1.2rem] bg-white px-4 py-3 text-sm font-bold text-rose-600 shadow-sm"
                      >
                        Reply to thread
                      </button>
                    </div>

                    {openReplyForms[`post-${post.id}`] && (
                      <div className="mb-6 rounded-[1.8rem] border border-rose-100 bg-white p-4">
                        <textarea
                          value={replyDrafts[`post-${post.id}`] || ''}
                          onChange={(e) => setReplyDraft(`post-${post.id}`, e.target.value)}
                          placeholder="Add a thoughtful reply to this discussion..."
                          className="min-h-28 w-full rounded-[1.4rem] border border-slate-200 px-4 py-3 text-sm text-slate-700"
                        />
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            disabled={!user || replyLoadingKey === `post-${post.id}`}
                            onClick={() => submitReply(post.id, `post-${post.id}`)}
                            className="rounded-[1.2rem] bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                          >
                            {replyLoadingKey === `post-${post.id}` ? 'Posting...' : 'Post Reply'}
                          </button>
                          <button
                            onClick={() => toggleReplyForm(`post-${post.id}`)}
                            className="rounded-[1.2rem] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                        {!user && <p className="mt-3 text-sm font-medium text-amber-700">Sign in to join this discussion thread.</p>}
                      </div>
                    )}

                    <div className="space-y-4">
                      {post.replies.length > 0 ? (
                        post.replies.map((reply) => (
                          <ReplyThread
                            key={reply.id}
                            postId={post.id}
                            reply={reply}
                            depth={0}
                            user={user}
                            openReplyForms={openReplyForms}
                            replyDrafts={replyDrafts}
                            replyLoadingKey={replyLoadingKey}
                            onToggleReplyForm={toggleReplyForm}
                            onDraftChange={setReplyDraft}
                            onSubmitReply={submitReply}
                          />
                        ))
                      ) : (
                        <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
                          No replies yet. Be the first sister to respond with something useful and kind.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </main>

        <aside className="space-y-6">
          <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Member Sharing</p>
                <h3 className="text-xl font-bold text-slate-900">Upload resources and member content</h3>
              </div>
            </div>
            <div className="space-y-4">
              <input
                value={shareForm.title}
                onChange={(e) => setShareForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title for what you're sharing"
                className="w-full rounded-[1.4rem] border border-slate-200 px-4 py-3 text-sm text-slate-700"
              />
              <textarea
                value={shareForm.description}
                onChange={(e) => setShareForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Why would this benefit the community?"
                className="min-h-28 w-full rounded-[1.5rem] border border-slate-200 px-4 py-3 text-sm text-slate-700"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={shareForm.contentType}
                  onChange={(e) =>
                    setShareForm((prev) => ({ ...prev, contentType: e.target.value as SharedContent['content_type'] }))
                  }
                  className="rounded-[1.3rem] border border-slate-200 px-4 py-3 text-sm text-slate-700"
                >
                  <option value="document">Document</option>
                  <option value="pdf">PDF</option>
                  <option value="article">Article</option>
                  <option value="audio">Audio</option>
                  <option value="link">Link</option>
                </select>
                <input
                  value={shareForm.category}
                  onChange={(e) => setShareForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                  className="rounded-[1.3rem] border border-slate-200 px-4 py-3 text-sm text-slate-700"
                />
              </div>
              <input
                value={shareForm.externalUrl}
                onChange={(e) => setShareForm((prev) => ({ ...prev, externalUrl: e.target.value }))}
                placeholder="Optional link URL"
                className="w-full rounded-[1.3rem] border border-slate-200 px-4 py-3 text-sm text-slate-700"
              />
              <input
                type="file"
                onChange={(e) => setSharedFile(e.target.files?.[0] || null)}
                className="w-full rounded-[1.3rem] border border-slate-200 px-4 py-3 text-sm text-slate-600"
              />
              <label className="flex items-center gap-3 rounded-[1.3rem] bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={shareForm.isPublic}
                  onChange={(e) => setShareForm((prev) => ({ ...prev, isPublic: e.target.checked }))}
                />
                Make this visible in the public resource stream once approved
              </label>
              <button
                onClick={submitSharedContent}
                disabled={!user || shareLoading}
                className="w-full rounded-[1.5rem] bg-slate-950 px-5 py-4 font-bold text-white disabled:opacity-50"
              >
                {shareLoading ? 'Submitting resource...' : 'Share With Community'}
              </button>
              {shareError && <p className="text-sm font-medium text-rose-600">{shareError}</p>}
              {shareSuccess && <p className="text-sm font-medium text-emerald-700">{shareSuccess}</p>}
              {!user && <p className="text-sm font-medium text-amber-700">Any visitor can register, then upload and share from here.</p>}
            </div>
          </div>

          <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Membership Layer</p>
                <h3 className="text-xl font-bold text-slate-900">How this network feels different</h3>
              </div>
            </div>
            <div className="space-y-4">
              {[
                'Rooms feel intentional rather than algorithmic',
                'Supportive threads stay readable and protected',
                'Women can share without broadcasting to the public internet',
              ].map((item) => (
                <div key={item} className="rounded-[1.6rem] bg-slate-50 p-4 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.8rem] bg-[linear-gradient(145deg,#fff7f8_0%,#fff 100%)] p-6 shadow-xl shadow-rose-100/40 ring-1 ring-rose-100">
            <div className="mb-5 flex items-center gap-3 text-rose-600">
              <Star size={20} />
              <h3 className="text-xl font-bold">Suggested room rhythms</h3>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Monday reflections', meta: 'Small weekly reset prompts' },
                { title: 'Marriage and home room', meta: 'Practical threads with adab' },
                { title: 'Identity and confidence room', meta: 'For belonging, modesty, and growth' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-white/80 bg-white/80 p-4">
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Shared Library</p>
                <h3 className="text-xl font-bold text-slate-900">Member contributions</h3>
              </div>
            </div>
            <div className="space-y-4">
              {sharedContent.slice(0, 4).map((item) => (
                <a
                  key={item.id}
                  href={item.external_url || item.fileUrl || '#'}
                  target={item.external_url || item.fileUrl ? '_blank' : undefined}
                  rel="noreferrer"
                  className="block rounded-[1.7rem] border border-slate-100 bg-slate-50 p-4 transition-all hover:border-rose-100 hover:bg-rose-50/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{item.uploaderName}</div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {item.content_type}
                    </div>
                  </div>
                  <div className="mt-3 text-sm leading-relaxed text-slate-600">{item.description || 'Shared for the community library.'}</div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-600">
                    <Link2 size={14} />
                    Open resource
                  </div>
                </a>
              ))}
              {sharedContent.length === 0 && (
                <div className="rounded-[1.7rem] bg-slate-50 p-4 text-sm text-slate-500">
                  Approved community resources will appear here once members begin sharing.
                </div>
              )}
            </div>
          </div>

          {user && (
            <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Your Uploads</p>
                  <h3 className="text-xl font-bold text-slate-900">Submission queue</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {myUploads.length} items
                </div>
              </div>
              <div className="space-y-3">
                {myUploads.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-[1.6rem] bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.category || 'General'}</div>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                          item.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.status === 'rejected'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
                {myUploads.length === 0 && (
                  <div className="rounded-[1.6rem] bg-slate-50 p-4 text-sm text-slate-500">
                    Your uploads will appear here so members can track what is pending review or already approved.
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function ReplyThread({
  postId,
  reply,
  depth,
  user,
  openReplyForms,
  replyDrafts,
  replyLoadingKey,
  onToggleReplyForm,
  onDraftChange,
  onSubmitReply,
}: {
  postId: number;
  reply: CommunityReply;
  depth: number;
  user: unknown;
  openReplyForms: Record<string, boolean>;
  replyDrafts: Record<string, string>;
  replyLoadingKey: string | null;
  onToggleReplyForm: (key: string) => void;
  onDraftChange: (key: string, value: string) => void;
  onSubmitReply: (postId: number, key: string, parentId?: number) => Promise<void>;
}) {
  const replyKey = `reply-${reply.id}`;
  const nestedPadding = depth > 0 ? 'ml-4 border-l border-rose-100 pl-4 md:ml-6 md:pl-6' : '';

  return (
    <div className={nestedPadding}>
      <div className="rounded-[1.7rem] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-900">{reply.author}</span>
              {reply.role === 'Moderator' && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Moderator
                </span>
              )}
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </div>
          </div>
          <button
            onClick={() => onToggleReplyForm(replyKey)}
            className="rounded-[1.1rem] bg-slate-50 px-4 py-2 text-sm font-bold text-rose-600"
          >
            Reply
          </button>
        </div>

        <p className="mt-4 text-base leading-relaxed text-slate-600">{reply.content}</p>

        {openReplyForms[replyKey] && (
          <div className="mt-4 rounded-[1.5rem] border border-rose-100 bg-rose-50/40 p-4">
            <textarea
              value={replyDrafts[replyKey] || ''}
              onChange={(e) => onDraftChange(replyKey, e.target.value)}
              placeholder="Write a nested reply..."
              className="min-h-24 w-full rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                disabled={!user || replyLoadingKey === replyKey}
                onClick={() => onSubmitReply(postId, replyKey, reply.id)}
                className="rounded-[1.1rem] bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {replyLoadingKey === replyKey ? 'Posting...' : 'Post Nested Reply'}
              </button>
              <button
                onClick={() => onToggleReplyForm(replyKey)}
                className="rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {reply.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {reply.replies.map((childReply) => (
            <ReplyThread
              key={childReply.id}
              postId={postId}
              reply={childReply}
              depth={depth + 1}
              user={user}
              openReplyForms={openReplyForms}
              replyDrafts={replyDrafts}
              replyLoadingKey={replyLoadingKey}
              onToggleReplyForm={onToggleReplyForm}
              onDraftChange={onDraftChange}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
