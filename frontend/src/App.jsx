import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Sidebar from './components/Sidebar';
import BadgeUnlockModal from './components/BadgeUnlockModal';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SkillGap from './pages/SkillGap';
import CSFundamentals from './pages/CSFundamentals';
import InterviewSimulator from './pages/InterviewSimulator';
import CompanyPrep from './pages/CompanyPrep';
import AdvancedProjects from './pages/AdvancedProjects';
import Revision from './pages/Revision';
import Aptitude from './pages/Aptitude';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Contests from './pages/Contests';
import Roadmap from './pages/Roadmap';
import TopicDetails from './pages/TopicDetails';
import ProblemView from './pages/ProblemView';
import FeatureMockView from './pages/FeatureMockView';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Admin from './pages/Admin';
import GritCenter from './pages/GritCenter';
import AIMentor from './pages/AIMentor';
import Companies from './pages/Companies';
import InterviewCenter from './pages/InterviewCenter';
import ResumeBuilder from './pages/ResumeBuilder';
import Achievements from './pages/Achievements';
import CareerReport from './pages/CareerReport';
import Leaderboard from './pages/Leaderboard';
import GlobalSearch from './components/GlobalSearch';
import AIAssistantFloatingWidget from './components/AIAssistantFloatingWidget';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verifying session token...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-screen bg-brand-bg flex overflow-hidden">
      <GlobalSearch />
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto relative lg:p-0 pt-16">
        {children}
      </div>
      {/* Global Badge Unlock Overlay Trigger */}
      <BadgeUnlockModal />
      {/* Global Floating AI Companion Assistant Widget */}
      <AIAssistantFloatingWidget />
    </div>
  );
};

// Public Route Guard (Redirects away from landing to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            {/* Public Landing & Sign-in */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />

            {/* Protected Student Console Pages */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skill-gap" 
              element={
                <ProtectedRoute>
                  <SkillGap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cs-fundamentals" 
              element={
                <ProtectedRoute>
                  <CSFundamentals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview-simulator" 
              element={
                <ProtectedRoute>
                  <InterviewSimulator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company-prep" 
              element={
                <ProtectedRoute>
                  <CompanyPrep />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advanced-projects" 
              element={
                <ProtectedRoute>
                  <AdvancedProjects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/revision" 
              element={
                <ProtectedRoute>
                  <Revision />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/aptitude" 
              element={
                <ProtectedRoute>
                  <Aptitude />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume-analyzer" 
              element={
                <ProtectedRoute>
                  <ResumeAnalyzer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contests" 
              element={
                <ProtectedRoute>
                  <Contests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roadmap" 
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/topic/:slug" 
              element={
                <ProtectedRoute>
                  <TopicDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/problem/:problemId" 
              element={
                <ProtectedRoute>
                  <ProblemView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/feature/:type/:topic" 
              element={
                <ProtectedRoute>
                  <FeatureMockView />
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
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/grit-center" 
              element={
                <ProtectedRoute>
                  <GritCenter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentor" 
              element={
                <ProtectedRoute>
                  <AIMentor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies" 
              element={
                <ProtectedRoute>
                  <Companies />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interviews" 
              element={
                <ProtectedRoute>
                  <InterviewCenter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume" 
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/awards" 
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <CareerReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />

            {/* Fallback routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
