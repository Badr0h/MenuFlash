import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import AuthService from '../services/AuthService';
import Sidebar from '../components/Sidebar';
import QrCodeGenerator from '../components/QrCodeGenerator';
import {
  Package,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Plus,
  Download,
  Share2,
  Calendar,
  Utensils,
  MousePointer2
} from 'lucide-react';

const AdminOverview = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = AuthService.getCurrentUser();
    const firstName = user?.firstName || 'User';

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
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

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30 glass">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Utensils size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-none">Dashboard</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Menu Overview</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-slate-500 font-bold text-sm">
                            <Calendar size={16} />
                            <span>Today, {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Welcome back, {firstName}.</h3>
                            <p className="text-slate-500 font-medium mt-1">Manage your restaurant menu and view real-time statistics.</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                { label: "Total Products", value: stats.total, icon: <Package />, color: "indigo" },
                                { label: "Available Now", value: stats.available, icon: <CheckCircle />, color: "emerald" },
                                { label: "Out of Stock", value: stats.unavailable, icon: <XCircle />, color: "amber" },
                                { label: "Categories", value: stats.categories, icon: <LayoutGrid />, color: "violet" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-4`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* QR Code Section */}
                            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10">
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Your Menu QR Code</h4>
                                <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center mb-6">
                                    <QrCodeGenerator url={`${window.location.origin}/menu/demo`} />
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center">
                                        <Download className="mr-2" size={18} />
                                        Download QR Code
                                    </button>
                                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black hover:bg-slate-50 transition-all flex items-center justify-center">
                                        <Share2 className="mr-2" size={18} />
                                        Share Menu Link
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">Quick Actions</h4>
                                        <Link to="/admin/products" className="text-indigo-600 font-black text-sm hover:underline">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Link to="/admin/products" className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all group">
                                            <Plus className="text-indigo-600 mb-3" size={24} />
                                            <p className="font-black text-slate-900">Add Product</p>
                                            <p className="text-xs text-slate-500 font-medium mt-1">Create new menu item</p>
                                        </Link>
                                        <Link to="/menu/demo" className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all group">
                                            <MousePointer2 className="text-slate-600 mb-3" size={24} />
                                            <p className="font-black text-slate-900">Preview Menu</p>
                                            <p className="text-xs text-slate-500 font-medium mt-1">See customer view</p>
                                        </Link>
                                    </div>
                                </div>

                                {/* Recent Products */}
                                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10">
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight mb-6">Recent Products</h4>
                                    <div className="space-y-4">
                                        {products.slice(0, 3).map(product => (
                                            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg">
                                                        {product.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">{product.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{product.category}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${product.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {product.isAvailable ? 'Available' : 'Sold Out'}
                                                </span>
                                            </div>
                                        ))}
                                        {products.length === 0 && !loading && (
                                            <p className="text-center text-slate-400 font-medium py-8">No products yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminOverview;
