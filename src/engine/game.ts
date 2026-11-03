// @ts-nocheck  (game rules ported from the validated v1 build; UI-free)
import { CFG, CATS, VM, MISSIONS, WT, PASS } from '../data/content.ts';
import { ACH } from '../data/achievements.ts';
import { S, addReward, gateInfo, mDone, buildQueue, bossSpecs, mkWrite, skillBuckets, dueIds, currentMission, save, dayKey, pick, sample, shuffle, uniq, readiness, status, learnedCount } from './engine.ts';
import { toast } from './bus.ts';

export function checkAch() {
  ACH.forEach((a) => { if (!S.ach.includes(a[0]) && a[3](S)) { S.ach.push(a[0]); addReward(0, a[4]); toast('🏆 הישג חדש: ' + a[1] + ' (+' + a[4] + ' 🪙)'); } });
  save();
}

/** Opens the farm gate when the guard battle is won AND words are genuinely mastered (not XP). */
export function checkGate(): boolean {
  if (!S.flags.farmOpen && gateInfo().ok) {
    S.flags.farmOpen = true; addReward(CFG.xp.region, CFG.coins.boss);
    toast('🚪 השער נפתח! חוות החיות מחכה לכם (+' + CFG.xp.region + ' XP)'); save(); return true;
  }
  return false;
}

export function bossQueue(m) {
  let q = buildQueue(bossSpecs(m.r)).filter((x) => x.kind !== 'memory' && x.kind !== 'search');
  q = shuffle(q).slice(0, 9); q.push(mkWrite(m.r === 1 ? 'w_pen' : 'w_farmer')); return q;
}
export const missionQueue = (m) => (m.boss ? bossQueue(m) : [...buildQueue(m.steps), mkWrite(m.chal)]);

export function missionDone(m, s): string[] {
  const lines: string[] = [], need = m.boss ? CFG.passBoss : CFG.passMission, pass = s.score >= need, first = !mDone(m.id);
  const rec = S.missions[m.id] || { tries: 0, best: 0 }; rec.tries++; rec.best = Math.max(rec.best, s.score);
  if (!pass) { S.missions[m.id] = rec; lines.push(`ציון ${Math.round(s.score * 100)}% – צריך לפחות ${Math.round(need * 100)}% כדי להשלים. הפריטים שטעיתם בהם יחזרו בתרגול. נסו שוב! 💪`); save(); return lines; }
  rec.done = true; rec.t = Date.now(); S.missions[m.id] = rec;
  if (first) {
    const bx = m.boss ? CFG.xp.boss : 0, ch = s.res.find((x) => x.q.kind === 'write' && x.quality > 0) ? CFG.xp.challenge : 0;
    addReward(CFG.xp.mission + bx + ch, m.boss ? CFG.coins.boss : CFG.coins.mission);
    if (!S.inv.some((i) => i.id === m.id)) S.inv.push({ id: m.id, e: m.item, n: m.itemName });
    lines.push(`🎉 משימה הושלמה! +${CFG.xp.mission + bx} XP${ch ? ` · אתגר כתיבה +${ch} XP` : ''} · +${m.boss ? CFG.coins.boss : CFG.coins.mission} 🪙`, `פריט אספנות חדש: ${m.item} ${m.itemName}`);
  } else lines.push('✅ עברתם שוב! (תגמול ניתן בהשלמה הראשונה)');
  if (m.id === 'v6') { const g = gateInfo(); if (g.ok) { checkGate(); lines.push('🚪 השער נפתח! עכשיו אפשר להיכנס לחוות החיות.'); } else lines.push(`עברתם את הקרב! כדי לפתוח את השער צריך להוכיח שליטה בעוד מילים: ${g.learned}/${g.need}. תרגלו (משימת היום / תרגול) והשער ייפתח.`); }
  if (m.id === 'f7' && first) { addReward(CFG.xp.region, CFG.coins.boss); lines.push(`🏆 סיימתם את חוות החיות! +${CFG.xp.region} XP`); }
  save(); return lines;
}

