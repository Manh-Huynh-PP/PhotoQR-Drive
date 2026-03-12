import { useState } from 'react';
import { Grid, Monitor, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

import { useDriveFolder } from './hooks/useDriveFolder';
import LiveMonitor from './components/LiveMonitor';
import Gallery from './components/Gallery';
import DetailedPreview from './components/DetailedPreview';

function App() {
  const [view, setView] = useState(() => {
    if (window.innerWidth < 768) return 'gallery';
    return new URLSearchParams(window.location.search).get('view') || 'live';
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [liveImage, setLiveImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 1024);

  const { 
    images, 
    latestImage, 
    error, 
  } = useDriveFolder();



  const handleBackToLive = () => {
    setSelectedImage(null);
    setView('live');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 flex">
      {/* Premium Sidebar - Icon Only */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 72 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col items-center py-4 glass-dark border-r border-white/5 bg-slate-950/50 backdrop-blur-2xl overflow-hidden"
      >
        {/* Nav Icons */}
        <nav className="flex flex-col items-center gap-3 mt-16">
          <SidebarNavItem 
            icon={<Monitor size={22} />} 
            label="Live Monitor" 
            active={view === 'live'} 
            onClick={() => setView('live')}
            hideOnMobile
          />
          <SidebarNavItem 
            icon={<Grid size={22} />} 
            label="Library" 
            active={view === 'gallery'} 
            onClick={() => setView('gallery')}
          />
        </nav>
      </motion.aside>

      {/* Toggle Tab - top-aligned, glued to sidebar right edge */}
      <motion.div
        initial={false}
        animate={{ left: isSidebarOpen ? 72 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block fixed top-6 z-[60]"
      >
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center justify-center w-5 h-12 bg-slate-800/90 border border-l-0 border-white/10 rounded-r-lg text-white/50 hover:text-white hover:bg-slate-700 transition-colors shadow-xl backdrop-blur-md"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </motion.div>

      {/* Main Content Area */}
      <motion.main 
        initial={false}
        animate={{ paddingLeft: isSidebarOpen ? 72 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 min-h-screen"
      >
        {view === 'live' ? (
          <LiveMonitor 
            image={liveImage || latestImage} 
            images={images} 
            onNavigate={setLiveImage} 
            isSidebarOpen={isSidebarOpen} 
          />
        ) : (
          <div className="pt-6 md:pt-10 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
            <header className="mb-6 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 md:mb-3">Photo Gallery</h2>
              <p className="text-slate-500 text-sm md:text-lg">Explore the latest memories captured</p>
            </header>
            <Gallery images={images} onSelect={(img) => setSelectedImage(img)} />
          </div>
        )}
      </motion.main>

      {/* Overlays */}
      <AnimatePresence>
        {selectedImage && (
          <DetailedPreview 
            image={selectedImage} 
            onClose={() => setSelectedImage(null)} 
            onBackToLive={handleBackToLive}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Settings Modal removed as per user request */}
      </AnimatePresence>

      {/* Status Indicators (Errors Only) */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-bold text-red-400 z-50"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Nav rail item: icon only, with tooltip on hover
function SidebarNavItem({ icon, label, active, onClick, hideOnMobile }) {
  return (
    <div className={`relative group ${hideOnMobile ? 'hidden md:block' : ''}`}>
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200
          ${active 
            ? 'bg-white text-slate-950 shadow-[0_8px_20px_-6px_rgba(255,255,255,0.3)] scale-110' 
            : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
      >
        {icon}
      </button>
      {/* Tooltip */}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] border border-white/10 shadow-xl hidden md:block">
        {label}
      </div>
    </div>
  );
}

export default App;
