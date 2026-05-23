import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Download, ExternalLink, QrCode } from 'lucide-react';

const QrCodeGenerator = ({ url }) => {
    const downloadQRCode = () => {
        const svg = document.getElementById('qr-code-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'menunflash-qr.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                    <QrCode size={24} />
                </div>
                
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Live Menu QR</h3>
                <p className="text-slate-500 text-sm font-medium text-center mb-8 px-4 leading-relaxed">
                    Scan this code to view your digital menu as a customer would.
                </p>
                
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner mb-8 transition-transform group-hover:scale-[1.02] duration-500">
                    <QRCodeSVG 
                        id="qr-code-svg"
                        value={url} 
                        size={180}
                        level="H"
                        includeMargin={false}
                        fgColor="#1e293b"
                    />
                </div>
                
                <div className="w-full space-y-3">
                    <button 
                        onClick={downloadQRCode}
                        className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-bold"
                    >
                        <Download className="mr-2" size={20} />
                        Download PNG
                    </button>
                    
                    <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-bold group/link"
                    >
                        Open Live Menu
                        <ExternalLink className="ml-2 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default QrCodeGenerator;
