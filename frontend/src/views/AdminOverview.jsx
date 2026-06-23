import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useAuth } from '../api/AuthContext';
import Sidebar from '../components/Sidebar';
import QrCodeGenerator from '../components/QrCodeGenerator';
import UpgradeModal from '../components/UpgradeModal';
import {
  Package,
  LayoutGrid,
  Plus,
  Download,
  Calendar,
  TrendingUp,
  Eye,
  Lock,
  LayoutDashboard,
  ExternalLink,
  Sliders,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Power,
  Copy,
  CheckCircle2,
  Share2,
  QrCode
} from 'lucide-react';

const AdminOverview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [copied, setCopying] = useState(false);
    
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        unavailable: 0,
        categories: 0,
        scans: 0,
        growth: "+0%"
    });

    const firstName = user?.firstName || 'Utilisateur';
    const isPaid = user?.isPaid;
    const menuUrl = `${window.location.origin}/menu/demo`;

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            const productData = Array.isArray(data) ? data : [];
            setProducts(productData);
            
            const categories = new Set(productData.map(p => p.category?.name).filter(Boolean));
            
            setStats({
                total: productData.length,
                available: productData.filter(p => p.isAvailable).length,
                unavailable: productData.filter(p => !p.isAvailable).length,
                categories: categories.size,
                scans: isPaid ? Math.floor(Math.random() * 45) + 28 : 0,
                growth: isPaid ? "+18%" : "+0%"
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [isPaid]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(menuUrl);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    const checkPermission = (e) => {
        if (!isPaid) {
            e?.preventDefault();
            setIsUpgradeModalOpen(true);
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans text-left">
            <Sidebar />

            <UpgradeModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setIsUpgradeModalOpen(false)} 
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto">
                        
                        {/* 1. MODERN HEADER HUB */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div className="text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bonjour, {firstName}</h1>
                                </div>
                                <p className="text-slate-400 font-medium text-lg ml-5">Pilotez votre restaurant en temps réel.</p>
                            </div>
                            <div className="flex items-center gap-3 ml-5 md:ml-0">
                                <div className="flex flex-col items-end mr-4 hidden sm:flex">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut Serveur</span>
                                    <span className="flex items-center text-emerald-500 text-xs font-bold">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                                        Opérationnel
                                    </span>
                                </div>
                                <button onClick={fetchDashboardData} className="p-4 bg-white border border-stone-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-indigo-600">
                                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>

                        {/* 2. KPI WIDGETS (Sleek & Visual) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                { label: "Menu Live", value: stats?.total, sub: "articles actifs", icon: <Package />, color: "indigo" },
                                { label: "Portée", value: stats?.scans, sub: "scans aujourd'hui", icon: <Eye />, color: "emerald" },
                                { label: "Structure", value: stats?.categories, sub: "catégories créées", icon: <LayoutGrid />, color: "amber" },
                                { label: "Performance", value: stats?.growth, sub: "vs mois dernier", icon: <TrendingUp />, color: "purple" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50/50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                                    <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative`}>
                                        {React.cloneElement(stat.icon, { size: 28, strokeWidth: 2.5 })}
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter relative">{stat.value}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 relative">{stat.label}</p>
                                    <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{stat.sub}</span>
                                        <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 3. MAIN DASHBOARD CONTENT (GRID 12 COLS) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* COLONNE GAUCHE : COMMAND CENTER (8 Cols) */}
                            <div className="lg:col-span-8 space-y-8">
                                
                                {/* QUICK ACTIONS HUB */}
                                <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-10 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Commandes Rapides</h2>
                                                <p className="text-slate-400 text-sm font-medium mt-1">Actions prioritaires pour votre établissement.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <button 
                                                onClick={() => isPaid ? navigate('/admin/products') : setIsUpgradeModalOpen(true)}
                                                className="p-8 bg-slate-900 text-white rounded-[2.5rem] hover:bg-indigo-600 transition-all group shadow-2xl shadow-slate-200 text-left flex flex-col justify-between min-h-[220px]"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                        <Plus className="text-white" size={32} strokeWidth={3} />
                                                    </div>
                                                    {!isPaid && <Lock size={20} className="text-white/40" />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-xl tracking-tight">Ajouter un Article</p>
                                                    <p className="text-xs text-white/50 font-medium mt-1">Mise à jour instantanée du menu live.</p>
                                                </div>
                                            </button>

                                            <button 
                                                onClick={() => navigate('/admin/categories')}
                                                className="p-8 bg-white border border-stone-200 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-xl transition-all group text-left flex flex-col justify-between min-h-[220px]"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        <LayoutGrid size={28} strokeWidth={2.5} />
                                                    </div>
                                                    <ChevronRight className="text-stone-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-xl tracking-tight">Gérer les Catégories</p>
                                                    <p className="text-xs text-slate-400 font-medium mt-1">Organisez vos plats par sections.</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* STOCK & AVAILABILITY MONITOR */}
                                <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                                <AlertCircle size={20} />
                                            </div>
                                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Ruptures de Stock</h2>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-stone-100">Synchronisé</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {products.filter(p => !p.isAvailable).length > 0 ? (
                                            products.filter(p => !p.isAvailable).slice(0, 4).map(product => (
                                                <div key={product.id} className="flex items-center justify-between p-5 bg-stone-50/50 rounded-2xl border border-stone-100 hover:border-indigo-100 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm shrink-0">
                                                            {product.imageUrl ? (
                                                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300 font-black">
                                                                    {product.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-black text-slate-900 truncate max-w-[120px]">{product.name}</p>
                                                            <p className="text-[10px] text-rose-500 font-black uppercase tracking-wider mt-0.5">Épuisé</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => navigate('/admin/products')}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Réapprovisionner"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-emerald-50/30 rounded-[2rem] border border-emerald-100/50">
                                                <CheckCircle2 size={40} className="text-emerald-500 mb-4" />
                                                <p className="text-slate-900 font-black text-lg tracking-tight">Inventaire Impeccable</p>
                                                <p className="text-slate-500 text-sm font-medium mt-1">Tous vos articles sont actuellement disponibles.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* COLONNE DROITE : DISTRIBUTION HUB (4 Cols) */}
                            <div className="lg:col-span-4 space-y-8">
                                
                                {/* MODERN QR HUB - FLAT DESIGN */}
                                <div className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-slate-100 p-10 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
                                    
                                    <div className="w-full flex items-center justify-between mb-10">
                                        <div className="text-left">
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight">QR Identité</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Menu Link</p>
                                        </div>
                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                            <QrCode size={20} />
                                        </div>
                                    </div>

                                    <div className="relative group cursor-pointer mb-10">
                                        <div className={`p-6 bg-[#FDFDFC] rounded-[3.5rem] border-2 border-dashed border-stone-100 transition-all group-hover:border-indigo-600 group-hover:bg-white shadow-inner ${!isPaid ? 'blur-md opacity-20' : ''}`}>
                                            <QrCodeGenerator url={menuUrl} size={160} />
                                        </div>
                                        
                                        {!isPaid && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                                <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-2xl mb-4">
                                                    <Lock size={24} strokeWidth={3} />
                                                </div>
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Premium Hub</p>
                                            </div>
                                        )}
                                        
                                        {isPaid && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                    Agrandir
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full space-y-4">
                                        <div className="flex items-center gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                            <div className="flex-1 truncate text-[10px] font-mono text-slate-400 text-left lowercase">{menuUrl}</div>
                                            <button 
                                                onClick={copyToClipboard}
                                                className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm'}`}
                                            >
                                                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        <button 
                                            onClick={checkPermission}
                                            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 group"
                                        >
                                            <Download size={18} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
                                            Télécharger QR
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => navigate('/menu/demo')}
                                                className="py-4 bg-white border border-stone-200 text-slate-600 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink size={14} /> Aperçu
                                            </button>
                                            <button 
                                                onClick={checkPermission}
                                                className="py-4 bg-white border border-stone-200 text-slate-600 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Sliders size={14} /> Style
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* SMART TIP CARD */}
                                <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10 text-left">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                                            <TrendingUp size={20} strokeWidth={3} />
                                        </div>
                                        <h4 className="text-lg font-black tracking-tight mb-3 uppercase">Le saviez-vous ?</h4>
                                        <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
                                            Les menus digitaux avec des visuels de haute qualité augmentent les ventes de 27% en moyenne. Explorez notre médiathèque pour sublimer votre carte.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminOverview;
