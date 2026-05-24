import React from 'react';
import { useAuth } from '../api/AuthContext';
import Sidebar from '../components/Sidebar';
import { User, Mail, Utensils, Shield, LogOut, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will be handled by ProtectedRoute
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-none">Mon Compte</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Paramètres du profil</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Profil Utilisateur</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Gérez vos informations personnelles et celles de votre établissement.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                            <div className="p-8">
                                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-50">
                                    <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{user?.firstName} {user?.lastName}</h4>
                                        <p className="text-slate-400 text-xs font-medium flex items-center mt-0.5">
                                            <Shield size={12} className="mr-1.5 text-indigo-500" />
                                            Administrateur MenuFlash
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Prénom</label>
                                        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm flex items-center">
                                            {user?.firstName}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Nom</label>
                                        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm flex items-center">
                                            {user?.lastName}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Email</label>
                                        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm flex items-center">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Établissement</label>
                                        <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm flex items-center">
                                            {user?.restaurantName}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex justify-end">
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-rose-600 font-bold text-xs hover:bg-rose-50 rounded-lg transition-all flex items-center group"
                                >
                                    <LogOut size={14} className="mr-2" />
                                    Se déconnecter de la plateforme
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-md">
                             <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h4 className="text-base font-bold tracking-tight mb-1">Besoin d'assistance ?</h4>
                                    <p className="text-indigo-100 font-medium text-xs max-w-xs">Notre équipe support est disponible 24/7 pour vous accompagner.</p>
                                </div>
                                <button className="px-5 py-2 bg-white text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-50 transition-all shadow-sm">
                                    Contacter le support
                                </button>
                             </div>
                             <Zap className="absolute -bottom-6 -right-6 text-white opacity-10" size={120} fill="currentColor" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;
