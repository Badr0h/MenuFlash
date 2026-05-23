import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, DollarSign, Tag, FileText, LayoutGrid, ChevronRight } from 'lucide-react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20 relative">
                
                {/* Visual Header */}
                <div className="bg-indigo-600 px-8 py-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                        <Tag size={100} />
                    </div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter leading-none mb-1">
                                {product ? 'Edit Item' : 'New Product'}
                            </h2>
                            <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px]">Product details and pricing</p>
                        </div>
                        <button onClick={onCancel} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all border border-white/10">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 transition-colors group-focus-within:text-indigo-600">
                                <Tag size={14} className="mr-2" />
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="e.g. Imperial Wagyu Burger"
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 transition-colors group-focus-within:text-indigo-600">
                                <FileText size={14} className="mr-2" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 leading-relaxed placeholder:text-slate-300 text-sm"
                                placeholder="Short description of this item..."
                            ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 transition-colors group-focus-within:text-indigo-600">
                                    <DollarSign size={14} className="mr-2" />
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-slate-900"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 transition-colors group-focus-within:text-indigo-600">
                                    <LayoutGrid size={14} className="mr-2" />
                                    Category
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                                    placeholder="e.g. Mains"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${formData.isAvailable ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-200 text-slate-400 shadow-none'}`}>
                                <Save size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 leading-none">Available on menu</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Instant toggle</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                        </label>
                    </div>
                    
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-black text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[1.5] px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-black text-sm flex items-center justify-center group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {product ? 'Save Changes' : 'Create Product'}
                                    <ChevronRight className="ml-1.5 group-hover:translate-x-1 transition-transform" size={20} />
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
