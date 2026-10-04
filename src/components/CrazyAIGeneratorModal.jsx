import React, { useState } from 'react';
import { Sparkles, Bot, Zap, X, Flame, CheckCircle2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

const CRAZY_THEMES = [
  { id: 'quantum-ai', name: '⚛️ Quantum Neural AI', category: 'ARTIFICIAL INTELLIGENCE' },
  { id: 'space-web3', name: '🚀 DeepSpace Web3 & Mars Mesh', category: 'BLOCKCHAIN & WEB3' },
  { id: 'cyber-war', name: '🛡️ Autonomous Cyber Defense Agents', category: 'CYBERSECURITY' },
  { id: 'bci-brain', name: '🧠 Neural Interface & BCI Hacking', category: 'ROBOTICS & HARDWARE' },
  { id: 'climate-fusion', name: '⚡ Fusion Energy & Smart Grids', category: 'CLIMATE & CLEAN TECH' }
];

const ORGANIZERS = [
  'DeepMind Quantum Labs',
  'OpenBrain AI Collective',
  'CyberDyne Autonomous Systems',
  'Sovereign ZK Foundation',
  'Starlight Aerospace Hackers',
  'Apex Neural Dynamics'
];

const TITLE_PREFIXES = [
  'Global Breakthrough',
  'HyperDrive Challenge',
  'Zero-Limits Blitz',
  'Quantum Leap 2026',
  'Autonomous Horizon',
  'NextGen Cyber Matrix'
];

export default function CrazyAIGeneratorModal({ isOpen, onClose, onInsertHackathon }) {
  const [selectedTheme, setSelectedTheme] = useState(CRAZY_THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    sounds.playCyberLaser();
    setIsGenerating(true);

    setTimeout(() => {
      const randomPrefix = TITLE_PREFIXES[Math.floor(Math.random() * TITLE_PREFIXES.length)];
      const randomOrganizer = ORGANIZERS[Math.floor(Math.random() * ORGANIZERS.length)];
      const randomPrize = Math.floor(Math.random() * 8 + 3) * 10000; // $30k - $100k
      
      const newIdea = {
        id: `crazy-ai-${Date.now()}`,
        title: `${selectedTheme.name.replace(/[^a-zA-Z0-9 ]/g, '').trim()} ${randomPrefix}`,
        category: selectedTheme.category,
        organizer: randomOrganizer,
        date: 'Nov 20 - 23, 2026',
        location: 'Virtual & Global Metastations',
        locationType: 'virtual',
        prizePool: `$${randomPrize.toLocaleString()}`,
        description: `Unleash autonomous AI agents, solve real-time predictive challenges, and build production-grade prototypes in this 72-hour high-octane global sprint.`,
        registrationDeadline: 'Registration closes on Nov 15, 2026',
        websiteUrl: 'https://example.com/crazy-hackathon',
        tags: ['AI Agents', 'Quantum', 'Automated ML', 'NextGen'],
        status: 'Upcoming',
        insertedBy: 'AI Hackathon Generator 🤖',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setGeneratedIdea(newIdea);
      setIsGenerating(false);
      sounds.playSuccess();
    }, 600);
  };

  const handleAddGenerated = () => {
    if (generatedIdea) {
      sounds.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      onInsertHackathon(generatedIdea);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 text-white rounded-3xl p-6 shadow-2xl border border-teal-500/30 overflow-hidden my-auto">
        
        {/* Glowing decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-['Syne'] flex items-center gap-2">
                Crazy AI Hackathon Generator <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">Instant futuristic hackathon idea synthesizer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="py-5 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Pick a Futuristic Theme Track:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CRAZY_THEMES.map(theme => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setSelectedTheme(theme);
                }}
                className={`p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                  selectedTheme.id === theme.id
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{theme.name}</span>
                {selectedTheme.id === theme.id && <Flame className="w-4 h-4 text-teal-400 shrink-0" />}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/25 active:scale-98"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Futuristic Challenge...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" /> Generate Hackathon Challenge Now
              </>
            )}
          </button>
        </div>

        {/* Generated Result Preview Card */}
        {generatedIdea && (
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-teal-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-teal-400 text-slate-950">
                Generated Idea
              </span>
              <span className="text-xs font-extrabold text-amber-400">
                Prize: {generatedIdea.prizePool}
              </span>
            </div>

            <h3 className="text-lg font-black text-white font-['Syne']">
              {generatedIdea.title}
            </h3>

            <p className="text-xs text-slate-300">
              {generatedIdea.description}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={handleAddGenerated}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" /> Insert to Website Now
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
