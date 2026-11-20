import { MISSIONS, NPCS, REGIONS } from '../data/content.ts';
import { mDone, missionState, regionOpen, gateInfo } from '../engine/engine.ts';
import { useGame } from '../engine/useGame.ts';
import { useUI } from '../engine/ui.ts';
import { Bar, Card, Page } from '../ui/kit.tsx';

export default function MapScreen() {
  useGame(); const ui = useUI();
  return (
    <Page title="🗺️ מפת האי">
      {REGIONS.map((r) => {
        const open = regionOpen(r.id), ms = MISSIONS.filter((m) => m.r === r.id), done = ms.filter((m) => mDone(m.id)).length, g = gateInfo(r.id);
        return (
          <Card key={r.id} className={open ? '' : 'opacity-60'}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{r.emoji}</span>
              <div className="flex-1"><h3 className="text-lg font-extrabold">{r.he} <span className="en text-sm font-medium text-[#8a6a45]">{r.en}</span></h3>
                <Bar pct={(done / ms.length) * 100} h={9} /></div>
              <span className="chip">{`${done}/${ms.length}`}</span>
            </div>
            {open && ms.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ms.map((m) => { const st = missionState(m); return (
                  <button key={m.id} onClick={() => { ui.reset('menu'); ui.go('world'); setTimeout(() => ui.openDialog(m.npc), 60); }}
                    className={`rounded-2xl border-2 border-[#e4c88e] bg-white/70 p-2 text-center text-sm font-bold ${st === 'lock' ? 'opacity-50' : ''}`}>
                    <div className="text-2xl">{st === 'done' ? '✅' : st === 'lock' ? '🔒' : m.boss ? '⚔️' : '❗'}</div>{m.title}<div className="text-xs font-medium text-[#8a6a45]">{(NPCS as any)[m.npc].n}</div>
                  </button>); })}
              </div>
            )}
            {!open && ms.length > 0 && <div className="mt-2 text-sm text-[#8a6a45]">🔒 {g.boss ? `נדרשת שליטה במילים (${g.learned}/${g.need})` : 'עברו את קרב הבוס של האזור הקודם כדי לפתוח'}</div>}
          </Card>
        );
      })}
    </Page>
  );
}
