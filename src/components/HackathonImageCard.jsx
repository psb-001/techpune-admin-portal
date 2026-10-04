import React, { useState, useEffect, useRef } from 'react';
import { User, Calendar, MapPin, GraduationCap, Clock, Share2, Bookmark, ExternalLink, Sparkles, Download, Users, Flame } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * Pixel-Perfect match of the user's provided hackathon design image
 * plus 3D Parallax Tilt, Live Countdown Timer, and Team Attendees
 */
export default function HackathonImageCard({ hackathon, onEdit, onDelete, showActions = true }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(12);
  const [isAttending, setIsAttending] = useState(false);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 22, seconds: 45 });

  if (!hackathon) return null;

  // 3D Parallax Tilt logic on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
    const rotateY = ((x - centerX) / centerX) * 6; // max 6deg

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out'
    });
  };

  // Live ticking timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleBookmark = () => {
    sounds.playPop();
    setIsBookmarked(!isBookmarked);
  };

  const toggleAttend = () => {
    sounds.playSuccess();
    if (isAttending) {
      setIsAttending(false);
      setAttendeesCount(prev => prev - 1);
    } else {
      setIsAttending(true);
      setAttendeesCount(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective-card">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className="w-full bg-white rounded-[32px] p-6 sm:p-9 border border-gray-200/90 shadow-2xl relative overflow-hidden transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)]"
      >
        
        {/* Subtle Ambient Teal Glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Category Pill Badge */}
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest text-white bg-[#18181B] uppercase shadow-sm font-sans">
            {hackathon.category || 'ARTIFICIAL INTELLIGENCE'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAttend}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAttending
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isAttending ? 'text-amber-300 fill-amber-300' : 'text-gray-400'}`} />
              {isAttending ? 'Joined!' : 'Join Team'}
            </button>

            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-full transition-colors ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:text-gray-700'}`}
              title="Bookmark Hackathon"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. Main Title - Exact Match Typography */}
        <h1 className="text-4xl sm:text-[46px] font-black text-[#111827] tracking-tight leading-[1.0] mb-7 font-['Unbounded'] sm:font-['Syne']">
          {hackathon.title}
        </h1>

        {/* 3. Four Soft Detail Cards Stack */}
        <div className="space-y-3.5 mb-8">
          
          {/* Organizer Row with Glowing Teal Ring */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 sm:p-[18px] flex items-center justify-between transition-all hover:bg-[#EAECEF]">
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-[16px] bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
                <User className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#8B909A] tracking-wide">Organizer</p>
                <p className="text-[16px] sm:text-[18px] font-extrabold text-[#111827] leading-snug">{hackathon.organizer}</p>
              </div>
            </div>

            {/* Glowing Cyan/Teal Circular Emblem Badge (Exact Replicate of Image) */}
            <div className="relative flex items-center justify-center mr-1">
              <div className="w-[46px] h-[46px] rounded-full border-[3px] border-[#2DD4BF] bg-[#ECFDF5] flex items-center justify-center shadow-[0_0_16px_rgba(45,212,191,0.45)]">
                <div className="w-[22px] h-[22px] rounded-full bg-[#0D9488]" />
              </div>
            </div>
          </div>

          {/* Date Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 sm:p-[18px] flex items-center gap-4 transition-all hover:bg-[#EAECEF]">
            <div className="w-[50px] h-[50px] rounded-[16px] bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
              <Calendar className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#8B909A] tracking-wide">Date</p>
              <p className="text-[16px] sm:text-[18px] font-extrabold text-[#111827] leading-snug">{hackathon.date}</p>
            </div>
          </div>

          {/* Location Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 sm:p-[18px] flex items-center gap-4 transition-all hover:bg-[#EAECEF]">
            <div className="w-[50px] h-[50px] rounded-[16px] bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
              <MapPin className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#8B909A] tracking-wide">Location</p>
              <p className="text-[16px] sm:text-[18px] font-extrabold text-[#111827] leading-snug">{hackathon.location}</p>
            </div>
          </div>

          {/* Prize Pool Row */}
          <div className="bg-[#F3F4F6] rounded-[22px] p-4 sm:p-[18px] flex items-center gap-4 transition-all hover:bg-[#EAECEF]">
            <div className="w-[50px] h-[50px] rounded-[16px] bg-[#E5E7EB] flex items-center justify-center text-[#374151] shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#8B909A] tracking-wide">Prize Pool</p>
              <p className="text-[16px] sm:text-[18px] font-extrabold text-[#111827] leading-snug">{hackathon.prizePool}</p>
            </div>
          </div>

        </div>

        {/* 4. About Section - Exact Match Typography */}
        <div className="mb-8">
          <h2 className="text-[26px] sm:text-[32px] font-black text-[#111827] tracking-tight leading-none mb-3 font-['Unbounded'] sm:font-['Syne']">
            About this Hackathon
          </h2>
          <p className="text-[#4B5563] text-[15px] sm:text-[16px] leading-[1.65] font-normal">
            {hackathon.description}
          </p>
        </div>

        {/* 5. Soft Red/Pink Registration Alert Banner */}
        <div className="bg-[#FCE8E6] rounded-[20px] p-4 flex items-center justify-between text-[#991B1B] mb-6 border border-[#F87171]/20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-[2px] border-[#B91C1C] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <p className="text-[13px] sm:text-[14px] font-bold text-[#991B1B]">
              {hackathon.registrationDeadline || 'Registration closes on Oct 18, 2026'}
            </p>
          </div>

          {/* Live Ticking Mini Counter */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-bold bg-white/80 text-[#991B1B] px-2.5 py-1 rounded-lg shadow-xs">
            <span>{timeLeft.days}d</span>:<span>{String(timeLeft.hours).padStart(2,'0')}h</span>:<span>{String(timeLeft.minutes).padStart(2,'0')}m</span>:<span>{String(timeLeft.seconds).padStart(2,'0')}s</span>
          </div>
        </div>

        {/* Live Team Attendees Bar */}
        <div className="mb-6 p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs border border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-700">Team Interested:</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">{attendeesCount} members</span>
          </div>

          <div className="flex -space-x-2 overflow-hidden">
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Team" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Team" />
            <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Team" />
          </div>
        </div>

        {/* Interactive Action Controls */}
        {showActions && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <a
              href={hackathon.websiteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playCyberLaser()}
              className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl bg-[#0F172A] hover:bg-black text-white font-extrabold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl active:scale-[0.98]"
            >
              Apply Now <ExternalLink className="w-4 h-4 text-teal-400" />
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  navigator.clipboard?.writeText(window.location.href);
                  alert(`Copied link for ${hackathon.title}!`);
                }}
                className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all active:scale-95"
                title="Share Hackathon"
              >
                <Share2 className="w-4 h-4" />
              </button>
              
              {onEdit && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onEdit(hackathon);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs sm:text-sm transition-all active:scale-95"
                >
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onDelete(hackathon.id);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs sm:text-sm transition-all active:scale-95"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
