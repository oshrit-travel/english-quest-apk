import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { NPCS } from './data/content.ts';
import { S, dayKey, save } from './engine/engine.ts';
import { checkGate } from './engine/game.ts';
import { bus } from './engine/bus.ts';
import { useUI, syncWorldMode } from './engine/ui.ts';
import { useWorld, player } from './world/store.ts';
import Hud from './screens/Hud.tsx';
import Menu from './screens/Menu.tsx';
import { Setup, AssessIntro } from './screens/Setup.tsx';
import Dialog from './screens/Dialog.tsx';
import MapScreen from './screens/MapScreen.tsx';
import Activity from './screens/Activity.tsx';
import Results from './screens/Results.tsx';
import { Practice, School, Exam, Vocab, Daily, Achievements } from './screens/Lists.tsx';
import { Inventory, Profile, Settings, Parent } from './screens/Account.tsx';
import { Toasts } from './ui/kit.tsx';

const GameCanvas = lazy(() => import('./world/Scene.tsx'));

function LevelUp() {
  const n = useUI((s) => s.levelUp), set = useUI((s) => s.setLevelUp);
  useEffect(() => { if (n) { const t = setTimeout(() => set(null), 3200); return () => clearTimeout(t); } }, [n, set]);
  return (
    <AnimatePresence>
      {n && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => set(null)}>
          <motion.div initial={{ scale: 0.3, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 10 }} className="panel px-10 py-8 text-center">
            <div className="text-6xl">🌟</div><div className="mt-2 text-lg font-bold text-[#8a4a12]">עליתם רמה!</div>
            <div className="text-6xl font-extrabold text-[#e5604a]">{n}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const stack = useUI((s) => s.stack), dialog = useUI((s) => s.dialog), ui = useUI;
  const top = stack[stack.length - 1];

  useEffect(() => {
    checkGate(); // an existing save may already qualify for the next region
    const q = S.set.quality; if (q === 'low' || q === 'high') useWorld.getState().setQuality(q);
    const off = [
      bus.on('toast', (m) => ui.getState().toast(m)),
      bus.on('levelup', (n) => ui.getState().setLevelUp(n)),
      bus.on('npc-tap', (id) => {
        const n = (NPCS as any)[id]; if (!n || ui.getState().stack.at(-1)?.name !== 'world') return;
        if (Math.hypot(n.x - player.x, n.z - player.z) < 4.8) { player.wave = 1.4; ui.getState().openDialog(id); } else ui.getState().toast('התקרבו אל ' + n.n + ' כדי לדבר');
      }),
      bus.on('interact', () => {
        const s = ui.getState(); if (s.stack.at(-1)?.name !== 'world' || s.dialog) return;
        const near = useWorld.getState().near; if (near) { player.wave = 1.4; s.openDialog(near); }
      }),
    ];
    const unsub = useUI.subscribe(syncWorldMode); syncWorldMode();
    const tick = setInterval(() => { const n = useUI.getState().stack.at(-1)!.name; if (document.hidden || n === 'menu' || n === 'parent') return; const k = dayKey(); S.time[k] = (S.time[k] || 0) + 10; save(); }, 10000);
    let removeBack: (() => void) | undefined;
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/app').then(({ App: CapApp }) => {
        CapApp.addListener('backButton', () => {
          const s = ui.getState(); if (s.dialog || s.levelUp) { s.openDialog(null); s.setLevelUp(null); return; }
          const name = s.stack.at(-1)!.name;
          if (name === 'world') { bus.emit('escape'); return; }
          if (name === 'activity') { bus.emit('quit-request'); return; }
          if (!s.back()) CapApp.exitApp();
        }).then((h) => { removeBack = () => h.remove(); });
      }).catch(() => {});
      import('@capacitor/status-bar').then(({ StatusBar }) => StatusBar.hide()).catch(() => {});
    }
    return () => { off.forEach((f) => f()); unsub(); clearInterval(tick); removeBack?.(); };
  }, []);

  // Android hardware back on an activity: same confirmation as the ✕ button
  useEffect(() => bus.on('quit-request', () => { import('./engine/runner.ts').then((m) => { if (confirm('לצאת מהתרגול?')) m.quit(); }); }), []);

  const arg = top.arg;
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#17323d]" dir="rtl">
      <Suspense fallback={<div className="grid h-full place-items-center text-2xl text-white">🏝️ טוען…</div>}><GameCanvas /></Suspense>
      {top.name === 'world' && <Hud />}
      <div key={top.name} className="contents">
          {top.name === 'menu' && <Menu />}
          {top.name === 'setup' && <Setup />}
          {top.name === 'assessIntro' && <AssessIntro />}
          {top.name === 'map' && <MapScreen />}
          {top.name === 'practice' && <Practice />}
          {top.name === 'school' && <School />}
          {top.name === 'exam' && <Exam />}
          {top.name === 'vocab' && <Vocab />}
          {top.name === 'daily' && <Daily />}
          {top.name === 'ach' && <Achievements />}
          {top.name === 'inv' && <Inventory />}
          {top.name === 'profile' && <Profile />}
          {top.name === 'settings' && <Settings />}
          {top.name === 'parent' && <Parent />}
          {top.name === 'activity' && <Activity />}
          {top.name === 'results' && <Results s={arg} />}
      </div>
      <AnimatePresence>{dialog && <Dialog key={dialog.npc} id={dialog.npc} />}</AnimatePresence>
      <Toasts /><LevelUp />
    </div>
  );
}
