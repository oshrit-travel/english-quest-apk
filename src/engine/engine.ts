// @ts-nocheck  (ported generator/engine code; the UI layer is typed)
import { CFG, CATS, VOC, VM, SENT, CC, FX, TALK, PIC, ADJ, VD, WH, PREP, CONJ, TOPICS, PASS, INSTR, WT, MISSIONS, REGIONS, SHOP } from '../data/content.ts';
import { bus, toast, bump } from './bus.ts';
/* ===== ENGINE: utils, state, mastery, speech, question generators (no rendering code) ===== */
export const rnd=n=>Math.floor(Math.random()*n);
export const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
export const pick=a=>a[rnd(a.length)];
export const sample=(a,n)=>shuffle(a).slice(0,n);
export const uniq=a=>[...new Set(a)];
export const norm=s=>String(s).toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,!?;:"]/g,'').replace(/\s+/g,' ').trim();
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const cap=s=>s[0].toUpperCase()+s.slice(1);
export function lev(a,b){const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++){d[i]=[i]}for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
export const dayKey=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};

/* ---------- state ---------- */
export const KEY='englishquest.v1';
export const defaultState=()=>({v:1,name:'',avatar:{shirt:'blue',hair:'brown',hat:'none',pack:'none',pet:'none'},own:['shirt:blue','shirt:red','hair:brown','hair:black','hat:none','pack:none','pet:none'],
 xp:0,coins:0,missions:{},mastery:{},attempts:[],exams:[],time:{},inv:[],ach:[],picked:[],pos:{x:-31,z:0},assessed:false,assess:null,
 daily:{date:'',done:false},flags:{},pin:'',snap:[],
 set:{vol:1,rate:.85,mute:false,subs:false,quality:'auto',goal:CFG.dailyGoalMin,diffOverride:null,weights:Object.assign({},CFG.readiness)}});
export let S=loadState();
export function loadState(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r),d=defaultState();const s=Object.assign(d,o);s.set=Object.assign(d.set,o.set||{});s.set.weights=Object.assign({},CFG.readiness,(o.set||{}).weights||{});s.avatar=Object.assign(d.avatar,o.avatar||{});return s}}catch(e){}return defaultState()}
let _st;
export function save(){clearTimeout(_st);_st=setTimeout(saveNow,200);bump()}
export function saveNow(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('⚠️ לא ניתן לשמור – האחסון במכשיר מלא')}}
if(typeof window!=='undefined'){window.addEventListener('pagehide',saveNow);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow()})}

export function levelInfo(xp){let lvl=1,need=100;while(xp>=need){xp-=need;lvl++;need+=40}return{lvl,cur:xp,need}}
export function addReward(xp,coins){const before=levelInfo(S.xp).lvl;S.xp+=xp||0;S.coins+=coins||0;const after=levelInfo(S.xp).lvl;if(after>before){toast('🎉 עליתם לרמה '+after+'!');bus.emit('levelup',after)}save()}

/* ---------- mastery & spaced repetition ---------- */
export const STATUS=['חדש','לומד','מתרגל','נלמד','שולט'];
export function status(id){const m=S.mastery[id];if(!m||!m.reps)return 0;if(m.step>=6&&m.modes.length>=2&&m.ok>=5)return 4;if(m.step>=4)return 3;if(m.step>=2)return 2;return 1}
/* quality: 2 = clean correct, 1 = correct with hints/retries (uncertain), 0 = wrong */
export function record(q,quality,ms){
  const now=Date.now(),id=q.id,m=S.mastery[id]||(S.mastery[id]={skill:q.skill,step:0,reps:0,ok:0,bad:0,modes:[],next:0,last:0,streak:0});
  const before=status(id);
  m.reps++;m.last=now;
  if(quality===2){m.ok++;m.streak++;if(!m.modes.includes(q.mode))m.modes.push(q.mode);
    if(m.step===0||now>=m.next)m.step=Math.min(6,m.step+1);}   /* advances only when due → real retention, not same-session repetition */
  else if(quality===1){m.streak=0;m.step=Math.max(0,m.step-1)}
  else{m.bad++;m.streak=0;m.step=Math.max(0,m.step-2)}
  m.next=now+(quality===2?CFG.intervals[m.step]:CFG.intervals[Math.min(m.step,1)]);
  S.attempts.push({t:now,id,skill:q.skill,mode:q.mode,kind:q.kind,ok:quality===2,q:quality,ms:ms||0,label:q.label||''});
  if(S.attempts.length>1500)S.attempts=S.attempts.slice(-1200);
  const day=dayKey();if(!S.snap.length||S.snap[S.snap.length-1].d!==day){S.snap.push({d:day});if(S.snap.length>90)S.snap.shift()}
  save();
  return{before,after:status(id)};
}
export function skillAcc(skill,n){const a=S.attempts.filter(x=>x.skill===skill);const b=n?a.slice(-n):a;return b.length?b.filter(x=>x.ok).length/b.length:null}
export function diff(skill){
  if(S.set.diffOverride!=null)return S.set.diffOverride;
  const a=S.attempts.filter(x=>x.skill===skill).slice(-12);let v;
  if(a.length>=4)v=a.filter(x=>x.ok).length/a.length;else if(S.assess&&S.assess.skills[skill]!=null)v=S.assess.skills[skill];else v=.5;
  return v<.6?0:v>.85?2:1;
}
export function prio(items,idf){const now=Date.now();return items.map(x=>{const m=S.mastery[idf(x)];let w=Math.random();if(!m||!m.reps)w+=1.2;else{if(m.next<=now)w+=1.5;if(m.bad>m.ok)w+=1.5;w+=(6-m.step)*.2}return[w,x]}).sort((a,b)=>b[0]-a[0]).map(a=>a[1])}
export function dueIds(){const now=Date.now();return Object.keys(S.mastery).filter(k=>k.startsWith('v:')&&S.mastery[k].next<=now&&S.mastery[k].reps>0)}
export function learnedCount(){return Object.keys(S.mastery).filter(k=>k.startsWith('v:')&&S.mastery[k].step>=1).length}

