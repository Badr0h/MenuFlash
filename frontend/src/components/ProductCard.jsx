import React from 'react';
import { ShoppingBag, Power, Edit2, Trash2 } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, onToggleAvailability, isAdmin = false }) => {
    // Placeholder image logic based on category
    const getPlaceholderImage = (category) => {
        const cat = category?.toLowerCase() || 'food';
        if (cat.includes('entrée') || cat.includes('starter')) return "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800";
        if (cat.includes('plat') || cat.includes('main')) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
        if (cat.includes('dessert')) return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800";
        if (cat.includes('boisson') || cat.includes('drink')) return "https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800";
        return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800";
    };

    return (
        <div className={`group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 border border-stone-100 ${!product.isAvailable ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex flex-col">
                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden">
                    <img 
                        src={product.imageUrl || product.genericImage?.imageUrl || getPlaceholderImage(product.category?.name)} 
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Protective Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-900/60 border border-white/20 rounded-full">
                                Épuisé
                            </span>
                        </div>
                    )}

                    {/* Category Badge on Image */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] font-black text-slate-800 uppercase tracking-widest rounded-lg shadow-sm">
                            {product.category?.name || 'Général'}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-7 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors duration-300">
                                {product.name}
                            </h3>
                        </div>
                        
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                            {product.description || "Une création artisanale préparée avec les meilleurs ingrédients de saison."}
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-left">
                            <p className="text-2xl font-black tracking-tighter text-slate-900">
                                {product.price.toFixed(0)}
                                <span className="text-[10px] font-black ml-1 uppercase text-slate-400">DH</span>
                            </p>
                        </div>
                        
                        {/* Admin Actions */}
                        {isAdmin && (
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => onToggleAvailability(product.id, !product.isAvailable)}
                                    className={`p-2.5 rounded-xl transition-all shadow-sm ${product.isAvailable ? 'bg-stone-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                >
                                    <Power size={14} strokeWidth={3} />
                                </button>
                                <button 
                                    onClick={() => onEdit(product)}
                                    className="p-2.5 bg-stone-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
                                >
                                    <Edit2 size={14} strokeWidth={3} />
                                </button>
                                <button 
                                    onClick={() => onDelete(product.id)}
                                    className="p-2.5 bg-stone-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                                >
                                    <Trash2 size={14} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
