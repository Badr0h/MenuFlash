import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { AuthProvider } from './api/AuthContext';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import PricingPage from './views/PricingPage';
import AdminOverview from './views/AdminOverview';
import AdminProducts from './views/AdminProducts';
import UserProfile from './views/UserProfile';
import ClientMenuView from './views/ClientMenuView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* FIX MOCK MENU DEMO: Route explicite pour la démo avant la route dynamique */}
            <Route path="/menu/demo" element={<ClientMenuView isDemo={true} />} />
            <Route path="/menu/:id" element={<ClientMenuView isDemo={false} />} />

            {/* Routes Privées Protégées */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin/dashboard" element={<AdminOverview />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              
              {/* FIX PROFILE URL: Alignement exact de l'URL demandée */}
              <Route path="/admin/profile" element={<UserProfile />} />
            </Route>

            {/* Catch-All Route pour éviter l'écran blanc si l'URL est introuvable */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
