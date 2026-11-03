import { useState } from 'react';
import { motion } from 'framer-motion';
import { SHOP, MISSIONS } from '../data/content.ts';
import { ACH } from '../data/achievements.ts';
import { S, KEY, save, levelInfo, learnedCount, STATUS, TTS, say } from '../engine/engine.ts';
import { hash, parentStats } from '../engine/game.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { AvatarFace, Bar, Card, Page, XpRing } from '../ui/kit.tsx';
import { STC } from './Lists.tsx';
import { startAssess } from './Setup.tsx';

const CATN: Record<string, string> = { shirt: 'חולצה', hair: 'שיער', hat: 'כובעים', pack: 'תיקים', pet: 'חיות מחמד' };

export function Inventory() {
  const g = useGame(), ui = useUI();
  const act = (k: string, it: any) => {
    const key = k + ':' + it[0], own = S.own.includes(key) || !it[3];
    if (!own) { if (S.coins < it[3]) { ui.toast(`אין מספיק מטבעות – חסרים ${it[3] - S.coins} 🪙`); return; } S.coins -= it[3]; S.own.push(key); ui.toast('נקנה! 🎉'); }
    S.avatar[k] = it[0]; save();
  };
  return (
    <Page title="🎒 ארון ותיק">
      <Card className="text-center"><div className="flex justify-center"><AvatarFace size={120} /></div>
        <div className="mt-2 text-sm text-[#8a6a45]">מטבעות נצברים מהשלמת משימות ואיסוף בעולם. אי אפשר לקנות איתם התקדמות לימודית.</div></Card>
      {Object.keys(CATN).map((k) => (
        <Card key={k} title={CATN[k]}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{(SHOP as any)[k].map((it: any) => { const own = g.own.includes(k + ':' + it[0]) || !it[3], eq = g.avatar[k] === it[0]; return (
            <motion.button whileTap={{ scale: 0.92 }} key={it[0]} onClick={() => act(k, it)} className={`rounded-2xl border-[3px] p-2 text-center text-sm font-bold ${eq ? 'border-[#46b560] bg-[#e3f8e6]' : 'border-[#e4c88e] bg-white/70'}`}>
              <div className="mx-auto mb-1 h-9 w-9 rounded-full border-2 border-black/10" style={{ background: it[2] || 'transparent' }}>{!it[2] && <span className="text-lg">∅</span>}</div>{it[1]}
              <div className="text-xs text-[#8a6a45]">{eq ? '✔ לבוש' : own ? 'לבישה' : `🪙 ${it[3]}`}</div></motion.button>); })}</div>
        </Card>))}
      <Card title="אוסף פריטים 🏅">{g.inv.length ? <div className="flex flex-wrap gap-2">{g.inv.map((i: any) => <span key={i.id} className="chip !text-sm">{i.e} {i.n}</span>)}</div> : <div className="text-[#8a6a45]">השלימו משימות כדי לאסוף פריטים</div>}</Card>
    </Page>
  );
}

export function Profile() {
  const g = useGame(), ui = useUI(), L = levelInfo(g.xp);
  const doneM = Object.values(g.missions).filter((m: any) => m.done).length, acc = g.attempts.length ? Math.round((g.attempts.filter((a: any) => a.ok).length / g.attempts.length) * 100) : 0;
  const stats: [string | number, string][] = [[`${doneM}/${MISSIONS.length}`, 'משימות'], [learnedCount(), 'מילים בלימוד'], [g.attempts.length, 'תשובות'], [`${acc}%`, 'דיוק כללי'], [`${g.ach.length}/${ACH.length}`, 'הישגים'], [g.flags.bestStreak || 0, 'רצף שיא']];
  return (
    <Page title="👤 הפרופיל שלי">
      <Card><div className="flex items-center gap-4"><XpRing size={84} /><div className="flex-1"><h2 className="text-2xl font-extrabold">{g.name}</h2><div className="text-sm text-[#8a6a45]">רמה {L.lvl} · {L.cur}/{L.need} XP</div><Bar pct={(L.cur / L.need) * 100} h={10} /></div></div>
        <div className="mt-3 grid grid-cols-3 gap-2">{stats.map(([v, t]) => <div key={t} className="panel-inset p-2 text-center"><b className="text-xl">{v}</b><div className="text-xs text-[#8a6a45]">{t}</div></div>)}</div>
        <div className="mt-3 flex flex-wrap gap-2"><button className="btn btn-cream btn-sm" onClick={() => { const n = prompt('שם חדש:', S.name); if (n && n.trim()) { S.name = n.trim().slice(0, 14); save(); } }}>✏️ שינוי שם</button><button className="btn btn-cream btn-sm" onClick={() => ui.go('inv')}>🎒 התאמה אישית</button>{g.assessed && <button className="btn btn-cream btn-sm" onClick={startAssess}>🧭 מבחן הכרות מחדש</button>}</div></Card>
    </Page>
  );
}

