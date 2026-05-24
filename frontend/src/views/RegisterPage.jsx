import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../api/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    restaurantName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Tentative d\'inscription avec:', formData.email);
      const user = await register(formData);
      console.log('Inscription réussie');
      
      // On redirige vers le dashboard, même s'il n'a pas encore payé (Mode Freemium)
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
      <div className="w-full max-w-[500px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2.5 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Menu<span className="text-indigo-600">Flash</span></span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 tracking-tight">Créez votre compte</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Commencez votre essai gratuit de 14 jours.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 flex items-center animate-in fade-in slide-in-from-top-1">
              <Zap size={14} className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Prénom</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                  placeholder="Jean"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Nom</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Nom du Restaurant</label>
              <input 
                type="text" 
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                placeholder="Le Petit Bistro"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Adresse Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                placeholder="jean@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Mot de passe</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm placeholder:text-slate-300"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start space-x-3 px-1 pt-1">
               <input type="checkbox" className="mt-1 w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
               <span className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  J'accepte les <a href="#" className="text-indigo-600 hover:underline">Conditions d'utilisation</a> et la <a href="#" className="text-indigo-600 hover:underline">Politique de confidentialité</a>.
               </span>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center group disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
              {!loading && <ArrowRight className="ml-2 group-hover:translate-x-0.5 transition-transform" size={18} />}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
             <ShieldCheck size={14} />
             <span>Connexion SSL Sécurisée</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Déjà un compte ? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
