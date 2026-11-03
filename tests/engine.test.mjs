// Pure-logic tests (run with: npm test). Node strips the TypeScript types.
import test from 'node:test';import assert from 'node:assert/strict';
const store={};
globalThis.window=globalThis;globalThis.addEventListener=()=>{};globalThis.document={addEventListener(){},hidden:false};
globalThis.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v}};
const C=await import('../src/data/content.ts');
const E=await import('../src/engine/engine.ts');
const {S,G,VOC,mkHunter}=Object.assign({},E,C);
const chk=(q,w)=>{assert.ok(q,'null '+w);if(q.kind==='mcq'){assert.equal(q.opts.filter(o=>o.ok).length,1,'one correct '+w);assert.equal(new Set(q.opts.map(o=>o.h)).size,q.opts.length,'dup opts '+w)}
 if(q.kind==='build'){const sep=q.join===''?'':' ';for(const w2 of q.answer.split(sep))assert.ok(q.tiles.includes(w2),'tile missing '+w)}};
test('no pig content anywhere in data',async()=>{const fs=await import('node:fs');const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(d+'/'+x.name):[d+'/'+x.name]);
  for(const f of walk(new URL('../src',import.meta.url).pathname)){const t=fs.readFileSync(f,'utf8');assert.ok(!/\bpigs?\b|🐷|🐖|🐽|חזיר|פיגי/i.test(t),'pig content in '+f)}});
test('every generator yields valid questions at all difficulties',()=>{for(let d=0;d<3;d++){E.S.set.diffOverride=d;
  for(const t of Object.keys(E.G))for(let i=0;i<40;i++)chk(E.G[t](d),'G.'+t);
  for(const v of C.VOC){chk(E.mkHunter(v,d),'hunter '+v.id);chk(E.mkListenWord(v,d),'lw '+v.id)}
  C.SENT.forEach(s=>{chk(E.mkBuild(s,d),s.id);chk(E.mkListenSent(s,d),s.id)});
  C.CC.forEach((c,i)=>{chk(E.mkCC(c,'mcq',d,i),'cc');chk(E.mkCC(c,'build',d,i),'ccb')});
  C.TALK.forEach((_,i)=>chk(E.mkTalk(i,d),'talk'));C.PIC.forEach((_,i)=>chk(E.mkPic(i,d),'pic'));C.FX.forEach((_,i)=>chk(E.mkFix(i,d),'fix'));
  for(const p in C.PASS)C.PASS[p].qs.forEach((_,i)=>{chk(E.mkRead(p,i,false,d),'r');chk(E.mkRead(p,i,true,d),'l')})}});
test('all missions expand to questions and have writing tasks',()=>{for(const m of C.MISSIONS){if(m.boss){assert.ok(E.buildQueue(E.bossSpecs(m.r)).length>5);continue}
  const q=E.buildQueue(m.steps);assert.ok(q.length>0,m.id);assert.ok(C.WT[m.chal],m.id)}});
test('mastery advances only when review is due (no same-session inflation)',()=>{const q={id:'v:test',skill:'vocabulary',mode:'hunter',kind:'mcq'};
  E.record(q,2);assert.equal(E.S.mastery['v:test'].step,1);E.record(q,2);assert.equal(E.S.mastery['v:test'].step,1);
  E.S.mastery['v:test'].next=0;E.record(q,2);assert.equal(E.S.mastery['v:test'].step,2);E.record(q,0);assert.equal(E.S.mastery['v:test'].step,0)});
test('XP/levels',()=>{assert.equal(E.levelInfo(0).lvl,1);assert.equal(E.levelInfo(640).lvl,5)});
test('writing evaluation',()=>{assert.ok(E.evalWrite(C.WT.w_farmer,'The farmer is feeding the sheep.').pass);assert.ok(!E.evalWrite(C.WT.w_count,'i have red').pass)});
test('mission unlock logic: gate needs boss + repeated mastery, not XP',()=>{E.S.xp=99999;assert.equal(E.regionOpen(2),false);assert.equal(E.gateInfo().ok,false)});
test('game layer: daily plan builds, missions complete, gate opens only with mastery',async()=>{
  const Gm=await import('../src/engine/game.ts');
  const plan=Gm.dailyPlan();assert.equal(plan.length,5);for(const p of plan)assert.ok(E.buildQueue(p.specs).length>0,p.t);
  const m=C.MISSIONS.find(x=>x.id==='v6');
  E.S.missions.v6={done:true};E.S.flags.farmOpen=false;for(const k of Object.keys(E.S.mastery))delete E.S.mastery[k];
  assert.equal(Gm.checkGate(),false);
  C.VOC.slice(0,13).forEach(v=>E.S.mastery['v:'+v.id]={step:2,reps:3,ok:3,bad:0,modes:['a'],next:Date.now()+1e6,last:Date.now(),streak:3});
  assert.equal(Gm.checkGate(),true);assert.ok(E.regionOpen(2));
  assert.ok(Gm.parentStats().rec.length>0);
});
