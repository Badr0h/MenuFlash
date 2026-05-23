import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  LayoutGrid,
  LogOut,
  Zap
} from 'lucide-react';
import AuthService from '../services/AuthService';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const user = AuthService.getCurrentUser();
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin' : 'Admin';
  const userInitials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'AD' : 'AD';
  const restaurantName = user?.restaurantName || 'MenuFlash';

  const brandParts = restaurantName.split(' ');
  const brandFirst = brandParts[0];
  const brandRest = brandParts.slice(1).join(' ') || 'Flash';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen z-20">
        <div className="p-6">
            <Link to="/" className="flex items-center space-x-3 mb-8 group">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                    <Zap className="text-white" size={20} />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">{brandFirst}<span className="text-indigo-600">{brandRest}</span></span>
            </Link>

            <nav className="space-y-1">
                <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-bold group ${
                        isActive('/admin/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Home size={20} className={isActive('/admin/dashboard') ? 'text-indigo-600' : 'group-hover:text-indigo-600'} />
                    <span>Dashboard</span>
                </Link>
                <Link
                    to="/admin/products"
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-bold group ${
                        isActive('/admin/products') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Package size={20} className={isActive('/admin/products') ? 'text-indigo-600' : 'group-hover:text-indigo-600'} />
                    <span>Products</span>
                </Link>
                <Link
                    to="/menu/demo"
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-bold group ${
                        isActive('/menu/demo') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <LayoutGrid size={20} className={isActive('/menu/demo') ? 'text-indigo-600' : 'group-hover:text-indigo-600'} />
                    <span>Preview</span>
                </Link>
            </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">{userInitials}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{user?.role || 'Admin'}</p>
                    </div>
                    <button 
                        onClick={() => {
                            AuthService.logout();
                            window.location.href = '/login';
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;
