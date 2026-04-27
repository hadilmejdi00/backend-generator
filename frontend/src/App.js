import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import GeneratorPage from './pages/GeneratorPage';
import ChatPage from './pages/ChatPage';
import PreviewPage from './pages/PreviewPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#ffffff',
            border: '1px solid #7C3AED',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#7C3AED',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/generator" element={
          <ProtectedRoute><GeneratorPage /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute><ChatPage /></ProtectedRoute>
        } />
        <Route path="/preview" element={
          <ProtectedRoute><PreviewPage /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;