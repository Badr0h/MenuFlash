import React from 'react';
import { Trash2, Edit2, Power, DollarSign, Tag, Info } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, onToggleAvailability, isAdmin = false }) => {
    return (
        <div className={`group relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!product.isAvailable && 'bg-slate-50/50 opacity-90'}`}>
            <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col space-y-2">
                        <span className={`w-fit text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            product.isAvailable 
                            ? 'text-indigo-600 bg-indigo-50 border-indigo-100' 
                            : 'text-slate-400 bg-slate-100 border-slate-200'
                        }`}>
                            {product.category}
                        </span>
                        
                        {product.isAvailable ? (
                            <div className="flex items-center text-emerald-500 text-[9px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded-lg border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                Available
                            </div>
                        ) : (
                            <div className="flex items-center text-rose-500 text-[9px] font-black uppercase tracking-widest bg-rose-50 w-fit px-2 py-0.5 rounded-lg border border-rose-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5"></span>
                                Sold Out
                            </div>
                        )}
                    </div>

                    <div className="text-right">
                        <p className={`text-2xl font-black tracking-tighter ${product.isAvailable ? 'text-indigo-600' : 'text-slate-400'}`}>
                            <span className="text-sm font-bold mr-0.5">$</span>
                            {product.price.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mb-6">
                    <h3 className={`text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors ${!product.isAvailable && 'text-slate-400'}`}>
                        {product.name}
                    </h3>
                    <p className={`text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 ${!product.isAvailable && 'text-slate-300'}`}>
                        {product.description || "No description provided for this item."}
                    </p>
                </div>

                {/* Actions Footer */}
                {isAdmin && (
                    <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => onToggleAvailability(product.id, !product.isAvailable)}
                            className={`p-2.5 rounded-xl transition-all ${product.isAvailable ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                            title={product.isAvailable ? "Set Sold Out" : "Set Available"}
                        >
                            <Power size={18} />
                        </button>
                        <button 
                            onClick={() => onEdit(product)}
                            className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                            title="Edit Item"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => onDelete(product.id)}
                            className="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                            title="Remove Item"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </div>
            
            {/* Visual Indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${product.isAvailable ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            
            {!product.isAvailable && !isAdmin && (
                <div className="absolute inset-0 bg-slate-50/40 backdrop-grayscale-[0.5] pointer-events-none flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-xl shadow-sm border border-slate-100 transform -rotate-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Sold Out</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
