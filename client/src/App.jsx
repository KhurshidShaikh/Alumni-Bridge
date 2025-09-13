import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AlumniPage from './pages/AlumniPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import MentorshipPage from './pages/MentorshipPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes - will add authentication later */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/mentorship" element={<MentorshipPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Admin Routes - will add admin authentication later */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Catch all route - 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
