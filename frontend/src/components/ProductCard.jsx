import React from 'react';
import { Trash2, Edit2, Power } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, onToggleAvailability, isAdmin = false }) => {
    return (
        <div className={`group relative bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md ${!product.isAvailable ? 'opacity-60' : ''}`}>
            <div className="p-5">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {product.category}
                        </span>
                        
                        {!product.isAvailable && (
                            <div className="flex items-center text-slate-500 text-[9px] font-bold uppercase tracking-widest bg-slate-100 w-fit px-2 py-0.5 rounded border border-slate-200">
                                Épuisé temporairement
                            </div>
                        )}
                        {product.isAvailable && isAdmin && (
                            <div className="flex items-center text-emerald-600 text-[9px] font-bold uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100/50">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5"></span>
                                Disponible
                            </div>
                        )}
                    </div>

                    <div className="text-right">
                        <p className={`text-lg font-bold tracking-tight text-slate-900`}>
                            {product.price.toFixed(2)}
                            <span className="text-[10px] font-medium ml-1 text-slate-400 uppercase">DH</span>
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {product.description || "Sélection de produits frais préparés avec soin."}
                    </p>
                </div>

                {/* Actions Footer */}
                {isAdmin && (
                    <div className="flex items-center justify-end space-x-1.5 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onToggleAvailability(product.id, !product.isAvailable)}
                            className={`p-2 rounded-lg transition-all ${product.isAvailable ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                            title={product.isAvailable ? "Marquer épuisé" : "Remettre en stock"}
                        >
                            <Power size={15} />
                        </button>
                        <button 
                            onClick={() => onEdit(product)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Modifier"
                        >
                            <Edit2 size={15} />
                        </button>
                        <button 
                            onClick={() => onDelete(product.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Supprimer"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                )}
            </div>
            
            {/* Elegant status indicator */}
            {product.isAvailable && (
                <div className="absolute top-0 left-0 w-0.5 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </div>
    );
};

export default ProductCard;
