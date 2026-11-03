import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { S, TTS, SR } from '../engine/engine.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { useRun, speak, next, quit, showHint, answerMcq, checkBuild, checkType, checkWrite, searchPick, searchHint, memoryDone, micSay } from '../engine/runner.ts';
import { Bar, Burst, Portrait, MASCOT } from '../ui/kit.tsx';

const H = (html: string) => ({ dangerouslySetInnerHTML: { __html: html } });
const subsOn = () => S.set.subs || !TTS.ok || !TTS.has;

function SpeakRow({ q }: { q: any }) {
  return (
    <div className="my-3 flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <button className="btn btn-teal !min-h-[60px] !px-6 text-3xl" aria-label="השמעה" onClick={() => speak(q.speak)}>🔊</button>
        <button className="btn btn-cream !min-h-[60px] !px-5 text-2xl" aria-label="לאט" onClick={() => speak(q.speak, true)}>🐢</button>
        {q.qspeak && <button className="btn btn-cream !min-h-[60px] !px-5 text-2xl" aria-label="השמעת השאלה" onClick={() => speak(q.qspeak)}>❓</button>}
      </div>
      {subsOn() && q.speak && !q.passage && !q.nosub && <div className="sub en text-lg font-bold">{q.speak}</div>}
    </div>
  );
}

function Passage({ q, revealed }: { q: any; revealed: boolean }) {
  const p = q.passage; if (!p) return null;
  if (p.hidden && !revealed) return (
    <div className="panel-inset mb-3 p-3 text-center"><div className="font-extrabold">{p.title}</div>🎧 הקשיבו לקטע (אפשר להשמיע שוב) ואז ענו על השאלה.{subsOn() && <div className="sub en mt-2 text-left">{p.s.join(' ')}</div>}</div>
  );
  return (
    <div className="panel-inset pass mb-3 p-3"><div className="mb-1 font-extrabold">{p.title}</div>
      {p.s.map((s: string, i: number) => <span key={i} className={q.showEv && p.ev === i ? 'hl' : ''}>{s} </span>)}
    </div>
  );
}

