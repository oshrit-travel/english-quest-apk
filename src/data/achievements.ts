import { levelInfo } from '../engine/engine.ts';
export const ACH:any[]=[
['first','צעד ראשון','השלמתם משימה ראשונה',s=>Object.values(s.missions).filter(m=>m.done).length>=1,10],
['five','חמש משימות','השלמתם 5 משימות',s=>Object.values(s.missions).filter(m=>m.done).length>=5,20],
['words','אוסף מילים','20 מילים ברמת "לומד" ומעלה',s=>Object.keys(s.mastery).filter(k=>k[0]=='v'&&k[1]==':'&&s.mastery[k].step>=1).length>=20,20],
['streak','רצף של 10','10 תשובות נכונות ברצף',s=>(s.flags.bestStreak||0)>=10,15],
['gate','פתיחת השער','עברתם את קרב השער ופתחתם את החווה',s=>!!s.flags.farmOpen,30],
['farm','אלוף החווה','עברתם את קרב החווה',s=>!!(s.missions.f7&&s.missions.f7.done),40],
['coins','אספן','אספתם 8 מטבעות בעולם',s=>s.picked.length>=8,15],
['exam','אמיצים','סיימתם מבחן',s=>s.exams.length>=1,20],
['writer','סופר צעיר','3 משימות כתיבה שהצלחתם בהן',s=>(s.flags.writeOk||0)>=3,20],
['lvl5','רמה 5','הגעתם לרמת שחקן 5',s=>levelInfo(s.xp).lvl>=5,25],
['master','שליטה','מילה אחת בדרגת "שולט"',s=>Object.values(s.mastery).some(m=>m.step>=6&&m.modes.length>=2&&m.ok>=5),50],
['daily','יום מלא','השלמתם תוכנית יומית',s=>!!s.flags.dailyDone,20]
];
