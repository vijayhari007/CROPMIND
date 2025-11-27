import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { useActivityTracker } from './hooks/useActivityTracker';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Recommendation from './pages/Recommendation';
import SoilAnalysis from './pages/SoilAnalysis';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Advisor from './pages/Advisor';
import GovernmentSchemes from './pages/GovernmentSchemes';
import InteractiveFarmGame from './pages/InteractiveFarmGame';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Community from './pages/community/Community';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return children;
};

function AppContent() {
  // Track page views
  useActivityTracker();
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/advisor" element={<Advisor />} />
          <Route path="/soil-analysis" element={<SoilAnalysis />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/farming-game" element={<InteractiveFarmGame />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

// Wrap the app with Router and AuthProvider in the correct order
function AppWithRouter() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppWithRouter />
    </I18nProvider>
  );
}

export default App;