import { motion } from 'framer-motion';
import { CFG, VM } from '../data/content.ts';
import { STATUS, status, uniq } from '../engine/engine.ts';
import { useUI } from '../engine/ui.ts';
import { startMission } from './Dialog.tsx';
import { Burst, Card, Page } from '../ui/kit.tsx';
import { STC } from './Lists.tsx';

const H = (html: string) => ({ dangerouslySetInnerHTML: { __html: html } });

export default function Results({ s }: { s: any }) {
  const ui = useUI(), o = s.o || {}, pct = Math.round(s.score * 100), ex = o.exam && !o.assess;
  const need = o.mission ? (o.mission.boss ? CFG.passBoss : CFG.passMission) : 0, failed = o.mission && s.score < need;
  const improved = s.res.filter((x: any) => x.after > x.before && String(x.q.id).startsWith('v:'));
  const weak = uniq(s.res.filter((x: any) => x.quality < 2).map((x: any) => x.q.label || '')).filter(Boolean).slice(0, 8) as string[];
  const title = s.timeUp ? '⏱ נגמר הזמן!' : o.boss ? (pct >= CFG.passBoss * 100 ? '⚔️ ניצחון!' : '⚔️ הפעם לא הצלחנו') : o.assess ? '🧭 סיימתם את מבחן ההכרות!' : failed ? '🌱 כמעט!' : '🏁 סיימתם!';
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const home = () => ui.reset('menu'), world = () => ui.reset('world');
  return (
    <Page title={title} back={false} right={<span />}>
      {!failed && pct >= 70 && <Burst n={1} />}
      <div className="py-2 text-center">
        <div className="flex justify-center gap-2 text-6xl">{[0, 1, 2].map((i) => <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25 + i * 0.25, type: 'spring' }} className={i < stars ? '' : 'opacity-25 grayscale'}>⭐</motion.span>)}</div>
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="mx-auto mt-3 grid h-28 w-28 place-items-center rounded-full border-[10px] border-[#ffb02e] bg-white/90 text-3xl font-extrabold text-[#4a2a05]">{pct}%</motion.div>
        <p className="mt-3 font-bold text-white/90">{s.first} מתוך {s.n} נכונות בניסיון ראשון · {Math.floor(s.secs / 60)}:{String(s.secs % 60).padStart(2, '0')} דק׳{s.xp ? ` · +${s.xp} XP` : ''}</p>
      </div>
      {s.lines?.length > 0 && <Card>{s.lines.map((l: string, i: number) => <p key={i} className="my-1 font-bold" {...H(l)} />)}</Card>}
      {improved.length > 0 && <Card title="📈 מילים שהתקדמו"><div className="flex flex-wrap gap-2">{uniq(improved.map((x: any) => x.q.id)).slice(0, 10).map((id: any) => { const v = (VM as any)[id.slice(2)]; return v ? <span key={id} className="chip" style={{ background: STC[status(id)] }}>{v.e} {v.en} · {STATUS[status(id)]}</span> : null; })}</div><div className="mt-2 text-xs text-[#8a6a45]">שליטה אמיתית נבנית מחזרות בימים שונים – לא מסיבוב אחד.</div></Card>}
      {weak.length > 0 && !ex && <Card title="🔁 לחזרה"><div className="flex flex-wrap gap-2">{weak.map((w) => <span key={w} className="chip !bg-[#fde1dc]"><span className="en">{w}</span></span>)}</div></Card>}
      {ex && <Card title="📋 סקירת המבחן"><table className="w-full text-right"><tbody>{s.res.map((x: any, i: number) => { const q = x.q; let corr = ''; if (q.kind === 'mcq') corr = (q.opts.find((z: any) => z.ok) || {}).h; else if (q.kind === 'write') corr = `<span class=en>${q.task.ref}</span> (ציון ${q.r ? q.r.score : 0}/3)`; else corr = `<span class=en>${q.answer || (q.answers || [])[0] || ''}</span>`;
        return <tr key={i} className="border-t border-black/10 align-top"><td className="py-2 pl-2 text-xl">{x.quality === 2 ? '✅' : x.quality === 1 ? '🟡' : '❌'}</td><td className="py-2"><span className="en font-bold">{q.label}</span><div className="text-sm text-[#8a6a45]">תשובה נכונה: <span {...H(corr || '')} /></div>{x.quality < 2 && q.why && <div className="text-sm" {...H(q.why)} />}{q.kind === 'write' && x.extra && <div className="text-sm" {...H(x.extra)} />}</td></tr>; })}</tbody></table></Card>}
      <div className="mt-3 grid gap-3">
        <button className="btn btn-gold btn-lg" onClick={o.mission ? world : home}>{o.mission ? 'חזרה לעולם' : 'המשך'} ←</button>
        {failed && <button className="btn btn-green" onClick={() => { ui.reset('world'); startMission(o.mission); }}>נסו שוב</button>}
        {o.mission && <button className="btn btn-cream" onClick={home}>🏠 לתפריט</button>}
      </div>
    </Page>
  );
}
