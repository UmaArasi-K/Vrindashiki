import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './store/hooks';

/* Layout */
import Sidebar from './components/Sidebar/Sidebar';

/* Pages */
import Dashboard from './pages/Dashboard/Dashboard';
import TrackPage from './pages/Track/Track';
import StreaksPage from './pages/Streaks/Streaks';
import CommunityPage from './pages/Community/Community';
import SettingsPage from './pages/Settings/Settings';
import LoginPage from './pages/Login/Login';

import './App.css';

/**
 * Protected Route Wrapper
 * Redirects to login if user is not authenticated.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="app-container">
      {/* Show sidebar only if authenticated */}
      {isAuthenticated && <Sidebar />}

      <main className={`main-content ${!isAuthenticated ? 'main-content--full' : ''}`}>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute>
                <TrackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/streaks"
            element={
              <ProtectedRoute>
                <StreaksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
