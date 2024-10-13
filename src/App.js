// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext'; // Ensure the path is correct
import WelcomePage from './pages/WelcomePage';
import PhoneAuth from './components/PhoneAuth';
import Dashboard from './components/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ProfileSetup from './pages/ProfileSetup'; // Import the new ProfileSetup component
import { ToastContainer } from 'react-toastify'; // Optional: For toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Optional: Toast styles

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer /> {/* Optional: Enables toast notifications */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/sign-in" element={<PhoneAuth />} />

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

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
