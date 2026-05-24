import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { useAuth } from '../api/AuthContext';
import ProductCard from '../components/ProductCard';
import { Utensils, RefreshCw, ChevronLeft, MapPin, Clock, Zap } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const ClientMenuView = ({ isDemo = false }) => {
    const { restaurantId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState('MenuFlash');

    useEffect(() => {
        // Defensive check: wait for auth to initialize if not a demo
        if (!isDemo && authLoading) return;

        if (isDemo && user?.restaurantName) {
            setRestaurantName(user.restaurantName);
        } else if (!isDemo) {
            // In a real app, fetch restaurant info by restaurantId
            setRestaurantName(restaurantId ? `Établissement #${restaurantId}` : 'MenuFlash');
        }

        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                const productData = Array.isArray(data) ? data : [];
                setProducts(productData);
                
                const groups = productData.reduce((acc, product) => {
                    const category = product.category || 'Autres';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(product);
                    return acc;
                }, {});
                
                const sortedGroups = Object.keys(groups).sort().reduce((acc, key) => {
                    acc[key] = groups[key];
                    return acc;
                }, {});
                
                setGroupedProducts(sortedGroups);
            } catch (err) {
                console.error('Failed to fetch menu:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [user, isDemo, restaurantId, authLoading]);

    if (authLoading && !isDemo) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-white">
                <RefreshCw className="animate-spin text-indigo-600" size={24} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm flex flex-col relative border-x border-slate-100">
                
                {/* Refined Header */}
                <header className="bg-white pt-16 pb-12 px-8 relative border-b border-slate-50">
                    <div className="absolute top-6 left-6">
                        <Link to="/" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <ChevronLeft size={22} />
                        </Link>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-md mb-6">
                            <Utensils size={24} className="text-white" />
                        </div>
                        
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{restaurantName}</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Expérience Gastronomique</p>
                        
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                Ouvert
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <MapPin size={10} className="mr-1" />
                                Sélection Gourmet
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar pb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <RefreshCw className="animate-spin text-indigo-600 mb-4" size={24} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Préparation du menu...</p>
                        </div>
                    ) : Object.keys(groupedProducts).length === 0 ? (
                        <div className="text-center py-24 px-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Utensils className="text-slate-200" size={20} />
                            </div>
                            <p className="text-slate-900 font-bold text-sm">Menu en cours d'élaboration</p>
                            <p className="text-slate-400 text-xs mt-1">Revenez très prochainement pour découvrir nos plats.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {Object.entries(groupedProducts).map(([category, items]) => (
                                <section key={category}>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <h2 className="text-xs font-bold text-slate-900 tracking-[0.2em] uppercase whitespace-nowrap">
                                            {category}
                                        </h2>
                                        <div className="h-px w-full bg-slate-100" />
                                    </div>
                                    
                                    <div className="space-y-5">
                                        {items.map(product => (
                                            <ProductCard 
                                                key={product.id} 
                                                product={product} 
                                                isAdmin={false} 
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </main>
                
                <footer className="p-8 text-center bg-slate-50 border-t border-slate-100">
                    <div className="inline-flex items-center space-x-1.5 mb-2">
                        <Zap size={12} className="text-indigo-600" fill="currentColor" />
                        <span className="text-[10px] font-bold tracking-tight text-slate-800">MenuFlash</span>
                    </div>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest italic">Digital Gourmet Experience</p>
                </footer>
            </div>
        </div>
    );
};

export default ClientMenuView;
