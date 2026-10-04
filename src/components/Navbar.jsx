import React, { useRef } from 'react';
import { Plus, Download, Upload, Sparkles, LayoutGrid, Image as ImageIcon, RotateCcw, Bot, Volume2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Navbar({
  onOpenAddModal,
  onOpenCrazyModal,
  onSelectReferenceView,
  onExportJSON,
  onImportJSON,
  onResetData,
  totalCount,
  currentView,
  setCurrentView
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          onImportJSON(json);
          sounds.playSuccess();
        } catch (err) {
          alert('Invalid JSON file format!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Emblem */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              sounds.playPop();
              setCurrentView('grid');
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-11 h-11 rounded-full border-[3px] border-[#2DD4BF] bg-teal-50 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.45)] transition-transform group-hover:scale-105">
                <div className="w-4 h-4 rounded-full bg-[#0D9488]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Unbounded'] sm:font-['Syne']">
                  HackHub
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 text-white uppercase tracking-wider">
                  Team Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Hackathon Directory & Spec Inspector</p>
            </div>
          </div>

          {/* Quick Action buttons for mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playCyberLaser();
                onOpenCrazyModal();
              }}
              className="p-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md active:scale-95"
              title="Crazy AI Generator"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                onOpenAddModal();
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Insert
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          
          {/* View Mode Tabs */}
          <div className="bg-gray-100/90 p-1 rounded-2xl flex items-center gap-1">
            <button
              onClick={() => {
                sounds.playPop();
                setCurrentView('grid');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentView === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> All ({totalCount})
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onSelectReferenceView();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentView === 'reference' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-slate-900'
              }`}
              title="Show exact compulsory hackathon design from reference image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-teal-400" /> Reference Design View
            </button>
          </div>

          {/* Crazy AI Generator Button */}
          <button
            onClick={() => {
              sounds.playCyberLaser();
              onOpenCrazyModal();
            }}
            className="hidden lg:flex px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs items-center gap-1.5 transition-all shadow-md hover:shadow-lg active:scale-95"
            title="Crazy AI Idea Synthesizer"
          >
            <Bot className="w-4 h-4" /> AI Synthesizer
          </button>

          {/* Import / Export / Reset */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => {
                sounds.playPop();
                onExportJSON();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-slate-900 transition-colors"
              title="Export Hackathons JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                fileInputRef.current?.click();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-slate-900 transition-colors"
              title="Import Hackathons JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => {
                sounds.playPop();
                onResetData();
              }}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-rose-600 transition-colors"
              title="Reset to Default Preset Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenAddModal();
            }}
            className="hidden md:flex px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" /> Insert Hackathon
          </button>

        </div>

      </div>
    </header>
  );
}
