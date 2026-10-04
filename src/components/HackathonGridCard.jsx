import React from 'react';
import { User, Calendar, MapPin, Trophy, Clock, ArrowRight, Eye, Edit3, Trash2 } from 'lucide-react';

export default function HackathonGridCard({ hackathon, onViewDetail, onEdit, onDelete }) {
  const isCompulsoryItem = hackathon.id === 'global-ai-summit-2026';

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Featured Ribbon for Image Hackathon */}
      {isCompulsoryItem && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" /> Reference Design Match
        </div>
      )}

      <div>
        {/* Category Pill Tag */}
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest text-white bg-[#1E1E1E] uppercase">
            {hackathon.category || 'HACKATHON'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mb-3 group-hover:text-teal-700 transition-colors font-['Syne']">
          {hackathon.title}
        </h3>

        {/* Mini Grid info */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs font-semibold">
          
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate" title={hackathon.organizer}>{hackathon.organizer}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-slate-900">{hackathon.prizePool || 'TBD'}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{hackathon.date}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{hackathon.location}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
          {hackathon.description}
        </p>

        {/* Pink Alert Banner Snippet */}
        {hackathon.registrationDeadline && (
          <div className="bg-[#FCE8E6] rounded-xl p-2.5 flex items-center gap-2 text-[#991B1B] text-xs font-semibold mb-4">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{hackathon.registrationDeadline}</span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetail(hackathon)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 text-teal-400" /> Full Card Spec View
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(hackathon)}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-600 transition-colors"
            title="Edit Hackathon"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(hackathon.id)}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 transition-colors"
            title="Delete Hackathon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
