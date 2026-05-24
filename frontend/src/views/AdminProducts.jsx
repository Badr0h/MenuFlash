import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import Sidebar from '../components/Sidebar';
import UpgradeModal from '../components/UpgradeModal';
import { 
  Plus, 
  LayoutGrid, 
  RefreshCw, 
  Search, 
  Package,
  CheckCircle2,
  AlertCircle,
  Eye,
  Zap
} from 'lucide-react';
import { useAuth } from '../api/AuthContext';

const AdminProducts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [feedback, setFeedback] = useState(null);

    const isPaid = user?.isPaid;

    const showFeedback = useCallback((message, type = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 3000);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            showFeedback('Erreur lors du chargement des produits', 'error');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [showFeedback]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const stats = useMemo(() => {
        const categories = new Set(products.map(p => p.category));
        return {
            total: products.length,
            available: products.filter(p => p.isAvailable).length,
            unavailable: products.filter(p => !p.isAvailable).length,
            categories: categories.size
        };
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const checkPermission = () => {
        if (!isPaid) {
            setIsUpgradeModalOpen(true);
            return false;
        }
        return true;
    };

    const handleOpenForm = () => {
        if (checkPermission()) {
            setIsFormOpen(true);
        }
    };

    const handleCreateOrUpdate = async (productData) => {
        if (!isPaid) {
            setIsUpgradeModalOpen(true);
            return;
        }

        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, productData);
                showFeedback('Produit mis à jour avec succès');
            } else {
                await productService.createProduct(productData);
                showFeedback('Produit créé avec succès');
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err);
            showFeedback(err.response?.data?.message || 'Erreur lors de la sauvegarde', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!checkPermission()) return;

        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await productService.deleteProduct(id);
                showFeedback('Produit supprimé avec succès');
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
                showFeedback('Erreur lors de la suppression', 'error');
            }
        }
    };

    const handleToggleAvailability = async (id, isAvailable) => {
        if (!checkPermission()) return;

        try {
            await productService.updateAvailability(id, isAvailable);
            showFeedback(`Produit marqué comme ${isAvailable ? 'disponible' : 'épuisé'}`);
            fetchProducts();
        } catch (err) {
            console.error('Error updating availability:', err);
            showFeedback('Erreur lors de la mise à jour', 'error');
        }
    };

    const openEditForm = (product) => {
        if (checkPermission()) {
            setEditingProduct(product);
            setIsFormOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans relative text-slate-900">
            <Sidebar />

            <UpgradeModal 
                isOpen={isUpgradeModalOpen} 
                onClose={() => setIsUpgradeModalOpen(false)} 
            />

            {/* Feedback Toast */}
            {feedback && (
                <div className={`fixed top-6 right-6 z-[200] flex items-center space-x-2.5 px-5 py-3 rounded-xl shadow-lg border animate-in fade-in slide-in-from-top-2 duration-300 ${
                    feedback.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'
                }`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span className="font-bold text-xs">{feedback.message}</span>
                </div>
            )}

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <Package size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-none">Gestion du Menu</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Inventaire des produits</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleOpenForm}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm font-bold text-xs"
                        >
                            <Plus size={16} className="mr-1.5" />
                            Ajouter un produit
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Vos Produits</h3>
                                <p className="text-slate-500 text-sm font-medium">Gérez et organisez les articles de votre menu digital.</p>
                            </div>
                            
                            <div className="relative w-full md:w-72 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un plat..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-xs shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-9">
                                {loading && products.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-20 flex flex-col items-center">
                                        <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Synchronisation...</p>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-200 border border-slate-100">
                                            <Package size={24} />
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-900 mb-1">Aucun produit trouvé</h5>
                                        <p className="text-slate-400 font-medium mb-6 max-w-xs text-xs">Ajustez votre recherche ou ajoutez votre premier article.</p>
                                        <button 
                                            onClick={() => {setSearchQuery(''); handleOpenForm();}}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-sm"
                                        >
                                            Ajouter un article
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
                                        {filteredProducts.map(product => (
                                            <ProductCard 
                                                key={product.id} 
                                                product={product} 
                                                isAdmin={true}
                                                onEdit={openEditForm}
                                                onDelete={handleDelete}
                                                onToggleAvailability={handleToggleAvailability}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-3">
                                <div className="sticky top-0 space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-5 flex items-center">
                                            <LayoutGrid size={12} className="mr-2 text-indigo-600" />
                                            Résumé du menu
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-medium">Total</span>
                                                <span className="font-bold text-slate-900 text-xs">{stats.total}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-medium">En stock</span>
                                                <span className="font-bold text-emerald-500 text-xs">{stats.available}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-medium">Épuisés</span>
                                                <span className="font-bold text-rose-500 text-xs">{stats.unavailable}</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                                                <span className="text-xs text-slate-500 font-medium">Catégories</span>
                                                <span className="font-bold text-indigo-600 text-xs">{stats.categories}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-100 text-white relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h5 className="font-bold text-sm mb-1.5">Aperçu direct</h5>
                                            <p className="text-[11px] text-indigo-100 font-medium leading-relaxed mb-4">
                                                Visualisez votre menu tel qu'il apparaît pour vos clients.
                                            </p>
                                            <Link to="/menu/demo" className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-white text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                                                Voir le menu <Eye size={12} className="ml-1.5" />
                                            </Link>
                                        </div>
                                        <Zap className="absolute -bottom-4 -right-4 text-white opacity-10" size={80} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {isFormOpen && (
                <ProductForm 
                    product={editingProduct}
                    onSubmit={handleCreateOrUpdate}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminProducts;
