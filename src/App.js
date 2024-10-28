// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import WelcomePage from './pages/WelcomePage';
import PhoneAuth from './components/PhoneAuth/PhoneAuth';
import Dashboard from './components/Dashboard/Dashboard';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import ProfileSetup from './pages/ProfileSetup';
import DumpDetails from './components/DumpDetails/DumpDetails';
import PublicDumpDetails from './components/PublicDumpDetails/PublicDumpDetails'; // New import
import SettingsPage from './pages/SettingsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/sign-in" element={<PhoneAuth />} />
          {/* Public Profile Route */}
          <Route path="/user/:uid" element={<PublicProfilePage />} />
          {/* Public Dump Details Route */}
          <Route path="/dump/:dumpId" element={<PublicDumpDetails />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          {/* Protected Dump Details Route (optional) */}
          <Route
            path="/protected-dump/:dumpId"
            element={
              <PrivateRoute>
                <DumpDetails />
              </PrivateRoute>
            }
          />

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
