import { useState } from 'react';
import { Settings, X, Save, Folder, Key } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKey, folderId, onSave }) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localFolderId, setLocalFolderId] = useState(folderId);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localApiKey, localFolderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass-dark rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="text-white/60" size={20} />
            <h2 className="text-xl font-bold text-white">Photobooth Settings</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Key size={14} /> Google Drive API Key
            </label>
            <input 
              type="text" 
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
              placeholder="Enter your API Key..."
            />
            <p className="text-[10px] text-slate-500">
              Obtain this from Google Cloud Console (Credentials &rarr; API Key).
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Folder size={14} /> Google Drive Folder ID
            </label>
            <input 
              type="text" 
              value={localFolderId}
              onChange={(e) => setLocalFolderId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
              placeholder="e.g. 17rl9h5T1BKYdGYa3NoBtJuTHJ0_7-ADF"
            />
            <p className="text-[10px] text-slate-500">
              The string of characters at the end of the folder URL.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleSave}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Configuration
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-white/5 text-[10px] text-center text-slate-500">
          Settings are saved locally in your browser.
        </div>
      </div>
    </div>
  );
}
