import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CFG, MISSIONS, NPCS, REGIONS } from '../data/content.ts';
import { missionState, regionOpen, gateInfo } from '../engine/engine.ts';
import { missionDone, missionQueue } from '../engine/game.ts';
import { useUI } from '../engine/ui.ts';
import { runQueue } from '../engine/runner.ts';
import { Portrait } from '../ui/kit.tsx';

export function startMission(m: any) {
  const o: any = { title: m.title, mission: m, onDone: (s: any) => missionDone(m, s) };
  if (m.boss) Object.assign(o, { boss: true, single: true, noHint: true, bossEmoji: m.r === 1 ? '💂' : '🧟' });
  runQueue(missionQueue(m), o);
}

/** NPC conversation: a sequence of speech bubbles (story → goal → lesson → call-to-action). */
export default function Dialog({ id }: { id: string }) {
  const ui = useUI(), n = (NPCS as any)[id];
  const m: any = MISSIONS.find((x) => x.npc === id);
  const [i, setI] = useState(0);
  let lines: { t: string; h: string }[] = [], cta: string | null = null, locked = false;
  if (!m) lines = [{ t: '', h: 'שלום! שמחים לראות אותך.' }];
  else {
    const st = missionState(m);
    if (st === 'lock') {
      locked = true;
      const g = gateInfo();
      const why = !regionOpen(m.r) ? (g.boss ? `עברת את הקרב, אבל צריך לתרגל עוד מילים: ${g.learned}/${g.need}. תרגלו ונפתח את השער!` : `כדי לפתוח את שער החווה צריך לנצח את שומר השער (לפחות ${Math.round(CFG.passBoss * 100)}%) ולתרגל מילים.`) : m.boss ? 'קודם השלימו את כל המשימות באזור הזה.' : 'קודם השלימו את המשימה הקודמת באזור.';
      lines = [{ t: '🔒 עוד לא', h: why }];
    } else {
      lines = [{ t: '📖 הסיפור', h: m.story }, { t: '🎯 המטרה', h: m.obj }, { t: '🧠 שיעור קצר', h: m.lesson }];
      cta = st === 'done' ? 'שחקו שוב' : m.boss ? '⚔️ לקרב!' : 'יוצאים לדרך!';
    }
  }
  const last = i >= lines.length - 1, cur = lines[Math.min(i, lines.length - 1)];
  const close = () => ui.openDialog(null);
  return (
    <motion.div className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 p-3 safe-pb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} dir="rtl">
      <motion.div className="panel relative w-full max-w-xl p-4 pt-9" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20 }} onClick={(e) => e.stopPropagation()}>
        <div className="absolute -top-8 right-4 flex items-center gap-2">
          <Portrait id={id} size={72} />
          <div className="tag tag-gold !text-sm">{n.n}{m && ` · ${REGIONS[m.r - 1].emoji}`}</div>
        </div>
        <button aria-label="סגירה" className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/10 text-lg font-bold" onClick={close}>✕</button>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 min-h-[110px]">
            {cur.t && <div className="mb-1 text-sm font-extrabold text-[#b4570f]">{cur.t}</div>}
            <p className="text-lg font-bold leading-relaxed text-[#4b3320]" dangerouslySetInnerHTML={{ __html: cur.h }} />
          </motion.div>
        </AnimatePresence>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">{lines.map((_, k) => <span key={k} className={`h-2.5 w-2.5 rounded-full ${k <= i ? 'bg-[#ffb02e]' : 'bg-black/15'}`} />)}</div>
          {!last ? <button className="btn btn-gold" onClick={() => setI(i + 1)}>המשך ←</button>
            : locked || !cta ? <button className="btn btn-cream" onClick={close}>הבנתי</button>
            : <div className="flex gap-2"><button className="btn btn-cream btn-sm" onClick={close}>אחר כך</button><button className="btn btn-green" onClick={() => { close(); startMission(m); }}>{cta}</button></div>}
        </div>
        {m && !locked && last && <div className="mt-2 text-xs text-[#8a6a45]">תגמול: {CFG.xp.mission} XP · {CFG.coins.mission} 🪙 · פריט אספנות {m.item}</div>}
      </motion.div>
    </motion.div>
  );
}
