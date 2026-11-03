import { useState } from 'react';
import { motion } from 'framer-motion';
import { SHOP } from '../data/content.ts';
import { S, save, assessQueue } from '../engine/engine.ts';
import { assessDone } from '../engine/game.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { runQueue } from '../engine/runner.ts';
import { AvatarFace, Card, MASCOT, Page } from '../ui/kit.tsx';

export function startAssess() {
  runQueue(assessQueue(), { exam: true, assess: true, single: true, noHint: true, title: 'מבחן הכרות', onDone: (s: any) => assessDone(s).map((l) => l) });
}

export function Setup() {
  const g = useGame(), ui = useUI(), [name, setName] = useState(g.name || '');
  const sw = (k: 'shirt' | 'hair') => (
    <div className="flex flex-wrap gap-3">
      {(SHOP[k] as any[]).filter((x) => !x[3]).map((x) => (
        <motion.button whileTap={{ scale: 0.88 }} key={x[0]} onClick={() => { S.avatar[k] = x[0]; save(); }} aria-label={x[1]}
          className={`h-14 w-14 rounded-full border-4 ${g.avatar[k] === x[0] ? 'border-[#ffb02e] ring-4 ring-[#ffb02e]/40' : 'border-white'} shadow-chunky`} style={{ background: x[2] }} />
      ))}
    </div>
  );
  const ok = () => {
    const v = name.trim(); if (!v) { ui.toast('כתבו את השם שלכם 🙂'); return; }
    S.name = v.slice(0, 14); save(); if (S.assessed) ui.reset('menu'); else ui.replace('assessIntro');
  };
  return (
    <Page title="איזה הרפתקן אתם?" back={!!g.name}>
      <div className="flex justify-center py-2"><motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2 }}><AvatarFace size={110} /></motion.div></div>
      <Card title="איך קוראים לכם?"><input className="field" maxLength={14} placeholder="השם שלכם" value={name} onChange={(e) => setName(e.target.value)} /></Card>
      <Card title="צבע חולצה">{sw('shirt')}<h3 className="mb-2 mt-4 text-lg font-extrabold text-[#8a4a12]">צבע שיער</h3>{sw('hair')}
        <p className="mt-3 text-sm text-[#8a6a45]">עוד פריטים (כובעים, תיקים, חיות מחמד) אפשר לקנות במטבעות שתאספו.</p></Card>
      <button className="btn btn-gold btn-lg mt-2 w-full" onClick={ok}>בואו נתחיל ←</button>
    </Page>
  );
}

export function AssessIntro() {
  const g = useGame(), ui = useUI();
  return (
    <Page title={`שלום ${g.name}!`} back={false}>
      <Card className="text-center">
        <div className="text-6xl">{MASCOT}</div>
        <p className="mt-2 text-lg font-bold">לפני שיוצאים להרפתקה – <b>מבחן הכרות קצר</b> (כ-13 שאלות, 4 דקות): מילים, איות, דקדוק, קריאה והאזנה.</p>
        <p className="mt-2 text-[#6b4a2b]">אין רמזים במבחן, וזה בסדר לטעות – המשחק פשוט יתאים את הקושי לכם. 🙂</p>
        <div className="mt-4 grid gap-3">
          <button className="btn btn-gold btn-lg" onClick={() => { ui.reset('menu'); startAssess(); }}>יוצאים לדרך ←</button>
          <button className="btn btn-cream" onClick={() => { S.assessed = true; save(); ui.reset('menu'); }}>דלגו – נתחיל ישר</button>
        </div>
      </Card>
    </Page>
  );
}