function Mcq({ q, dis }: { q: any; dis: boolean }) {
  return (
    <div className={`mt-3 grid gap-3 ${q.opts.length > 3 && q.opts.every((o: any) => o.h.length < 28) ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {q.opts.map((o: any, i: number) => {
        const cls = q.dead?.[i] ? 'bad' : dis && o.ok ? 'good' : q.picked === i && o.ok ? 'good' : '';
        return <motion.button key={i} whileTap={{ scale: 0.96 }} className={`opt ${cls}`} disabled={dis} onClick={() => answerMcq(i)} {...H(o.h)} />;
      })}
    </div>
  );
}

function Build({ q, dis, shakeKey }: { q: any; dis: boolean; shakeKey: number }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const txt = placed.map((i) => q.tiles[i]).join(q.join);
  return (
    <div className="mt-3">
      <motion.div key={shakeKey} animate={shakeKey ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.35 }} dir="ltr"
        className="flex min-h-[72px] flex-wrap items-center gap-2 rounded-2xl border-[3px] border-dashed border-[#d9b872] bg-white/60 p-2">
        {!placed.length && <span className="w-full text-center text-sm text-[#a58a5e]">לחצו על המילים כדי לבנות</span>}
        {placed.map((ti, pos) => <motion.button layout key={ti} className="tile" disabled={dis} onClick={() => setPlaced(placed.filter((_, k) => k !== pos))}>{q.tiles[ti]}</motion.button>)}
      </motion.div>
      <div dir="ltr" className="mt-3 flex min-h-[60px] flex-wrap justify-center gap-2">
        {q.tiles.map((t: string, i: number) => placed.includes(i) ? null : <motion.button layout key={i} className="tile" disabled={dis} onClick={() => setPlaced([...placed, i])}>{t}</motion.button>)}
      </div>
      <div className="mt-3 flex justify-center gap-3">
        <button className="btn btn-cream btn-sm" disabled={dis} onClick={() => setPlaced([])}>↺ איפוס</button>
        <button className="btn btn-green" disabled={dis || !placed.length} onClick={() => checkBuild(txt)}>✔ בדיקה</button>
      </div>
    </div>
  );
}

function TypeIn({ q, dis }: { q: any; dis: boolean }) {
  const [v, setV] = useState('');
  return (
    <div className="mt-3">
      <input dir="ltr" className="field text-center text-xl font-bold" autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Type here..." value={v} disabled={dis} autoFocus
        onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { checkType(v); } }} />
      <div className="mt-3 flex justify-center"><button className="btn btn-green" disabled={dis || !v.trim()} onClick={() => checkType(v)}>✔ בדיקה</button></div>
    </div>
  );
}

function Write({ q, dis, exam }: { q: any; dis: boolean; exam: boolean }) {
  const t = q.task, [v, setV] = useState('');
  return (
    <div className="mt-2">
      {t.scene && <div className="scene text-center">{t.scene}</div>}
      <p className="text-center text-lg font-bold" {...H(t.he)} />
      {!exam && <div className="mt-2 text-center"><span className="sub en">{t.ref}</span></div>}
      <textarea dir="ltr" rows={4} className="field mt-3 text-lg" placeholder="Write in English..." autoCapitalize="sentences" spellCheck={false} value={v} disabled={dis} onChange={(e) => setV(e.target.value)} />
      <div className="mt-3 flex justify-center"><button className="btn btn-green" disabled={dis} onClick={() => { if (!v.trim()) { useUI.getState().toast('כתבו משהו קודם 🙂'); return; } checkWrite(v); }}>✔ בדיקה</button></div>
      <p className="mt-2 text-center text-xs text-[#8a6a45]">הבדיקה אוטומטית לפי מילות מפתח וכללי כתיבה – היא עוזרת, אבל לא מחליפה מורה.</p>
    </div>
  );
}

function Memory({ q }: { q: any }) {
  const [s, setS] = useState(q.secs);
  useEffect(() => { const iv = setInterval(() => setS((x: number) => x - 1), 1000); return () => clearInterval(iv); }, []);
  useEffect(() => { if (s <= 0) memoryDone(); }, [s]);
  return (
    <div className="text-center"><div className="big2">זכרו את הפריטים! <span className="text-[#e5604a]">{Math.max(0, s)}</span></div>
      <div className="my-3 flex flex-wrap justify-center gap-3">{q.items.map((x: any, i: number) => <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }} className="big">{x.e}</motion.span>)}</div>
      <div className="text-[#8a6a45]">אחד מהם ייעלם...</div></div>
  );
}

function Search({ q, noHint }: { q: any; noHint: boolean }) {
  const cells = (p: any) => Array.from({ length: p.v.en.length }, (_, i) => [p.x + p.dx * i, p.y + p.dy * i]);
  const foundCells = new Set<string>(); q.place.forEach((p: any) => { if (q.found.includes(p.v.id)) cells(p).forEach((c) => foundCells.add(c.join(','))); });
  const hintCell = q.hint && !q.found.includes(q.hint.v.id) ? `${q.hint.x},${q.hint.y}` : '';
  return (
    <div className="text-center">
      <div className="big2">Word Quest 🔎</div><div className="text-sm text-[#8a6a45]">לחצו על האות הראשונה ואז על האות האחרונה של המילה</div>
      <div className="my-2 flex flex-wrap justify-center gap-2">{q.words.map((w: any) => <span key={w.id} className={`chip ${q.found.includes(w.id) ? '!bg-[#c9f2cf] line-through' : ''}`}>{w.e} <span className="en">{w.en}</span></span>)}</div>
      <div dir="ltr" className="mx-auto grid max-w-[420px] gap-1" style={{ gridTemplateColumns: `repeat(${q.N},1fr)` }}>
        {q.g.map((r: string[], y: number) => r.map((c, x) => {
          const k = `${x},${y}`, st = foundCells.has(k) ? 'bg-[#8be08f] text-[#0c3a1b]' : q.sel && q.sel[0] === x && q.sel[1] === y ? 'bg-[#ffd34a] scale-110' : hintCell === k ? 'bg-[#bfe9f5] animate-pulse' : 'bg-white';
          return <button key={k} onClick={() => searchPick(x, y)} className={`grid aspect-square place-items-center rounded-lg border-2 border-[#e4c88e] text-[clamp(.8rem,3.6vw,1.25rem)] font-extrabold uppercase text-[#4b3320] transition ${st}`}>{c}</button>;
        }))}
      </div>
      {!noHint && <button className="btn btn-cream btn-sm mt-3" onClick={searchHint}>💡 רמז</button>}
    </div>
  );
}

