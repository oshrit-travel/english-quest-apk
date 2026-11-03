import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { NPCS, MISSIONS, SHOP, CFG } from '../data/content.ts';
import { S, addReward, beep, missionState } from '../engine/engine.ts';
import { checkAch } from '../engine/game.ts';
import { bus } from '../engine/bus.ts';
import { useGame } from '../engine/useGame.ts';
import { Humanoid, Pet, skinFor, type Look } from './Character.tsx';
import { Sheep, Horse, Cow, Chicken, Rabbit, Duck, Birds, Butterflies } from './Animals.tsx';
import { Ground, Forest, Meadow, Houses, Fences, Gate, Lamps, Fountain, Well, Stalls, Hay, Crops, Windmill, Pond, CloudShadows, Tag } from './Props.tsx';
import { BOUND, COINS, PENS, POND, hit } from './layout.ts';
import { input, player, useWorld } from './store.ts';

const RT = Math.SQRT1_2;
const shopColor = (k: keyof typeof SHOP, id: string): string | null => ((SHOP[k] as any[]).find((x) => x[0] === id) || [])[2] ?? null;

/* ---------- static world (never re-renders) ---------- */
const StaticWorld = memo(function StaticWorld() {
  return (
    <>
      <Ground /><Houses /><Fences /><Forest /><Meadow /><Lamps /><Fountain /><Well /><Stalls /><Hay /><Crops /><Windmill /><Pond />
      <CloudShadows /><Birds /><Butterflies />
      {[[15.5, 15], [17.5, 17.5], [19.5, 15.5], [20, 18.5]].map((p, i) => <Sheep key={'s' + i} bounds={PENS.sheep as any} start={p as any} />)}
      <Horse bounds={PENS.horses as any} start={[29, 16]} /><Horse bounds={PENS.horses as any} start={[33, 18]} coat="#f2ede4" mane="#b9a98c" />
      <Cow bounds={PENS.horses as any} start={[30, 14.8]} /><Cow bounds={PENS.horses as any} start={[34, 15]} />
      {[[26, -18], [28, -17], [30, -18.4], [27.4, -16]].map((p, i) => <Chicken key={'c' + i} bounds={PENS.chickens as any} start={p as any} color={i % 2 ? '#f4e2c4' : '#fffaf0'} />)}
      <Rabbit bounds={[-34, 8, -28, 12]} start={[-31, 10]} /><Rabbit bounds={[-34, 8, -28, 12]} start={[-30, 11]} color="#c9b497" /><Rabbit bounds={[2.5, 6, 8, 11]} start={[5, 9]} color="#efe9e0" />
      <Duck circle={{ x: POND.x, z: POND.z, r: 2.4 }} start={[POND.x + 1, POND.z]} /><Duck circle={{ x: POND.x, z: POND.z, r: 2.4 }} start={[POND.x - 1.2, POND.z + 1]} />
    </>
  );
});

/* ---------- NPCs ---------- */
const NPC_LOOK: Record<string, { hair: Look['hairStyle']; skin: number; hat?: string; pants?: string; accent?: string }> = {
  dana: { hair: 'long', skin: 0 }, yuval: { hair: 'short', skin: 1, accent: '#fff' }, mira: { hair: 'bun', skin: 3 }, sami: { hair: 'spiky', skin: 2 },
  ruth: { hair: 'bob', skin: 0 }, guard: { hair: 'short', skin: 1, hat: 'cap', pants: '#59616b' }, gil: { hair: 'short', skin: 2, hat: 'straw', pants: '#6b5a3a' },
  tali: { hair: 'long', skin: 3 }, omer: { hair: 'spiky', skin: 1, hat: 'straw' }, avi: { hair: 'short', skin: 4 }, dalia: { hair: 'bob', skin: 0 },
  kids: { hair: 'spiky', skin: 3 }, oldgil: { hair: 'short', skin: 1, hat: 'straw', pants: '#7a5a2a', accent: '#c0392b' },
};

