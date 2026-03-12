// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export default function LiveMonitor({ image, images, onNavigate }) {
  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-950 text-slate-400">
        <p className="text-xl animate-pulse">Waiting for photos...</p>
        <p className="text-sm mt-2 opacity-60">Upload a photo to your Google Drive folder to see it here.</p>
      </div>
    );
  }

  const currentIndex = images.findIndex(img => img.id === image.id);
  const canGoRight = currentIndex < images.length - 1; // right goes deeper (older)
  const canGoLeft = currentIndex > 0; // left goes back to start (newer)

  const handleGoLeft = (e) => {
    e.stopPropagation();
    if (canGoLeft) onNavigate(images[currentIndex - 1]);
  };

  const handleGoRight = (e) => {
    e.stopPropagation();
    if (canGoRight) onNavigate(images[currentIndex + 1]);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image Container — Fullscreen centered */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset }) => {
              const swipe = offset.x;
              // Swipe Left -> Go Right (older/index+1)
              if (swipe < -60 && canGoRight) {
                handleGoRight();
              // Swipe Right -> Go Left (newer/index-1)
              } else if (swipe > 60 && canGoLeft) {
                handleGoLeft();
              }
            }}
            className="flex h-full w-full items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <img
              src={`/api/image/${image.id}`}
              alt={image.name}
              className="h-full w-full object-contain pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main UI Overlay Container */}
      <div className="relative h-full w-full z-10 pointer-events-none">
        <div className="relative h-full w-full pointer-events-auto">
          {/* Navigation Arrows — Symmetrical within the visible space */}
          {canGoLeft && (
            <button
              onClick={handleGoLeft}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-40 p-5 bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-full transition-all hover:scale-110 cursor-pointer group"
              title="Previous"
            >
              <ChevronLeft size={36} className="group-active:scale-90 transition-transform" />
            </button>
          )}
          {canGoRight && (
            <button
              onClick={handleGoRight}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-40 p-5 bg-black/40 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white rounded-full transition-all hover:scale-110 cursor-pointer group"
              title="Next"
            >
              <ChevronRight size={36} className="group-active:scale-90 transition-transform" />
            </button>
          )}

          {/* Counter Badge */}
          {images.length > 0 && (
            <div className="absolute top-10 right-10 z-10 px-4 py-2 glass-dark rounded-full text-xs text-white/60 font-mono">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* QR Overlays */}
          <motion.div 
            key={`qr-${image.id}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-10 right-10 glass-dark p-4 rounded-3xl flex flex-col items-center gap-3 z-10"
          >
            {/* Download QR */}
            <div className="p-2 bg-white rounded-xl">
              <QRCodeSVG value={`${window.location.origin}/api/download/${image.id}`} size={120} level="H" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-xs">Scan to Download</p>
            </div>
          </motion.div>

          {/* Floating Actions & Thumbnails */}
          <div className="absolute bottom-10 left-10 flex flex-col gap-3 items-start z-20">
            {/* Back to Latest — only show when user has navigated to older photos */}
            <AnimatePresence>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={() => onNavigate(images[0])}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
                >
                  <ChevronsRight size={16} />
                  Back to Latest
                </motion.button>
              )}
            </AnimatePresence>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-hidden rounded-2xl p-1 bg-black/20 backdrop-blur-sm border border-white/5 max-w-[60vw]">
              {images.slice(currentIndex + 1, currentIndex + 8).map((img) => (
                <img 
                  key={img.id} 
                  src={`/api/image/${img.id}`} 
                  alt={img.name}
                  onClick={(e) => { e.stopPropagation(); onNavigate(img); }}
                  className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border border-white/20 opacity-50 hover:opacity-100 cursor-pointer transition-opacity shrink-0"
                />
              ))}
            </div>
          </div>
          
          <div className="absolute top-10 left-10 flex items-start gap-6 z-10">
             {/* Gallery QR */}
             <div className="glass-dark p-3 rounded-2xl flex flex-col items-center gap-2">
              <div className="p-1.5 bg-white rounded-lg">
                <QRCodeSVG value={`${window.location.origin}/?view=gallery`} size={60} level="H" />
              </div>
              <p className="text-white font-medium text-[10px]">View Gallery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
