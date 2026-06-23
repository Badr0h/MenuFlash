import React, { useState, useEffect, useRef } from 'react';
import productService from '../services/productService';
import { useAuth } from '../api/AuthContext';
import ProductCard from '../components/ProductCard';
import { Utensils, RefreshCw, ChevronLeft, Zap, ShoppingBag } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const ClientMenuView = ({ isDemo = false }) => {
    const { restaurantId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState('MenuFlash');
    const [activeCategory, setActiveCategory] = useState('');
    const categoryRefs = useRef({});

    useEffect(() => {
        if (!isDemo && authLoading) return;

        if (isDemo && user?.restaurantName) {
            setRestaurantName(user.restaurantName);
        } else if (!isDemo) {
            setRestaurantName(restaurantId ? `L'Ardoise de Moulay` : 'MenuFlash');
        }

        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                const productData = Array.isArray(data) ? data : [];
                setProducts(productData);
                
                const groups = productData.reduce((acc, product) => {
                    const category = product.category?.name || 'Autres';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(product);
                    return acc;
                }, {});
                
                const sortedKeys = Object.keys(groups).sort();
                const sortedGroups = sortedKeys.reduce((acc, key) => {
                    acc[key] = groups[key];
                    return acc;
                }, {});
                
                setGroupedProducts(sortedGroups);
                if (sortedKeys.length > 0) setActiveCategory(sortedKeys[0]);
            } catch (err) {
                console.error('Failed to fetch menu:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [user, isDemo, restaurantId, authLoading]);

    const scrollToCategory = (category) => {
        setActiveCategory(category);
        categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    };

    if (authLoading && !isDemo) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-stone-50">
                <RefreshCw className="animate-spin text-amber-700" size={24} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-amber-100">
            {/* Centered Mobile-First Container */}
            <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-sm flex flex-col relative border-x border-stone-100/50">
                
                {/* Premium Header */}
                <header className="bg-white pt-12 pb-8 px-6 relative">
                    <div className="absolute top-6 left-6">
                        <Link to="/" className="text-slate-400 hover:text-amber-700 transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                    </div>
                    <div className="absolute top-6 right-6">
                        <div className="relative text-slate-400 hover:text-amber-700 transition-colors cursor-pointer">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2 tracking-tight">
                            {restaurantName}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100/50">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                Ouvert
                            </div>
                        </div>
                    </div>
                </header>

                {/* Horizontal Category Navigation */}
                <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-stone-50 overflow-x-auto no-scrollbar">
                    <div className="flex items-center px-4 space-x-8 min-w-max">
                        {Object.keys(groupedProducts).map((category) => (
                            <button
                                key={category}
                                onClick={() => scrollToCategory(category)}
                                className={`py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all relative ${
                                    activeCategory === category ? 'text-amber-700' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {category}
                                {activeCategory === category && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                <main className="flex-1 px-4 py-8 space-y-12 pb-24">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <RefreshCw className="animate-spin text-indigo-600 mb-4" size={24} />
                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">L'excellence se prépare...</p>
                        </div>
                    ) : Object.keys(groupedProducts).length === 0 ? (
                        <div className="text-center py-24 px-6">
                            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Utensils className="text-stone-200" size={24} />
                            </div>
                            <h3 className="text-slate-800 font-bold text-xl mb-2 tracking-tight">Notre Carte Arrive</h3>
                            <p className="text-slate-400 text-sm font-medium">Nous peaufinons notre sélection pour vous offrir le meilleur.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {Object.entries(groupedProducts).map(([category, items]) => (
                                <section 
                                    key={category} 
                                    ref={el => categoryRefs.current[category] = el}
                                    className="scroll-mt-24"
                                >
                                    <div className="flex items-center mb-6">
                                        <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">
                                            {category.toLowerCase()}
                                        </h2>
                                        <div className="h-px flex-1 bg-stone-100 ml-4" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {items.map(product => (
                                            <div 
                                                key={product.id} 
                                                className={`flex items-center justify-between p-4 bg-white rounded-[1.25rem] border border-stone-50 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 ${!product.isAvailable ? 'opacity-50' : ''}`}
                                            >
                                                {/* Left Column: Info (2/3) */}
                                                <div className="flex-1 pr-4">
                                                    <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug mb-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
                                                        {product.description || "Une création artisanale préparée avec les meilleurs ingrédients."}
                                                    </p>
                                                    <p className="text-sm font-black text-indigo-600 tracking-tight">
                                                        {product.price.toFixed(0)} <span className="text-[10px] uppercase ml-0.5">DH</span>
                                                    </p>
                                                </div>

                                                {/* Right Column: Image (1/3) */}
                                                <div className="relative shrink-0">
                                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                                                        <img 
                                                            src={product.imageUrl || product.genericImage?.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400"} 
                                                            alt={product.name}
                                                            className={`w-full h-full object-cover ${!product.isAvailable ? 'grayscale' : ''}`}
                                                        />
                                                    </div>
                                                    {!product.isAvailable && (
                                                        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                                            <span className="bg-white/90 text-slate-800 text-[8px] font-black uppercase px-2 py-1 rounded-md shadow-sm">Épuisé</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </main>
                
                <footer className="p-12 text-center bg-stone-50/50 border-t border-stone-100/50">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <Zap size={14} className="text-amber-700" fill="currentColor" />
                        <span className="text-sm font-serif italic text-slate-800">Gourmet Direct</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">Pure Digital Experience</p>
                    <div className="mt-8 flex justify-center space-x-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                         {/* Minimalist partners or social indicators */}
                         <div className="w-6 h-6 rounded-full bg-slate-200" />
                         <div className="w-6 h-6 rounded-full bg-slate-200" />
                         <div className="w-6 h-6 rounded-full bg-slate-200" />
                    </div>
                </footer>
            </div>

            {/* Float Action Button for mobile (Optional) */}
            <div className="fixed bottom-6 right-6 z-20">
                <button className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-all duration-300 group">
                    <ShoppingBag size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ClientMenuView;