function Feedback({ q, fb, exitless }: { q: any; fb: any; exitless?: boolean }) {
  const [mic, setMic] = useState('');
  const tone = fb.quality === 2 ? 'from-[#d9f7dc] to-[#b7ecbf] border-[#46b560]' : fb.quality === 1 ? 'from-[#fff3cf] to-[#ffe49a] border-[#e0a92e]' : 'from-[#e3f1ff] to-[#cfe3fb] border-[#7aa9dd]';
  return (
    <motion.div initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 22 }} className={`safe-px safe-pb border-t-4 bg-gradient-to-b ${tone}`} dir="rtl">
      <div className="mx-auto flex max-w-3xl items-start gap-3 py-3">
        <div className="text-4xl">{fb.quality === 2 ? '🦜' : fb.quality === 1 ? '🙂' : '💪'}</div>
        <div className="min-w-0 flex-1 text-[#3b2514]">
          <div className="text-lg font-extrabold">{fb.msg}</div>
          {fb.why && <div className="mt-1 text-[15px]" {...H(fb.why)} />}
          {fb.revealed && <div className="mt-1 text-sm text-[#6b4a2b]">נתרגל תרגיל דומה בהמשך.</div>}
          {fb.quality === 2 && q.sayText && SR && !S.set.mute && (
            <div className="mt-2 flex flex-wrap items-center gap-2"><button className="btn btn-cream btn-sm" onClick={() => micSay(q, setMic)}>🎤 נסו להגיד בקול</button><span className="text-sm" {...H(mic)} /></div>
          )}
        </div>
        <button className={`btn ${fb.quality === 2 ? 'btn-green' : 'btn-gold'} self-center`} autoFocus onClick={next}>המשך ←</button>
      </div>
    </motion.div>
  );
}

export default function Activity() {
  useGame(); useRun((s) => s.v);
  const R = useRun((s) => s.R), ui = useUI();
  if (!R) return null;
  const q = R.q[R.i]; if (!q) return null;
  const o = R.o, dis = !!R.fb, noHint = !!o.noHint, hints = (q.hints || []).length > 0;
  const pct = Math.min(100, (R.i / R.total) * 100);
  const left = R.left ? `⏱ ${Math.floor(R.left / 60)}:${String(R.left % 60).padStart(2, '0')}` : '';
  const exit = () => { if ((o.exam || o.boss) && !confirm('לצאת באמצע? ההתקדמות בזה לא תישמר כהשלמה.')) return; quit(); };
  const bossHp = 100 - Math.round((R.res.filter((x: any) => x.quality === 2).length / R.total) * 100);
  return (
    <div className="fixed inset-0 z-20 flex flex-col bg-gradient-to-b from-[#17323d]/86 via-[#1c4452]/88 to-[#17323d]/95 backdrop-blur-md safe-pt" dir="rtl">
      <Burst n={R.burst} />
      <header className="safe-px flex items-center gap-3 pb-2">
        <button className="btn btn-cream btn-sm !min-h-[42px] !px-3" aria-label="יציאה" onClick={exit}>✕</button>
        <div className="flex-1"><Bar pct={pct} h={14} /></div>
        <div className="glass min-w-[72px] px-3 py-1 text-center text-sm font-extrabold">{o.boss && '❤️'.repeat(Math.max(0, R.hearts))} {left || `${R.streak > 1 ? '🔥' + R.streak + ' ' : ''}${Math.min(R.i + 1, R.total)}/${R.total}`}</div>
      </header>
      <main className="scroll-y safe-px flex-1 pb-4">
        <div className="mx-auto max-w-2xl">
          {o.boss && (
            <div className="glass mb-3 flex items-center gap-3 p-2"><motion.span className="text-5xl" animate={{ rotate: [0, -6, 6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>{o.bossEmoji || '👹'}</motion.span><div className="flex-1"><div className="mb-1 text-xs font-bold">{o.title}</div><Bar pct={bossHp} color="from-[#ff9a7d] to-[#e5604a]" h={12} /></div></div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={R.i + ':' + R.total + ':' + q.kind} initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="panel p-4">
              {q.kind === 'memory' ? <Memory q={q} /> : q.kind === 'search' ? <Search q={q} noHint={noHint} /> : q.kind === 'write' ? <Write q={q} dis={dis} exam={!!o.exam} /> : (
                <>
                  <Passage q={q} revealed={dis} />
                  <div className="text-center text-xl font-bold leading-relaxed" {...H(q.prompt)} />
                  {q.speak && <SpeakRow q={q} />}
                  {q.kind === 'mcq' && <Mcq q={q} dis={dis} />}
                  {q.kind === 'build' && <Build key={R.i + ':' + R.total} q={q} dis={dis} shakeKey={q.shake || 0} />}
                  {q.kind === 'type' && <TypeIn key={R.i + ':' + R.total} q={q} dis={dis} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {!noHint && hints && !dis && q.kind !== 'memory' && q.kind !== 'search' && q.kind !== 'write' && <div className="mt-3 text-center"><button className="btn btn-ghost btn-sm" onClick={() => showHint(true)}>💡 רמז</button></div>}
          {q.hintHtml && !dis && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass mt-3 flex items-start gap-2 p-3"><span className="text-2xl">{MASCOT}</span><div className="text-[15px]" {...H(q.hintHtml)} /></motion.div>}
        </div>
      </main>
      {R.fb && !(o.exam) && <Feedback key={R.i + ':' + R.res.length} q={q} fb={R.fb} />}
    </div>
  );
}
