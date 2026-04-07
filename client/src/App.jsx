import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ProfileDetail from './pages/ProfileDetail';
import EditProfile from './pages/EditProfile';
import Chat from './pages/Chat';
import ChatInbox from './pages/ChatInbox';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Splash from './components/Splash';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Interests from './pages/Interests';
import Notifications from './pages/Notifications';
import SearchPage from './pages/Search';
import SuccessStories from './pages/SuccessStories';
import Help from './pages/Help';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import MembershipManagement from './pages/admin/MembershipManagement';
import ActivityMonitor from './pages/admin/ActivityMonitor';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Main Site Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/chat/inbox" element={<ProtectedRoute><ChatInbox /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

            {/* New Feature Routes */}
            <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/help" element={<Help />} />

            {/* Redirects to Edit Profile Tabs */}
            <Route path="/edit-preferences" element={<ProtectedRoute><EditProfile defaultTab="partner_pref" /></ProtectedRoute>} />
            <Route path="/horoscope" element={<ProtectedRoute><EditProfile defaultTab="horoscope" /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><EditProfile defaultTab="settings" /></ProtectedRoute>} />
            <Route path="/membership" element={<ProtectedRoute><EditProfile defaultTab="membership" /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="membership" element={<MembershipManagement />} />
            <Route path="activity" element={<ActivityMonitor />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
