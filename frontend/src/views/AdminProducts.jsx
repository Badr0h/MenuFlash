import React, { useState, useEffect, useCallback, useMemo } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import QrCodeGenerator from '../components/QrCodeGenerator';
import Sidebar from '../components/Sidebar';
import { 
  Plus, 
  LayoutGrid, 
  RefreshCw, 
  Search, 
  Package,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [feedback, setFeedback] = useState(null);

    const showFeedback = (message, type = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 3000);
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            showFeedback('Failed to fetch products', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

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

    const handleCreateOrUpdate = async (productData) => {
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, productData);
                showFeedback('Product updated successfully');
            } else {
                await productService.createProduct(productData);
                showFeedback('Product created successfully');
            }
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err);
            showFeedback(err.response?.data?.message || 'Error saving product', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                showFeedback('Product deleted successfully');
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
                showFeedback('Error deleting product', 'error');
            }
        }
    };

    const handleToggleAvailability = async (id, isAvailable) => {
        try {
            await productService.updateAvailability(id, isAvailable);
            showFeedback(`Product marked as ${isAvailable ? 'available' : 'sold out'}`);
            fetchProducts();
        } catch (err) {
            console.error('Error updating availability:', err);
            showFeedback('Error updating availability', 'error');
        }
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const clientMenuUrl = `${window.location.origin}/menu/demo`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans relative">
            <Sidebar />

            {/* Feedback Toast */}
            {feedback && (
                <div className={`fixed top-6 right-6 z-[200] flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
                    feedback.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-rose-500 text-white border-rose-400'
                }`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-black text-sm">{feedback.message}</span>
                </div>
            )}

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30 glass">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-none">Products</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage your inventory</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-black tracking-tight"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Product
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">Menu Items</h3>
                                <p className="text-slate-500 font-medium mt-1">Everything served at your restaurant.</p>
                            </div>
                            
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-6">
                                {loading && products.length === 0 ? (
                                    <div className="bg-white rounded-[2rem] border border-slate-200 p-20 flex flex-col items-center">
                                        <RefreshCw className="animate-spin text-indigo-500 mb-6" size={40} />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing with kitchen...</p>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="bg-white rounded-[2rem] border border-slate-200 p-16 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-200">
                                            <Package size={32} />
                                        </div>
                                        <h5 className="text-xl font-black text-slate-900 mb-2">No items found</h5>
                                        <p className="text-slate-400 font-medium mb-8 max-w-xs text-sm">We couldn't find any products matching your search criteria.</p>
                                        <button 
                                            onClick={() => {setSearchQuery(''); setIsFormOpen(true);}}
                                            className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                        >
                                            Add First Item
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
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

                            <div className="lg:col-span-4">
                                <div className="sticky top-0 space-y-6">
                                    <QrCodeGenerator url={clientMenuUrl} />
                                    
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6 flex items-center">
                                            <LayoutGrid size={14} className="mr-2 text-indigo-600" />
                                            Inventory Summary
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Total Items</span>
                                                <span className="font-black text-slate-900">{stats.total}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Available</span>
                                                <span className="font-black text-emerald-500">{stats.available}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Sold Out</span>
                                                <span className="font-black text-rose-500">{stats.unavailable}</span>
                                            </div>
                                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-sm text-slate-500 font-medium">Categories</span>
                                                <span className="font-black text-indigo-600">{stats.categories}</span>
                                            </div>
                                        </div>
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