function Npc({ id }: { id: string }) {
  const n = (NPCS as any)[id], ex = NPC_LOOK[id] || { hair: 'short', skin: 0 };
  const g = useRef<THREE.Group>(null!), mk = useRef<THREE.Group>(null!), ring = useRef<THREE.Mesh>(null!);
  const m = MISSIONS.find((x) => x.npc === id);
  const st = m ? missionState(m) : null;
  const look: Look = useMemo(() => ({ shirt: n.c, hair: n.h, skin: skinFor(ex.skin), hairStyle: ex.hair, hat: ex.hat, pants: ex.pants, accent: ex.accent }), [id]);
  const ph = useMemo(() => Math.random() * 6, []);
  const pose = useRef({ speed: 0, wave: 0, cheer: 0, talk: 0 });
  const col = st === 'done' ? '#5ed58c' : st === 'lock' ? '#a4adb6' : m?.boss ? '#ff6b5a' : '#ffcf3d';
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime, dx = player.x - n.x, dz = player.z - n.z, d = Math.hypot(dx, dz);
    if (d < 8) { const ta = Math.atan2(dx, dz); let da = ta - g.current.rotation.y; while (da > Math.PI) da -= 6.283; while (da < -Math.PI) da += 6.283; g.current.rotation.y += da * Math.min(1, dt * 5); }
    pose.current.wave = d < 5.2 && st === 'open' ? 1 : 0;
    mk.current.position.y = 3.35 + Math.sin(t * 2.4 + ph) * 0.15; mk.current.rotation.y = t * 1.6;
    if (ring.current) { const k = (t * 0.8 + ph) % 1; ring.current.scale.setScalar(0.7 + k * 0.8); (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k); }
  });
  return (
    <group position={[n.x, 0, n.z]}>
      <group ref={g}><Humanoid look={look} pose={() => pose.current} phase={ph} /></group>
      <Tag y={2.95} text={n.n} />
      {st && (
        <group ref={mk}>
          <mesh scale={[0.36, 0.55, 0.36]}><octahedronGeometry args={[1]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={st === 'lock' ? 0.1 : 0.55} flatShading /></mesh>
        </group>
      )}
      {st === 'open' && <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}><ringGeometry args={[0.85, 1.05, 32]} /><meshBasicMaterial color={col} transparent opacity={0.5} depthWrite={false} /></mesh>}
      <mesh position={[0, 1.4, 0]} onClick={(e) => { e.stopPropagation(); if (useWorld.getState().mode === 'play') bus.emit('npc-tap', id); }}>
        <cylinderGeometry args={[1.1, 1.1, 2.9, 8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---------- coins ---------- */
function Coins() {
  const g = useGame();
  const refs = useRef<Record<string, THREE.Group>>({});
  const list = COINS.map((c, i) => ({ id: 'k' + i, x: c[0], z: c[1] })).filter((c) => !g.picked.includes(c.id));
  useFrame((s) => {
    const t = s.clock.elapsedTime, play = useWorld.getState().mode === 'play';
    for (const c of list) {
      const o = refs.current[c.id]; if (!o) continue;
      o.rotation.y = t * 3 + c.x; o.position.y = 0.95 + Math.sin(t * 3 + c.z) * 0.14;
      if (play && Math.hypot(player.x - c.x, player.z - c.z) < 1.15 && !S.picked.includes(c.id)) {
        S.picked.push(c.id); addReward(0, CFG.coins.pickup); beep(true); bus.emit('coin', c.id); checkAch();
      }
    }
  });
  return (
    <>
      {list.map((c) => (
        <group key={c.id} position={[c.x, 0.95, c.z]} ref={(o) => { if (o) refs.current[c.id] = o; }}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.38, 0.38, 0.1, 20]} /><meshStandardMaterial color="#ffd23f" emissive="#ffb300" emissiveIntensity={0.45} metalness={0.7} roughness={0.25} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27, 0.035, 6, 20]} /><meshStandardMaterial color="#fff2a8" emissive="#ffe27a" emissiveIntensity={0.5} /></mesh>
        </group>
      ))}
    </>
  );
}

