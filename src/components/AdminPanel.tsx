import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AudioLines,
  BarChart3,
  BookOpen,
  FileText,
  Loader2,
  Plus,
  Radar,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import {
  createAdminItem,
  deleteAdminItem,
  fetchAdminCollection,
  fetchAdminOverview,
  updateAdminItem,
} from '../services/api';
import { CommunityPost, Course, KnowledgeResource, PodcastEpisode } from '../types';

type AdminTab = 'command' | 'courses' | 'resources' | 'episodes' | 'community';

export default function AdminPanel() {
  const { isAdmin, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('command');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [saving, setSaving] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '4 Weeks', category: 'Quran', image: '', level: 'beginner', students: 0, rating: 4.8, lessonsCount: 8 });
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', author: '', resource_type: 'article', categorySlug: 'quran-studies', url: '' });
  const [episodeForm, setEpisodeForm] = useState({ title: '', description: '', speaker: '', duration: '20 min', audio_url: '', image_url: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [overviewData, courseData, resourceData, episodeData, communityData] = await Promise.all([
        fetchAdminOverview(),
        fetchAdminCollection<Course>('/api/admin/courses'),
        fetchAdminCollection<KnowledgeResource>('/api/admin/resources'),
        fetchAdminCollection<PodcastEpisode>('/api/admin/episodes'),
        fetchAdminCollection<CommunityPost>('/api/admin/community-posts'),
      ]);
      setOverview(overviewData);
      setCourses(courseData);
      setResources(resourceData);
      setEpisodes(episodeData);
      setCommunityPosts(communityData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      load().catch(console.error);
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const createCourse = async () => {
    setSaving(true);
    try {
      await createAdminItem('/api/admin/courses', {
        ...courseForm,
        image: courseForm.image,
      });
      setCourseForm({ title: '', description: '', duration: '4 Weeks', category: 'Quran', image: '', level: 'beginner', students: 0, rating: 4.8, lessonsCount: 8 });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const createResource = async () => {
    setSaving(true);
    try {
      await createAdminItem('/api/admin/resources', resourceForm);
      setResourceForm({ title: '', description: '', author: '', resource_type: 'article', categorySlug: 'quran-studies', url: '' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const createEpisode = async () => {
    setSaving(true);
    try {
      await createAdminItem('/api/admin/episodes', episodeForm);
      setEpisodeForm({ title: '', description: '', speaker: '', duration: '20 min', audio_url: '', image_url: '' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (path: string) => {
    setSaving(true);
    try {
      await deleteAdminItem(path);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (path: string, item: { is_featured?: boolean }) => {
    setSaving(true);
    try {
      await updateAdminItem(path, { ...item, is_featured: !item.is_featured });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const commandStats = useMemo(() => {
    if (!overview?.stats) return [];
    return [
      { key: 'users', label: 'Members', icon: Users, tone: 'text-sky-600 bg-sky-50' },
      { key: 'communityPosts', label: 'Threads', icon: Radar, tone: 'text-rose-600 bg-rose-50' },
      { key: 'courses', label: 'Courses', icon: BookOpen, tone: 'text-emerald-600 bg-emerald-50' },
      { key: 'resources', label: 'Resources', icon: FileText, tone: 'text-amber-600 bg-amber-50' },
      { key: 'episodes', label: 'Audio', icon: AudioLines, tone: 'text-violet-600 bg-violet-50' },
      { key: 'openReports', label: 'Open Reports', icon: ShieldAlert, tone: 'text-red-600 bg-red-50' },
    ];
  }, [overview]);

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24 space-y-6">
        <ShieldAlert className="mx-auto text-amber-500" size={56} />
        <h2 className="text-4xl font-display font-bold text-slate-900">Admin Access Required</h2>
        <p className="text-slate-500 text-lg">This area is reserved for administrators and content managers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="animate-spin text-rose-600" size={40} />
      </div>
    );
  }

  const tabs: Array<{ key: AdminTab; label: string; icon: any; caption: string }> = [
    { key: 'command', label: 'Command', icon: BarChart3, caption: 'Overview and operations' },
    { key: 'courses', label: 'Courses', icon: BookOpen, caption: 'Learning catalog control' },
    { key: 'resources', label: 'Resources', icon: FileText, caption: 'Library publishing' },
    { key: 'episodes', label: 'Audio', icon: AudioLines, caption: 'Audio programming' },
    { key: 'community', label: 'Community', icon: Users, caption: 'Network moderation' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <div className="grid gap-8 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="overflow-hidden rounded-[3rem] bg-[linear-gradient(155deg,#111827_0%,#1f1631_65%,#0b1820_100%)] p-7 text-white shadow-[0_35px_100px_-25px_rgba(15,23,42,0.45)]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-300">
                <Sparkles size={14} />
                Platform Backend
              </div>
              <h1 className="text-4xl font-display font-bold leading-[0.94]">FindIlm Control Room</h1>
              <p className="text-slate-300 leading-relaxed">
                Serious oversight for a serious platform: content, rooms, trust, growth, and quality.
              </p>
            </div>
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/8 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Signed in as</div>
              <div className="mt-2 text-xl font-bold">{profile?.displayName || 'Administrator'}</div>
              <div className="mt-1 text-sm text-slate-400">{profile?.email}</div>
            </div>
          </div>

          <div className="rounded-[2.6rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/30">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full rounded-[1.8rem] p-4 text-left transition-all ${
                    activeTab === tab.key ? 'bg-rose-50 ring-1 ring-rose-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${activeTab === tab.key ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <tab.icon size={18} />
                    </div>
                    <div>
                      <div className={`font-bold ${activeTab === tab.key ? 'text-rose-600' : 'text-slate-900'}`}>{tab.label}</div>
                      <div className="text-xs text-slate-400">{tab.caption}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-8">
          <section className="rounded-[3rem] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.18)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
                  <Activity size={14} />
                  Active Workspace
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900">
                  {tabs.find((tab) => tab.key === activeTab)?.label}
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
                  {activeTab === 'command' && 'Monitor platform health, trust signals, growth, and the latest member activity.'}
                  {activeTab === 'courses' && 'Shape the curriculum and keep the learning catalog current and compelling.'}
                  {activeTab === 'resources' && 'Publish, feature, and rotate the library that powers the platform’s knowledge layer.'}
                  {activeTab === 'episodes' && 'Program the audio side of the platform: reminders, recitations, and spoken learning.'}
                  {activeTab === 'community' && 'Review what members are posting and keep the network thoughtful, safe, and high-signal.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-[1.4rem] bg-slate-950 px-5 py-3 font-bold text-white">
                  <TrendingUp size={16} />
                  Platform pulse
                </button>
                <button className="inline-flex items-center gap-2 rounded-[1.4rem] border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600">
                  <Radar size={16} />
                  Review rooms
                </button>
              </div>
            </div>
          </section>

          {activeTab === 'command' && overview && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {commandStats.map((stat) => (
                  <div key={stat.key} className="rounded-[2.4rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{stat.label}</div>
                        <div className="mt-3 text-4xl font-bold text-slate-900">{String(overview.stats[stat.key] ?? 0)}</div>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone}`}>
                        <stat.icon size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <ControlFeed
                  title="Recent Member Activity"
                  items={[
                    ...overview.recentUsers.map((user: any) => ({ title: user.displayName, meta: user.email, tone: 'user' })),
                    ...overview.recentDuas.slice(0, 2).map((item: any) => ({ title: item.content, meta: item.displayName, tone: 'care' })),
                  ]}
                />
                <div className="space-y-6">
                  <ControlFeed
                    title="Recent Reflections"
                    items={overview.recentReflections.map((item: any) => ({ title: item.content, meta: item.displayName, tone: 'reflection' }))}
                  />
                  <ControlFeed
                    title="Recent Reports"
                    items={(overview.recentReports || []).map((item: any) => ({ title: item.reason, meta: `${item.target_type} • ${item.status}`, tone: 'report' }))}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <AdminWorkspace
              title="Course Publishing"
              subtitle="Create new learning experiences while reviewing the live course catalog."
              form={
                <>
                  <Field label="Course title">
                    <input className="admin-input" placeholder="Title" value={courseForm.title} onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))} />
                  </Field>
                  <Field label="Description">
                    <textarea className="admin-input min-h-32" placeholder="Description" value={courseForm.description} onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </Field>
                  <Field label="Image URL">
                    <input className="admin-input" placeholder="Image URL" value={courseForm.image} onChange={(e) => setCourseForm((prev) => ({ ...prev, image: e.target.value }))} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Duration">
                      <input className="admin-input" placeholder="Duration" value={courseForm.duration} onChange={(e) => setCourseForm((prev) => ({ ...prev, duration: e.target.value }))} />
                    </Field>
                    <Field label="Category">
                      <input className="admin-input" placeholder="Category" value={courseForm.category} onChange={(e) => setCourseForm((prev) => ({ ...prev, category: e.target.value }))} />
                    </Field>
                  </div>
                  <button disabled={saving} onClick={createCourse} className="admin-primary">
                    <Plus size={16} />
                    Create Course
                  </button>
                </>
              }
              table={
                <AdminRecordTable
                  title="Live Course Catalog"
                  rows={courses.map((course) => ({
                    id: course.id,
                    title: course.title,
                    meta: `${course.category} • ${course.duration} • ${course.students} students`,
                    featured: Boolean(course.is_featured),
                    onDelete: () => removeItem(`/api/admin/courses/${course.id}`),
                    onToggle: () => toggleFeatured(`/api/admin/courses/${course.id}`, course),
                  }))}
                />
              }
            />
          )}

          {activeTab === 'resources' && (
            <AdminWorkspace
              title="Library Management"
              subtitle="Keep the library current, relevant, and worth returning to."
              form={
                <>
                  <Field label="Resource title">
                    <input className="admin-input" placeholder="Title" value={resourceForm.title} onChange={(e) => setResourceForm((prev) => ({ ...prev, title: e.target.value }))} />
                  </Field>
                  <Field label="Description">
                    <textarea className="admin-input min-h-32" placeholder="Description" value={resourceForm.description} onChange={(e) => setResourceForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Author">
                      <input className="admin-input" placeholder="Author" value={resourceForm.author} onChange={(e) => setResourceForm((prev) => ({ ...prev, author: e.target.value }))} />
                    </Field>
                    <Field label="Category slug">
                      <input className="admin-input" placeholder="Category Slug" value={resourceForm.categorySlug} onChange={(e) => setResourceForm((prev) => ({ ...prev, categorySlug: e.target.value }))} />
                    </Field>
                  </div>
                  <button disabled={saving} onClick={createResource} className="admin-primary">
                    <Plus size={16} />
                    Create Resource
                  </button>
                </>
              }
              table={
                <AdminRecordTable
                  title="Published Resources"
                  rows={resources.map((resource) => ({
                    id: resource.id,
                    title: resource.title,
                    meta: `${resource.category.name} • ${resource.resource_type}`,
                    featured: resource.is_featured,
                    onDelete: () => removeItem(`/api/admin/resources/${resource.id}`),
                    onToggle: () => toggleFeatured(`/api/admin/resources/${resource.id}`, resource),
                  }))}
                />
              }
            />
          )}

          {activeTab === 'episodes' && (
            <AdminWorkspace
              title="Audio Programming"
              subtitle="Manage the spoken and audio layer of the platform with more editorial control."
              form={
                <>
                  <Field label="Episode title">
                    <input className="admin-input" placeholder="Title" value={episodeForm.title} onChange={(e) => setEpisodeForm((prev) => ({ ...prev, title: e.target.value }))} />
                  </Field>
                  <Field label="Description">
                    <textarea className="admin-input min-h-32" placeholder="Description" value={episodeForm.description} onChange={(e) => setEpisodeForm((prev) => ({ ...prev, description: e.target.value }))} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Speaker">
                      <input className="admin-input" placeholder="Speaker" value={episodeForm.speaker} onChange={(e) => setEpisodeForm((prev) => ({ ...prev, speaker: e.target.value }))} />
                    </Field>
                    <Field label="Audio URL">
                      <input className="admin-input" placeholder="Audio URL" value={episodeForm.audio_url} onChange={(e) => setEpisodeForm((prev) => ({ ...prev, audio_url: e.target.value }))} />
                    </Field>
                  </div>
                  <button disabled={saving} onClick={createEpisode} className="admin-primary">
                    <Plus size={16} />
                    Create Episode
                  </button>
                </>
              }
              table={
                <AdminRecordTable
                  title="Episode Library"
                  rows={episodes.map((episode) => ({
                    id: episode.id,
                    title: episode.title,
                    meta: `${episode.speaker} • ${episode.duration}`,
                    featured: episode.is_featured,
                    onDelete: () => removeItem(`/api/admin/episodes/${episode.id}`),
                    onToggle: () => toggleFeatured(`/api/admin/episodes/${episode.id}`, episode),
                  }))}
                />
              }
            />
          )}

          {activeTab === 'community' && (
            <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[2.8rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/30">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Community Governance</div>
                    <div className="text-2xl font-bold text-slate-900">Moderation posture</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    'Watch for repetitive low-signal posting',
                    'Protect privacy and emotional safety in replies',
                    'Feature threads that create useful, grounded conversation',
                    'Remove content that undermines adab or member trust',
                  ].map((item) => (
                    <div key={item} className="rounded-[1.8rem] bg-slate-50 p-4 text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <AdminRecordTable
                title="Community Feed Oversight"
                rows={communityPosts.map((post) => ({
                  id: post.id,
                  title: post.title,
                  meta: `${post.category.name} • ${post.author} • ${post.likes} likes`,
                  featured: false,
                  onDelete: () => removeItem(`/api/admin/community-posts/${post.id}`),
                }))}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function AdminWorkspace({
  title,
  subtitle,
  form,
  table,
}: {
  title: string;
  subtitle: string;
  form: ReactNode;
  table: ReactNode;
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="rounded-[2.8rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/30">
        <div className="mb-6 space-y-2">
          <h3 className="text-3xl font-display font-bold text-slate-900">{title}</h3>
          <p className="leading-relaxed text-slate-500">{subtitle}</p>
        </div>
        <div className="space-y-4">{form}</div>
      </div>
      {table}
    </div>
  );
}

function ControlFeed({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; meta?: string; tone?: string }>;
}) {
  return (
    <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
      <div className="mb-5 text-2xl font-bold text-slate-900">{title}</div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[1.8rem] bg-slate-50 p-4 text-slate-500">No recent activity yet.</div>
        ) : (
          items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-[1.8rem] border border-slate-100 bg-slate-50 p-4">
              <div className="font-bold text-slate-900">{item.title}</div>
              {item.meta && <div className="mt-1 text-sm text-slate-500">{item.meta}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AdminRecordTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ id: number; title: string; meta: string; featured?: boolean; onDelete: () => void; onToggle?: () => void }>;
}) {
  return (
    <div className="rounded-[2.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Operational table</div>
          <h3 className="mt-2 text-3xl font-display font-bold text-slate-900">{title}</h3>
        </div>
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-bold text-slate-900">{row.title}</div>
              <div className="mt-1 text-sm text-slate-500">{row.meta}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {row.onToggle && (
                <button
                  onClick={row.onToggle}
                  className={`rounded-[1.2rem] px-4 py-2 font-bold ${row.featured ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  {row.featured ? 'Featured' : 'Feature'}
                </button>
              )}
              <button onClick={row.onDelete} className="inline-flex items-center gap-2 rounded-[1.2rem] bg-rose-50 px-4 py-2 font-bold text-rose-600">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
