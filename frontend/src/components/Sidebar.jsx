import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Eye,
  LogOut,
  Zap,
  User,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../api/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Gérant' : 'Gérant';
  const userInitials = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'AD' : 'AD';
  const restaurantName = user?.restaurantName || 'MenuFlash';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Produits', icon: Package },
    { path: '/admin/profile', label: 'Mon Compte', icon: User },
    { path: '/pricing', label: 'Abonnement', icon: CreditCard },
    { path: '/menu/demo', label: 'Aperçu Menu', icon: Eye },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen z-20">
        <div className="p-5 flex flex-col h-full">
            <Link to="/" className="flex items-center space-x-2.5 mb-8 px-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                    <Zap className="text-white" size={18} fill="currentColor" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-800">Menu<span className="text-indigo-600">Flash</span></span>
            </Link>

            <nav className="flex-1 space-y-0.5">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                                active 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-5 border-t border-slate-100">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {userInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">{restaurantName}</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Déconnexion"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;
