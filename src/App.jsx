import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import HackathonCard from './components/HackathonCard';
import HackathonFormModal from './components/HackathonFormModal';
import Login from './Login';
import { Plus, Filter, Info, LogOut } from 'lucide-react';

const CATEGORIES = ['ALL', 'ARTIFICIAL INTELLIGENCE', 'BLOCKCHAIN & WEB3', 'CYBERSECURITY', 'CLIMATE & CLEAN TECH'];

// --- Boundary mappers: the cards speak the portal's display shape, Convex
// speaks ISO dates. Both directions translate here so neither side changes.

const fromDoc = (d) => ({
  id: d._id,
  title: d.title,
  category: (d.tag || '').toUpperCase(),
  organizer: d.organizer,
  date: d.dateDisplay || `${d.startsOn} - ${d.endsOn}`,
  location: d.location,
  prizePool: d.prize,
  description: d.description,
  registrationDeadline: d.deadlineDisplay || `Registration closes on ${d.deadline}`,
  deadlineDate: d.deadline,
  status: d.status || 'Upcoming',
  isFeatured: d.isFeatured ?? false,
  websiteUrl: d.websiteUrl || '',
  startsOn: d.startsOn,
  endsOn: d.endsOn,
});

const toArgs = (f) => ({
  title: f.title,
  organizer: f.organizer,
  description: f.description || '',
  location: f.location || '',
  startsOn: f.startsOn || '',
  endsOn: f.endsOn || f.startsOn || '',
  deadline: f.deadlineDate || '',
  prize: f.prizePool || '',
  tag: (f.category || '').toLowerCase().replace(/^./, (c) => c.toUpperCase()),
  dateDisplay: f.date || undefined,
  deadlineDisplay: f.registrationDeadline || undefined,
  websiteUrl: f.websiteUrl || undefined,
  status: f.status || undefined,
  isFeatured: f.isFeatured ?? undefined,
});

export default function App() {
  const docs = useQuery(api.hackathons.list);
  const createHackathon = useMutation(api.admin.create);
  const updateHackathon = useMutation(api.admin.update);
  const removeHackathon = useMutation(api.admin.remove);
  const logout = useMutation(api.auth.logout);

  const [token, setToken] = useState(() => localStorage.getItem('tp_admin_token') || '');
  const tokenValid = useQuery(api.auth.validate, token ? { token } : 'skip');

  // Drop stale/expired sessions.
  useEffect(() => {
    if (token && tokenValid === false) {
      localStorage.removeItem('tp_admin_token');
      setToken('');
    }
  }, [token, tokenValid]);

  const handleLogout = async () => {
    try { await logout({ token }); } catch {}
    localStorage.removeItem('tp_admin_token');
    setToken('');
  };

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState(null);

  const hackathons = (docs ?? []).map(fromDoc);

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  const handleSaveHackathon = async (hackathonData) => {
    try {
      if (editingHackathon) {
        await updateHackathon({ id: editingHackathon.id, token, ...toArgs(hackathonData) });
      } else {
        await createHackathon({ token, ...toArgs(hackathonData) });
      }
    } catch (err) {
      alert(err?.message?.includes('Unauthorized') ? 'Session expired — log in again.' : String(err));
    }
  };

  const handleDeleteHackathon = (id) => {
    if (window.confirm('Delete this hackathon entry?')) {
      removeHackathon({ id, token }).catch(() => alert('Session expired — log in again.'));
    }
  };

  const handleOpenEdit = (hackathon) => {
    setEditingHackathon(hackathon);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingHackathon(null);
    setIsModalOpen(true);
  };

  const filteredHackathons = hackathons.filter(h => {
    return selectedCategory === 'ALL' || h.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col font-sans antialiased">
      
      {/* 1. Aligned Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-[3px] border-[#2DD4BF] bg-[#ECFDF5] flex items-center justify-center shadow-xs shrink-0">
              <div className="w-4 h-4 rounded-full bg-[#0D9488]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Syne']">
                Hackathon Portal
              </h1>
              <p className="text-xs text-gray-500 font-semibold">Team Hackathon Insert & Tracking Dashboard</p>
            </div>
          </div>

          {/* Logout + Insert Hackathon Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              title="Log out"
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" /> Insert Hackathon
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Aligned Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Category Selection Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200/90 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-600" /> Category:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Counter Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            All Hackathons ({filteredHackathons.length})
          </span>
          <span className="text-xs text-gray-400">
            {docs === undefined ? 'Connecting to backend…' : 'Live from Convex'}
          </span>
        </div>

        {/* 3. Perfectly Aligned Hackathon Cards Grid */}
        {docs === undefined ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 my-8">
            <p className="text-xs text-gray-500">Loading hackathons…</p>
          </div>
        ) : filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center">
            {filteredHackathons.map(hackathon => (
              <div key={hackathon.id} className="w-full flex">
                <HackathonCard
                  hackathon={hackathon}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteHackathon}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 my-8 space-y-3">
            <Info className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Hackathons Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No hackathons found in this category. Click below to insert a new hackathon event.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Insert Hackathon
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs font-medium text-gray-500 mt-12">
        Team Hackathon Dashboard &copy; 2026
      </footer>

      {/* Insert / Edit Form Modal */}
      <HackathonFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHackathon}
        editingHackathon={editingHackathon}
      />

    </div>
  );
}
