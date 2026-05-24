import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useAuth } from '../api/AuthContext';
import Sidebar from '../components/Sidebar';
import QrCodeGenerator from '../components/QrCodeGenerator';
import UpgradeModal from '../components/UpgradeModal';
import {
  Package,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Plus,
  Download,
  Share2,
  Calendar,
  Utensils,
  MousePointer2,
  Users,
  TrendingUp,
  Eye,
  Lock,
  LayoutDashboard
} from 'lucide-react';

const AdminOverview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    
    // 1. INITIALISATION DU STATE AVEC VALEURS PAR DÉFAUT SAINES
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

    // Guard: Si l'utilisateur n'est pas encore chargé, on évite d'exécuter la logique métier
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // 2. RÉCUPÉRATION DES DONNÉES DEPUIS LE BACKEND
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            const productData = Array.isArray(data) ? data : [];
            setProducts(productData);
            
            // Calcul des stats locales à partir des produits
            const categories = new Set(productData.map(p => p.category));
            
            setStats({
                total: productData.length,
                available: productData.filter(p => p.isAvailable).length,
                unavailable: productData.filter(p => !p.isAvailable).length,
                categories: categories.size,
                scans: isPaid ? Math.floor(Math.random() * 45) + 28 : 0, // Mock pour démo
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

    const checkPermission = (e) => {
        if (!isPaid) {
            e?.preventDefault();
            setIsUpgradeModalOpen(true);
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            <Sidebar />

            <UpgradeModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setIsUpgradeModalOpen(false)} 
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-none">{user?.restaurantName || 'Mon Restaurant'}</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Espace de gestion</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-500 font-medium text-xs">
                            <Calendar size={14} />
                            <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Bonjour, {firstName}</h3>
                                <p className="text-slate-500 text-sm mt-1 font-medium">
                                    Voici un aperçu de l'activité de votre restaurant aujourd'hui.
                                </p>
                            </div>
                        </div>

                        {/* 3. SÉCURISATION DU RENDU AVEC OPTIONAL CHAINING */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {[
                                { label: "Articles au Menu", value: stats?.total || 0, icon: <Package />, color: "indigo" },
                                { label: "Scans Aujourd'hui", value: stats?.scans || 0, icon: <Eye />, color: "emerald" },
                                { label: "Catégories", value: stats?.categories || 0, icon: <LayoutGrid />, color: "violet" },
                                { label: "Croissance", value: stats?.growth || "+0%", icon: <TrendingUp />, color: "amber" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
                                    <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                                        {React.cloneElement(stat.icon, { size: 20 })}
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* QR Code Section - FEATURE GATED */}
                            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center relative overflow-hidden">
                                <h4 className="text-sm font-bold text-slate-900 mb-6 self-start">Smart QR Menu</h4>
                                
                                <div className="relative w-full aspect-square flex items-center justify-center mb-8">
                                    <div className={`w-full h-full bg-slate-50 rounded-xl p-8 flex items-center justify-center border border-slate-100 shadow-inner transition-all duration-700 ${!isPaid ? 'blur-md opacity-40' : ''}`}>
                                        <QrCodeGenerator url={`${window.location.origin}/menu/demo`} />
                                    </div>
                                    
                                    {!isPaid && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg mb-3">
                                                <Lock size={20} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 leading-tight">Fonctionnalité Premium</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Activez votre abonnement pour générer le QR Code</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 w-full">
                                    <button 
                                        onClick={checkPermission}
                                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center"
                                    >
                                        {!isPaid && <Lock size={14} className="mr-1.5" />}
                                        Télécharger le QR
                                    </button>
                                    <button 
                                        onClick={checkPermission}
                                        className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                                    >
                                        Lien public
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions & Recent */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-sm font-bold text-slate-900">Actions rapides</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => isPaid ? navigate('/admin/products') : setIsUpgradeModalOpen(true)}
                                            className="p-6 bg-indigo-50/30 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 transition-all group border-dashed text-left"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <Plus className="text-indigo-600" size={24} />
                                                {!isPaid && <Lock size={14} className="text-indigo-300" />}
                                            </div>
                                            <p className="font-bold text-slate-900 text-sm">Ajouter un produit</p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Mise à jour instantanée du menu</p>
                                        </button>
                                        <Link to="/menu/demo" className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all group">
                                            <MousePointer2 className="text-slate-600 mb-3" size={24} />
                                            <p className="font-bold text-slate-900 text-sm">Aperçu Menu</p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Voir ce que voient vos clients</p>
                                        </Link>
                                    </div>
                                </div>

                                {/* Availability Focus */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                                    <h4 className="text-sm font-bold text-slate-900 mb-6">Articles en rupture</h4>
                                    <div className="space-y-3">
                                        {products.filter(p => !p.isAvailable).slice(0, 3).map(product => (
                                            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200">
                                                        {product.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{product.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.category}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={checkPermission}
                                                    className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider flex items-center"
                                                >
                                                    {!isPaid && <Lock size={10} className="mr-1" />}
                                                    Réapprovisionner
                                                </button>
                                            </div>
                                        ))}
                                        {products.filter(p => !p.isAvailable).length === 0 && !loading && (
                                            <div className="py-6 text-center bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                                                <p className="text-emerald-600 font-bold text-xs italic">Tous vos articles sont disponibles !</p>
                                            </div>
                                        )}
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
