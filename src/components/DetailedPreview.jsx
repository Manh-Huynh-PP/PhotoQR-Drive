import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DetailedPreview({ image, images = [], onNavigate, onClose, onBackToLive }) {
  const [showQR, setShowQR] = useState(false);
  if (!image) return null;

  const currentIndex = images.findIndex(img => img.id === image.id);
  const canGoRight = currentIndex < images.length - 1; // right goes deeper (older)
  const canGoLeft = currentIndex > 0; // left goes back to start (newer)

  const handleGoLeft = (e) => {
    e?.stopPropagation();
    if (canGoLeft && onNavigate) onNavigate(images[currentIndex - 1]);
  };

  const handleGoRight = (e) => {
    e?.stopPropagation();
    if (canGoRight && onNavigate) onNavigate(images[currentIndex + 1]);
  };

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
          
          {/* Top Counter */}
          {images.length > 0 && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 px-3 py-1.5 bg-black/50 text-white/90 text-xs font-mono font-bold rounded-full backdrop-blur-md border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x; 
                // Swipe Left -> Next item (Right)
                if (swipe < -50 && canGoRight) {
                  handleGoRight();
                // Swipe Right -> Prev item (Left)
                } else if (swipe > 50 && canGoLeft) {
                  handleGoLeft();
                }
              }}
              className="absolute inset-0 flex items-center justify-center p-4 md:p-0 cursor-grab active:cursor-grabbing"
            >
              <img 
                src={`/api/image/${image.id}`} 
                alt={image.name} 
                className="h-full w-full object-contain pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:top-6 md:left-6 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-50"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Swipe Hint Overlay (Mobile only, briefly visible) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-black/60 text-white/90 text-xs font-bold rounded-full backdrop-blur-md border border-white/10 pointer-events-none md:hidden"
            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          >
            ← Swipe to navigate →
          </motion.div>

          {/* Navigation Arrows */}
          {canGoLeft && (
            <button
              onClick={handleGoLeft}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-full transition-all hover:scale-110 cursor-pointer"
              title="Previous"
            >
              <ChevronLeft size={28} className="w-5 h-5 md:w-7 md:h-7" />
            </button>
          )}
          {canGoRight && (
            <button
              onClick={handleGoRight}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-full transition-all hover:scale-110 cursor-pointer"
              title="Next"
            >
              <ChevronRight size={28} className="w-5 h-5 md:w-7 md:h-7" />
            </button>
          )}
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
