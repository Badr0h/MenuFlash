import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
    Zap, 
    CheckCircle2, 
    CreditCard, 
    ShieldCheck, 
    Loader2,
    Lock,
    Calendar,
    User,
    ChevronRight,
    X
} from 'lucide-react';

const PricingPage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvc: ''
    });

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulation de la passerelle de paiement (2.5 secondes)
        setTimeout(async () => {
            try {
                // 1. Appel API pour mettre à jour la DB
                const response = await axiosInstance.post('/auth/simulate-payment', {
                    email: user.email
                });
                
                // 2. Création de l'objet utilisateur mis à jour
                const updatedUser = { 
                    ...user, 
                    isPaid: true,
                    // On peut aussi utiliser response.data s'il contient l'utilisateur complet
                    ...response.data 
                };
                
                // 3. Persistance locale immédiate
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // 4. Mise à jour du state global React (AuthContext)
                // Cela déclenchera le déblocage en temps réel sur les autres composants
                setUser(updatedUser);
                
                setIsProcessing(false);
                setIsModalOpen(false);
                
                // 5. Redirection finale vers le Dashboard désormais débloqué
                navigate('/admin/dashboard');
            } catch (err) {
                console.error("Payment error:", err);
                setIsProcessing(false);
                alert("Échec de la vérification des fonds. Veuillez réessayer.");
            }
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 selection:bg-indigo-100">
            <div className="w-full max-w-2xl text-center mb-12">
                <div className="inline-flex items-center space-x-2 mb-6">
                    <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                        <Zap className="text-white" size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">MenuFlash</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                    Activez votre abonnement <span className="text-indigo-600">Premium</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium max-w-lg mx-auto leading-relaxed">
                    Une seule offre simple pour propulser votre restaurant dans l'ère digitale.
                </p>
            </div>

            <div className="w-full max-w-[440px]">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                                Accès Illimité
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mt-4 tracking-tight">Plan Unique</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">150 DH</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HT / mois</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {[
                            "Menus numériques & QR Codes illimités",
                            "Mise à jour des stocks en temps réel",
                            "Statistiques de consultation avancées",
                            "Support technique dédié",
                            "Zéro commission sur vos ventes"
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="bg-emerald-50 p-0.5 rounded-full">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                </div>
                                <span className="text-slate-600 font-medium text-xs">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center group"
                    >
                        S'abonner maintenant
                        <ChevronRight className="ml-2 group-hover:translate-x-0.5 transition-transform" size={16} />
                    </button>

                    <div className="mt-6 flex items-center justify-center space-x-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                    </div>
                </div>
            </div>

            {/* Modal de Paiement Refactorisée */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Paiement sécurisé</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transaction cryptée SSL</p>
                            </div>
                            <button 
                                onClick={() => !isProcessing && setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePayment} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Titulaire de la carte</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm"
                                            placeholder="Nom complet"
                                            value={cardData.name}
                                            onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Numéro de carte</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm"
                                            placeholder="4242 4242 4242 4242"
                                            value={cardData.number}
                                            onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Expiration</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm"
                                                placeholder="MM/YY"
                                                value={cardData.expiry}
                                                onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">CVC</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm"
                                                placeholder="123"
                                                value={cardData.cvc}
                                                onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center group disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Vérification sécurisée des fonds...
                                    </>
                                ) : (
                                    `Payer 150 DH`
                                )}
                            </button>
                            
                            <p className="text-[10px] text-center text-slate-400 font-medium">
                                En payant, vous acceptez les conditions de renouvellement automatique.
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingPage;
