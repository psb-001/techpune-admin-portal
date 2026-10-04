import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.jsx'

// The Convex deployment URL comes from the environment:
// `.env.local` for local dev, VITE_CONVEX_URL in the hosting provider
// (Vercel/Netlify) for production. No fallback — a missing URL fails loudly
// at startup instead of silently pointing at the wrong backend.
const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is not set');
}
const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>,
)
