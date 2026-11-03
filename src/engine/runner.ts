// @ts-nocheck  (activity state machine ported from the validated v1 runner; rendering lives in screens/Activity.tsx)
import { create } from 'zustand';
import { CFG } from '../data/content.ts';
import { S, record, addReward, say, beep, chime, stopSpeech, lev, norm, evalWrite, pick, TTS } from './engine.ts';
import { checkAch } from './game.ts';
import { toast } from './bus.ts';
import { useUI } from './ui.ts';

export type Fb = { quality: number; msg: string; why: string; revealed: boolean; extra?: string };
export type Run = { q: any[]; i: number; res: any[]; o: any; streak: number; hearts: number; xp: number; t0: number; req: number; left: number; total: number; fb: Fb | null; timer: any; burst: number; gain: number };

export const useRun = create<{ R: Run | null; v: number }>(() => ({ R: null, v: 0 }));
const touch = () => useRun.setState((s) => ({ v: s.v + 1, R: s.R }));
const get = () => useRun.getState().R;

export const speak = (text: string, slow = false) => { const ok = say(text, slow); if (!ok && TTS.ok && !S.set.mute) toast('לא נמצא קול באנגלית במכשיר – ראו את הכתוביות'); return ok; };

export function runQueue(queue: any[], o: any = {}) {
  queue = queue.filter(Boolean);
  if (!queue.length) { toast('אין שאלות זמינות כרגע'); return; }
  const R: Run = { q: queue, i: 0, res: [], o, streak: 0, hearts: 3, xp: 0, t0: Date.now(), req: 0, left: o.limit ? o.limit * 60 : 0, total: queue.length, fb: null, timer: null, burst: 0, gain: 0 };
  useRun.setState({ R, v: 0 });
  if (R.left) R.timer = setInterval(() => { const r = get(); if (!r) return; r.left--; if (r.left <= 0) { clearInterval(r.timer); finishRun(true); } else touch(); }, 1000);
  useUI.getState().go('activity');
  prep();
}
function prep() {
  const R = get(); if (!R) return;
  const q = R.q[R.i]; if (!q) return;
  q.att = 0; q.hintN = 0; q.dead = {}; q.t0 = Date.now(); q.placed = []; q.usedHint = false; q.hintHtml = null; R.fb = null;
  touch();
  if (q.auto) setTimeout(() => { const r = get(); if (r && r.q[r.i] === q) speak(q.speak); }, 450);
}
export function next() {
  const R = get(); if (!R) return;
  R.i++;
  if (R.i >= R.q.length || (R.o.boss && R.hearts <= 0)) { finishRun(); return; }
  prep();
}
export function quit() {
  const R = get(); if (!R) return;
  clearInterval(R.timer); stopSpeech(); useRun.setState({ R: null }); useUI.getState().back();
}
export function swapQuestion(nq: any) { const R = get(); if (!R) return; R.q[R.i] = nq; prep(); }

/* progressive hints: visual clue → contextual → short explanation (then reveal + a similar new exercise) */
export function showHint(manual = true) {
  const R = get(); if (!R) return; const q = R.q[R.i], hs = q.hints || []; if (!hs.length) return;
  const h = hs[Math.min(q.hintN, hs.length - 1)]; q.usedHint = true; q.hintN = Math.min(q.hintN + 1, hs.length);
  q.hintHtml = typeof h === 'string' ? h : h.h; if (typeof h === 'object' && h.ev) q.showEv = true; touch();
}

