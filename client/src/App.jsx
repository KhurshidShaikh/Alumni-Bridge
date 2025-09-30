import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProfileEdit from './pages/ProfileEdit';
import AlumniPage from './pages/AlumniPage';
import AlumniDetailPage from './pages/AlumniDetailPage';
import ConnectionsPage from './pages/ConnectionsPage';
import JobDetailPage from './pages/JobDetailPage';
import JobPostPage from './pages/JobPostPage';
import MyJobsPage from './pages/MyJobsPage';
import JobApplicationsPage from './pages/JobApplicationsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MessagesListPage from './pages/MessagesListPage';
import ChatPage from './pages/ChatPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import NewsStoriesPage from './pages/NewsStoriesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';

// Admin Components
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import AdminMessaging from './pages/Admin/AdminMessaging';
import EventManagement from './pages/Admin/EventManagement';
import Analytics from './pages/Admin/Analytics';
import BulkImport from './pages/Admin/BulkImport';
import AdminLogs from './pages/Admin/AdminLogs';
import ContentManagement from './pages/Admin/ContentManagement';

// Component to conditionally render chatbot
const ChatbotWrapper = () => {
  const location = useLocation();
  
  // Don't show chatbot on public routes, admin routes, or landing page
  const hideChatbotRoutes = ['/', '/login', '/register'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldShowChatbot = !hideChatbotRoutes.includes(location.pathname) && !isAdminRoute;
  
  return shouldShowChatbot ? <Chatbot /> : null;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Profile Edit Route - Accessible to authenticated users */}
          <Route path="/profile/edit/:id" element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes - Require complete profile */}
          <Route path="/home" element={
            <ProtectedRoute requireProfileComplete={true}>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireProfileComplete={true}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/alumni" element={
            <ProtectedRoute requireProfileComplete={true}>
              <AlumniPage />
            </ProtectedRoute>
          } />
          <Route path="/alumni/:alumniId" element={
            <ProtectedRoute requireProfileComplete={true}>
              <AlumniDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/connections" element={
            <ProtectedRoute requireProfileComplete={true}>
              <ConnectionsPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute requireProfileComplete={true}>
              <MessagesListPage />
            </ProtectedRoute>
          } />
          <Route path="/chat/:conversationId" element={
            <ProtectedRoute requireProfileComplete={true}>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/chat/user/:userId" element={
            <ProtectedRoute requireProfileComplete={true}>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute requireProfileComplete={true}>
              <JobsPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs/post" element={
            <ProtectedRoute requireProfileComplete={true}>
              <JobPostPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs/my-jobs" element={
            <ProtectedRoute requireProfileComplete={true}>
              <MyJobsPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs/my-applications" element={
            <ProtectedRoute requireProfileComplete={true}>
              <MyApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:jobId/applications" element={
            <ProtectedRoute requireProfileComplete={true}>
              <JobApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:jobId" element={
            <ProtectedRoute requireProfileComplete={true}>
              <JobDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute requireProfileComplete={true}>
              <EventsPage />
            </ProtectedRoute>
          } />
          <Route path="/news-stories" element={
            <ProtectedRoute requireProfileComplete={true}>
              <NewsStoriesPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/messages" element={<AdminMessaging />} />
          <Route path="/admin/events" element={<EventManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/content" element={<ContentManagement />} />
          <Route path="/admin/bulk-import" element={<BulkImport />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          
          {/* Catch all route - 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        {/* Chatbot - Available on protected routes only */}
        <ChatbotWrapper />
      </div>
    </Router>
  );
}

export default App;