/* ---------- player ---------- */
function Player() {
  const g = useGame();
  const root = useRef<THREE.Group>(null!), body = useRef<THREE.Group>(null!), petG = useRef<THREE.Group>(null!);
  const A = g.avatar;
  const look: Look = useMemo(() => ({
    shirt: shopColor('shirt', A.shirt) || '#3b82f6', hair: shopColor('hair', A.hair) || '#5b3a1e', hat: A.hat, pack: shopColor('pack', A.pack), hairStyle: 'short', skin: '#f6c9a0',
  }), [A.shirt, A.hair, A.hat, A.pack]);
  const petColor = shopColor('pet', A.pet) || '#b9824f';
  const pose = useRef({ speed: 0, wave: 0, cheer: 0 });
  useEffect(() => { root.current.position.set(S.pos.x, 0, S.pos.z); player.x = S.pos.x; player.z = S.pos.z; petG.current.position.set(S.pos.x - 1.2, 0, S.pos.z - 1.2); }, []);
  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05);
    const mode = useWorld.getState().mode, k = input.keys;
    let ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0) + input.joyX, iy = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) + input.joyY;
    let mag = Math.hypot(ix, iy); if (mag > 1) { ix /= mag; iy /= mag; mag = 1; }
    if (mode === 'play' && mag > 0.08) {
      const wx = ix * RT - iy * RT, wz = -ix * RT - iy * RT, spd = 2.4 + mag * 4.2, open = !!S.flags.farmOpen;
      const nx = player.x + wx * spd * dt, nz = player.z + wz * spd * dt;
      if (!hit(nx, player.z, 0.45, open) && nx > BOUND.x1 && nx < BOUND.x2) player.x = nx;
      if (!hit(player.x, nz, 0.45, open) && nz > BOUND.z1 && nz < BOUND.z2) player.z = nz;
      const ta = Math.atan2(wx, wz); let da = ta - player.a; while (da > Math.PI) da -= 6.283; while (da < -Math.PI) da += 6.283; player.a += da * Math.min(1, dt * 14);
      player.v = spd;
    } else player.v = Math.max(0, player.v - dt * 30);
    if (player.wave > 0) player.wave -= dt; if (player.cheer > 0) player.cheer -= dt;
    pose.current.speed = player.v; pose.current.wave = player.wave; pose.current.cheer = player.cheer;
    root.current.position.set(player.x, 0, player.z); body.current.rotation.y = player.a;
    // pet follows
    const p = petG.current, dx = player.x - p.position.x, dz = player.z - p.position.z, d = Math.hypot(dx, dz);
    if (d > 1.9) { const s = Math.min(d - 1.7, 6 * dt); p.position.x += (dx / d) * s; p.position.z += (dz / d) * s; p.rotation.y = Math.atan2(dx, dz); }
    // proximity to NPCs
    if (mode === 'play') {
      let best: string | null = null, bd = 3.6;
      for (const [id, n] of Object.entries(NPCS as Record<string, any>)) { const dd = Math.hypot(player.x - n.x, player.z - n.z); if (dd < bd) { bd = dd; best = id; } }
      if (useWorld.getState().near !== best) useWorld.getState().setNear(best);
      S.pos.x = player.x; S.pos.z = player.z;
    }
  });
  return (
    <>
      <group ref={root}>
        <group ref={body}><Humanoid look={look} pose={() => pose.current} /></group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}><circleGeometry args={[0.55, 20]} /><meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} /></mesh>
      </group>
      <group ref={petG}>{A.pet !== 'none' && <Pet type={A.pet} color={petColor} />}</group>
    </>
  );
}