export function answerMcq(i: number) {
  const R = get(); if (!R) return; const q = R.q[R.i], o = q.opts[i];
  if (R.fb) return;
  if (o.ok) { beep(true); q.picked = i; finalize(q, q.att === 0 && !q.usedHint ? 2 : 1, o.h); return; }
  beep(false); q.att++; q.dead[i] = 1; q.shake = (q.shake || 0) + 1;
  if (R.o.single) { q.picked = i; finalize(q, 0, o.h); return; }
  const left = q.opts.filter((x, k) => !x.ok && !q.dead[k]).length;
  if (q.att >= 4 || left === 0) { showHint(false); finalize(q, 0, o.h, true); return; }
  showHint(false); touch();
}
export function checkBuild(txt: string) {
  const R = get(); if (!R) return; const q = R.q[R.i];
  const good = [q.answer, ...(q.accept || [])].some((a) => norm(a) === norm(txt));
  if (good) { beep(true); finalize(q, q.att === 0 && !q.usedHint ? 2 : 1, txt); return; }
  beep(false); q.att++; q.shake = (q.shake || 0) + 1;
  if (R.o.single) { finalize(q, 0, txt); return; }
  showHint(false); if (q.att >= 4) finalize(q, 0, txt, true); else { toast('כמעט... נסו שוב 🙂'); touch(); }
}
export function checkType(v: string) {
  const R = get(); if (!R) return; const q = R.q[R.i]; v = v.trim(); if (!v) return;
  if (q.answers.some((a) => norm(a) === norm(v))) { beep(true); finalize(q, q.att === 0 && !q.usedHint ? 2 : 1, v); return; }
  beep(false); q.att++; q.shake = (q.shake || 0) + 1;
  if (R.o.single) { finalize(q, 0, v); return; }
  showHint(false); if (q.att >= 4) finalize(q, 0, v, true); else { toast('לא בדיוק – נסו שוב 🙂'); touch(); }
}
export function checkWrite(v: string) {
  const R = get(); if (!R) return; const q = R.q[R.i]; const r = evalWrite(q.task, v); q.r = r; q.userTxt = v;
  const parts = [`<b>ציון: ${r.score}/3</b>`];
  if (r.ok.length) parts.push('✔ מצוין: ' + r.ok.map((x) => `<span class=en>${x}</span>`).join(', '));
  if (r.miss.length) parts.push('✖ חסר: ' + r.miss.map((x) => `<span class=en>${x}</span>`).join(', '));
  r.fb.forEach((f) => parts.push('📝 ' + f)); parts.push('דוגמה: <span class=en>' + q.task.ref + '</span>');
  if (r.pass && r.pts >= 2.5) S.flags.writeOk = (S.flags.writeOk || 0) + (R.o.exam ? 0 : 1);
  finalize(q, r.pass ? (r.pts >= 2.5 ? 2 : 1) : 0, v, false, parts.join('<br>'));
}
/* word search */
export function searchPick(x: number, y: number) {
  const R = get(); if (!R) return; const q = R.q[R.i];
  if (!q.sel) { q.sel = [x, y]; touch(); return; }
  const [sx, sy] = q.sel; q.sel = null;
  const ends = (p) => { const e = p.v.en.length - 1; return [p.x + p.dx * e, p.y + p.dy * e]; };
  const p = q.place.find((p) => !q.found.includes(p.v.id) && ((p.x === sx && p.y === sy && ends(p)[0] === x && ends(p)[1] === y) || (p.x === x && p.y === y && ends(p)[0] === sx && ends(p)[1] === sy)));
  if (p) {
    beep(true); q.found.push(p.v.id); record({ id: 'v:' + p.v.id, skill: 'vocabulary', mode: 'wordquest', kind: 'search', label: p.v.en }, q.hintUsed[p.v.id] ? 1 : 2, 0);
    R.xp += 1; addReward(CFG.xp.correct, 0);
    if (q.found.length === q.place.length) { R.res.push({ q, quality: 2, ans: '', why: '' }); R.burst++; chime(); R.fb = { quality: 2, msg: 'מצאתם את כל המילים! 🎉', why: '', revealed: false }; }
  } else { beep(false); toast('זו לא מילה מהרשימה – נסו שוב'); }
  touch();
}
export function searchHint() { const R = get(); if (!R) return; const q = R.q[R.i]; const w = q.place.find((p) => !q.found.includes(p.v.id)); if (w) { q.hint = w; q.hintUsed[w.v.id] = 1; touch(); } }
export function memoryDone() { const R = get(); if (!R) return; const q = R.q[R.i]; if (q.kind === 'memory') swapQuestion(q.after); }

