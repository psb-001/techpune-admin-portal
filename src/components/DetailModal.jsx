import React from 'react';
import { X, Sparkles, Download, Check } from 'lucide-react';
import HackathonImageCard from './HackathonImageCard';

export default function DetailModal({ hackathon, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !hackathon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Reference Image Pixel-Perfect View
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Render the Exact Reference Image Card */}
        <div className="py-2">
          <HackathonImageCard
            hackathon={hackathon}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={true}
          />
        </div>

        {/* Modal Footer Note */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Inserted by: <strong className="text-slate-200">{hackathon.insertedBy || 'Team Member'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
