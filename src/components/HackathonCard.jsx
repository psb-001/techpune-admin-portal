import React from 'react';
import { User, Calendar, MapPin, GraduationCap, Clock, ExternalLink, Edit2, Trash2 } from 'lucide-react';

export default function HackathonCard({ hackathon, onEdit, onDelete }) {
  if (!hackathon) return null;

  return (
    <div className="w-full h-full max-w-xl mx-auto bg-white rounded-[32px] p-6 sm:p-8 border border-gray-200/90 shadow-md hover:shadow-lg transition-all flex flex-col justify-between font-sans">
      <div>
        {/* 1. Category Pill Badge & Actions */}
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-white bg-[#18181B] uppercase shadow-xs">
            {hackathon.category || 'ARTIFICIAL INTELLIGENCE'}
          </span>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(hackathon)}
                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
                title="Edit Hackathon"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(hackathon.id)}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Hackathon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Main Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight leading-[1.1] mb-6 font-['Syne'] sm:font-['Plus_Jakarta_Sans']">
          {hackathon.title}
        </h2>

        {/* 3. Four Detail Cards Stack - Perfectly Aligned Containers */}
        <div className="space-y-3.5 mb-7">
          
          {/* Organizer Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 min-h-[72px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
                <User className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[12px] font-semibold text-[#8B909A] leading-none mb-1">Organizer</span>
                <span className="text-[16px] font-bold text-[#111827] leading-snug">{hackathon.organizer}</span>
              </div>
            </div>

            {/* Glowing Teal Emblem Circle (Exact Replicate of Image) */}
            <div className="relative flex items-center justify-center mr-1 shrink-0">
              <div className="w-10 h-10 rounded-full border-[3px] border-[#2DD4BF] bg-[#ECFDF5] flex items-center justify-center shadow-[0_0_12px_rgba(45,212,191,0.35)]">
                <div className="w-4 h-4 rounded-full bg-[#0D9488]" />
              </div>
            </div>
          </div>

          {/* Date Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 min-h-[72px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
              <Calendar className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-[#8B909A] leading-none mb-1">Date</span>
              <span className="text-[16px] font-bold text-[#111827] leading-snug">{hackathon.date}</span>
            </div>
          </div>

          {/* Location Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 min-h-[72px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
              <MapPin className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-[#8B909A] leading-none mb-1">Location</span>
              <span className="text-[16px] font-bold text-[#111827] leading-snug">{hackathon.location}</span>
            </div>
          </div>

          {/* Prize Pool Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 min-h-[72px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[12px] font-semibold text-[#8B909A] leading-none mb-1">Prize Pool</span>
              <span className="text-[16px] font-extrabold text-[#111827] leading-snug">{hackathon.prizePool}</span>
            </div>
          </div>

        </div>

        {/* 4. About Section */}
        {hackathon.description && (
          <div className="mb-7">
            <h3 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight leading-none mb-3 font-['Syne'] sm:font-['Plus_Jakarta_Sans']">
              About this Hackathon
            </h3>
            <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed font-normal">
              {hackathon.description}
            </p>
          </div>
        )}

        {/* 5. Registration Alert Banner */}
        {hackathon.registrationDeadline && (
          <div className="bg-[#FCE8E6] rounded-[20px] p-4 min-h-[56px] flex items-center gap-3 text-[#991B1B] mb-6 border border-[#F87171]/20">
            <div className="w-6 h-6 rounded-full border-[2px] border-[#B91C1C] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#991B1B]">
              {hackathon.registrationDeadline}
            </p>
          </div>
        )}
      </div>

      {/* Apply Link Button */}
      {hackathon.websiteUrl && (
        <a
          href={hackathon.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0F172A] hover:bg-black text-white font-extrabold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 mt-2"
        >
          Apply Now <ExternalLink className="w-4 h-4 text-teal-400" />
        </a>
      )}

    </div>
  );
}
