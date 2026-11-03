import { motion } from 'framer-motion';
import { MISSIONS, REGIONS, NPCS } from '../data/content.ts';
import { currentMission, mDone, levelInfo } from '../engine/engine.ts';
import { dayKey } from '../engine/engine.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { Bar, CoinPill, Portrait, XpRing } from '../ui/kit.tsx';

export default function Menu() {
  const g = useGame(), ui = useUI(), cm = currentMission(), L = levelInfo(g.xp);
  const dd = g.daily.date === dayKey() && g.daily.done, today = Math.floor((g.time[dayKey()] || 0) / 60);
  const reg = cm ? MISSIONS.filter((m) => m.r === cm.r) : [], done = reg.filter((m) => mDone(m.id)).length;
  const start = () => { if (!g.name) ui.go('setup'); else ui.go('world'); };
  const Small = ({ icon, label, to }: { icon: string; label: string; to: string }) => (
    <motion.button whileTap={{ scale: 0.92 }} onClick={() => ui.go(to)} className="glass flex min-w-[78px] flex-col items-center gap-0.5 px-3 py-2 text-xs font-bold"><span className="text-2xl">{icon}</span>{label}</motion.button>
  );
  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-between safe-pt safe-pb safe-px portrait:items-stretch landscape:flex-row landscape:items-stretch" dir="rtl">
      {/* title + hero side */}
      <div className="flex flex-1 flex-col items-center justify-start pt-3 landscape:items-start landscape:justify-center landscape:pr-4">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120 }} className="text-center landscape:text-right">
          <div className="text-[13px] font-extrabold tracking-[.35em] text-[#ffe08a] drop-shadow">THE ISLAND OF WORDS</div>
          <h1 className="font-extrabold leading-none text-white drop-shadow-[0_5px_0_rgba(20,60,70,.65)]" style={{ fontSize: 'clamp(2.6rem,9vw,4.6rem)', direction: 'ltr' }}>English<br className="landscape:hidden" /> <span className="text-[#ffd34a]">Quest</span></h1>
          <p className="mt-2 text-sm font-bold text-white/90 drop-shadow">ההרפתקה שלך · האנגלית שלך · העולם שלך</p>
        </motion.div>
      </div>
      {/* actions */}
      <div className="flex flex-col items-stretch justify-end gap-3 pb-2 landscape:w-[min(430px,46vw)] landscape:justify-center">
        {g.name && (
          <div className="glass flex items-center gap-3 p-2.5 pl-4">
            <XpRing size={56} />
            <div className="min-w-0 flex-1"><div className="truncate font-extrabold">{g.name}</div><div className="text-xs text-white/75">רמה {L.lvl} · {L.cur}/{L.need} XP</div><Bar pct={(L.cur / L.need) * 100} h={8} /></div>
            <CoinPill />
          </div>
        )}
        {g.name && cm && (
          <button onClick={() => ui.go('world')} className="glass flex items-center gap-3 p-2.5 text-right">
            <Portrait id={cm.npc} size={46} />
            <div className="min-w-0 flex-1"><div className="text-[11px] font-bold text-[#ffd34a]">המשימה הבאה · {REGIONS[cm.r - 1].he}</div><div className="truncate text-sm font-extrabold">{cm.title}</div><Bar pct={(done / reg.length) * 100} h={6} /></div>
            <span className="text-sm font-bold text-white/70">{done}/{reg.length}</span>
          </button>
        )}
        <motion.button whileTap={{ scale: 0.95 }} animate={{ scale: [1, 1.035, 1] }} transition={{ repeat: Infinity, duration: 2.2 }} className="btn btn-gold btn-lg w-full text-2xl" onClick={start}>
          {g.name ? '▶  המשך הרפתקה' : '✨  התחילו הרפתקה'}
        </motion.button>
        {g.name && (
          <button onClick={() => ui.go('daily')} className="btn btn-teal w-full justify-between">
            <span>📅 משימת היום</span><span className="text-sm">{dd ? '✅ הושלמה' : `${today}/${g.set.goal} דק׳`}</span>
          </button>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <Small icon="🎯" label="תרגול" to="practice" /><Small icon="🏫" label="בית ספר" to="school" /><Small icon="📝" label="מבחן" to="exam" />
          <Small icon="📚" label="מילים" to="vocab" /><Small icon="🎒" label="ארון" to="inv" /><Small icon="🏆" label="הישגים" to="ach" />
          <Small icon="👤" label="פרופיל" to="profile" /><Small icon="👪" label="הורים" to="parent" /><Small icon="⚙️" label="הגדרות" to="settings" />
        </div>
      </div>
    </div>
  );
}
