import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NPCS, MISSIONS, REGIONS } from '../data/content.ts';
import { levelInfo, currentMission, mDone } from '../engine/engine.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { bus } from '../engine/bus.ts';
import { input, useWorld } from '../world/store.ts';
import { Bar, CoinPill, Portrait, XpRing } from '../ui/kit.tsx';

function Joystick() {
  const base = useRef<HTMLDivElement>(null), knob = useRef<HTMLDivElement>(null), pid = useRef<number | null>(null);
  const move = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect(), R = r.width / 2;
    let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R); const m = Math.hypot(dx, dy);
    if (m > R) { dx *= R / m; dy *= R / m; }
    knob.current!.style.transform = `translate(${dx}px,${dy}px)`; input.joyX = dx / R; input.joyY = -dy / R;
  };
  const end = (e: React.PointerEvent) => { if (e.pointerId !== pid.current) return; pid.current = null; knob.current!.style.transform = ''; input.joyX = input.joyY = 0; };
  useEffect(() => () => { input.joyX = input.joyY = 0; }, []);
  return (
    <div ref={base} dir="ltr" className="pointer-events-auto absolute h-[132px] w-[132px] touch-none rounded-full border-[3px] border-white/40 bg-white/15 backdrop-blur-sm landscape:h-[116px] landscape:w-[116px]"
      style={{ left: 'calc(var(--sal) + 22px)', bottom: 'calc(var(--sab) + 24px)' }}
      onPointerDown={(e) => { pid.current = e.pointerId; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); move(e); }} onPointerMove={(e) => { if (e.pointerId === pid.current) move(e); }} onPointerUp={end} onPointerCancel={end}>
      <div className="absolute inset-0 grid place-items-center text-white/50"><span className="absolute top-1">▲</span><span className="absolute bottom-1">▼</span><span className="absolute left-2">◀</span><span className="absolute right-2">▶</span></div>
      <div ref={knob} className="absolute left-1/2 top-1/2 -ml-[27px] -mt-[27px] h-[54px] w-[54px] rounded-full bg-gradient-to-b from-white to-[#e9dcc0] shadow-lg" />
    </div>
  );
}

