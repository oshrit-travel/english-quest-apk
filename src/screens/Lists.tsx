import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATS, TOPICS, VOC, VM, PASS, WT, CFG } from '../data/content.ts';
import { ACH } from '../data/achievements.ts';
import { S, save, STATUS, status, skillAcc, weakQueue, dueIds, skillBuckets, examQueue, buildQueue, pick, sample, dayKey, say } from '../engine/engine.ts';
import { dailyPlan, dailyDone, examDone } from '../engine/game.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { runQueue } from '../engine/runner.ts';
import { Bar, Card, Page, Tile } from '../ui/kit.tsx';

export const STC = ['#b8c4cc', '#8ec9ee', '#ffd34a', '#8be08f', '#c9a3ff'];
export const StatusChip = ({ id }: { id: string }) => { const s = status(id); return <span className="chip !text-[11px]" style={{ background: STC[s] }}>{STATUS[s]}</span>; };

const MODES: [string, string, string, string][] = [['hunter', 'Word Hunter', '🎯', 'תמונות, מילים ושמע'], ['builder', 'Sentence Builder', '🧩', 'סדרו משפטים'], ['cancant', "Can or Can't", '🐦', 'יכול / לא יכול'], ['grammar', 'Grammar Master', '📐', 'דקדוק בהקשר'],
  ['listen', 'Listen & Catch', '🎧', 'האזנה והבנה'], ['reading', 'Reading Detective', '🔍', 'קטעי קריאה'], ['talk', 'Talk to People', '💬', 'שיחות עם דמויות'], ['picture', 'Picture Challenge', '🖼️', 'תארו תמונה'],
  ['missing', "What's Missing?", '🧠', 'משחק זיכרון'], ['factory', 'Word Factory', '🏭', 'אותיות ואיות'], ['fix', 'Fix the Mistake', '🔧', 'תקנו טעויות'], ['wordquest', 'Word Quest', '🔤', 'תפזורת מילים'], ['writing', 'Writing Workshop', '✍️', 'כתיבה עצמאית']];
const VIS = ['animals', 'colors', 'numbers', 'family', 'food', 'objects'];
const run = (specs: any[], title: string) => runQueue(buildQueue(specs), { title });
const Chip = ({ on, children, onClick }: any) => <button onClick={onClick} className={`chip !px-3 !py-1.5 ${on ? '!bg-[#ffb02e] !text-[#4a2a05]' : ''}`}>{children}</button>;

