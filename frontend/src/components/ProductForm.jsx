import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Loader2, DollarSign, Tag, FileText, LayoutGrid, ChevronRight, Power, Layers, Image as ImageIcon, Check, Lock, Search, Filter, Upload, Heart, Star } from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import globalImageService from '../services/globalImageService';
import { useAuth } from '../api/AuthContext';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const { user } = useAuth();
    const isPaid = user?.isPaid;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        genericImageId: '',
        imageUrl: '',
        isAvailable: true
    });
    const [categories, setCategories] = useState([]);
    const [genericImages, setGenericImages] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    
    // Gallery State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'upload'
    const [uploadPreview, setUploadPreview] = useState(null);

    const imageCategories = useMemo(() => {
        const cats = new Set(genericImages.map(img => img.category).filter(Boolean));
        return ['All', ...Array.from(cats)];
    }, [genericImages]);

    const filteredImages = useMemo(() => {
        return genericImages.filter(img => {
            const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 img.category?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [genericImages, searchQuery, selectedCategory]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [cats, images] = await Promise.all([
                    categoryService.getAllCategories(),
                    globalImageService.getGenericImages()
                ]);
                setCategories(cats);
                setGenericImages(images);
            } catch (err) {
                console.error("Failed to fetch form data:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();

        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                categoryId: product.category?.id || '',
                genericImageId: product.genericImage?.id || '',
                imageUrl: product.imageUrl || '',
                isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
            });
            if (product.imageUrl && !product.genericImage) {
                setActiveTab('upload');
                setUploadPreview(product.imageUrl);
            }
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectImage = (img) => {
        if (!isPaid) return;
        setFormData(prev => ({
            ...prev,
            genericImageId: prev.genericImageId === img.id ? '' : img.id,
            imageUrl: prev.genericImageId === img.id ? '' : img.imageUrl
        }));
    };

    const handleFileUpload = (e) => {
        if (!isPaid) return;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result, // In a real app, you'd upload to a server
                    genericImageId: ''
                }));
            };
            reader.readAsDataURL(file);
        }
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
        
        // Basic validation
        if (!formData.name.trim()) return;
        if (!formData.price || isNaN(parseFloat(formData.price))) {
            alert("Veuillez entrer un prix valide.");
            return;
        }

        setIsSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                price: parseFloat(formData.price),
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                genericImageId: formData.genericImageId ? parseInt(formData.genericImageId) : null
            };
            await onSubmit(submissionData);
        } catch (err) {
            console.error("Form submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
                
                {/* Header Style Premium */}
                <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3 group-hover:rotate-0 transition-transform">
                            <Tag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                {product ? 'Raffiner l\'article' : 'Nouvelle création'}
                            </h2>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">Studio Gastronomique</span>
                                <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Media Engine v2</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400 hover:text-rose-500">
                        <X size={28} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Panel: Form Data */}
                    <form id="productForm" onSubmit={handleSubmit} className="lg:w-2/5 p-8 space-y-8 overflow-y-auto custom-scrollbar border-r border-stone-100">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Identité du plat</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 text-sm placeholder:text-slate-300"
                                    placeholder="ex: Filet de Bar Rôti"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Composition & Histoire</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-6 py-4 bg-stone-50/50 border border-stone-100 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-medium text-slate-600 text-sm leading-relaxed placeholder:text-slate-300"
                                    placeholder="Décrivez les saveurs, textures et origines..."
                                ></textarea>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Tarif (DH)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            required
                                            className="w-full pl-12 pr-6 py-4 bg-stone-50/50 border border-stone-100 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-black text-slate-800 text-sm"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">DH</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 flex items-center justify-between">
                                        Classification
                                        {!isPaid && <Lock size={10} className="text-amber-600" />}
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            disabled={!isPaid}
                                            className={`w-full px-6 py-4 border rounded-[1.25rem] outline-none transition-all font-bold text-sm appearance-none cursor-pointer ${
                                                isPaid 
                                                ? 'bg-stone-50/50 border-stone-100 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 text-slate-800' 
                                                : 'bg-stone-100 border-stone-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <option value="">{isPaid ? "Catégorie..." : "Premium Only"}</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="p-6 bg-slate-900 rounded-[1.5rem] text-white shadow-xl shadow-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.isAvailable ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                        <Power size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest">Disponibilité</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Visible sur le menu</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAvailable}
                                        onChange={handleInstantToggle}
                                        className="sr-only peer"
                                        disabled={isToggling}
                                    />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                            </div>
                        </div>
                    </form>

                    {/* Right Panel: Advanced Media Library */}
                    <div className="flex-1 bg-stone-50/30 p-8 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex p-1 bg-stone-100 rounded-2xl w-fit">
                                <button 
                                    onClick={() => setActiveTab('gallery')}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'gallery' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Médiathèque
                                </button>
                                <button 
                                    onClick={() => setActiveTab('upload')}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Upload Perso
                                </button>
                            </div>
                            
                            {!isPaid && (
                                <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                                    <Lock size={14} className="text-amber-600" />
                                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Premium Engine</span>
                                </div>
                            )}
                        </div>

                        {activeTab === 'gallery' ? (
                            <>
                                {/* Search & Filters */}
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text"
                                            placeholder="Rechercher un visuel (ex: burger, café...)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all text-sm font-medium shadow-sm"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                                        {imageCategories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                                                    selectedCategory === cat 
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                                    : 'bg-white border-stone-100 text-slate-500 hover:border-indigo-200'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Grid - High Density */}
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {loadingData ? (
                                        <div className="h-full flex flex-col items-center justify-center py-20">
                                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Initialisation de la bibliothèque...</p>
                                        </div>
                                    ) : (
                                        <div className={`grid grid-cols-4 md:grid-cols-5 gap-3 pb-8 ${!isPaid ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                                            {filteredImages.map((img) => {
                                                const isSelected = formData.genericImageId === img.id;
                                                return (
                                                    <button
                                                        key={img.id}
                                                        type="button"
                                                        onClick={() => handleSelectImage(img)}
                                                        className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                                                            isSelected ? 'border-indigo-600 scale-90' : 'border-transparent hover:border-indigo-200'
                                                        }`}
                                                    >
                                                        <img src={img.imageUrl} alt={img.name} className="w-full h-full object-cover object-center" />
                                                        
                                                        {isSelected && (
                                                            <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                                <div className="bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                                                                    <Check size={12} strokeWidth={4} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <p className="text-[7px] font-black text-white uppercase tracking-tighter truncate text-center">{img.name}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {filteredImages.length === 0 && (
                                                <div className="col-span-full py-20 text-center">
                                                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                        <Search size={32} />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800 tracking-tight">Aucun visuel trouvé</p>
                                                    <p className="text-xs text-slate-400 mt-1 italic">Essayez d'autres mots-clés ou catégories.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Custom Upload Panel */
                            <div className={`flex-1 flex flex-col items-center justify-center space-y-8 pb-12 ${!isPaid ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                                <div className="w-full max-w-sm aspect-video rounded-[2.5rem] border-4 border-dashed border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center overflow-hidden relative group transition-all hover:border-indigo-400 hover:bg-white">
                                    {uploadPreview ? (
                                        <>
                                            <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                                <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                                                    Changer l'image
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center group/label">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-400 shadow-sm group-hover/label:scale-110 group-hover/label:text-indigo-600 transition-all mb-4">
                                                <Upload size={32} />
                                            </div>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">Cliquez pour importer</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 5MB</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    )}
                                </div>
                                
                                <div className="max-w-md text-center">
                                    <h4 className="text-lg font-black text-slate-800 tracking-tight">Utilisez votre propre visuel</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">
                                        Pour un rendu optimal, privilégiez des photos lumineuses avec un arrière-plan épuré. Vos clients adorent l'authenticité.
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2 text-indigo-600">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Optimisé Retina</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-indigo-600">
                                        <Heart size={16} fill="currentColor" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Favoris Cloud</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Final Actions Footer */}
                        <div className="mt-auto pt-8 flex items-center justify-between border-t border-stone-100 bg-white -mx-8 -mb-8 px-8 py-6 rounded-b-[2.5rem]">
                            <div className="hidden sm:block">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Propulsé par MenuFlash AI</p>
                            </div>
                            <div className="flex space-x-4 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={isSubmitting || isToggling}
                                    className="flex-1 sm:flex-none px-10 py-4 bg-white border border-stone-200 text-slate-600 rounded-2xl hover:bg-stone-50 transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    form="productForm"
                                    disabled={isSubmitting || isToggling}
                                    className="flex-[1.5] sm:flex-none px-12 py-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 font-black text-xs uppercase tracking-widest flex items-center justify-center group disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {product ? 'Sauvegarder' : 'Ajouter au Menu'}
                                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
