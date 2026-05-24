import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, DollarSign, Tag, FileText, LayoutGrid, ChevronRight, Power } from 'lucide-react';
import productService from '../services/productService';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || '',
                isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleInstantToggle = async (e) => {
        const checked = e.target.checked;
        setFormData(prev => ({ ...prev, isAvailable: checked }));

        if (product?.id) {
            setIsToggling(true);
            try {
                await productService.updateAvailability(product.id, checked);
            } catch (err) {
                console.error("Failed to update availability instantly:", err);
                setFormData(prev => ({ ...prev, isAvailable: !checked }));
                alert("Erreur de synchronisation.");
            } finally {
                setIsToggling(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                price: parseFloat(formData.price)
            });
        } catch (err) {
            console.error("Form submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                            {product ? 'Modifier l\'article' : 'Nouvel article'}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configuration du menu</p>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Nom du plat</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300"
                                placeholder="ex: Burger Signature"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Description culinaire</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 text-sm placeholder:text-slate-300"
                                placeholder="Ingrédients et saveurs..."
                            ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Prix (DH)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 text-sm"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Catégorie</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 text-sm"
                                    placeholder="ex: Entrées"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${formData.isAvailable ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                                {isToggling ? <Loader2 className="animate-spin" size={14} /> : <Power size={14} />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">Disponibilité instantanée</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Synchro en direct</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleInstantToggle}
                                className="sr-only peer"
                                disabled={isToggling}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                        </label>
                    </div>
                    
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting || isToggling}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isToggling}
                            className="flex-[1.5] px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-bold text-xs flex items-center justify-center group disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    {product ? 'Enregistrer' : 'Créer l\'article'}
                                    <ChevronRight className="ml-1 group-hover:translate-x-0.5 transition-transform" size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
