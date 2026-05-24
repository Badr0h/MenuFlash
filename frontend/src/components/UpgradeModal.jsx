import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, ChevronRight, ShieldCheck, Lock } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[200] animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center space-x-2">
                        <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                            <Lock size={16} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Fonctionnalité Premium</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                        <Zap size={32} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Passez à la vitesse supérieure</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                        Cette fonctionnalité nécessite un abonnement actif (150 DH/mois) pour configurer et gérer votre restaurant sans limites.
                    </p>

                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                onClose();
                                navigate('/pricing');
                            }}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center group"
                        >
                            Débloquer maintenant
                            <ChevronRight className="ml-1.5 group-hover:translate-x-0.5 transition-transform" size={16} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-3 bg-white text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            Peut-être plus tard
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                        <ShieldCheck size={14} />
                        <span>Activation instantanée après paiement</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
