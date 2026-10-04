import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';

export default function HackathonFormModal({ isOpen, onClose, onSave, editingHackathon = null }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'ARTIFICIAL INTELLIGENCE',
    organizer: '',
    date: '',
    location: '',
    prizePool: '',
    description: '',
    registrationDeadline: '',
    websiteUrl: ''
  });

  useEffect(() => {
    if (editingHackathon) {
      setFormData({
        title: editingHackathon.title || '',
        category: editingHackathon.category || 'ARTIFICIAL INTELLIGENCE',
        organizer: editingHackathon.organizer || '',
        date: editingHackathon.date || '',
        location: editingHackathon.location || '',
        prizePool: editingHackathon.prizePool || '',
        description: editingHackathon.description || '',
        registrationDeadline: editingHackathon.registrationDeadline || '',
        websiteUrl: editingHackathon.websiteUrl || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'ARTIFICIAL INTELLIGENCE',
        organizer: '',
        date: '',
        location: '',
        prizePool: '',
        description: '',
        registrationDeadline: '',
        websiteUrl: ''
      });
    }
  }, [editingHackathon, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.organizer) {
      alert('Please fill out Title and Organizer Name');
      return;
    }

    onSave({
      id: editingHackathon ? editingHackathon.id : `hack-${Date.now()}`,
      ...formData
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <h2 className="text-lg font-bold">
            {editingHackathon ? 'Edit Hackathon Event' : 'Insert New Hackathon Event'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:border-teal-500 focus:outline-none"
              >
                <option value="ARTIFICIAL INTELLIGENCE">ARTIFICIAL INTELLIGENCE</option>
                <option value="BLOCKCHAIN & WEB3">BLOCKCHAIN & WEB3</option>
                <option value="CYBERSECURITY">CYBERSECURITY</option>
                <option value="FINTECH">FINTECH</option>
                <option value="CLIMATE & CLEAN TECH">CLIMATE & CLEAN TECH</option>
                <option value="GENERAL HACKATHON">GENERAL HACKATHON</option>
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
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Organizer & Prize Pool */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Organizer *
              </label>
              <input
                type="text"
                name="organizer"
                required
                placeholder="e.g. Nexus AI"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:border-teal-500 focus:outline-none"
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
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Date Range
              </label>
              <input
                type="text"
                name="date"
                placeholder="e.g. Oct 23 - 26, 2026"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Virtual or San Francisco"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-teal-500 focus:outline-none"
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
              placeholder="Join the world's leading AI innovators..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Deadline & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Registration Deadline Text
              </label>
              <input
                type="text"
                name="registrationDeadline"
                placeholder="e.g. Registration closes on Oct 18, 2026"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Website Link
              </label>
              <input
                type="url"
                name="websiteUrl"
                placeholder="https://example.com/hackathon"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              {editingHackathon ? 'Save Changes' : 'Insert Hackathon'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