export function Settings() {
  const g = useGame(), ui = useUI(), st = g.set;
  const row = 'flex items-center justify-between gap-3 py-2';
  const exportData = () => {
    try { const b = new Blob([JSON.stringify(S)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'english-quest-backup.json'; document.body.appendChild(a); a.click(); a.remove(); }
    catch { ui.toast('לא ניתן לייצא במכשיר הזה'); }
  };
  const importData = () => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json'; i.onchange = () => { const f = i.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(String(r.result)); if (!o || o.v !== 1 || !o.mastery) throw 0; localStorage.setItem(KEY, JSON.stringify(o)); location.reload(); } catch { ui.toast('הקובץ לא תקין'); } }; r.readAsText(f); }; i.click(); };
  return (
    <Page title="⚙️ הגדרות">
      <Card title="🔊 שמע">
        <label className={row}>השתקה <input type="checkbox" className="h-6 w-6" checked={st.mute} onChange={(e) => { st.mute = e.target.checked; save(); }} /></label>
        <label className={row}>עוצמה <input type="range" min={0} max={1} step={0.1} value={st.vol} onChange={(e) => { st.vol = +e.target.value; save(); }} /></label>
        <label className={row}>מהירות דיבור <input type="range" min={0.5} max={1.2} step={0.05} value={st.rate} onChange={(e) => { st.rate = +e.target.value; save(); }} /></label>
        <label className={row}>כתוביות לשמע <input type="checkbox" className="h-6 w-6" checked={st.subs} onChange={(e) => { st.subs = e.target.checked; save(); }} /></label>
        <div className="flex flex-wrap items-center gap-2"><button className="btn btn-teal btn-sm" onClick={() => say('Hello! Welcome to English Quest.')}>🔊 בדיקת קול</button><span className="text-xs text-[#8a6a45]">{TTS.ok ? (TTS.has ? 'קול אנגלי: ' + (TTS.voice as any)?.name : 'לא נמצא קול אנגלי – מומלץ להתקין בהגדרות המכשיר (כתוביות יוצגו אוטומטית)') : 'ההשמעה לא נתמכת – כתוביות יוצגו'}</span></div>
      </Card>
      <Card title="🎮 משחק">
        <label className={row}>איכות גרפיקה
          <select className="field !w-auto" value={st.quality} onChange={(e) => { st.quality = e.target.value; save(); import('../world/store.ts').then((m) => m.useWorld.getState().setQuality(e.target.value === 'low' ? 'low' : 'high')); }}>
            <option value="auto">אוטומטי</option><option value="high">גבוהה</option><option value="low">חסכונית (מכשירים חלשים)</option></select></label>
        <label className={row}>יעד יומי (דקות) <input type="number" className="field !w-24" min={5} max={60} value={st.goal} onChange={(e) => { st.goal = Math.max(5, Math.min(60, +e.target.value || 18)); save(); }} /></label>
      </Card>
      <Card title="💾 גיבוי"><div className="flex flex-wrap gap-2"><button className="btn btn-cream btn-sm" onClick={exportData}>⬇️ ייצוא</button><button className="btn btn-cream btn-sm" onClick={importData}>⬆️ ייבוא</button><button className="btn btn-coral btn-sm" onClick={() => { if (confirm('למחוק את כל ההתקדמות? אי אפשר לבטל.') && confirm('בטוחים?')) { try { localStorage.removeItem(KEY); } catch { /* */ } location.reload(); } }}>🗑️ איפוס</button></div>
        <div className="mt-2 text-xs text-[#8a6a45]">ההתקדמות נשמרת על המכשיר הזה. מומלץ לייצא מדי פעם.</div></Card>
      <Card className="text-xs text-[#8a6a45]">English Quest 2.0 · הכתיבה והדיבור נבדקים אוטומטית וזה לא תחליף למורה.</Card>
    </Page>
  );
}

export function Parent() {
  const g = useGame(), [ok, setOk] = useState(false), [pin, setPin] = useState(''), ui = useUI();
  if (!g.pin || !ok) {
    const setting = !g.pin;
    return (
      <Page title="👪 אזור הורים">
        <Card className="text-center"><h3 className="text-lg font-extrabold">{setting ? 'הגדרת קוד הורים' : 'הכניסו קוד הורים'}</h3>
          {setting && <p className="text-sm text-[#8a6a45]">בחרו קוד של 4 ספרות. האזור הזה מציג את נתוני הלמידה. (הקוד מגן מילדים סקרנים – הוא לא הצפנה.)</p>}
          <input className="field mx-auto mt-3 max-w-[180px] text-center text-2xl" inputMode="numeric" maxLength={4} type="password" placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
          <button className="btn btn-gold mt-3" onClick={() => { if (setting) { if (!/^\d{4}$/.test(pin)) { ui.toast('4 ספרות בלבד'); return; } S.pin = hash(pin); save(); setOk(true); } else if (hash(pin) === g.pin) setOk(true); else ui.toast('קוד שגוי'); }}>{setting ? 'שמירה' : 'כניסה'}</button>
          {!setting && <div className="mt-2 text-xs text-[#8a6a45]">שכחתם קוד? בהגדרות אפשר לאפס את כל הנתונים.</div>}</Card>
      </Page>
    );
  }
  return <ParentDash />;
}

function ParentDash() {
  const g = useGame(), ui = useUI(), P = parentStats(), b: any = P.rd.b, mx = Math.max(1, ...P.days.map((d) => d.m)), ex = g.exams.slice(-8);
  return (
    <Page title={`👪 לוח הורים – ${g.name}`}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[[Math.round(P.total / 60), 'דקות למידה'], [P.week, 'דקות ב-7 ימים'], [levelInfo(g.xp).lvl, 'רמת שחקן'], [P.learned, 'מילים שנלמדו']].map(([v, t]) => <div key={t as string} className="panel p-3 text-center"><b className="text-2xl">{v}</b><div className="text-xs text-[#8a6a45]">{t}</div></div>)}</div>
      <Card title="פעילות שבועית (דקות ביום)"><div className="flex h-32 items-end justify-between gap-2" dir="ltr">{P.days.map((d) => <div key={d.d} className="flex flex-1 flex-col items-center text-xs"><span>{d.m}</span><div className="w-full rounded-t-lg bg-gradient-to-t from-[#2a9db5] to-[#5fd0dd]" style={{ height: Math.max(3, Math.round((d.m / mx) * 80)) }} /><span className="text-[#8a6a45]">{d.d.slice(8)}/{d.d.slice(5, 7)}</span></div>)}</div></Card>
      <Card title="🎯 מדד מוכנות לאנגלית">
        <div className="flex items-center gap-4"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[8px] border-[#ffb02e] text-2xl font-extrabold">{P.rd.idx == null ? '—' : P.rd.idx}</div>
          <div className="text-sm">{P.pr.idx != null && P.rd.idx != null ? <div>לפני שבוע: <b>{P.pr.idx}</b> · {P.rd.idx >= P.pr.idx ? '📈 +' : '📉 '}{P.rd.idx - P.pr.idx}</div> : <div className="text-[#8a6a45]">נדרש מעט יותר מידע להשוואה לשבוע קודם</div>}<div className="mt-1 text-xs text-[#8a6a45]">מחושב מ-40 התשובות האחרונות בכל מיומנות. <b>המדד הוא כלי מעקב בלבד ואינו מבטיח שיבוץ לקבוצה מתקדמת.</b></div></div></div>
        <div className="mt-3 space-y-2">{P.L.map(([k, t]: any) => <div key={k} className="flex items-center gap-2 text-sm"><span className="w-24 shrink-0">{t}</span><Bar pct={b[k] == null ? 0 : b[k] * 100} h={10} /><span className="w-10 text-left font-bold">{b[k] == null ? '—' : Math.round(b[k] * 100) + '%'}</span></div>)}</div></Card>
      <Card title="רמות שליטה"><div className="flex flex-wrap gap-2">{STATUS.map((t, i) => <span key={t} className="chip" style={{ background: STC[i] }}>{t}: {P.mc[i]} מילים</span>)}</div><div className="mt-2 flex flex-wrap gap-2">{STATUS.slice(1).map((t, i) => <span key={t} className="chip" style={{ background: STC[i + 1] }}>דקדוק/משפטים – {t}: {P.gm[i + 1]}</span>)}</div></Card>
      <Card title="היסטוריית מבחנים">{ex.length ? <div className="flex h-28 items-end gap-2" dir="ltr">{ex.map((e: any, i: number) => <div key={i} className="flex flex-1 flex-col items-center text-xs"><span>{e.score}%</span><div className="w-full rounded-t-lg bg-gradient-to-t from-[#3fb35c] to-[#8be08f]" style={{ height: Math.max(3, e.score * 0.7) }} /><span className="text-[#8a6a45]">{new Date(e.t).getDate()}/{new Date(e.t).getMonth() + 1}</span></div>)}</div> : <div className="text-[#8a6a45]">אין עדיין מבחנים</div>}</Card>
      <Card title="טעויות שחוזרות">{P.top.length ? <table className="w-full"><tbody>{P.top.map(([l, n]: any) => <tr key={l} className="border-t border-black/10"><td className="en py-1">{l}</td><td className="text-left">{n}×</td></tr>)}</tbody></table> : <div className="text-[#8a6a45]">אין טעויות חוזרות 🎉</div>}</Card>
      <Card title="המלצות להמשך">{P.rec.map((r: string, i: number) => <p key={i} className="my-1">• {r}</p>)}</Card>
      <Card title="הגדרות הורים"><button className="btn btn-cream btn-sm" onClick={() => { const v = prompt('קוד חדש (4 ספרות):'); if (v && /^\d{4}$/.test(v)) { S.pin = hash(v); save(); ui.toast('הקוד עודכן'); } }}>🔑 שינוי קוד</button>
        <div className="mt-2 text-xs text-[#8a6a45]">משקולות המדד: {Object.entries(g.set.weights).map(([k, v]: any) => `${k} ${Math.round(v * 100)}%`).join(' · ')}</div></Card>
    </Page>
  );
}