function ActionButton() {
  const near = useWorld((s) => s.near);
  const m = near ? MISSIONS.find((x) => x.npc === near) : null;
  return (
    <AnimatePresence>
      {near && (
        <motion.button key={near} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} whileTap={{ scale: 0.9 }}
          onClick={() => bus.emit('interact')} className="pointer-events-auto absolute flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full border-4 border-[#b9770e] bg-gradient-to-b from-[#ffe08a] to-[#ffb02e] text-[#4a2a05] shadow-chunky"
          style={{ right: 'calc(var(--sar) + 22px)', bottom: 'calc(var(--sab) + 30px)' }}>
          <span className="absolute inset-0 animate-ring rounded-full border-4 border-[#ffd34a]" />
          <span className="text-4xl leading-none">{m?.boss ? '⚔️' : '💬'}</span>
          <span className="text-[13px] font-extrabold">{(NPCS as any)[near].n}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Quest() {
  const g = useGame(), cm = currentMission();
  const reg = cm ? MISSIONS.filter((m) => m.r === cm.r) : [], done = reg.filter((m) => mDone(m.id)).length;
  const ui = useUI();
  return (
    <button onClick={() => ui.go('map', 'world')} className="glass pointer-events-auto flex max-w-[min(420px,58vw)] items-center gap-3 px-3 py-2 text-right">
      {cm ? <Portrait id={cm.npc} size={42} /> : <div className="text-3xl">🎉</div>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] font-bold text-[#ffd34a]">{cm ? `משימה · ${REGIONS[cm.r - 1].he}` : 'כל הכבוד!'}</div>
        <div className="truncate text-sm font-extrabold">{cm ? cm.title : 'השלמתם את כל המשימות הזמינות'}</div>
        {cm && <div className="truncate text-xs text-white/80">{cm.obj}</div>}
        {cm && <div className="mt-1"><Bar pct={(done / reg.length) * 100} h={7} /></div>}
      </div>
    </button>
  );
}

export default function Hud() {
  const g = useGame(), ui = useUI(), L = levelInfo(g.xp), zoomBy = useWorld((s) => s.zoomBy);
  const [pause, setPause] = useState(false);
  const [pop, setPop] = useState(0);
  useEffect(() => {
    const a = bus.on('escape', () => setPause((p) => !p));
    const b = bus.on('coin', () => setPop((n) => n + 1));
    return () => { a(); b(); };
  }, []);
  const IB = ({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) => <button aria-label={label} onClick={onClick} className="glass pointer-events-auto grid h-12 w-12 place-items-center !rounded-2xl text-2xl active:scale-90">{icon}</button>;
  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none" dir="ltr">
      <div className="absolute flex items-start justify-between gap-2" style={{ top: 'calc(var(--sat) + 8px)', left: 'calc(var(--sal) + 10px)', right: 'calc(var(--sar) + 10px)' }}>
        <div className="flex flex-col gap-2">
          <div className="glass pointer-events-auto flex items-center gap-3 py-1.5 pl-1.5 pr-4" dir="rtl">
            <XpRing size={58} />
            <div className="min-w-[88px]">
              <div className="text-sm font-extrabold">{g.name || 'הרפתקן'}</div>
              <div className="text-[11px] text-white/75">רמה {L.lvl} · {L.cur}/{L.need} XP</div>
              <div className="mt-1 flex items-center gap-2"><CoinPill className="!px-2 !py-0 text-xs" /></div>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 justify-center sm:flex" dir="rtl"><Quest /></div>
        <div className="flex gap-2">
          <IB icon="🗺️" label="מפה" onClick={() => ui.go('map', 'world')} />
          <IB icon="🎒" label="ארון" onClick={() => ui.go('inv')} />
          <IB icon="🏆" label="הישגים" onClick={() => ui.go('ach')} />
          <IB icon="⏸" label="הפסקה" onClick={() => setPause(true)} />
        </div>
      </div>
      <div className="absolute flex justify-center sm:hidden" style={{ top: 'calc(var(--sat) + 80px)', left: 12, right: 12 }} dir="rtl"><Quest /></div>
      <div className="absolute flex flex-col gap-2" style={{ right: 'calc(var(--sar) + 10px)', top: '44%' }}>
        <IB icon="＋" label="הגדלה" onClick={() => zoomBy(1.15)} /><IB icon="－" label="הקטנה" onClick={() => zoomBy(0.87)} />
      </div>
      <Joystick /><ActionButton />
      <AnimatePresence>{pop > 0 && <motion.div key={pop} initial={{ y: 0, opacity: 1 }} animate={{ y: -40, opacity: 0 }} transition={{ duration: 0.9 }} className="absolute left-1/2 top-[40%] text-2xl font-extrabold text-[#ffd34a] drop-shadow">+2 🪙</motion.div>}</AnimatePresence>
      <AnimatePresence>
        {pause && (
          <motion.div className="pointer-events-auto absolute inset-0 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} dir="rtl">
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="panel w-full max-w-sm p-5 text-center">
              <h2 className="mb-3 text-2xl font-extrabold text-[#8a4a12]">⏸ הפסקה</h2>
              <div className="grid gap-3">
                <button className="btn btn-green btn-lg" onClick={() => setPause(false)}>▶ חזרה לעולם</button>
                <button className="btn btn-cream" onClick={() => { setPause(false); ui.go('map', 'world'); }}>🗺️ מפה ומשימות</button>
                <button className="btn btn-cream" onClick={() => { setPause(false); ui.go('settings'); }}>⚙️ הגדרות</button>
                <button className="btn btn-coral" onClick={() => { setPause(false); ui.reset('menu'); }}>🏠 לתפריט הראשי</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