/* ---------- camera + lighting rig ---------- */
function Rig() {
  const cam = useRef<THREE.OrthographicCamera>(null!);
  const sun = useRef<THREE.DirectionalLight>(null!);
  const size = useThree((s) => s.size);
  const aim = useMemo(() => new THREE.Object3D(), []);
  const tgt = useRef({ x: player.x, z: player.z, zoom: 40 });
  useLayoutEffect(() => { sun.current.target = aim; }, [aim]);
  const q = useWorld((s) => s.quality);
  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05);
    const { mode, zoom } = useWorld.getState(), portrait = size.height > size.width;
    let ox = 0, oz = 0, zm = 1;
    if (mode === 'menu') { const k = portrait ? 3.8 : 3.3; if (portrait) { ox = k * RT; oz = k * RT; } else { ox = k * RT; oz = -k * RT; } zm = 1.3; }
    const base = Math.max(24, Math.min(80, Math.min(size.width, size.height) / (portrait ? 13 : 15)));
    const T = tgt.current, k = Math.min(1, dt * (mode === 'play' ? 6 : 2.5));
    const px = Math.max(-31, Math.min(41, player.x)), pz = Math.max(-17, Math.min(17, player.z));
    T.x += (px + ox - T.x) * k; T.z += (pz + oz - T.z) * k; T.zoom += (base * zm * zoom - T.zoom) * Math.min(1, dt * 3);
    const c = cam.current; c.position.set(T.x + 14, 16, T.z + 14); c.lookAt(T.x, 0, T.z); c.zoom = T.zoom; c.updateProjectionMatrix();
    sun.current.position.set(T.x - 22, 36, T.z + 16); aim.position.set(T.x, 0, T.z); aim.updateMatrixWorld();
  });
  return (
    <>
      <OrthographicCamera ref={cam} makeDefault position={[14, 16, 14]} near={0.1} far={220} zoom={40} />
      <hemisphereLight args={['#fff5e0', '#8fbf74', 1.05]} />
      <ambientLight intensity={0.28} color="#ffe9c4" />
      <directionalLight ref={sun} castShadow intensity={2.5} color="#fff0cf" shadow-mapSize={q === 'low' ? [1024, 1024] : [2048, 2048]} shadow-bias={-0.0005} shadow-normalBias={0.05}
        shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-near={1} shadow-camera-far={110} />
      <primitive object={aim} />
    </>
  );
}

function Interact() {
  // keyboard (desktop) – Android back / on-screen controls are wired in the HUD / App
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement; if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      if (useWorld.getState().mode !== 'play') return;
      input.keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') bus.emit('interact');
      if (e.code === 'Escape') bus.emit('escape');
    };
    const up = (e: KeyboardEvent) => { input.keys[e.code] = false; };
    addEventListener('keydown', dn); addEventListener('keyup', up);
    return () => { removeEventListener('keydown', dn); removeEventListener('keyup', up); };
  }, []);
  // friendly wave in the menu
  useEffect(() => { const id = setInterval(() => { if (useWorld.getState().mode === 'menu') player.wave = 1.8; }, 5200); return () => clearInterval(id); }, []);
  return null;
}

function World() {
  const g = useGame();
  return (
    <>
      <Rig /><Interact />
      <StaticWorld />
      <Gate open={!!g.flags.farmOpen} />
      {Object.keys(NPCS as object).map((id) => <Npc key={id} id={id} />)}
      <Coins /><Player />
    </>
  );
}

export default function GameCanvas() {
  const mode = useWorld((s) => s.mode), quality = useWorld((s) => s.quality), setQuality = useWorld((s) => s.setQuality);
  return (
    <Canvas shadows={quality === 'high'} dpr={quality === 'low' ? 1 : [1, 1.75]} frameloop={mode === 'frozen' ? 'never' : 'always'}
      gl={{ antialias: true, powerPreference: 'high-performance' }} style={{ position: 'fixed', inset: 0, touchAction: 'none' }}
      onCreated={({ gl, scene }) => { gl.setClearColor('#8fd8ea'); scene.fog = new THREE.Fog('#a9e3f0', 46, 105); }}>
      <PerformanceMonitor onDecline={() => { if (S.set.quality === 'auto') setQuality('low'); }} flipflops={3} />
      <World />
    </Canvas>
  );
}