export function Practice() {
  const g = useGame(), ui = useUI(), [cat, setCat] = useState('animals'), [diff, setDiff] = useState(g.set.diffOverride == null ? 'auto' : String(g.set.diffOverride));
  const setD = (v: string) => { setDiff(v); S.set.diffOverride = v === 'auto' ? null : +v; save(); };
  const skill = (k: string) => {
    const sp: any = { vocabulary: [{ m: 'hunter', n: 5 }, { m: 'missing', cat: 'animals', n: 1 }], grammar: [{ m: 'grammar', n: 6 }, { m: 'fix', n: 2 }], reading: [{ m: 'reading', pid: pick(['p1', 'p2', 'p3']), n: 5 }], listening: [{ m: 'listen', kind: 'sent', n: 3 }, { m: 'listen', kind: 'word', n: 3 }], writing: [{ m: 'picture', n: 3 }, { m: 'writing', ids: sample(Object.keys(WT), 2) }], speaking: [{ m: 'talk', n: 6 }] };
    run(sp[k], 'תרגול');
  };
  const weakest = () => { const b: any = skillBuckets(), m: any = { vocab: 'vocabulary', grammar: 'grammar', reading: 'reading', listening: 'listening', writing: 'writing' }, ks = Object.keys(m).filter((k) => b[k] != null).sort((a, c) => b[a] - b[c]); skill(m[ks[0] || 'grammar']); };
  const mode = (k: string, title: string) => {
    const c = cat, vc = VIS.includes(c) ? c : 'animals';
    const sp: any = { hunter: [{ m: 'hunter', cat: c, n: 8 }], builder: [{ m: 'builder', n: 6 }], cancant: [{ m: 'cancant', n: 6 }], grammar: [{ m: 'grammar', n: 8 }], listen: [{ m: 'listen', kind: 'word', cat: c, n: 3 }, { m: 'listen', kind: 'sent', n: 3 }, { m: 'listen', kind: 'instr', n: 2 }], reading: [{ m: 'reading', pid: pick(['p1', 'p2', 'p3']), n: 5 }], talk: [{ m: 'talk', n: 6 }], picture: [{ m: 'picture', n: 5 }], missing: [{ m: 'missing', cat: vc, n: 5 }], factory: [{ m: 'factory', cat: c === 'numbers' ? 'animals' : c, n: 4, kind: 'order' }, { m: 'factory', cat: c === 'numbers' ? 'animals' : c, n: 4, kind: 'missing' }], fix: [{ m: 'fix', n: 6 }], wordquest: [{ m: 'wordquest', cat: vc }], writing: [{ m: 'writing', ids: sample(Object.keys(WT), 3) }] };
    run(sp[k], title);
  };
  const wk = weakQueue(1).length, due = dueIds().filter((x) => (VM as any)[x.slice(2)]);
  return (
    <Page title="🎯 תרגול חופשי">
      <Card title="לפי מיומנות"><div className="flex flex-wrap gap-2">{[['vocabulary', 'אוצר מילים'], ['grammar', 'דקדוק'], ['reading', 'קריאה'], ['listening', 'האזנה'], ['writing', 'כתיבה'], ['speaking', 'שיחה']].map(([k, t]) => { const a = skillAcc(k, 20); return <button key={k} className="btn btn-cream btn-sm" onClick={() => skill(k)}>{t}{a != null ? ` · ${Math.round(a * 100)}%` : ''}</button>; })}</div></Card>
      <Card title="חיזוק"><div className="flex flex-wrap gap-2">
        <button className="btn btn-gold btn-sm" disabled={!wk} onClick={() => runQueue(weakQueue(8), { title: 'שאלות שטעיתי בהן' })}>🔁 שאלות שטעיתי בהן</button>
        <button className="btn btn-green btn-sm" onClick={weakest}>📉 המיומנות החלשה שלי</button>
        <button className="btn btn-teal btn-sm" onClick={() => { if (!due.length) { ui.toast('אין כרגע מילים לחזרה 🎉'); return; } run([{ m: 'hunter', ids: sample(due.map((x) => x.slice(2)), Math.min(8, due.length)), n: 8 }], 'חזרה'); }}>⏰ מילים לחזרה ({due.length})</button></div></Card>
      <Card title="קושי"><div className="flex flex-wrap gap-2">{[['auto', 'אוטומטי'], ['0', 'קל'], ['1', 'בינוני'], ['2', 'מאתגר']].map(([v, t]) => <Chip key={v} on={diff === v} onClick={() => setD(v)}>{t}</Chip>)}</div></Card>
      <Card title="נושא (אוצר מילים ומשחקי זיכרון)"><div className="flex flex-wrap gap-2">{Object.entries(CATS).map(([k, t]) => <Chip key={k} on={cat === k} onClick={() => setCat(k)}>{t as string}</Chip>)}</div></Card>
      <h3 className="mt-4 text-lg font-extrabold text-white">משחקים</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">{MODES.map((m) => <Tile key={m[0]} icon={m[2]} label={m[1]} sub={m[3]} onClick={() => mode(m[0], m[1])} />)}</div>
      <p className="mt-3 text-sm text-white/70">⚔️ קרב הבוס מחכה לכם בעולם – בסוף כל אזור.</p>
    </Page>
  );
}

export function School() {
  const gram = (k: string) => run([{ m: 'grammar', topics: [k], n: 8 }], (TOPICS as any)[k]);
  const voc = (k: string) => run([{ m: 'hunter', cat: k, n: 6 }, { m: 'listen', kind: 'word', cat: k, n: 3 }, ...(['verbs', 'adjectives'].includes(k) ? [] : [{ m: 'factory', cat: k === 'numbers' ? 'animals' : k, n: 3, kind: 'missing' }])], (CATS as any)[k]);
  const rd = (k: string) => run([{ m: 'reading', pid: k, n: 6 }, { m: 'listen', kind: 'passage', pid: k, n: 3 }], (PASS as any)[k].title);
  return (
    <Page title="🏫 מצב בית ספר">
      <Card className="text-sm text-[#6b4a2b]">קיבוץ רמת רחל · תרגול לפי החומר שנלמד בכיתה: Can/Can't, תארים, פעלים, Present Simple, Present Continuous, קריאה ושיחות.</Card>
      <h3 className="mt-3 text-lg font-extrabold text-white">דקדוק</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">{Object.entries(TOPICS).map(([k, t]) => <Tile key={k} icon="📐" label={t as string} onClick={() => gram(k)} />)}</div>
      <h3 className="mt-4 text-lg font-extrabold text-white">רשימות מילים</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['animals', '🐑'], ['colors', '🎨'], ['numbers', '🔢'], ['family', '👪'], ['food', '🍎'], ['objects', '📚'], ['verbs', '🏃'], ['adjectives', '🌺']].map(([k, e]) => <Tile key={k} icon={e} label={(CATS as any)[k]} sub={`${VOC.filter((v: any) => v.cat === k).length} מילים`} onClick={() => voc(k)} />)}</div>
      <h3 className="mt-4 text-lg font-extrabold text-white">קריאה</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">{Object.entries(PASS).map(([k, p]: any) => <Tile key={k} icon="📖" label={p.title} sub={p.he} onClick={() => rd(k)} />)}</div>
      <h3 className="mt-4 text-lg font-extrabold text-white">עוד</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile icon="🧩" label="השלמת משפטים" onClick={() => run([{ m: 'grammar', topics: ['adj', 'vdiff', 'prep', 'conj', 'wh'], n: 10 }], 'השלמת משפטים')} />
        <Tile icon="🖼️" label="תיאור תמונות" onClick={() => run([{ m: 'picture', n: 6 }], 'תיאור תמונות')} />
        <Tile icon="💬" label="שיחות" onClick={() => run([{ m: 'talk', n: 8 }], 'שיחות')} />
        <Tile icon="✍️" label="כתיבה" onClick={() => run([{ m: 'writing', ids: sample(Object.keys(WT), 3) }], 'כתיבה')} />
      </div>
    </Page>
  );
}