function finalize(q, quality, ans, revealed = false, extra) {
  const R = get(); if (!R) return; const ms = Date.now() - (q.t0 || Date.now());
  const rec = record(q, quality, ms);
  R.res.push({ q, quality, ans, ms, before: rec.before, after: rec.after, extra });
  R.gain = 0;
  if (quality === 2) {
    R.streak++; S.flags.bestStreak = Math.max(S.flags.bestStreak || 0, R.streak); let x = CFG.xp.correct;
    if (R.streak % CFG.xp.streakEvery === 0) { x += CFG.xp.streakBonus; toast('🔥 רצף של ' + R.streak + '! בונוס +' + CFG.xp.streakBonus + ' XP'); }
    R.xp += x; R.gain = x; if (!R.o.exam) addReward(x, CFG.coins.correct); R.burst++; chime();
  } else { R.streak = 0; if (R.o.boss && quality === 0) R.hearts--; }
  if (R.o.exam || R.o.assess) { setTimeout(next, 150); touch(); return; }
  if (quality === 0 && !R.o.single && q.regen && R.req < 3) { R.req++; const n = q.regen(); if (n) { R.q.push(n); R.total++; } }
  const praise = quality === 2 ? pick(['כל הכבוד! 🌟', 'מעולה! ✅', 'נכון! 🎉', 'יפה מאוד! 👏', 'בול! 🎯']) : quality === 1 ? 'נכון! עם קצת עזרה – נחזור על זה בהמשך 👍' : pick(['כמעט! כך לומדים 💪', 'לא נורא, ננסה שוב בהמשך 🌱', 'עוד קצת ויש! 🙂']);
  R.fb = { quality, msg: praise, why: extra || q.why || '', revealed };
  touch();
}
export function micSay(q, cb) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) { toast('זיהוי דיבור לא זמין בדפדפן הזה'); return; }
  try {
    const r = new SR(); r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 3; cb('מקשיב... 🎧');
    r.onresult = (e) => { const heard = [...e.results[0]].map((a) => a.transcript); const best = Math.min(...heard.map((h) => lev(norm(h), norm(q.sayText)) / Math.max(1, norm(q.sayText).length))); const ok = best < 0.25; cb(ok ? '✅ נשמע מצוין!' : '🙂 שמעתי: ' + heard[0] + ' – נסו שוב'); record({ id: 'sp:' + q.id, skill: 'speaking', mode: 'talk', kind: 'speech', label: q.sayText }, ok ? 2 : 1, 0); };
    r.onerror = () => cb('לא הצלחתי לשמוע. אפשר להמשיך בלי זה.'); r.start();
  } catch (e) { toast('זיהוי דיבור לא זמין'); }
}
export function finishRun(timeUp = false) {
  const R = get(); if (!R) return; clearInterval(R.timer); stopSpeech();
  const n = R.res.length || 1, score = R.res.reduce((a, x) => a + (x.quality === 2 ? 1 : x.quality === 1 ? 0.5 : 0), 0) / (R.o.exam ? Math.max(R.res.length, R.total) : n);
  const sum = { res: R.res, score, n: R.res.length, total: R.total, xp: R.xp, timeUp, o: R.o, first: R.res.filter((x) => x.quality === 2).length, secs: Math.round((Date.now() - R.t0) / 1000), lines: [] };
  sum.lines = R.o.onDone ? R.o.onDone(sum) || [] : [];
  S.flags.lastRun = Date.now(); checkAch(); useRun.setState({ R: null });
  useUI.getState().replace('results', sum);
}
