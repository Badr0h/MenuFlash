import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import AuthService from '../services/AuthService';
import ProductCard from '../components/ProductCard';
import { Utensils, RefreshCw, ChevronLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const ClientMenuView = () => {
    const { restaurantId } = useParams();
    const [products, setProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState('MenuFlash');

    useEffect(() => {
        // In a real app, we'd fetch restaurant info by ID
        // For now, if user is logged in, we use their restaurant name
        const user = AuthService.getCurrentUser();
        if (user?.restaurantName) {
            setRestaurantName(user.restaurantName);
        }

        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);
                
                const groups = data.reduce((acc, product) => {
                    const category = product.category || 'Other';
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
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            <div className="max-w-md mx-auto bg-white min-h-screen overflow-hidden flex flex-col relative shadow-2xl">
                <header className="bg-slate-900 pt-16 pb-10 px-8 text-white relative">
                    <div className="absolute top-4 left-4">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                            <Utensils size={28} className="text-white" />
                        </div>
                        <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Open Now</span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">{restaurantName}</h1>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] opacity-80">Premium Digital Experience</p>
                </header>

                <main className="flex-1 overflow-y-auto p-6 -mt-6 bg-slate-50 rounded-t-[2.5rem] relative z-10 custom-scrollbar pb-24">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading our menu...</p>
                        </div>
                    ) : Object.keys(groupedProducts).length === 0 ? (
                        <div className="text-center py-24 px-6">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <Utensils className="text-slate-200" size={32} />
                            </div>
                            <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Our menu is coming soon</p>
                            <p className="text-slate-400 text-xs font-medium mt-2">Check back shortly for delicious updates.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {Object.entries(groupedProducts).map(([category, items]) => (
                                <section key={category}>
                                    <div className="flex items-center space-x-4 mb-6">
                                        <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase whitespace-nowrap">
                                            {category}
                                        </h2>
                                        <div className="h-px w-full bg-slate-200" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                            {items.length}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4">
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
                
                <footer className="bg-white border-t border-slate-100 p-6 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Powered by MenuFlash</p>
                </footer>
            </div>
        </div>
    );
};

export default ClientMenuView;
