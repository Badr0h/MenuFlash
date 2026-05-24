import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../api/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@menuflash.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        console.log('Tentative de connexion avec:', email);
        const user = await login(email, password);
        console.log('Connexion réussie, rôle:', user.role, 'Payé:', user.isPaid);
        
        // Role-based routing (Plus de redirection forcée vers le pricing)
        if (user.role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (user.role === 'CLIENT') {
            navigate('/menu/demo');
        } else {
            navigate('/');
        }
    } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Invalid email or password. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2.5 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Menu<span className="text-indigo-600">Flash</span></span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 tracking-tight">Bon retour parmi nous</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Connectez-vous pour gérer votre menu digital.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 flex items-center animate-in fade-in slide-in-from-top-1">
              <Zap size={14} className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Adresse Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                  placeholder="nom@restaurant.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Mot de passe</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
               <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-xs font-medium text-slate-500">Rester connecté</span>
               </label>
               <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Oublié ?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center group disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight className="ml-2 group-hover:translate-x-0.5 transition-transform" size={16} />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Pas encore de compte ? <Link to="/register" className="text-indigo-600 font-bold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
