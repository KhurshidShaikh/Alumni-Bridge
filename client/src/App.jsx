import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import MessagesListPage from './pages/MessagesListPage';
import ChatPage from './pages/ChatPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import MentorshipPage from './pages/MentorshipPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/events" element={
            <ProtectedRoute requireProfileComplete={true}>
              <EventsPage />
            </ProtectedRoute>
          } />
          <Route path="/mentorship" element={
            <ProtectedRoute requireProfileComplete={true}>
              <MentorshipPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requireProfileComplete={true}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Require authentication */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          
          {/* Catch all route - 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
