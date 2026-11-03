import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NPCS, SHOP } from '../data/content.ts';
import { levelInfo } from '../engine/engine.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';

export const PORTRAIT: Record<string, string> = { dana: '👩‍🦰', yuval: '🧑‍🍳', mira: '👩‍🎨', sami: '👨‍💼', ruth: '👩‍🏫', guard: '💂', gil: '👨‍🌾', tali: '👩‍🌾', omer: '🧑‍🌾', avi: '👨‍🔧', dalia: '👩‍💼', kids: '🧒', oldgil: '🌾' };
export const MASCOT = '🦜';

export function Portrait({ id, size = 64 }: { id?: string; size?: number }) {
  const n = id ? (NPCS as any)[id] : null;
  return (
    <div className="shrink-0 rounded-full grid place-items-center border-4 border-[#fff3cf] shadow-chunky" style={{ width: size, height: size, background: n ? n.c : '#2fa6b8', fontSize: size * 0.58 }}>
      {id ? PORTRAIT[id] : MASCOT}
    </div>
  );
}

/** Little CSS face that mirrors the chosen outfit (used in the HUD, menus and the closet). */
export function AvatarFace({ size = 56 }: { size?: number }) {
  const g = useGame(), A = g.avatar;
  const c = (k: keyof typeof SHOP, id: string) => ((SHOP[k] as any[]).find((x) => x[0] === id) || [])[2];
  const hair = c('hair', A.hair) || '#5b3a1e', shirt = c('shirt', A.shirt) || '#3b82f6', hat = c('hat', A.hat);
  const s = size;
  return (
    <div className="relative shrink-0 overflow-hidden rounded-full" style={{ width: s, height: s, background: 'linear-gradient(180deg,#bfe9f5,#e8f7d4)' }}>
      <div className="absolute rounded-t-[50%]" style={{ left: s * 0.12, right: s * 0.12, bottom: -s * 0.12, height: s * 0.34, background: shirt }} />
      <div className="absolute rounded-full" style={{ left: s * 0.24, top: s * 0.17, width: s * 0.52, height: s * 0.52, background: '#f6c9a0' }} />
      <div className="absolute rounded-t-full" style={{ left: s * 0.22, top: s * 0.12, width: s * 0.56, height: s * 0.3, background: hair }} />
      {[0.36, 0.55].map((x) => <div key={x} className="absolute rounded-full" style={{ left: s * x, top: s * 0.4, width: s * 0.08, height: s * 0.1, background: '#2a1a14' }} />)}
      <div className="absolute rounded-b-full" style={{ left: s * 0.42, top: s * 0.54, width: s * 0.16, height: s * 0.07, borderBottom: `${Math.max(2, s * 0.03)}px solid #8a3b2b` }} />
      {hat && <div className="absolute rounded-t-full" style={{ left: s * 0.2, top: s * 0.04, width: s * 0.6, height: s * 0.2, background: hat }} />}
    </div>
  );
}

export function Bar({ pct, color = 'from-[#7fe08a] to-[#ffd34a]', h = 12 }: { pct: number; color?: string; h?: number }) {
  return <div className="w-full overflow-hidden rounded-full bg-black/25" style={{ height: h }}><motion.div className={`h-full rounded-full bg-gradient-to-r ${color}`} initial={false} animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>;
}

export function CoinPill({ className = '' }: { className?: string }) {
  const g = useGame();
  return <span className={`inline-flex items-center gap-1.5 rounded-full border-2 border-[#b9770e] bg-gradient-to-b from-[#ffe08a] to-[#ffb83d] px-3 py-1 text-sm font-extrabold text-[#4a2a05] shadow ${className}`}>🪙 {g.coins}</span>;
}

export function Ribbon({ children }: { children: ReactNode }) {
  return (
    <div className="relative inline-block">
      <div className="relative z-10 rounded-xl border-[3px] border-[#b9770e] bg-gradient-to-b from-[#ffe08a] to-[#ffb83d] px-6 py-1.5 text-lg font-extrabold text-[#4a2a05] shadow-chunky">{children}</div>
    </div>
  );
}

/** Full-screen page that floats over the (blurred, paused) 3D world. */
export function Page({ title, children, right, back = true }: { title: ReactNode; children: ReactNode; right?: ReactNode; back?: boolean }) {
  const ui = useUI();
  return (
    <motion.div className="fixed inset-0 z-20 flex flex-col bg-gradient-to-b from-[#17323d]/80 via-[#1c4452]/82 to-[#17323d]/92 backdrop-blur-md safe-pt"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <header className="safe-px flex items-center gap-3 pb-2">
        {back && <button className="btn btn-cream btn-sm !px-4 text-xl" onClick={() => ui.back()} aria-label="חזרה">→</button>}
        <div className="min-w-0 flex-1"><Ribbon>{title}</Ribbon></div>
        {right ?? <CoinPill />}
      </header>
      <main className="scroll-y safe-px safe-pb flex-1">
        <motion.div className="mx-auto max-w-3xl pb-6" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}>{children}</motion.div>
      </main>
    </motion.div>
  );
}

export function Card({ children, className = '', title }: { children: ReactNode; className?: string; title?: ReactNode }) {
  return <section className={`panel my-3 p-4 ${className}`}>{title && <h3 className="mb-2 text-lg font-extrabold text-[#8a4a12]">{title}</h3>}{children}</section>;
}

export function Tile({ icon, label, sub, onClick, disabled }: { icon: ReactNode; label: ReactNode; sub?: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} disabled={disabled}
      className={`panel flex min-h-[104px] flex-col items-center justify-center gap-1 p-3 text-center font-extrabold text-[#5a3b22] ${disabled ? 'opacity-50' : ''}`}>
      <span className="text-4xl leading-none">{icon}</span><span>{label}</span>{sub && <span className="text-xs font-medium text-[#8a6a45]">{sub}</span>}
    </motion.button>
  );
}

export function Toasts() {
  const t = useUI((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2" style={{ top: 'calc(var(--sat) + 76px)' }}>
      <AnimatePresence>
        {t.map((x) => <motion.div key={x.id} initial={{ y: -16, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -10 }} className="glass max-w-[90vw] px-4 py-2 text-center text-sm font-bold">{x.text}</motion.div>)}
      </AnimatePresence>
    </div>
  );
}

const EMO = ['⭐', '✨', '🎉', '🪙', '💛', '🌟'];
export function Burst({ n }: { n: number }) {
  if (!n) return null;
  return (
    <div key={n} className="pointer-events-none fixed left-1/2 top-[52%] z-[55]">
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2 + Math.random() * 0.4, d = 90 + Math.random() * 130;
        return <motion.span key={i} className="absolute text-2xl" initial={{ x: 0, y: 0, scale: 0.2, opacity: 1 }} animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d - 50, scale: 1.1, opacity: 0, rotate: Math.random() * 300 }} transition={{ duration: 0.85, ease: 'easeOut' }}>{EMO[i % EMO.length]}</motion.span>;
      })}
    </div>
  );
}

export function XpRing({ size = 64 }: { size?: number }) {
  const g = useGame(), L = levelInfo(g.xp), r = size / 2 - 4, C = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,.35)" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#ffd34a" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - L.cur / L.need)} style={{ transition: 'stroke-dashoffset .5s' }} />
      </svg>
      <div className="absolute inset-[7px]"><AvatarFace size={size - 14} /></div>
      <div className="absolute -bottom-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-[#b9770e] bg-[#ffcf3d] px-1 text-[11px] font-extrabold text-[#4a2a05]">{L.lvl}</div>
    </div>
  );
}