export const SKN = { vocab: 'אוצר מילים', grammar: 'דקדוק', reading: 'קריאה', listening: 'האזנה', writing: 'כתיבה' };
export function dailyPlan() {
  const b = skillBuckets(), ks = ['vocab', 'grammar', 'reading', 'listening', 'writing'].filter((k) => b[k] != null).sort((a, c) => b[a] - b[c]), weak = ks[0] || 'grammar';
  const due = dueIds().map((x) => x.slice(2)).filter((x) => VM[x]), learned = Object.keys(S.mastery).filter((k) => k.startsWith('v:') && S.mastery[k].reps).map((x) => x.slice(2)).filter((x) => VM[x]), rev = due.length ? due : learned, cm = currentMission();
  const cat = ((cm && cm.steps.find((s) => s.cat)) || {}).cat || 'animals', r = cm ? cm.r : 1, pid = () => pick(['p1', 'p2', 'p3']);
  const rv = rev.length ? sample(rev, Math.min(5, rev.length)) : null;
  return [
    { t: 'חזרת אוצר מילים', ic: '🔁', min: 3, sub: rev.length ? (due.length ? 'מילים שהגיע זמן לחזור עליהן' : 'מילים שלמדתם') : 'התחלה חדשה', specs: rv ? [{ m: 'hunter', ids: rv, n: rv.length }, { m: 'listen', kind: 'word', ids: rv, n: 2 }] : [{ m: 'hunter', cat, n: 4 }] },
    { t: 'לימוד חדש', ic: '✨', min: 4, sub: 'מילים ומשפטים חדשים – ' + CATS[cat], specs: [{ m: 'hunter', cat, n: 3 }, { m: 'builder', r, n: 2 }] },
    { t: 'אתגר אינטראקטיבי', ic: '🎮', min: 4, sub: 'מותאם לחולשה: ' + SKN[weak], specs: weak === 'vocab' ? [{ m: 'factory', cat, n: 2, kind: 'missing' }, { m: 'missing', cat, n: 1 }, { m: 'wordquest', cat }] : weak === 'grammar' ? [{ m: 'grammar', n: 4 }, { m: 'fix', n: 1 }] : [{ m: 'cancant', n: 3 }, { m: 'picture', n: 2 }] },
    { t: 'קריאה או האזנה', ic: '📖', min: 4, sub: weak === 'listening' ? 'האזנה – החולשה שלכם' : 'קטע קצר ושאלות', specs: weak === 'listening' ? [{ m: 'listen', kind: 'sent', n: 3 }, { m: 'listen', kind: 'instr', n: 2 }] : [{ m: 'reading', pid: pid(), n: 3 }, { m: 'listen', kind: 'passage', pid: pid(), n: 2 }] },
    { t: 'אתגר סיום', ic: '🏁', min: 4, sub: 'שיחה וכתיבה עצמאית', specs: [{ m: 'talk', n: 2 }, { m: 'writing', ids: [pick(['w_intro', 'w_daily', 'w_ican', 'w_family'])] }] },
  ];
}
export function dailyDone(): string[] {
  const first = !(S.daily.date === dayKey() && S.daily.done);
  S.daily = { date: dayKey(), done: true }; S.flags.dailyDone = 1; save();
  if (first) { addReward(20, 5); return ['📅 השלמתם את משימת היום! +20 XP · +5 🪙']; }
  return ['👏 עוד תרגול – מעולה!'];
}
const SK_HE = { vocabulary: 'מילים', spelling: 'איות', grammar: 'דקדוק', reading: 'קריאה', listening: 'האזנה', writing: 'כתיבה', speaking: 'שיחה' };
export function examDone(min, s): string[] {
  const by = {}; s.res.forEach((x) => { const k = x.q.skill; (by[k] = by[k] || [0, 0]); by[k][1]++; by[k][0] += x.quality === 2 ? 1 : x.quality === 1 ? 0.5 : 0; });
  const br = {}; Object.keys(by).forEach((k) => (br[k] = Math.round((by[k][0] / by[k][1]) * 100)));
  S.exams.push({ t: Date.now(), min, score: Math.round(s.score * 100), br }); save();
  return [`הציון נשמר בהיסטוריה (${Math.round(s.score * 100)}%).`, 'פירוט לפי מיומנות: ' + Object.entries(br).map(([k, v]) => `${SK_HE[k] || k} ${v}%`).join(' · ')];
}
export function assessDone(s): string[] {
  const by = {}; s.res.forEach((x) => { const k = x.q.skill; (by[k] = by[k] || [0, 0]); by[k][1]++; if (x.quality === 2) by[k][0]++; });
  const sk = {}; Object.keys(by).forEach((k) => (sk[k] = by[k][0] / by[k][1]));
  S.assess = { t: Date.now(), skills: sk, score: s.score }; S.assessed = true; save();
  return [`רמת ההתחלה שלכם: ${s.score < 0.5 ? 'Basic – מתחילים מהיסודות' : s.score < 0.8 ? 'Basic+ – בסיס טוב' : 'מתקדם יחסית – נאתגר אתכם יותר'}`, 'המשחק התאים את רמת הקושי לכל מיומנות בנפרד.'];
}

