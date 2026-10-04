import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { LogIn } from 'lucide-react';

export default function Login({ onLogin }) {
  const login = useMutation(api.auth.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await login({ email: email.trim(), password });
      if (res.ok) {
        localStorage.setItem('tp_admin_token', res.token);
        onLogin(res.token);
      } else {
        setError('Invalid email or password.');
      }
    } catch {
      setError('Could not reach the backend. Is `npx convex dev` running?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl shadow-xs p-8 w-full max-w-sm space-y-5">
        <div className="flex items-center gap-3">
          <img src="favicon.png" alt="HackLoop logo" className="w-10 h-10 rounded-full shadow-xs shrink-0" />
          <div>
            <h1 className="text-xl font-black text-slate-900 font-['Syne']">Admin Login</h1>
            <p className="text-xs text-gray-500 font-semibold">HackLoop</p>
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="admin@techpune.local"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm py-2.5 flex items-center justify-center gap-2 transition-all"
        >
          <LogIn className="w-4 h-4" /> {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          No default credentials — the first admin is created by the backend operator.
        </p>
      </form>
    </div>
  );
}
