import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import AdminOverview from './views/AdminOverview';
import AdminProducts from './views/AdminProducts';
import ClientMenuView from './views/ClientMenuView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin">
            <Route path="dashboard" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminOverview />
              </ProtectedRoute>
            } />
            <Route path="products" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          
          {/* Client Routes */}
          <Route path="/menu/:restaurantId" element={<ClientMenuView />} />
          {/* Demo menu route */}
          <Route path="/menu/demo" element={<ClientMenuView />} />
          
          {/* 404 Catch-all */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
              <h1 className="text-[12rem] font-black leading-none italic tracking-tighter opacity-10 absolute pointer-events-none">404</h1>
              <div className="bg-indigo-600 p-4 rounded-3xl mb-8 shadow-2xl shadow-indigo-500/20 rotate-3">
                <Zap size={64} className="text-white" />
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-4">Signal Lost</h2>
              <p className="text-slate-400 font-medium text-center max-w-sm mb-12">The page you're looking for has moved to another dimension or never existed in this one.</p>
              <a href="/" className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-xl">
                Return to Landing
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
