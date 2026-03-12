import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, ArrowLeft } from 'lucide-react';

export default function DetailedPreview({ image, onClose, onBackToLive }) {
  if (!image) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-xl"
    >
      <div className="relative w-full h-full flex flex-col md:flex-row gap-8">
        {/* Main Image Area */}
        <div className="flex-1 relative flex items-center justify-center bg-black/40 rounded-3xl overflow-hidden glass">
          <img 
            src={`/api/image/${image.id}`} 
            alt={image.name} 
            className="max-h-full max-w-full object-contain"
          />
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl flex flex-col items-center gap-6">
            <h2 className="text-xl font-bold text-white self-start">Photo Details</h2>
            <div className="p-3 bg-white rounded-2xl w-full flex justify-center">
              <QRCodeSVG value={`${window.location.origin}/api/download/${image.id}`} size={180} level="H" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-white font-medium">Transfer to Phone</p>
              <p className="text-slate-400 text-sm">Scan the QR code to download this photo directly.</p>
            </div>
            
            <div className="w-full h-px bg-white/10" />

            <div className="w-full space-y-3">
              <a 
                href={`/api/download/${image.id}`}
                download={image.name}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
              >
                <Download size={20} />
                Download High-Res
              </a>
            </div>
          </div>

          <button 
            onClick={onBackToLive}
            className="w-full py-4 bg-blue-600/20 text-blue-400 font-bold rounded-2xl hover:bg-blue-600/30 transition-colors border border-blue-500/20"
          >
            Back to Live View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
