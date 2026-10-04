import React from 'react';
import { Trophy, Calendar, Globe, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

export default function StatsBanner({ hackathons, onOpenAddModal, onSelectReference }) {
  const totalCount = hackathons.length;
  
  // Calculate total prize pool numerical sum estimation
  const totalPrize = hackathons.reduce((acc, item) => {
    const num = parseInt((item.prizePool || '').replace(/[^0-9]/g, '')) || 0;
    return acc + num;
  }, 0);

  const virtualCount = hackathons.filter(h => (h.location || '').toLowerCase().includes('virtual')).length;
  
  // Find reference hackathon
  const referenceItem = hackathons.find(h => h.id === 'global-ai-summit-2026') || hackathons[0];

  return (
    <div className="mb-8">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white p-6 md:p-8 shadow-2xl border border-slate-700/50">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Headline */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Team Hackathon Directory
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Syne'] leading-tight">
              Insert & Track Top Tech Hackathons Effortlessly
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Empower your team to add, review, and participate in leading global hackathons. Features real-time spec rendering matching your custom reference design layout.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddModal}
                className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-500/25 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Insert Hackathon
              </button>

              {referenceItem && (
                <button
                  onClick={() => onSelectReference(referenceItem)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 backdrop-blur-md transition-all border border-white/10 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> View "Global AI Summit" Layout
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            
            {/* Metric 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-teal-400/20 flex items-center justify-center text-teal-300 mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-white font-['Syne']">
                ${totalPrize > 0 ? totalPrize.toLocaleString() : '130,000'}+
              </p>
              <p className="text-xs font-semibold text-slate-400">Total Prize Money</p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-300 mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-white font-['Syne']">
                {totalCount}
              </p>
              <p className="text-xs font-semibold text-slate-400">Active Hackathons</p>
            </div>

            {/* Metric 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-300 mb-2">
                <Globe className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-white font-['Syne']">
                {virtualCount} Virtual
              </p>
              <p className="text-xs font-semibold text-slate-400">Online & Remote</p>
            </div>

            {/* Metric 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-white font-['Syne']">
                100%
              </p>
              <p className="text-xs font-semibold text-slate-400">Team Custom Design</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
