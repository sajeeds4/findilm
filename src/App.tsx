import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';
import Auth from './components/Auth';
import Assistant from './components/Assistant';
import DuaSupport from './components/DuaSupport';
import PrayerTimes from './components/PrayerTimes';
import Quran from './components/Quran';
import KnowledgeHub from './components/KnowledgeHub';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Courses from './components/Courses';
import AudioPodcasts from './components/AudioPodcasts';
import WomenSection from './components/WomenSection';
import RevertSupport from './components/RevertSupport';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/prayer" element={<PrayerTimes />} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/audio-podcasts" element={<AudioPodcasts />} />
            <Route path="/women-section" element={<WomenSection />} />
            <Route path="/revert-support" element={<RevertSupport />} />
            <Route path="/dua" element={<DuaSupport />} />
            <Route path="/community" element={<Community />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
