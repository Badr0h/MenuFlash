import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  Clock,
  DollarSign,
  Users,
  UtensilsCrossed,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Globe,
  Star,
  Plus
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Zap className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Menu<span className="text-indigo-600">Flash</span></span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-50/50 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-50/50 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.95]">
            Digital Menus <br />
            <span className="text-indigo-600">For Modern Restaurants</span>
          </h1>

          <p className="text-xl lg:text-2xl text-slate-500 mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
            Create QR-based menus in seconds. Update prices instantly. No printing costs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center group">
              Start Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link to="/menu/demo" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black hover:bg-slate-50 transition-all flex items-center justify-center">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Why MenuFlash - Problem/Solution */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Why MenuFlash?</h2>
            <p className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Stop printing menus. Start updating instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <DollarSign size={24}/>, 
                title: "Save Money", 
                desc: "No more printing costs. Update prices instantly."
              },
              { 
                icon: <Clock size={24}/>, 
                title: "Real-time Updates", 
                desc: "Change availability in seconds, not days."
              },
              { 
                icon: <Smartphone size={24}/>, 
                title: "Touchless Experience", 
                desc: "Modern QR-based menus for health-conscious guests."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Pricing</h2>
          <p className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-8">Simple. No hidden fees.</p>

          <div className="bg-white rounded-3xl border-2 border-indigo-600 p-10 shadow-xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">150 DH / month</h3>
            <p className="text-slate-500 font-medium mb-8">Everything you need to run your digital menu</p>

            <div className="space-y-3 mb-8 text-left">
              {[
                "Unlimited menu updates",
                "QR code generation",
                "Real-time availability",
                "Mobile-optimized design"
              ].map((feat, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <CheckCircle2 size={18} className="text-indigo-600" />
                  <span className="text-slate-700 font-bold">{feat}</span>
                </div>
              ))}
            </div>

            <Link to="/register" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">
            Ready to modernize your menu?
          </h2>
          <Link to="/register" className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all">
            Start Free Trial
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2026 MenuFlash. Digital menus for modern restaurants.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
