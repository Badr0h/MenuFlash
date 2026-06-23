import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../services/categoryService';
import { useAuth } from '../api/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Layers,
  Plus,
  Trash2,
  LayoutDashboard,
  Calendar,
  FolderPlus,
  AlertCircle,
  RefreshCw,
  Search,
  Lock
} from 'lucide-react';

const AdminCategories = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isPaid = user?.isPaid;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!isPaid) {
            alert("Abonnement Premium requis pour créer des catégories.");
            return;
        }
        if (!newCategoryName.trim()) return;

        setIsSubmitting(true);
        try {
            await categoryService.createCategory({ name: newCategoryName });
            setNewCategoryName('');
            fetchCategories();
        } catch (err) {
            console.error('Failed to create category:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!isPaid) {
            alert("Abonnement Premium requis pour modifier les catégories.");
            return;
        }
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            await categoryService.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center">
                            <Layers size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-none">Gestion des Catégories</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{user?.restaurantName || 'Mon Restaurant'}</p>
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
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Vos Catégories</h3>
                                <p className="text-slate-500 text-sm mt-1 font-medium">
                                    Organisez votre menu pour une navigation fluide.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Create Category Section */}
                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sticky top-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-indigo-50 p-2 rounded-lg">
                                                <FolderPlus size={18} className="text-indigo-700" />
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-900">Nouvelle Catégorie</h4>
                                        </div>
                                        {!isPaid && <Lock size={14} className="text-amber-600" />}
                                    </div>

                                    <form onSubmit={handleCreateCategory} className="space-y-4">
                                        <div className={!isPaid ? 'opacity-50 grayscale pointer-events-none' : ''}>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                                Nom de la catégorie
                                            </label>
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                placeholder={isPaid ? "Ex: Entrées, Boissons Chaudes..." : "Option Premium"}
                                                className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-indigo-700/20 focus:border-indigo-700 outline-none transition-all text-sm font-medium"
                                                required={isPaid}
                                                disabled={!isPaid}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !newCategoryName.trim() || !isPaid}
                                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : (isPaid ? "Créer la catégorie" : "Débloquer Premium")}
                                        </button>
                                    </form>

                                    <div className={`mt-8 p-4 rounded-xl border flex items-start space-x-3 ${isPaid ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-amber-50 border-amber-100'}`}>
                                        {isPaid ? (
                                            <AlertCircle size={16} className="text-indigo-700 mt-0.5 shrink-0" />
                                        ) : (
                                            <Lock size={16} className="text-amber-700 mt-0.5 shrink-0" />
                                        )}
                                        <p className={`text-[11px] leading-relaxed font-medium ${isPaid ? 'text-indigo-800' : 'text-amber-800'}`}>
                                            {isPaid 
                                                ? "Les catégories permettent de grouper vos produits sur le menu client pour une meilleure lisibilité."
                                                : "Passez au plan Premium pour organiser votre menu par catégories et offrir une expérience VIP à vos clients."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories List Section */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-stone-50 bg-stone-50/30">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Rechercher une catégorie..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-100 rounded-lg text-xs focus:ring-2 focus:ring-amber-700/10 focus:border-amber-700 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="divide-y divide-stone-50 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        {loading ? (
                                            <div className="py-20 text-center">
                                                <RefreshCw size={24} className="animate-spin text-amber-700 mx-auto mb-4" />
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Chargement...</p>
                                            </div>
                                        ) : filteredCategories.length === 0 ? (
                                            <div className="py-20 text-center px-6">
                                                <Layers size={32} className="text-stone-200 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-800">Aucune catégorie</p>
                                                <p className="text-xs text-slate-500 mt-1 italic">Commencez par en créer une à gauche.</p>
                                            </div>
                                        ) : (
                                            filteredCategories.map((cat) => (
                                                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-stone-50/50 transition-colors group">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-white border border-stone-100 rounded-lg flex items-center justify-center text-slate-400 font-bold group-hover:text-amber-700 group-hover:border-amber-100 transition-colors">
                                                            {cat.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 tracking-tight">{cat.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">Catégorie active</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.id)}
                                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))
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

export default AdminCategories;