export function Exam() {
  const g = useGame(), ex = g.exams.slice(-8).reverse();
  const start = (min: number) => runQueue(examQueue(min), { exam: true, single: true, noHint: true, limit: min, title: 'מבחן', onDone: (s: any) => examDone(min, s) });
  return (
    <Page title="📝 מצב מבחן">
      <Card><p className="font-bold">סימולציה של מבחן: <b>בלי רמזים</b>, ניסיון אחד לכל שאלה, שאלות חדשות בכל פעם (חלקן עם האזנה, קריאה וכתיבה). ההסבר המלא מופיע בסוף.</p>
        <div className="mt-3 grid grid-cols-3 gap-2">{[[5, 'קצר · ~8'], [10, 'בינוני · ~14'], [15, 'ארוך · ~19']].map(([m, t]) => <button key={m} className="btn btn-gold !flex-col !py-3" onClick={() => start(m as number)}><span className="text-xl">{m} דק׳</span><span className="text-xs font-medium">{t} שאלות</span></button>)}</div></Card>
      <Card title="היסטוריית ציונים">{ex.length ? <table className="w-full text-right"><tbody><tr className="text-sm text-[#8a6a45]"><th>תאריך</th><th>משך</th><th>ציון</th></tr>{ex.map((e: any, i: number) => <tr key={i} className="border-t border-black/10"><td className="py-1">{new Date(e.t).toLocaleDateString('he-IL')}</td><td>{e.min} דק׳</td><td className="font-extrabold">{e.score}%</td></tr>)}</tbody></table> : <div className="text-[#8a6a45]">עדיין לא נעשה מבחן</div>}</Card>
    </Page>
  );
}

export function Vocab() {
  const g = useGame();
  return (
    <Page title="📚 אוצר מילים">
      <Card className="text-sm text-[#6b4a2b]">לחצו על מילה כדי לשמוע. הסטטוס משקף שליטה אמיתית: חדש ← לומד ← מתרגל ← נלמד ← שולט (דורש הצלחות חוזרות בימים שונים ובכמה סוגי תרגילים).</Card>
      {Object.entries(CATS).map(([k, t]) => (
        <Card key={k} title={t as string}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{VOC.filter((v: any) => v.cat === k).map((v: any) => { const m = g.mastery['v:' + v.id], due = m && m.reps && m.next <= Date.now(); return (
            <motion.button whileTap={{ scale: 0.94 }} key={v.id} onClick={() => say(v.en)} className="rounded-2xl border-2 border-[#e4c88e] bg-white/70 p-2 text-center">
              <div className="text-3xl">{v.e}</div><div className="en font-extrabold">{v.en}</div><div className="text-sm text-[#8a6a45]">{v.he}</div><div className="mt-1 flex flex-wrap justify-center gap-1"><StatusChip id={'v:' + v.id} />{due && <span className="chip !bg-[#fde1dc] !text-[11px]">⏰</span>}</div></motion.button>); })}</div>
        </Card>))}
    </Page>
  );
}

export function Daily() {
  useGame(); const p = dailyPlan();
  return (
    <Page title="📅 משימת היום">
      <Card className="text-sm text-[#6b4a2b]">התוכנית נבנית מחדש בכל פעם לפי הפריטים שהגיע זמן לחזור עליהם והמיומנות החלשה ביותר. אין עונש על ימים שהוחמצו.</Card>
      {p.map((s, i) => <Card key={i}><div className="flex items-center gap-3"><span className="text-4xl">{s.ic}</span><div className="flex-1"><b>{i + 1}. {s.t}</b> <span className="chip">~{s.min} דק׳</span><div className="text-sm text-[#8a6a45]">{s.sub}</div></div></div></Card>)}
      <button className="btn btn-gold btn-lg mt-2 w-full" onClick={() => runQueue(p.flatMap((s) => buildQueue(s.specs)), { title: 'משימת היום', onDone: () => dailyDone() })}>יוצאים לדרך ←</button>
    </Page>
  );
}

export function Achievements() {
  const g = useGame();
  return (
    <Page title="🏆 הישגים">
      <div className="grid gap-3 sm:grid-cols-2">{ACH.map((a) => { const on = g.ach.includes(a[0]); return (
        <div key={a[0]} className={`panel flex items-center gap-3 p-3 ${on ? '' : 'opacity-55 grayscale'}`}><span className="text-4xl">{on ? '🏆' : '🔒'}</span><div className="flex-1"><b>{a[1]}</b><div className="text-sm text-[#8a6a45]">{a[2]}</div></div><span className="chip">+{a[4]}🪙</span></div>); })}</div>
    </Page>
  );
}