/* ---------- speech ---------- */
const NATIVE=typeof window!=='undefined'&&!!(window as any).Capacitor?.isNativePlatform?.();
let _ntts:any=null;
if(NATIVE)import('@capacitor-community/text-to-speech').then(m=>{_ntts=m.TextToSpeech}).catch(()=>{});
export const TTS:any={ok:NATIVE||(typeof window!=='undefined'&&'speechSynthesis' in window),voice:null,has:NATIVE,native:NATIVE,init(){if(NATIVE||!this.ok)return;const f=()=>{const v=speechSynthesis.getVoices();const en=v.filter(x=>/^en[-_]/i.test(x.lang));this.voice=en.find(x=>/en[-_]US/i.test(x.lang)&&/google|samantha|natural|aria|jenny/i.test(x.name))||en.find(x=>/en[-_]US/i.test(x.lang))||en[0]||null;this.has=!!this.voice};f();speechSynthesis.onvoiceschanged=f}};
if(TTS.ok&&!NATIVE)TTS.init();
export function say(text,slow){if(S.set.mute||!TTS.ok||!text)return false;const t=String(text).replace(/___/g,'blank');
  if(NATIVE){if(!_ntts)return false;try{_ntts.stop().catch(()=>{}).finally(()=>{_ntts.speak({text:t,lang:'en-US',rate:slow?Math.max(.5,S.set.rate-.3):S.set.rate,pitch:1,volume:S.set.vol,category:'ambient'}).catch(()=>{})})}catch(e){return false}return true}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';if(TTS.voice)u.voice=TTS.voice;u.rate=slow?Math.max(.5,S.set.rate-.3):S.set.rate;u.volume=S.set.vol;speechSynthesis.speak(u);return true}catch(e){return false}}
export const SR=typeof window!=='undefined'?(window.SpeechRecognition||window.webkitSpeechRecognition):undefined;
let _ac;
export function beep(ok){if(S.set.mute)return;try{_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.connect(g);g.connect(_ac.destination);o.type='sine';const t=_ac.currentTime;o.frequency.setValueAtTime(ok?660:200,t);if(ok)o.frequency.setValueAtTime(880,t+.09);g.gain.setValueAtTime(.12*S.set.vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.25);o.start(t);o.stop(t+.26)}catch(e){}}

/* ---------- writing evaluation (rule-based, honest) ---------- */
export function evalWrite(t,txt){
  const raw=txt.trim(),words=raw.split(/\s+/).filter(Boolean),low=raw.toLowerCase().replace(/[’]/g,"'");
  const ok=[],miss=[],fb=[];let pts=0;
  t.must.forEach(([re,he])=>(new RegExp(re,'i').test(low)?ok:miss).push(he));
  const rel=t.must.length?ok.length/t.must.length:1;pts+=rel===1?1.5:rel>=.5?.75:0;
  if(words.length>=t.min)pts+=.5;else fb.push(`כתבו לפחות ${t.min} מילים (כתבתם ${words.length}).`);
  if(/^[A-Z]/.test(raw)&&/[.!?]$/.test(raw))pts+=.5;else fb.push('התחילו באות גדולה וסיימו בנקודה.');
  if(t.ref){const d=lev(norm(raw),norm(t.ref));if(d===0)pts+=.5;else if(d<=3){pts+=.25;fb.push('כמעט כמו הדוגמה – בדקו איות.')}else if(rel===1&&words.length>=t.min)pts+=.5}
  else if(rel===1)pts+=.5;
  if(!/[a-z]/i.test(raw))pts=0;
  pts=Math.min(3,pts);
  return{pts,pass:pts>=2,ok,miss,fb,score:Math.round(pts)};
}

/* ---------- question generators ---------- */
export const nOpts=d=>d===0?3:4;
export const SUBJ=['I','You','He','She','We','They','The farmer','The children','My mother','The men','Dan','The dog'];
export const THIRD=['He','She','The farmer','My mother','Dan','The dog'];
export const beOf=s=>s==='I'?'am':THIRD.includes(s)?'is':'are';
export const isThird=s=>THIRD.includes(s);
export const VACT=[['play','plays','playing','football'],['read','reads','reading','a book'],['eat','eats','eating','an apple'],['feed','feeds','feeding','the sheep'],['pick','picks','picking','oranges'],['sing','sings','singing','a song'],['walk','walks','walking','to school'],['swim','swims','swimming','in the river'],['run','runs','running','in the field'],['drink','drinks','drinking','milk'],['watch','watches','watching','TV'],['write','writes','writing','a letter']];
export const TH={pcont:['שימו לב למילות הרמז Look! / Right now – הפעולה קורית עכשיו.'],psimple:['מילים כמו every day מרמזות על שגרה. שימו לב: עם he/she מוסיפים s.'],neg:["עם he / she / the farmer → doesn't. עם I / you / we / they → don't."],dodoes:['עם he / she / the farmer שואלים עם Does. עם I / you / we / they עם Do.'],havehas:['he / she / my sister → has. I / you / we / they → have.'],can:['אחרי can בא פועל בסיסי – בלי s ובלי ing.'],pspc:['Every day = שגרה (Simple). Right now / Look! = עכשיו (Continuous).'],wh:['חשבו מה השאלה שואלת: מקום, אדם, זמן, סיבה?'],prep:['in = בתוך, on = על, under = מתחת.'],conj:['and = וגם, but = אבל, because = כי, or = או.'],adj:['חשבו איזה תואר מתאים לתמונה ולמשפט.'],vdiff:['קראו את המשפט – איזה פועל מתאים למשמעות?']};
export function mkG(topic,prompt,ans,opts,why,d){
  opts=uniq(opts);if(!opts.includes(ans))opts.unshift(ans);opts=shuffle(opts.filter(o=>o!==ans).slice(0,nOpts(d)-1).concat(ans));
  return{kind:'mcq',mode:'grammar',skill:'grammar',id:'g:'+topic,label:prompt.replace(/___/,'['+ans+']'),prompt:`<div class="en big2">${esc(prompt).replace('___','<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>')}</div>`,speak:null,
   opts:opts.map(o=>({h:`<span class=en>${esc(o)}</span>`,ok:o===ans})),hints:[TH[topic][0],{h:'המילה הנכונה מתחילה ב: <b class=en>'+ans[0]+'</b>'},`<b>הסבר:</b> ${why}<br><span class=en>${esc(prompt.replace('___',ans))}</span>`],why:`${why}<br><span class=en>${esc(prompt.replace('___',ans))}</span>`,regen:()=>G[topic](d)};
}
export const staticG=(topic,arr)=>d=>{const [p,a,o,w]=pick(arr);const first=p.match(/^[^\x00-\x7F]+\s*/);return mkG(topic,p,a,o.slice(),w,d)};
export const G={
 pcont:d=>{const s=pick(SUBJ),a=pick(VACT),be=beOf(s);let ans,opts,p;if(d===0){p=`Look! ${s} ___ ${a[2]} ${a[3]}.`;ans=be;opts=['am','is','are']}else{p=`Look! ${s} ___ ${a[3]}.`;ans=`${be} ${a[2]}`;opts=[ans,`${be} ${a[0]}`,isThird(s)?a[1]:a[0],a[2]]}
  return mkG('pcont',p,ans,opts,`אחרי <span class=en>${s}</span> משתמשים ב-<span class=en>${be}</span> ועוד פועל עם ing: <span class=en>${be} ${a[2]}</span>.`,d)},
 psimple:d=>{const s=pick(SUBJ),a=pick(VACT),t=isThird(s),ans=t?a[1]:a[0],oth=t?a[0]:a[1];const opts=[ans,oth,a[2]];if(d>0)opts.push(`${beOf(s)} ${a[2]}`);
  return mkG('psimple',`${s} ___ ${a[3]} every day.`,ans,opts,t?`עם <span class=en>${s}</span> (הוא/היא) מוסיפים s לפועל.`:`עם <span class=en>${s}</span> הפועל נשאר בצורה בסיסית, בלי s.`,d)},
 neg:d=>{const s=pick(SUBJ.filter(x=>x!=='The men')),[v,o]=pick([['like','milk'],['like','cats'],['have','a dog'],['play','football'],['eat','fish']]);const ans=isThird(s)?"doesn't":"don't";const opts=["don't","doesn't"];if(d>0)opts.push("isn't","aren't");
  return mkG('neg',`${s} ___ ${v} ${o}.`,ans,opts,isThird(s)?`עם <span class=en>${s}</span> (הוא/היא) משתמשים ב-doesn't.`:`עם <span class=en>${s}</span> משתמשים ב-don't.`,d)},
 dodoes:d=>{const s=pick(['you','he','she','they','the farmer','the children','your sister','your friends']),t=['he','she','the farmer','your sister'].includes(s),[v,o]=pick([['like','cats'],['play','football'],['have','a pen'],['eat','apples']]);const ans=t?'Does':'Do';const opts=['Do','Does'];if(d>0)opts.push('Is','Are');
  return mkG('dodoes',`___ ${s} ${v} ${o}?`,ans,opts,t?`עם <span class=en>${s}</span> (הוא/היא) שואלים עם Does, והפועל נשאר בסיסי.`:`עם <span class=en>${s}</span> שואלים עם Do.`,d)},
 havehas:d=>{const s=pick(SUBJ.concat(['My sister','My father'])),t=isThird(s)||/^My /.test(s),ans=t?'has':'have';const opts=['have','has'];if(d>0)opts.push('haves');
  return mkG('havehas',`${s} ___ a red pen.`,ans,opts,t?`עם <span class=en>${s}</span> (הוא/היא) משתמשים ב-has.`:`עם <span class=en>${s}</span> משתמשים ב-have.`,d)},
 can:d=>{const s=pick(['I','He','She','We','They','The horse','My sister']),a=pick(VACT);const opts=[a[0],a[1],a[2]];if(d>0)opts.push('to '+a[0]);
  return mkG('can',`${s} can ___ ${a[3]}.`,a[0],opts,'אחרי can בא פועל בצורה בסיסית – בלי s, בלי ing ובלי to.',d)},
 pspc:d=>{const s=pick(SUBJ),a=pick(VACT),now=Math.random()<.5,clue=now?pick(['Right now','Look!','At the moment','Listen!']):pick(['Every day','Every morning','Usually','On Sundays']);
  const be=beOf(s),sf=isThird(s)?a[1]:a[0],ans=now?`${be} ${a[2]}`:sf;const opts=[ans,now?sf:`${be} ${a[2]}`,a[2]];if(d>0)opts.push(`${be} ${a[0]}`);
  return mkG('pspc',`${clue}${clue.endsWith('!')?' ':', '}${s} ___ ${a[3]}.`,ans,opts,now?'מילת הרמז מראה שהפעולה קורית עכשיו → Present Continuous (am/is/are + ing).':'מילת הרמז מראה על שגרה → Present Simple.',d)},
 wh:null,prep:null,conj:null,adj:null,vdiff:null
};
G.wh=staticG('wh',WH);G.prep=staticG('prep',PREP);G.conj=staticG('conj',CONJ);G.adj=staticG('adj',ADJ);G.vdiff=staticG('vdiff',VD);

export function distract(v,d,key){const pool=VOC.filter(x=>x.id!==v.id&&x[key]!==v[key]);const same=pool.filter(x=>x.cat===v.cat),need=nOpts(d)-1;let ds=sample(same,need);if(ds.length<need)ds=ds.concat(sample(pool.filter(x=>!ds.includes(x)),need-ds.length));return ds}
export const visual=v=>!['verbs','adjectives'].includes(v.cat);
export function mkHunter(v,d,dir){
  if(!dir)dir=(d===0&&visual(v))?'pic2word':pick(visual(v)?['pic2word','word2he','he2word']:['word2he','he2word']);
  const all=shuffle([v,...distract(v,d,dir==='he2word'?'en':dir==='word2he'?'he':'en')]),L=v.en[0];
  const why=`<span class=en>${v.en}</span> = ${v.he} ${v.e}`;
  const b={kind:'mcq',mode:'hunter',nosub:true,skill:'vocabulary',id:'v:'+v.id,label:v.en+' = '+v.he,why,regen:()=>mkHunter(v,d,dir)};
  if(dir==='pic2word')return{...b,prompt:`<div class=big>${v.e}</div><div>איך אומרים את זה באנגלית?</div>`,speak:v.en,opts:all.map(x=>({h:`<span class=en>${x.en}</span>`,ok:x===v})),hints:[`האות הראשונה: <b class=en>${L}</b>`,{h:`במילה יש ${v.en.length} אותיות`},why]};
  if(dir==='word2he')return{...b,prompt:`<div class="big en">${v.en}</div><div>מה זה אומר בעברית?</div>`,speak:v.en,opts:all.map(x=>({h:x.he,ok:x===v})),hints:[`<div class=big>${v.e}</div>`,{h:`האות הראשונה באנגלית: <b class=en>${L}</b>`},why]};
  return{...b,prompt:`<div class=big>${v.he}</div><div>איך אומרים באנגלית?</div>`,speak:null,opts:all.map(x=>({h:`<span class=en>${x.en}</span>`,ok:x===v})),hints:[`<div class=big>${v.e}</div>`,{h:`האות הראשונה: <b class=en>${L}</b>`},why]};
}
export function mkListenWord(v,d){
  const vis=visual(v),all=shuffle([v,...distract(v,d,'en')]);
  return{kind:'mcq',mode:'listen',skill:'listening',id:'v:'+v.id,label:'🔊 '+v.en,prompt:`<div>הקשיבו ובחרו ${vis?'את התמונה':'את התרגום'}:</div>`,speak:v.en,auto:true,
   opts:all.map(x=>({h:vis?`<span class=big>${x.e}</span>`:x.he,ok:x===v})),hints:[{h:'לחצו שוב על 🔊, אפשר גם על 🐢 לשמיעה איטית'},{h:`האות הראשונה: <b class=en>${v.en[0]}</b>`},`<span class=en>${v.en}</span> = ${v.he} ${v.e}`],why:`<span class=en>${v.en}</span> = ${v.he} ${v.e}`,regen:()=>mkListenWord(v,d)};
}
export function mkListenSent(s,d){
  const others=sample(SENT.filter(x=>x.id!==s.id),nOpts(d)-1),all=shuffle([s,...others]);
  return{kind:'mcq',mode:'listen',skill:'listening',id:'l:'+s.id,label:'🔊 '+s.en,prompt:'<div>הקשיבו למשפט ובחרו את התרגום הנכון:</div>',speak:s.en,auto:true,opts:all.map(x=>({h:x.he,ok:x===s})),
   hints:[{h:'האזינו שוב לאט (🐢)'},{h:`המשפט מתחיל ב: <b class=en>${s.en.split(' ')[0]}</b>`},`<span class=en>${s.en}</span><br>${s.he}`],why:`<span class=en>${s.en}</span><br>${s.he}`,regen:()=>mkListenSent(s,d)};
}
export function mkListenInstr(it,d,i){
  const wr=sample(INSTR.filter(x=>x[1]!==it[1]),nOpts(d)-1),all=shuffle([it,...wr]);
  return{kind:'mcq',mode:'listen',skill:'listening',id:'l:i'+INSTR.indexOf(it),label:'🔊 '+it[0],prompt:'<div>הקשיבו להוראה ובחרו מה צריך לעשות:</div>',speak:it[0],auto:true,opts:all.map(x=>({h:`<span class=big>${x[1]}</span>`,ok:x===it})),
   hints:[{h:'האזינו שוב לאט (🐢)'},{h:'חפשו את המילה העיקרית בהוראה'},`<span class=en>${it[0]}</span> ${it[1]}`],why:`<span class=en>${it[0]}</span> ${it[1]}`,regen:()=>mkListenInstr(it,d)};
}
export function mkRead(pid,qi,listen,d){
  const P=PASS[pid],[qt,right,wr,ev]=P.qs[qi],all=shuffle([right,...wr]);
  const evs=P.s[ev];
  return{kind:'mcq',mode:listen?'listen':'reading',skill:listen?'listening':'reading',id:(listen?'l:':'r:')+pid+':'+qi,label:qt,
   passage:{title:P.title,s:P.s,hidden:!!listen,ev},prompt:`<div class="en big2">${esc(qt)}</div>`,speak:listen?P.s.join(' '):null,auto:!!listen,qspeak:qt,
   opts:all.map(o=>({h:`<span class=en>${esc(o)}</span>`,ok:o===right})),hints:[listen?{h:'לחצו שוב על 🔊 להאזנה חוזרת'}:{h:'שימו לב למילת השאלה: '+qt.split(' ')[0]},{h:'הרמז מודגש בטקסט',ev:1},`התשובה במשפט: <span class=en>"${esc(evs)}"</span>`],
   why:`התשובה במשפט: <span class=en>"${esc(evs)}"</span>`,regen:()=>mkRead(pid,qi,listen,d)};
}
export function mkBuild(s,d){
  const words=s.en.split(' '),extra=sample(uniq(SENT.filter(x=>x.id!==s.id).flatMap(x=>x.en.split(' '))).filter(w=>!words.includes(w)),d);
  return{kind:'build',mode:'builder',skill:'grammar',id:'s:'+s.id,label:s.en,prompt:`<div>בנו את המשפט באנגלית:</div><div class=big2>${s.he}</div>`,speak:s.en,answer:s.en,tiles:shuffle(words.concat(extra)),join:' ',
   hints:[{h:`המילה הראשונה: <b class=en>${words[0]}</b>`},{h:`יש ${words.length} מילים במשפט`},`<span class=en>${esc(s.en)}</span>`],why:`<span class=en>${esc(s.en)}</span>`,regen:()=>mkBuild(s,d)};
}
export function mkCC(c,form,d,idx){
  const [e,subj,verb,can,he]=c,aux=can?'can':"can't",full=`${subj} ${aux} ${verb}.`,id='cc:'+idx;
  const why=`${he}.<br><span class=en>${esc(full)}</span>`;
  if(form==='build'){const w=full.split(' '),ex=sample(['to','is','are','does'],d>0?1:0);return{kind:'build',mode:'cancant',skill:'grammar',id,label:full,prompt:`<div class=big>${e}</div><div>בנו משפט: ${he}</div>`,speak:full,answer:full,tiles:shuffle(w.concat(ex)),join:' ',hints:[{h:`המילה הראשונה: <b class=en>${w[0]}</b>`},{h:'חשבו: can או can\'t?'},why],why,regen:()=>mkCC(c,'build',d,idx)}}
  return{kind:'mcq',mode:'cancant',skill:'grammar',id,label:full,prompt:`<div class=big>${e}</div><div class="en big2">${subj} <u>&nbsp;&nbsp;&nbsp;&nbsp;</u> ${verb}.</div>`,speak:null,opts:shuffle([{h:'<span class=en>can</span>',ok:can},{h:"<span class=en>can't</span>",ok:!can}]),
   hints:[{h:'חשבו על '+subj+' במציאות'},{h:'האם זה אפשרי? '+(can?'כן ✔️':'לא ✖️')},why],why,regen:()=>mkCC(c,'mcq',d,idx)};
}
export function mkTalk(i,d){
  const [line,right,wr,why]=TALK[i],nm=S.name||'Dan',R=right.replace('{name}',nm),all=shuffle([R,...wr.map(x=>x.replace('{name}',nm))]);
  return{kind:'mcq',mode:'talk',skill:'speaking',id:'d:'+i,label:line,prompt:`<div class=bubble><span class=en>${esc(line)}</span></div><div>איך עונים?</div>`,speak:line,auto:true,opts:all.map(o=>({h:`<span class=en>${esc(o)}</span>`,ok:o===R})),sayText:R,
   hints:[{h:'האזינו לשאלה שוב (🔊)'},{h:'חשבו: מה השאלה שואלת? '+line.split(' ')[0]},`${why}<br><span class=en>${esc(R)}</span>`],why:`${why}<br><span class=en>${esc(R)}</span>`,regen:()=>mkTalk(i,d)};
}
export function mkPic(i,d){
  const p=PIC[i],w=p.en.split(' '),ex=sample(['are','is','the','a'].filter(x=>!w.map(y=>y.toLowerCase()).includes(x)),d>0?1:0);
  return{kind:'build',mode:'picture',skill:'writing',id:'p:'+i,label:p.en,prompt:`<div class=scene>${p.e}</div><div>תארו מה קורה בתמונה באנגלית:</div>`,speak:null,answer:p.en,accept:p.alt,tiles:shuffle(w.concat(ex)),join:' ',
   hints:[{h:`המשפט מתחיל ב: <b class=en>${w.slice(0,2).join(' ')}</b>`},{h:p.he},`<span class=en>${esc(p.en)}</span>`],why:`<span class=en>${esc(p.en)}</span> – ${p.he}`,regen:()=>mkPic(i,d)};
}
export function mkFix(i,d){
  const [wr,rt,ds,why]=FX[i],ex=`<div class="en big2 wrong">${esc(wr)}</div>`;
  if(d>=2)return{kind:'type',mode:'fix',skill:'grammar',id:'f:'+i,label:wr,prompt:`<div>יש טעות במשפט. הקלידו אותו מתוקן:</div>${ex}`,answers:[rt],hints:[{h:'הטעות קשורה לפועל'},{h:'חשבו על הנושא של המשפט'},`<span class=en>${esc(rt)}</span>`],why:`${why}<br><span class=en>${esc(rt)}</span>`,regen:()=>mkFix(i,d)};
  return{kind:'mcq',mode:'fix',skill:'grammar',id:'f:'+i,label:wr,prompt:`<div>יש טעות במשפט. איזה משפט נכון?</div>${ex}`,speak:null,opts:shuffle([rt,wr,ds]).map(o=>({h:`<span class=en>${esc(o)}</span>`,ok:o===rt})),
   hints:[{h:'הטעות קשורה לפועל'},{h:'חשבו על הנושא של המשפט'},`${why}<br><span class=en>${esc(rt)}</span>`],why:`${why}<br><span class=en>${esc(rt)}</span>`,regen:()=>mkFix(i,d)};
}
export function mkMissingLetters(v,d){
  const w=v.en,idx=[...w].map((c,i)=>i).filter(i=>w[i]!==' '),k=Math.min(d+1,Math.floor(idx.length/2)||1),h=sample(idx,k),pat=[...w].map((c,i)=>h.includes(i)?'_':c).join(' ');
  return{kind:'type',mode:'factory',skill:'spelling',id:'v:'+v.id,label:v.en,prompt:`<div class=big>${v.e}</div><div>${v.he} – השלימו את האותיות החסרות:</div><div class="big2 en pat">${pat}</div>`,answers:[w],speak:v.en,
   hints:[{h:`האות הראשונה: <b class=en>${w[0]}</b>`},{h:`יש ${w.length} אותיות`},`<span class=en>${w}</span>`],why:`<span class=en>${w}</span> = ${v.he}`,regen:()=>mkMissingLetters(v,d)};
}
export function mkOrder(v,d){
  const w=v.en,L=[...w];let t=shuffle(L);for(let i=0;i<5&&t.join('')===w;i++)t=shuffle(L);if(d>1)t=shuffle(t.concat(sample('aeioutnrsl'.split('').filter(c=>!L.includes(c)),1)));
  return{kind:'build',mode:'factory',skill:'spelling',id:'v:'+v.id,label:v.en,prompt:`<div class=big>${v.e}</div><div>${v.he} – סדרו את האותיות למילה:</div>`,speak:v.en,answer:w,tiles:t,join:'',
   hints:[{h:`האות הראשונה: <b class=en>${w[0]}</b>`},{h:`יש ${w.length} אותיות`},`<span class=en>${w}</span>`],why:`<span class=en>${w}</span> = ${v.he}`,regen:()=>mkOrder(v,d)};
}
export function mkMemory(cat,d){
  const pool=VOC.filter(v=>v.cat===cat&&visual(v)),n=Math.min(pool.length-1,d===0?4:6),items=sample(pool,n),miss=pick(items),rest=items.filter(x=>x!==miss),dec=sample(pool.filter(x=>!items.includes(x)).concat(VOC.filter(x=>x.cat!==cat&&visual(x))),3);
  const all=shuffle([miss,...dec]);
  const after={kind:'mcq',mode:'missing',skill:'vocabulary',id:'v:'+miss.id,label:'מה חסר? '+miss.en,prompt:`<div class=grid6>${rest.map(x=>`<span class=big>${x.e}</span>`).join('')}</div><div>איזה פריט נעלם?</div>`,speak:null,opts:all.map(x=>({h:`<span class=en>${x.en}</span> ${x.e}`,ok:x===miss})),
   hints:[{h:'ספרו את הפריטים שנשארו'},{h:`האות הראשונה: <b class=en>${miss.en[0]}</b>`},`<span class=en>${miss.en}</span> ${miss.e}`],why:`<span class=en>${miss.en}</span> ${miss.e}`,regen:()=>mkMemory(cat,d)};
  return{kind:'memory',mode:'missing',skill:'vocabulary',id:'v:'+miss.id,items,after,secs:d===0?6:5};
}
export function mkWrite(id){return{kind:'write',mode:'writing',skill:'writing',id:'w:'+id,label:WT[id].ref,task:WT[id],tid:id,speak:null}}
export function mkSearch(cat,d){
  const pool=VOC.filter(v=>v.cat===cat&&!v.en.includes(' ')&&v.en.length<=7),words=sample(pool,5),N=8,g=Array.from({length:N},()=>Array(N).fill(''));
  const place=[];for(const v of words){const w=v.en.toUpperCase();let ok=false;for(let t=0;t<60&&!ok;t++){const dir=rnd(d>0?3:2),dx=dir===0?1:dir===1?0:1,dy=dir===0?0:1,x=rnd(N-dx*(w.length-1)),y=rnd(N-dy*(w.length-1));let fits=true;for(let i=0;i<w.length;i++){const c=g[y+dy*i][x+dx*i];if(c&&c!==w[i]){fits=false;break}}if(fits){for(let i=0;i<w.length;i++)g[y+dy*i][x+dx*i]=w[i];place.push({v,x,y,dx,dy});ok=true}}}
  const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';for(const r of g)for(let i=0;i<N;i++)if(!r[i])r[i]=A[rnd(26)];
  return{kind:'search',mode:'wordquest',skill:'vocabulary',id:'wq:'+cat,label:'Word Quest',g,place,N,words:place.map(p=>p.v)};
}
export const vpool=o=>{let p=VOC;if(o.ids)p=p.filter(v=>o.ids.includes(v.id));else if(o.cat)p=p.filter(v=>v.cat===o.cat);else if(o.cats)p=p.filter(v=>o.cats.includes(v.cat));return p};

/* spec → list of questions */
export function expand(sp){
  const n=sp.n||5;
  switch(sp.m){
  case'hunter':{const d=diff('vocabulary');return prio(vpool(sp),v=>'v:'+v.id).slice(0,n).map(v=>mkHunter(v,d))}
  case'missing':{const d=diff('vocabulary');return Array.from({length:n},()=>mkMemory(sp.cat||'animals',d))}
  case'factory':{const d=diff('spelling'),p=prio(vpool(sp).filter(v=>!v.en.includes(' ')&&v.en.length>=3),v=>'v:'+v.id).slice(0,n);return p.map(v=>sp.kind==='missing'?mkMissingLetters(v,d):mkOrder(v,d))}
  case'listen':{const d=diff('listening');
    if(sp.kind==='sent'){const p=SENT.filter(s=>!sp.r||s.r===sp.r);return prio(p,s=>'l:'+s.id).slice(0,n).map(s=>mkListenSent(s,d))}
    if(sp.kind==='instr')return sample(INSTR,n).map(i=>mkListenInstr(i,d));
    if(sp.kind==='passage'){const P=PASS[sp.pid];return sample(P.qs.map((_,i)=>i),Math.min(n,P.qs.length)).map(i=>mkRead(sp.pid,i,true,d))}
    return prio(vpool(sp),v=>'v:'+v.id).slice(0,n).map(v=>mkListenWord(v,d))}
  case'builder':{const d=diff('grammar');let p=SENT;if(sp.r)p=p.filter(s=>s.r===sp.r);if(sp.tag)p=p.filter(s=>s.tag===sp.tag);return prio(p,s=>'s:'+s.id).slice(0,n).map(s=>mkBuild(s,d))}
  case'cancant':{const d=diff('grammar');return sample(CC.map((c,i)=>i),n).map((i,k)=>mkCC(CC[i],k%2?'build':'mcq',d,i))}
  case'grammar':{const d=diff('grammar'),t=sp.topics||Object.keys(G);return Array.from({length:n},(_,i)=>G[t[i%t.length]](d))}
  case'reading':{const P=PASS[sp.pid],d=diff('reading');return sample(P.qs.map((_,i)=>i),Math.min(n,P.qs.length)).map(i=>mkRead(sp.pid,i,false,d))}
  case'talk':{const d=diff('speaking');return prio(TALK.map((_,i)=>i),i=>'d:'+i).slice(0,n).map(i=>mkTalk(i,d))}
  case'picture':{const d=diff('writing');return sample(PIC.map((_,i)=>i),n).map(i=>mkPic(i,d))}
  case'fix':{const d=diff('grammar');return prio(FX.map((_,i)=>i),i=>'f:'+i).slice(0,n).map(i=>mkFix(i,d))}
  case'wordquest':return[mkSearch(sp.cat||'animals',diff('vocabulary'))];
  case'writing':return(sp.ids||[]).map(mkWrite);
  }return[];
}
export const buildQueue=specs=>specs.flatMap(expand);

/* boss pools */
export function bossSpecs(r){return r===1
 ?[{m:'hunter',cats:['animals','colors','numbers','family','food','objects'],n:4},{m:'listen',kind:'word',cats:['animals','colors','food'],n:2},{m:'grammar',topics:['havehas'],n:2},{m:'builder',r:1,n:2},{m:'talk',n:1}]
 :[{m:'grammar',topics:['can','pcont','psimple','pspc'],n:4},{m:'grammar',topics:['adj','vdiff'],n:2},{m:'cancant',n:1},{m:'reading',pid:'p1',n:2},{m:'fix',n:1}]}

/* exam: n questions from configurable duration; no repeats of exact items inside one exam */
export function examQueue(min){
  const n=min<=5?8:min<=10?14:20,pass=pick(['p1','p2','p3']),w=Math.max(1,Math.round(n*.2));
  const spec=[{m:'hunter',cats:Object.keys(CATS),n:Math.round(n*.2)},{m:'grammar',topics:['pcont','psimple','neg','dodoes','havehas','can','pspc','wh','prep','conj'],n:Math.round(n*.35)},{m:'reading',pid:pass,n:Math.max(2,Math.round(n*.2))},{m:'listen',kind:'sent',n:Math.max(1,Math.round(n*.1))},{m:'fix',n:1}];
  const q=buildQueue(spec).filter(x=>x.kind!=='memory');q.push(mkWrite(pick(['w_intro','w_daily','w_family','w_ican'])));
  q.forEach(x=>x.exam=true);return q;
}
/* assessment: fixed mix across skills */
export function assessQueue(){
  const d=1,vp=[...sample(VOC.filter(v=>v.cat==='animals'),1),...sample(VOC.filter(v=>v.cat==='food'),1),...sample(VOC.filter(v=>v.cat==='colors'),1)];
  const q=[...vp.map(v=>mkHunter(v,d,'pic2word')),mkMissingLetters(pick(VOC.filter(v=>['dog','cat','sun','red','pen'].includes(v.id))),0),mkMissingLetters(pick(VOC.filter(v=>['apple','horse','sheep','bread'].includes(v.id))),0),
   G.can(1),G.psimple(1),G.pcont(0),G.havehas(1),mkRead('p3',0,false,d),mkRead('p3',2,false,d),mkListenWord(pick(VOC.filter(v=>visual(v)&&v.cat==='animals')),d),mkListenSent(pick(SENT),d)];
  q.forEach(x=>x.exam=true);return q;
}
/* regenerate a question from an item id (for "previously incorrect" practice) */
export function regenById(id,d){
  const [k,a,b]=id.split(':');
  try{
  if(k==='v'){const v=VM[a];return v&&mkHunter(v,d)}
  if(k==='s'){const s=SENT.find(x=>x.id===a);return s&&mkBuild(s,d)}
  if(k==='g')return G[a]&&G[a](d);
  if(k==='f')return mkFix(+a,d);
  if(k==='d')return mkTalk(+a,d);
  if(k==='p')return mkPic(+a,d);
  if(k==='cc')return mkCC(CC[+a],'mcq',d,+a);
  if(k==='r'||k==='l'){if(PASS[a])return mkRead(a,+b,k==='l',d);const s=SENT.find(x=>x.id===a);if(s)return mkListenSent(s,d)}
  }catch(e){}return null;
}
export function weakQueue(n){
  const bad=uniq(S.attempts.filter(a=>!a.ok).map(a=>a.id).reverse()).slice(0,n*2),d=1;
  return bad.map(id=>regenById(id,d)).filter(Boolean).slice(0,n);
}

/* mission availability / unlocking: by demonstrated performance, not XP */
export const mDone=id=>!!(S.missions[id]&&S.missions[id].done);
export function regionOpen(r){return r===1||(r===2&&!!S.flags.farmOpen)}
export function missionState(m){
  if(!regionOpen(m.r))return'lock';
  if(mDone(m.id))return'done';
  const reg=MISSIONS.filter(x=>x.r===m.r);
  if(m.boss)return reg.filter(x=>!x.boss).every(x=>mDone(x.id))?'open':'lock';
  const i=reg.indexOf(m);return(i===0||mDone(reg[i-1].id))?'open':'lock';
}
export function gateCount(){return Object.keys(S.mastery).filter(k=>k.startsWith('v:')&&S.mastery[k].step>=2).length}
export function gateInfo(){const b=mDone('v6'),l=gateCount();return{boss:b,learned:l,need:CFG.minLearnedForGate,ok:b&&l>=CFG.minLearnedForGate}}
export function currentMission(){return MISSIONS.find(m=>missionState(m)==='open')||null}

/* analytics for parent dashboard */
export function skillBuckets(){
  const f=(sk)=>{const a=S.attempts.filter(x=>sk.includes(x.skill));if(!a.length)return null;const r=a.slice(-40);return r.filter(x=>x.ok).length/r.length};
  const ind=S.attempts.filter(x=>['type','build','write'].includes(x.kind));
  return{vocab:f(['vocabulary','spelling']),grammar:f(['grammar']),reading:f(['reading']),listening:f(['listening']),writing:f(['writing']),speaking:f(['speaking']),independent:ind.length?ind.slice(-40).filter(x=>x.ok).length/Math.min(40,ind.length):null};
}
export function readiness(at){
  const old=S.attempts;if(at!=null)S.attempts=old.filter(x=>x.t<at);
  const b=skillBuckets();S.attempts=old;const w=S.set.weights;let sum=0,wt=0;
  for(const k of ['vocab','grammar','reading','listening','writing','independent'])if(b[k]!=null){sum+=b[k]*w[k];wt+=w[k]}
  return{idx:wt?Math.round(100*sum/wt):null,b,cover:wt};
}

/* happy chime for rewards */
export function chime(){if(S.set.mute)return;try{_ac=_ac||new(window.AudioContext||window.webkitAudioContext)();const t0=_ac.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=_ac.createOscillator(),g=_ac.createGain();o.connect(g);g.connect(_ac.destination);o.type='triangle';const t=t0+i*.08;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.12*S.set.vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.start(t);o.stop(t+.32)})}catch(e){}}
export function stopSpeech(){try{if(NATIVE){_ntts&&_ntts.stop().catch(()=>{})}else speechSynthesis.cancel()}catch(e){}}
