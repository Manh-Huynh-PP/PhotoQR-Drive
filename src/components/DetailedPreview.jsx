import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, ArrowLeft } from 'lucide-react';

export default function DetailedPreview({ image, onClose, onBackToLive }) {
  const [showQR, setShowQR] = useState(false);
  if (!image) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-10 bg-slate-950/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="relative w-full min-h-full md:h-full flex flex-col md:flex-row gap-0 md:gap-8 bg-slate-950 md:bg-transparent">
        {/* Main Image Area */}
        <div className="flex-1 relative flex items-center justify-center bg-black/40 md:rounded-3xl overflow-hidden glass min-h-[50vh] md:min-h-0">
          <img 
            src={`/api/image/${image.id}`} 
            alt={image.name} 
            className="h-full w-full object-contain p-4 md:p-0"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:top-6 md:left-6 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-50"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-4 p-6 md:p-0">
          <div className="glass p-6 md:p-8 rounded-3xl flex flex-col items-center gap-6">
            <h2 className="text-xl font-bold text-white self-start hidden md:block">Photo Details</h2>
            
            <div className="w-full space-y-4">
              <a 
                href={`/api/download/${image.id}`}
                download={image.name}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-colors shadow-lg active:scale-95"
              >
                <Download size={20} />
                Download High-Res
              </a>

              <button 
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-colors border border-white/10 active:scale-95"
              >
                <ExternalLink size={20} />
                {showQR ? "Hide QR Code" : "Share via QR Code"}
              </button>
            </div>

            {/* Togglable QR Code */}
            {showQR && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="w-full flex flex-col items-center gap-3 overflow-hidden"
              >
                <div className="p-3 bg-white rounded-2xl w-full flex justify-center">
                  <QRCodeSVG value={`${window.location.origin}/api/download/${image.id}`} size={180} level="H" />
                </div>
                <p className="text-slate-400 text-sm text-center">Scan to download directly</p>
              </motion.div>
            )}
          </div>

          <button 
            onClick={onBackToLive}
            className="w-full py-4 bg-blue-600/20 text-blue-400 font-bold rounded-2xl hover:bg-blue-600/30 transition-colors border border-blue-500/20 hidden md:block"
          >
            Back to Live View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
