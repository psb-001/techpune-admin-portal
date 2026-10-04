import React, { useState, useEffect } from 'react';
import { X, Sparkles, PlusCircle, CheckCircle2, Eye, FileText, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import HackathonImageCard from './HackathonImageCard';

const TEMPLATES = [
  {
    name: '🤖 AI Hackathon',
    category: 'ARTIFICIAL INTELLIGENCE',
    title: 'Generative AI Breakthrough 2026',
    organizer: 'Vertex Neural AI',
    date: 'Nov 14 - 17, 2026',
    location: 'Virtual',
    locationType: 'virtual',
    prizePool: '$30,000',
    description: 'Build novel multi-modal agents, fine-tune open-weights LLMs, and craft real-time autonomous workflow assistants.',
    registrationDeadline: 'Registration closes on Nov 08, 2026',
    websiteUrl: 'https://example.com/ai-breakthrough',
    tags: ['AI', 'LLM', 'Agents', 'PyTorch']
  },
  {
    name: '⚡ Web3 / DeFi',
    category: 'BLOCKCHAIN & WEB3',
    title: 'Decentralized Finance Hackathon',
    organizer: 'Ether Protocol',
    date: 'Dec 05 - 08, 2026',
    location: 'Singapore & Virtual',
    locationType: 'hybrid',
    prizePool: '$45,000',
    description: 'Design next-gen liquidity protocols, automated market makers, and cross-chain messaging bridges with micro-second latency.',
    registrationDeadline: 'Registration closes on Nov 28, 2026',
    websiteUrl: 'https://example.com/defi-hack',
    tags: ['DeFi', 'Solidity', 'Zero-Knowledge', 'Web3']
  },
  {
    name: '🛡️ Cyber Security',
    category: 'CYBERSECURITY',
    title: 'Zero-Day Security Blitz',
    organizer: 'CyberGuard Corp',
    date: 'Oct 30 - Nov 02, 2026',
    location: 'Virtual',
    locationType: 'virtual',
    prizePool: '$20,000',
    description: 'Solve capture-the-flag scenarios, discover critical vulnerabilities, and build automated patch generation tools.',
    registrationDeadline: 'Registration closes on Oct 25, 2026',
    websiteUrl: 'https://example.com/cyberblitz',
    tags: ['Cybersecurity', 'CTF', 'Rust', 'AppSec']
  }
];

export default function AddHackathonModal({ isOpen, onClose, onSave, editingHackathon = null }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'ARTIFICIAL INTELLIGENCE',
    organizer: '',
    date: '',
    location: '',
    locationType: 'virtual',
    prizePool: '',
    description: '',
    registrationDeadline: '',
    websiteUrl: '',
    tags: ''
  });

  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'preview'
  const [teamMemberName, setTeamMemberName] = useState('Team Member');

  useEffect(() => {
    if (editingHackathon) {
      setFormData({
        title: editingHackathon.title || '',
        category: editingHackathon.category || 'ARTIFICIAL INTELLIGENCE',
        organizer: editingHackathon.organizer || '',
        date: editingHackathon.date || '',
        location: editingHackathon.location || '',
        locationType: editingHackathon.locationType || 'virtual',
        prizePool: editingHackathon.prizePool || '',
        description: editingHackathon.description || '',
        registrationDeadline: editingHackathon.registrationDeadline || '',
        websiteUrl: editingHackathon.websiteUrl || '',
        tags: Array.isArray(editingHackathon.tags) ? editingHackathon.tags.join(', ') : editingHackathon.tags || ''
      });
      setTeamMemberName(editingHackathon.insertedBy || 'Team Member');
    } else {
      setFormData({
        title: '',
        category: 'ARTIFICIAL INTELLIGENCE',
        organizer: '',
        date: '',
        location: '',
        locationType: 'virtual',
        prizePool: '',
        description: '',
        registrationDeadline: '',
        websiteUrl: '',
        tags: ''
      });
    }
  }, [editingHackathon, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyTemplate = (template) => {
    setFormData({
      title: template.title,
      category: template.category,
      organizer: template.organizer,
      date: template.date,
      location: template.location,
      locationType: template.locationType,
      prizePool: template.prizePool,
      description: template.description,
      registrationDeadline: template.registrationDeadline,
      websiteUrl: template.websiteUrl,
      tags: template.tags.join(', ')
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.organizer) {
      alert('Please enter at least Title and Organizer name');
      return;
    }

    const processedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : formData.tags;

    const newHackathon = {
      id: editingHackathon ? editingHackathon.id : `hack-${Date.now()}`,
      ...formData,
      tags: processedTags.length > 0 ? processedTags : ['Hackathon', 'Tech'],
      status: 'Upcoming',
      insertedBy: teamMemberName || 'Team Member',
      createdAt: editingHackathon ? editingHackathon.createdAt : new Date().toISOString().split('T')[0]
    };

    onSave(newHackathon);

    // Trigger celebratory confetti on creation
    if (!editingHackathon) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                {editingHackathon ? 'Edit Hackathon Details' : 'Insert New Hackathon'}
              </h2>
              <p className="text-xs text-slate-300">
                Easily publish a hackathon with live image card preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-slate-800 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1 ${activeTab === 'form' ? 'bg-teal-500 text-white' : 'text-slate-300'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1 ${activeTab === 'preview' ? 'bg-teal-500 text-white' : 'text-slate-300'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Card Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Split view on Desktop) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Input Form */}
          <div className={`lg:col-span-7 p-6 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Quick Templates Bar */}
            {!editingHackathon && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-teal-600" /> Quick Autofill Presets
                  </span>
                  <span className="text-[11px] text-slate-400">Click to fill</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg border border-slate-200 transition-all shadow-sm active:scale-95"
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form id="hackathon-form" onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category Tag *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-semibold bg-white"
                  >
                    <option value="ARTIFICIAL INTELLIGENCE">ARTIFICIAL INTELLIGENCE</option>
                    <option value="BLOCKCHAIN & WEB3">BLOCKCHAIN & WEB3</option>
                    <option value="CYBERSECURITY">CYBERSECURITY</option>
                    <option value="FINTECH">FINTECH</option>
                    <option value="CLIMATE & CLEAN TECH">CLIMATE & CLEAN TECH</option>
                    <option value="OPEN SOURCE">OPEN SOURCE</option>
                    <option value="ROBOTICS & HARDWARE">ROBOTICS & HARDWARE</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Hackathon Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Global AI Summit Challenge"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* Organizer & Prize Pool */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    required
                    placeholder="e.g. Nexus AI"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    name="prizePool"
                    placeholder="e.g. $10,000"
                    value={formData.prizePool}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Hackathon Dates
                  </label>
                  <input
                    type="text"
                    name="date"
                    placeholder="e.g. Oct 23 - 26, 2026"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Virtual or San Francisco, CA"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  About this Hackathon (Description)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe the challenge goals, duration, tracks, and tech stack required..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm leading-relaxed text-gray-800"
                />
              </div>

              {/* Deadline & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Registration Deadline Notice
                  </label>
                  <input
                    type="text"
                    name="registrationDeadline"
                    placeholder="e.g. Registration closes on Oct 18, 2026"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Website / Registration URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    placeholder="https://hackathon.example.com"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm text-gray-900"
                  />
                </div>
              </div>

              {/* Author & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="Machine Learning, PyTorch, LLM"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Inserted By (Team Member Name)
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={teamMemberName}
                    onChange={(e) => setTeamMemberName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm text-gray-900"
                  />
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Live Real-Time Image Card Preview */}
          <div className={`lg:col-span-5 bg-slate-100 p-6 border-l border-gray-200 flex flex-col items-center justify-start ${activeTab === 'form' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="w-full mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" /> Real-time Live Card Preview
              </span>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
                Matches Reference Image Layout
              </span>
            </div>

            <div className="w-full scale-90 sm:scale-95 origin-top transition-all">
              <HackathonImageCard
                hackathon={{
                  title: formData.title || 'Global AI Summit Challenge',
                  category: formData.category || 'ARTIFICIAL INTELLIGENCE',
                  organizer: formData.organizer || 'Nexus AI',
                  date: formData.date || 'Oct 23 - 26, 2026',
                  location: formData.location || 'Virtual',
                  prizePool: formData.prizePool || '$10,000',
                  description: formData.description || "Join the world's leading AI innovators to build the next generation of intelligent systems...",
                  registrationDeadline: formData.registrationDeadline || 'Registration closes on Oct 18, 2026',
                  websiteUrl: formData.websiteUrl || '#'
                }}
                showActions={false}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-sm transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="hackathon-form"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            {editingHackathon ? 'Save Changes' : 'Insert Hackathon Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
