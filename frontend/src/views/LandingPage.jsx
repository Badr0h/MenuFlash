import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { 
  Zap, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  Clock,
  ShieldCheck,
  ChevronRight,
  MousePointer2
} from 'lucide-react';

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePricingAction = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else if (!user.isPaid) {
      navigate('/pricing');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Zap className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Menu<span className="text-indigo-600">Flash</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 transition-colors">Fonctionnalités</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 transition-colors">Comment ça marche</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 transition-colors">Tarifs</button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/admin/dashboard" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Connexion</Link>
                <Link to="/register" className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-sm">
                  Essai Gratuit
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Nouveauté : QR Code Statique</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Votre Menu Digital <br />
              <span className="text-indigo-600 italic">en 60 secondes.</span>
            </h1>
            
            <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
              Transformez l'expérience de vos clients avec un menu QR Code élégant, 
              instantané et facile à gérer. Augmentez vos ventes et libérez votre personnel.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to={isAuthenticated ? "/admin/dashboard" : "/register"} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center group">
                {isAuthenticated ? "Accéder au Dashboard" : "Commencer gratuitement"}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button onClick={() => scrollToSection('how-it-works')} className="w-full sm:w-auto px-8 py-4 text-slate-600 font-bold hover:text-slate-900 transition-colors flex items-center justify-center">
                Voir la démo
              </button>
            </div>

            <div className="flex items-center space-x-6 pt-4 opacity-50 grayscale contrast-125">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            </div>
          </div>

          <div className="relative lg:block hidden">
             <div className="absolute inset-0 bg-indigo-100 rounded-[3rem] rotate-3 -z-10 blur-2xl opacity-30"></div>
             <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-4 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" 
                  alt="Restaurant Dashboard" 
                  className="rounded-[2rem] shadow-sm border border-slate-200"
                />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <BarChart3 size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ventes du jour</p>
                      <p className="text-lg font-bold text-slate-900">+24%</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Conçu pour la restauration moderne.</h2>
            <p className="text-slate-500 font-medium">Tout ce dont vous avez besoin pour digitaliser votre établissement sans complexité technique.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <QrCode size={24} />, 
                title: "Générateur QR Pro", 
                desc: "Créez des QR codes esthétiques et durables que vos clients adoreront scanner." 
              },
              { 
                icon: <Layers size={24} />, 
                title: "Gestion de Stock", 
                desc: "Mettez à jour vos ruptures en un clic depuis votre téléphone, directement en cuisine." 
              },
              { 
                icon: <Smartphone size={24} />, 
                title: "Expérience Gourmet", 
                desc: "Un menu fluide et appétissant qui met en valeur vos plats sur tous les écrans." 
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
               <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden">
                  <div className="aspect-[9/16] bg-white rounded-[2.5rem] overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" 
                      alt="Menu mobile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                     <MousePointer2 className="text-white animate-bounce" size={48} />
                  </div>
               </div>
            </div>
            
            <div className="space-y-10 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Une mise en place en 3 étapes.</h2>
              
              <div className="space-y-8">
                {[
                  { step: "01", title: "Inscrivez votre restaurant", desc: "Créez votre compte en quelques secondes et renseignez vos informations." },
                  { step: "02", title: "Ajoutez vos produits", desc: "Importez vos plats, descriptions et prix sur votre interface intuitive." },
                  { step: "03", title: "Imprimez vos QR Codes", desc: "Placez les QR codes sur vos tables et laissez la magie opérer." }
                ].map((s, i) => (
                  <div key={i} className="flex items-start space-x-5">
                    <span className="text-3xl font-black text-indigo-100">{s.step}</span>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Un prix simple, sans surprise.</h2>
            <p className="text-slate-500 font-medium">Tout le nécessaire pour transformer votre restaurant, pour le prix d'un café par jour.</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] border-2 border-indigo-600 p-10 shadow-xl relative overflow-hidden group">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                        Accès Illimité
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-4 tracking-tight">Plan Unique Premium</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">150 DH</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">par mois</p>
                  </div>
               </div>

               <div className="space-y-4 mb-10">
                  {[
                    "Menus numériques illimités",
                    "QR Codes haute résolution",
                    "Mise à jour instantanée des prix",
                    "Gestion des stocks en temps réel",
                    "Support prioritaire 24/7",
                    "Analyses de performance"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="bg-emerald-50 p-0.5 rounded-full">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                      <span className="text-slate-600 font-medium text-xs">{feat}</span>
                    </div>
                  ))}
               </div>

               <button 
                  onClick={handlePricingAction}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center group"
               >
                  {isAuthenticated ? (user.isPaid ? "Dashboard" : "S'abonner maintenant") : "Commencer l'essai gratuit"}
                  <ChevronRight className="ml-2 group-hover:translate-x-0.5 transition-transform" size={18} />
               </button>

               <div className="mt-6 flex items-center justify-center space-x-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Sans engagement - Annulable à tout moment</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale contrast-200">
             <span className="text-2xl font-black italic tracking-tighter">BISTRO.CO</span>
             <span className="text-2xl font-black italic tracking-tighter">GRILL HOUSE</span>
             <span className="text-2xl font-black italic tracking-tighter">CAFÉ ATLAS</span>
             <span className="text-2xl font-black italic tracking-tighter">SUSHI ZEN</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Zap className="text-indigo-600" size={16} fill="currentColor" />
            <span className="text-sm font-bold tracking-tight text-slate-900">© 2026 MenuFlash</span>
          </div>
          <div className="flex items-center space-x-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
