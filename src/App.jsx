import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import HackathonCard from './components/HackathonCard';
import HackathonFormModal from './components/HackathonFormModal';
import Login from './Login';
import { Plus, Filter, LogOut, LayoutDashboard, CalendarDays, MessageSquare, Star, Trash2, Trophy } from 'lucide-react';

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

const Stars = ({ value }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${value && i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
    ))}
  </div>
);

export default function App() {
  const docs = useQuery(api.hackathons.list);
  const createHackathon = useMutation(api.admin.create);
  const updateHackathon = useMutation(api.admin.update);
  const removeHackathon = useMutation(api.admin.remove);
  const logout = useMutation(api.auth.logout);

  const [token, setToken] = useState(() => localStorage.getItem('tp_admin_token') || '');
  const tokenValid = useQuery(api.auth.validate, token ? { token } : 'skip');
  const feedback = useQuery(api.feedback.list, token ? { token } : 'skip');
  const removeFeedback = useMutation(api.feedback.remove);

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

  const [view, setView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState(null);

  const hackathons = (docs ?? []).map(fromDoc);

  if (!token) return <Login onLogin={setToken} />;

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

  const handleOpenEdit = (hackathon) => { setEditingHackathon(hackathon); setIsModalOpen(true); };
  const handleOpenAdd = () => { setEditingHackathon(null); setIsModalOpen(true); };

  const filteredHackathons = hackathons.filter(h => selectedCategory === 'ALL' || h.category === selectedCategory);

  const upcoming = hackathons.filter((h) => h.status === 'Upcoming').length;
  const ongoing = hackathons.filter((h) => h.status === 'Ongoing').length;
  const avgRating = feedback && feedback.length
    ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.filter((f) => f.rating).length).toFixed(1)
    : '—';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hackathons', label: 'Hackathons', icon: CalendarDays },
    { id: 'feedback', label: `Feedback${feedback ? ` · ${feedback.length}` : ''}`, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-6 flex items-center gap-3">
          <img src="favicon.png" alt="HackLoop logo" className="w-9 h-9 rounded-full" />
          <div>
            <h1 className="text-lg font-black font-['Syne']">HackLoop</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Admin</p>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1 flex-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                view === id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-8 py-4">
          <h2 className="text-xl font-black text-slate-900">
            {view === 'dashboard' ? 'Dashboard' : view === 'hackathons' ? 'Hackathons' : 'Feedback'}
          </h2>
          {view === 'hackathons' && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Hackathon
            </button>
          )}
        </header>

        <div className="p-8 space-y-6">
          {view === 'dashboard' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total hackathons', value: hackathons.length },
                  { label: 'Upcoming', value: upcoming },
                  { label: 'Ongoing', value: ongoing },
                  { label: 'Avg. rating', value: avgRating },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-3xl font-black mt-2">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-teal-600" /> Latest hackathons</h3>
                {docs === undefined ? (
                  <p className="text-xs text-slate-400">Loading…</p>
                ) : hackathons.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-bold text-sm">{h.title}</p>
                      <p className="text-xs text-slate-400">{h.organizer} · {h.category}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      h.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-700' :
                      h.status === 'Completed' ? 'bg-slate-100 text-slate-500' :
                      h.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'
                    }`}>{h.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'hackathons' && (
            <>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-teal-600" /> Category:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                      selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                All Hackathons ({filteredHackathons.length}) · {docs === undefined ? 'Connecting to backend…' : 'Live from Convex'}
              </p>
              {docs === undefined ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200"><p className="text-xs text-slate-400">Loading hackathons…</p></div>
              ) : filteredHackathons.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHackathons.map((h) => (
                    <HackathonCard key={h.id} hackathon={h} onEdit={handleOpenEdit} onDelete={handleDeleteHackathon} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">No hackathons</h3>
                  <p className="text-xs text-slate-400">Nothing in this category yet.</p>
                  <button onClick={handleOpenAdd} className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs inline-flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Hackathon
                  </button>
                </div>
              )}
            </>
          )}

          {view === 'feedback' && (
            <div className="space-y-4">
              {feedback === undefined ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200"><p className="text-xs text-slate-400">Loading feedback…</p></div>
              ) : feedback.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-500">No feedback yet</p>
                  <p className="text-xs text-slate-400 mt-1">Feedback sent from the Android app appears here.</p>
                </div>
              ) : feedback.map((f) => (
                <div key={f._id} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Stars value={f.rating} />
                      <span className="text-xs text-slate-400">· {new Date(f.createdAt).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => window.confirm('Delete this feedback?') && removeFeedback({ id: f._id, token })}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-700">{f.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{f.name ? `— ${f.name}` : '— Anonymous'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <HackathonFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHackathon}
        editingHackathon={editingHackathon}
      />
    </div>
  );
}