export function parentStats() {
  const days = [...Array(7)].map((_, i) => { const d = dayKey(Date.now() - (6 - i) * 864e5); return { d, m: Math.round((S.time[d] || 0) / 60) }; });
  const total = Object.values(S.time).reduce((a: number, b: number) => a + b, 0);
  const rd = readiness(), pr = readiness(Date.now() - 7 * 864e5);
  const mc = [0, 0, 0, 0, 0]; Object.keys(S.mastery).filter((k) => k.startsWith('v:')).forEach((k) => mc[status(k)]++);
  const gm = [0, 0, 0, 0, 0]; Object.keys(S.mastery).filter((k) => 'gsfc'.includes(k[0]) && k[1] === ':').forEach((k) => gm[status(k)]++);
  const errs = {}; S.attempts.filter((a) => !a.ok && a.label).forEach((a) => (errs[a.label] = (errs[a.label] || 0) + 1));
  const top = Object.entries(errs).sort((a: any, c: any) => c[1] - a[1]).slice(0, 6);
  const L = [['vocab', 'אוצר מילים'], ['grammar', 'דקדוק'], ['reading', 'קריאה'], ['listening', 'האזנה'], ['writing', 'כתיבה'], ['speaking', 'דיבור / שיחה'], ['independent', 'שימוש עצמאי']];
  const b = rd.b, week = days.reduce((a, x) => a + x.m, 0);
  const gaps = L.filter(([k]) => b[k] != null && b[k] < 0.7).map((x) => x[1]), lowN = L.filter(([k]) => b[k] == null).map((x) => x[1]);
  const rec: string[] = [];
  if (gaps.length) rec.push('לחזק: ' + gaps.join(', ') + ' – תרגול חופשי לפי מיומנות.');
  if (dueIds().length) rec.push(`יש ${dueIds().length} מילים שהגיע זמן לחזור עליהן – משימת היום כוללת אותן.`);
  if (!S.exams.length) rec.push('כדאי לבצע מבחן קצר (5 דקות) כדי לקבל מדידה בלי רמזים.');
  if (week < S.set.goal * 3) rec.push(`בשבוע האחרון תורגלו ${week} דקות; היעד היומי ${S.set.goal} דקות.`);
  if (lowN.length) rec.push('עדיין אין מספיק נתונים על: ' + lowN.join(', ') + '.');
  if (!rec.length) rec.push('התקדמות יפה! אפשר להעלות את רמת הקושי בתרגול החופשי.');
  return { days, total, week, rd, pr, mc, gm, top, L, rec, learned: learnedCount() };
}

export const hash = (s: string) => { let h = 5381; for (const c of s) h = (h * 33 ^ c.charCodeAt(0)) >>> 0; return String(h); };
export { WT, PASS };
