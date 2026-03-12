import { useState, useMemo } from 'react';
import { Download, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 12;

export default function Gallery({ images, onSelect }) {
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name'
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const arr = [...images];
    if (sortBy === 'newest') arr.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
    else if (sortBy === 'oldest') arr.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
    else if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [images, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p>No photos found in this folder.</p>
      </div>
    );
  }

  return (
    <div className="md:p-6 space-y-4 md:space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">{sorted.length} photos</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {paged.map((img) => (
          <div 
            key={img.id} 
            className="relative group aspect-square rounded-2xl overflow-hidden glass cursor-pointer"
            onClick={() => onSelect(img)}
          >
            <img 
              src={`/api/image/${img.id}`} 
              alt={img.name}
              className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
            />
            {/* Desktop Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-4">
              <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                <Eye size={20} />
              </button>
              <a 
                href={`/api/download/${img.id}`} 
                download={img.name}
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <Download size={20} />
              </a>
            </div>

            {/* Mobile Always-Visible Download Button */}
            <a 
              href={`/api/download/${img.id}`} 
              download={img.name}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white md:hidden shadow-lg border border-white/10 active:scale-90"
            >
              <Download size={16} />
            </a>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
               <p className="text-[10px] text-white/60 truncate">{new Date(img.createdTime).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-20 disabled:cursor-not-allowed text-white transition-colors border border-white/10"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                  i === safePage
                    ? 'bg-white text-slate-950 scale-110 shadow-lg shadow-white/10'
                    : 'bg-white/5 text-white/50 hover:bg-white/15 border border-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-20 disabled:cursor-not-allowed text-white transition-colors border border-white/10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
