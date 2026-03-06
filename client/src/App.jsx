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

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
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
          </Route>

          {/* Admin Routes */}
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
