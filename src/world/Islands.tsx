import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS } from '../data/content.ts';
import { useGame } from '../engine/useGame.ts';
import { regionOpen } from '../engine/engine.ts';
import { HouseModel, Instances, Tag } from './Props.tsx';
import { ISLANDS, BRIDGES, BRIDGE_HALF, PIER, ISLAND_HOUSES, SCHOOL_FIELD, CLOCK_TOWER, STONES, CAMPFIRE, BIG_TREE, LIGHTHOUSE, CRATES, BOATS, CASTLE, KFOUNTAIN, type Island } from './layout.ts';

type V3 = [number, number, number];
const Bx = ({ p, s, c, rot, cast = true, e, ei = 0.4, rough = 0.85 }: { p: V3; s: V3; c: string; rot?: V3; cast?: boolean; e?: string; ei?: number; rough?: number }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} emissive={e} emissiveIntensity={e ? ei : 0} roughness={rough} /></mesh>
);
const Cyl = ({ p, r1, r2, h, c, seg = 14, e, ei = 0.4, cast = true }: { p: V3; r1: number; r2?: number; h: number; c: string; seg?: number; e?: string; ei?: number; cast?: boolean }) => (
  <mesh position={p} castShadow={cast} receiveShadow><cylinderGeometry args={[r2 ?? r1, r1, h, seg]} /><meshStandardMaterial color={c} emissive={e} emissiveIntensity={e ? ei : 0} roughness={0.8} /></mesh>
);
const Cone = ({ p, r, h, c, seg = 8 }: { p: V3; r: number; h: number; c: string; seg?: number }) => <mesh position={p} castShadow><coneGeometry args={[r, h, seg]} /><meshStandardMaterial color={c} flatShading roughness={0.8} /></mesh>;

/* ---------- island ground, roads, bridges ---------- */
const ROAD: Record<number, { c: string; w: number }> = { 3: { c: '#e8d9ae', w: 3.4 }, 4: { c: '#a98055', w: 2.8 }, 5: { c: '#b98850', w: 3.4 }, 6: { c: '#e9dcc0', w: 3.4 } };
function IslandBase({ i }: { i: Island }) {
  const w = i.x2 - i.x1, d = i.z2 - i.z1, rd = ROAD[i.r];
  return (
    <group>
      <RoundedBox args={[w + 4.4, 1.9, d + 4.4]} radius={0.5} smoothness={3} position={[i.cx, -0.95, 0]} receiveShadow><meshStandardMaterial color={i.r === 5 ? '#b99a62' : '#9b7345'} /></RoundedBox>
      <RoundedBox args={[w + 4.8, 0.35, d + 4.8]} radius={0.17} smoothness={3} position={[i.cx, -0.17, 0]} receiveShadow><meshStandardMaterial color={i.edge} /></RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[i.cx, 0.01, 0]} receiveShadow><planeGeometry args={[w + 2, d + 2]} /><meshStandardMaterial color={i.grass} roughness={1} /></mesh>
      <Bx p={[i.cx, 0.03, 0]} s={[w + 2, 0.05, rd.w]} c={rd.c} cast={false} />
      {i.r === 3 && <Bx p={[72, 0.03, -3.5]} s={[3, 0.05, 7]} c={rd.c} cast={false} />}
      {i.r === 6 && <><Bx p={[204, 0.045, 0]} s={[w / 2 + 1, 0.04, 2.6]} c="#b3202e" cast={false} /><Bx p={[204, 0.045, -4.2]} s={[2.6, 0.04, 8.6]} c="#b3202e" cast={false} /></>}
    </group>
  );
}

function Bridge({ b }: { b: { r: number; x1: number; x2: number } }) {
  const len = b.x2 - b.x1, n = Math.round(len / 1.25), cx = (b.x1 + b.x2) / 2;
  return (
    <group>
      <Bx p={[cx, -0.1, 0]} s={[len + 1, 0.3, BRIDGE_HALF * 2 + 0.3]} c="#a9783f" />
      {Array.from({ length: n }).map((_, k) => <Bx key={k} p={[b.x1 - 0.5 + ((k + 0.5) / n) * (len + 1), 0.07, 0]} s={[0.1, 0.04, BRIDGE_HALF * 2 + 0.3]} c="#7a4b26" cast={false} />)}
      {[-1, 1].map((sd) => (
        <group key={sd}>
          <Bx p={[cx, 0.95, sd * (BRIDGE_HALF + 0.1)]} s={[len + 0.6, 0.1, 0.12]} c="#d3a368" />
          <Bx p={[cx, 0.55, sd * (BRIDGE_HALF + 0.1)]} s={[len + 0.6, 0.08, 0.1]} c="#d3a368" />
          {Array.from({ length: n + 1 }).map((_, k) => <Bx key={k} p={[b.x1 - 0.3 + (k / n) * (len + 0.6), 0.5, sd * (BRIDGE_HALF + 0.1)]} s={[0.16, 1.0, 0.16]} c="#b98650" />)}
        </group>
      ))}
    </group>
  );
}

/** Wooden barrier + sign on each bridge; swings open when the region is unlocked. */
function BridgeGate({ b }: { b: { r: number; x1: number } }) {
  const g = useGame(); void g;
  const open = regionOpen(b.r), reg = REGIONS[b.r - 1];
  const l = useRef<THREE.Group>(null!), rr = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { const t = open ? 1.5 : 0, k = Math.min(1, dt * 2.5); l.current.rotation.y += (-t - l.current.rotation.y) * k; rr.current.rotation.y += (t - rr.current.rotation.y) * k; });
  const leaf = <group><Bx p={[0, 0.9, 0.95]} s={[0.12, 1.5, 1.9]} c="#9c6b3a" />{[0.35, 0.95, 1.5].map((y) => <Bx key={y} p={[0.08, y, 0.95]} s={[0.08, 0.14, 1.9]} c="#7a4b26" cast={false} />)}</group>;
  return (
    <group position={[b.x1 + 1, 0, 0]}>
      <Bx p={[0, 1.5, -2]} s={[0.4, 3, 0.4]} c="#6b4423" /><Bx p={[0, 1.5, 2]} s={[0.4, 3, 0.4]} c="#6b4423" />
      <Bx p={[0, 3.05, 0]} s={[0.35, 0.3, 4.7]} c="#7a4b26" />
      <group ref={l} position={[0, 0, -2]}>{leaf}</group>
      <group ref={rr} position={[0, 0, 2]} scale={[1, 1, -1]}>{leaf}</group>
      <Tag y={3.7} text={open ? `${reg.emoji} ${reg.he}` : '🔒 השער נעול'} tone="gold" />
    </group>
  );
}

/* ---------- region 3: School Town ---------- */
function SchoolTown() {
  const F = SCHOOL_FIELD, cx = (F.x1 + F.x2) / 2, cz = (F.z1 + F.z2) / 2, w = F.x2 - F.x1, d = F.z2 - F.z1;
  const t = CLOCK_TOWER;
  return (
    <group>
      <Bx p={[cx, 0.04, cz]} s={[w, 0.06, d]} c="#6dc060" cast={false} />
      {[[0, 0, w, 0.12], [0, d / 2, w, 0.12], [0, -d / 2, w, 0.12]].map(([x, z, a, b], i) => <Bx key={i} p={[cx + x, 0.09, cz + z]} s={[a, 0.02, b]} c="#fff" cast={false} />)}
      {[-1, 1].map((s) => <Bx key={s} p={[cx + (s * w) / 2, 0.09, cz]} s={[0.12, 0.02, d]} c="#fff" cast={false} />)}
      <Bx p={[cx, 0.09, cz]} s={[0.12, 0.02, d]} c="#fff" cast={false} />
      {[-1, 1].map((s) => (
        <group key={s} position={[cx + (s * (w / 2 - 0.2)), 0, cz]}>
          <Bx p={[0, 1.1, -1.4]} s={[0.12, 2.2, 0.12]} c="#f5f5f5" /><Bx p={[0, 1.1, 1.4]} s={[0.12, 2.2, 0.12]} c="#f5f5f5" /><Bx p={[0, 2.2, 0]} s={[0.12, 0.12, 2.9]} c="#f5f5f5" />
        </group>
      ))}
      <group position={[cx, 0, cz]}><Tag y={0.6} text="⚽ מגרש הספורט" /></group>
      {/* clock tower */}
      <group position={[t.x, 0, t.z]}>
        <Bx p={[0, 0.3, 0]} s={[2.2, 0.6, 2.2]} c="#a9a49a" /><Bx p={[0, 3, 0]} s={[1.6, 5, 1.6]} c="#e9d9b2" />
        <Bx p={[0, 5.7, 0]} s={[2, 0.5, 2]} c="#7a8896" /><Cone p={[0, 6.9, 0]} r={1.5} h={1.9} c="#3f7fc2" seg={4} />
        {[[0, 0.82, 0], [0.82, 0, Math.PI / 2]].map(([x, z, ry], i) => (
          <group key={i} position={[x, 4.4, z]} rotation={[0, ry, 0]}>
            <mesh><circleGeometry args={[0.6, 20]} /><meshStandardMaterial color="#fffdf3" /></mesh>
            <Bx p={[0, 0.2, 0.02]} s={[0.07, 0.4, 0.02]} c="#222" cast={false} /><Bx p={[0.14, 0, 0.02]} s={[0.28, 0.07, 0.02]} c="#222" cast={false} />
          </group>
        ))}
      </group>
      {/* flag pole + benches */}
      <Cyl p={[78, 3, 4]} r1={0.08} h={6} c="#ddd" seg={6} /><Bx p={[78.7, 5.4, 4]} s={[1.3, 0.8, 0.04]} c="#2f7fd1" />
      {[[70, 6.4], [76, -4.2]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Bx p={[0, 0.45, 0]} s={[1.8, 0.12, 0.5]} c="#b98650" /><Bx p={[-0.7, 0.22, 0]} s={[0.12, 0.44, 0.4]} c="#7a4b26" /><Bx p={[0.7, 0.22, 0]} s={[0.12, 0.44, 0.4]} c="#7a4b26" /></group>)}
    </group>
  );
}

/* ---------- region 4: Mystery Forest ---------- */
function Flicker({ p }: { p: V3 }) {
  const a = useRef<THREE.Mesh>(null!), b = useRef<THREE.Mesh>(null!), l = useRef<THREE.PointLight>(null!);
  useFrame((s) => { const t = s.clock.elapsedTime; a.current.scale.set(1, 1 + Math.sin(t * 11) * 0.18, 1); b.current.scale.set(0.8, 1 + Math.sin(t * 15 + 1) * 0.25, 0.8); l.current.intensity = 6 + Math.sin(t * 13) * 1.6; });
  return (
    <group position={p}>
      <mesh ref={a} position={[0, 0.5, 0]}><coneGeometry args={[0.36, 0.95, 8]} /><meshBasicMaterial color="#ff9a2e" /></mesh>
      <mesh ref={b} position={[0, 0.42, 0]}><coneGeometry args={[0.2, 0.62, 8]} /><meshBasicMaterial color="#ffe27a" /></mesh>
      <pointLight ref={l} position={[0, 1.1, 0]} color="#ffb04a" intensity={6} distance={12} decay={2} />
    </group>
  );
}
function Fireflies() {
  const ref = useRef<THREE.Group>(null!);
  const pts = useMemo(() => Array.from({ length: 34 }, (_, i) => ({ x: 100.5 + ((i * 37) % 32), z: -14 + ((i * 53) % 28), y: 0.8 + (i % 5) * 0.5, ph: i * 1.3 })), []);
  useFrame((s) => { const t = s.clock.elapsedTime; ref.current.children.forEach((m, i) => { const q = pts[i]; m.position.set(q.x + Math.sin(t * 0.6 + q.ph) * 0.8, q.y + Math.sin(t * 1.3 + q.ph) * 0.3, q.z + Math.cos(t * 0.5 + q.ph) * 0.8); (m as THREE.Mesh).scale.setScalar(0.6 + 0.4 * Math.sin(t * 3 + q.ph)); }); });
  return <group ref={ref}>{pts.map((_, i) => <mesh key={i}><sphereGeometry args={[0.07, 6, 5]} /><meshBasicMaterial color="#d8ff7a" /></mesh>)}</group>;
}
function MysteryForest() {
  const sg = useRef<THREE.Mesh>(null!);
  useFrame((s) => { if (sg.current) (sg.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(s.clock.elapsedTime * 2) * 0.15; });
  const mush = useMemo(() => {
    const out: { p: V3; s: number; c: string }[] = []; const C = ['#ff6fb5', '#6fd3ff', '#b58cff', '#7dff9a'];
    for (let i = 0; i < 46; i++) { const x = 100.5 + ((i * 29 + 7) % 31), z = -14.5 + ((i * 47 + 3) % 29); if (Math.abs(z) < 3 || Math.hypot(x - STONES.x, z - STONES.z) < 5 || Math.hypot(x - CAMPFIRE.x, z - CAMPFIRE.z) < 3) continue; out.push({ p: [x, 0.16, z], s: 0.7 + (i % 4) * 0.25, c: C[i % 4] }); }
    return out;
  }, []);
  const stones = Array.from({ length: STONES.n }, (_, k) => { const a = (k / STONES.n) * Math.PI * 2; return { x: STONES.x + Math.cos(a) * STONES.r, z: STONES.z + Math.sin(a) * STONES.r, a }; });
  return (
    <group>
      <Instances items={mush.map((m) => ({ p: [m.p[0], 0.18 * m.s, m.p[2]] as V3, s: m.s, c: '#f4efe0' }))}><cylinderGeometry args={[0.07, 0.09, 0.36, 6]} /><meshStandardMaterial /></Instances>
      <Instances items={mush.map((m) => ({ p: [m.p[0], 0.42 * m.s, m.p[2]] as V3, s: [m.s, m.s * 0.7, m.s] as V3, c: m.c }))} cast={false}><sphereGeometry args={[0.28, 8, 6, 0, 6.283, 0, 1.6]} /><meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.55} roughness={0.5} /></Instances>
      {/* stone circle */}
      {stones.map((s, i) => <group key={i} position={[s.x, 0, s.z]} rotation={[0, -s.a, 0]}><Bx p={[0, 1.0, 0]} s={[0.7, 2, 0.45]} c="#8e969e" /><Bx p={[0, 2.05, 0]} s={[0.78, 0.18, 0.52]} c="#5f9a58" cast={false} /><Bx p={[0.2, 1.2, 0.24]} s={[0.12, 0.7, 0.04]} c="#7ee0ff" e="#7ee0ff" ei={0.8} cast={false} /></group>)}
      <mesh ref={sg} rotation={[-Math.PI / 2, 0, 0]} position={[STONES.x, 0.06, STONES.z]}><ringGeometry args={[0.6, 2.3, 36]} /><meshBasicMaterial color="#8fe9ff" transparent opacity={0.4} depthWrite={false} /></mesh>
      {/* campfire */}
      <group position={[CAMPFIRE.x, 0, CAMPFIRE.z]}>
        {[0, 1, 2, 3].map((i) => <Bx key={i} p={[0, 0.16, 0]} s={[1.3, 0.2, 0.2]} c="#6b4423" rot={[0, (i * Math.PI) / 4, 0]} />)}
        {Array.from({ length: 8 }).map((_, i) => <Bx key={i} p={[Math.cos(i * 0.785) * 0.85, 0.12, Math.sin(i * 0.785) * 0.85]} s={[0.3, 0.22, 0.3]} c="#8e969e" />)}
        <Flicker p={[0, 0, 0]} />
      </group>
      {[[110, 4.5], [114.5, 8.5], [111.5, 9.3]].map(([x, z], i) => <Bx key={i} p={[x, 0.3, z]} s={[1.4, 0.5, 0.5]} c="#8a6a3a" rot={[0, i, 0]} />)}
      {/* the great old tree (home of the Wise Owl) */}
      <group position={[BIG_TREE.x, 0, BIG_TREE.z]}>
        <Cyl p={[0, 2.2, 0]} r1={1.5} r2={1.0} h={4.4} c="#6b4a2b" seg={10} />
        <mesh position={[0, 5.6, 0]} castShadow><icosahedronGeometry args={[3.2, 1]} /><meshStandardMaterial color="#2f7a46" flatShading roughness={0.9} /></mesh>
        <mesh position={[1.9, 4.6, 0.6]} castShadow><icosahedronGeometry args={[2, 1]} /><meshStandardMaterial color="#38894e" flatShading roughness={0.9} /></mesh>
        <mesh position={[-1.8, 4.9, -0.8]} castShadow><icosahedronGeometry args={[2.1, 1]} /><meshStandardMaterial color="#2b6f40" flatShading roughness={0.9} /></mesh>
        <Bx p={[0, 0.9, 1.1]} s={[0.9, 1.7, 0.2]} c="#2a1c10" />
      </group>
      <Fireflies />
    </group>
  );
}

/* ---------- region 5: Adventure Harbor ---------- */
function Boat({ b, i }: { b: { x: number; z: number; rot: number; c: string }; i: number }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((s) => { const t = s.clock.elapsedTime + i; g.current.position.y = -0.35 + Math.sin(t * 1.4) * 0.07; g.current.rotation.z = Math.sin(t * 1.1) * 0.04; });
  const sail = useMemo(() => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(1.9, 0); sh.lineTo(0, 3.1); sh.closePath(); return new THREE.ShapeGeometry(sh); }, []);
  return (
    <group position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
      <group ref={g}>
        <RoundedBox args={[3.8, 0.8, 1.6]} radius={0.3} smoothness={3} position={[0, 0.2, 0]} castShadow><meshStandardMaterial color={b.c} roughness={0.7} /></RoundedBox>
        <Bx p={[0, 0.62, 0]} s={[3.2, 0.1, 1.2]} c="#d9b982" cast={false} />
        <Cyl p={[0, 2.0, 0]} r1={0.07} h={3.2} c="#7a4b26" seg={6} />
        <mesh geometry={sail} position={[0.08, 1.3, 0]} castShadow><meshStandardMaterial color="#fffaf0" side={THREE.DoubleSide} roughness={0.9} /></mesh>
        <Bx p={[0.9, 3.4, 0]} s={[0.7, 0.4, 0.03]} c="#e5604a" cast={false} />
      </group>
    </group>
  );
}
function Lighthouse() {
  const beam = useRef<THREE.Group>(null!);
  useFrame((s) => { beam.current.rotation.y = s.clock.elapsedTime * 1.2; });
  const L = LIGHTHOUSE;
  return (
    <group position={[L.x, 0, L.z]}>
      {[0, 1, 2, 3].map((i) => <Cyl key={i} p={[0, 1.3 + i * 2.4, 0]} r1={1.9 - i * 0.2} r2={1.7 - i * 0.2} h={2.4} c={i % 2 ? '#fafafa' : '#d93a3a'} seg={16} />)}
      <Cyl p={[0, 10.2, 0]} r1={1.35} h={0.8} c="#5a5f66" seg={16} />
      <Cyl p={[0, 11.3, 0]} r1={0.85} h={1.5} c="#fff3b0" e="#ffe27a" ei={1.1} seg={12} cast={false} />
      <Cone p={[0, 12.7, 0]} r={1.3} h={1.3} c="#d93a3a" seg={12} />
      <group ref={beam} position={[0, 11.3, 0]}><mesh position={[4.5, 0, 0]}><boxGeometry args={[9, 0.5, 0.9]} /><meshBasicMaterial color="#fff6c2" transparent opacity={0.22} depthWrite={false} /></mesh></group>
      <Tag y={14} text="🗼 המגדלור" />
    </group>
  );
}
function Harbor() {
  const P = PIER, len = P.z2 - P.z1, cz = (P.z1 + P.z2) / 2, cx = (P.x1 + P.x2) / 2;
  return (
    <group>
      <Bx p={[cx, -0.05, cz]} s={[P.x2 - P.x1, 0.3, len]} c="#a9783f" />
      {Array.from({ length: Math.round(len / 1.1) }).map((_, k) => <Bx key={k} p={[cx, 0.12, P.z1 + 0.5 + k * 1.1]} s={[P.x2 - P.x1, 0.04, 0.08]} c="#6b4423" cast={false} />)}
      {[0, 1, 2, 3, 4, 5].flatMap((k) => [P.x1 + 0.2, P.x2 - 0.2].map((x) => <Cyl key={k + '-' + x} p={[x, -0.5, P.z1 + 0.8 + k * 2.2]} r1={0.22} h={1.8} c="#5a3b22" seg={6} />))}
      {[0, 1, 2].flatMap((k) => [P.x1, P.x2].map((x) => <Cyl key={'r' + k + x} p={[x, 0.6, P.z1 + 1.4 + k * 4.5]} r1={0.1} h={1.2} c="#d3a368" seg={6} />))}
      {BOATS.map((b, i) => <Boat key={i} b={b} i={i} />)}
      <Lighthouse />
      {CRATES.map(([x, z], i) => i % 2 ? <Cyl key={i} p={[x, 0.65, z]} r1={0.55} h={1.3} c="#8a5a2e" seg={10} /> : <Bx key={i} p={[x, 0.55, z]} s={[1.1, 1.1, 1.1]} c="#c8964f" rot={[0, i, 0]} />)}
      {/* fish stall */}
      <group position={[168.5, 0, 7]}>
        <Bx p={[0, 0.55, 0]} s={[3.6, 1.1, 1.2]} c="#a9783f" />
        {Array.from({ length: 6 }).map((_, i) => <Bx key={i} p={[-1.5 + i * 0.6, 2.35, 0.15]} s={[0.6, 0.08, 1.7]} c={i % 2 ? '#ffffff' : '#2f7fd1'} rot={[0.3, 0, 0]} />)}
        <Bx p={[-1.7, 1.2, -0.5]} s={[0.1, 2.4, 0.1]} c="#7a4b26" /><Bx p={[1.7, 1.2, -0.5]} s={[0.1, 2.4, 0.1]} c="#7a4b26" />
        {[-1.1, -0.4, 0.3, 1.0].map((x, i) => <mesh key={i} position={[x, 1.2, 0]} scale={[1, 0.45, 0.4]}><sphereGeometry args={[0.32, 8, 6]} /><meshStandardMaterial color={['#7fb6d8', '#e58a6a', '#9ecbe0', '#f2b13a'][i]} /></mesh>)}
      </group>
      {/* net rack by the lighthouse path */}
      <group position={[160, 0, -12.5]}><Bx p={[-1, 1, 0]} s={[0.12, 2, 0.12]} c="#6b4423" /><Bx p={[1, 1, 0]} s={[0.12, 2, 0.12]} c="#6b4423" /><Bx p={[0, 1.9, 0]} s={[2.2, 0.1, 0.1]} c="#6b4423" /><Bx p={[0, 1.2, 0]} s={[1.9, 1.3, 0.03]} c="#cdbb8a" /></group>
    </group>
  );
}

/* ---------- region 6: English Kingdom ---------- */
function Torch({ x, z }: { x: number; z: number }) {
  const f = useRef<THREE.Mesh>(null!);
  useFrame((s) => { f.current.scale.set(1, 1 + Math.sin(s.clock.elapsedTime * 12 + x) * 0.2, 1); });
  return <group position={[x, 0, z]}><Cyl p={[0, 0.8, 0]} r1={0.08} h={1.6} c="#5a3b22" seg={6} /><mesh ref={f} position={[0, 1.75, 0]}><coneGeometry args={[0.2, 0.5, 7]} /><meshBasicMaterial color="#ffb23a" /></mesh></group>;
}
function Castle() {
  const C = CASTLE, merl = useMemo(() => Array.from({ length: 19 }, (_, i) => C.x - C.w / 2 + 0.5 + i * ((C.w - 1) / 18)), [C.x, C.w]);
  const tw: [number, number][] = [[C.x - C.w / 2, C.z - C.d / 2], [C.x + C.w / 2, C.z - C.d / 2], [C.x - C.w / 2, C.z + C.d / 2], [C.x + C.w / 2, C.z + C.d / 2]];
  return (
    <group>
      <Bx p={[C.x, C.h / 2, C.z]} s={[C.w, C.h, C.d]} c="#d8d0c2" />
      <Bx p={[C.x, C.h + 0.15, C.z]} s={[C.w + 0.3, 0.3, C.d + 0.3]} c="#b8b0a2" />
      {merl.map((x, i) => i % 2 === 0 ? <Bx key={i} p={[x, C.h + 0.7, C.z + C.d / 2]} s={[0.6, 0.8, 0.5]} c="#d8d0c2" /> : null)}
      {tw.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Cyl p={[0, 5.2, 0]} r1={2.1} r2={1.95} h={10.4} c="#cfc6b6" seg={16} />
          <Cyl p={[0, 10.6, 0]} r1={2.4} h={0.5} c="#a9a091" seg={16} />
          <Cone p={[0, 12.1, 0]} r={2.6} h={3.0} c="#c0392b" seg={16} />
          <Cyl p={[0, 14.3, 0]} r1={0.05} h={1.6} c="#ddd" seg={5} cast={false} />
          <Bx p={[0.5, 14.7, 0]} s={[0.9, 0.5, 0.03]} c="#2f7fd1" cast={false} />
          <Bx p={[0, 6.5, 2.0]} s={[0.5, 1.1, 0.2]} c="#2a2a3a" />
        </group>
      ))}
      {/* gate */}
      <Bx p={[C.x, 2.0, C.z + C.d / 2 + 0.05]} s={[3.2, 4, 0.3]} c="#3b2a1c" />
      <mesh position={[C.x, 4.0, C.z + C.d / 2 + 0.05]} rotation={[0, 0, 0]}><cylinderGeometry args={[1.6, 1.6, 0.3, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#3b2a1c" /></mesh>
      {[-1, 1].map((s) => <group key={s} position={[C.x + s * 3.8, 0, C.z + C.d / 2 + 0.1]}><Bx p={[0, 4.2, 0]} s={[1.3, 3.2, 0.06]} c="#2f5fc2" cast={false} /><Bx p={[0, 4.4, 0.04]} s={[0.5, 0.5, 0.02]} c="#f2c230" cast={false} /></group>)}
      {[-6.5, -3.5, 3.5, 6.5].map((dx, i) => <Bx key={i} p={[C.x + dx, 3.6, C.z + C.d / 2 + 0.03]} s={[0.7, 1.1, 0.1]} c="#2a2a3a" cast={false} />)}
      <group position={[C.x, 0, C.z]}><Tag y={C.h + 7} text="🏰 ממלכת האנגלית" tone="gold" /></group>
    </group>
  );
}
function Kingdom() {
  const K = KFOUNTAIN, flowers = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ x: 190 + ((i * 7) % 12), z: 8 + ((i * 5) % 6), c: ['#ff6b8b', '#ffd54a', '#c77dff', '#ffffff'][i % 4] })), []);
  return (
    <group>
      <Castle />
      <group position={[K.x, 0, K.z]}>
        <Cyl p={[0, 0.3, 0]} r1={K.r} h={0.6} c="#cfc8bb" seg={20} /><mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[K.r - 0.2, 20]} /><meshStandardMaterial color="#5fc7e8" roughness={0.2} /></mesh>
        <Cyl p={[0, 1.2, 0]} r1={0.3} h={1.2} c="#b8b0a2" seg={10} /><Cyl p={[0, 1.9, 0]} r1={0.8} r2={0.3} h={0.3} c="#cfc8bb" seg={14} /><mesh position={[0, 2.2, 0]}><sphereGeometry args={[0.2, 10, 8]} /><meshStandardMaterial color="#9bdcf0" emissive="#6fd3ff" emissiveIntensity={0.4} /></mesh>
      </group>
      {[[190, -1.8], [190, 1.8], [198, -1.8], [198, 1.8], [199.2, -4], [208.8, -4], [199.2, -8], [208.8, -8]].map(([x, z], i) => <Torch key={i} x={x} z={z} />)}
      {/* hedges + flower beds */}
      {[[196, 12.5, 8, 1], [212, 12.5, 8, 1], [189.5, 11, 1, 6], [218.5, 11, 1, 6]].map(([x, z, w, d], i) => <Bx key={i} p={[x, 0.55, z]} s={[w, 1.1, d]} c="#3f8f4f" />)}
      <Instances items={flowers.map((f) => ({ p: [f.x, 0.4, f.z] as V3, s: 1, c: f.c }))} cast={false}><sphereGeometry args={[0.2, 6, 5]} /><meshStandardMaterial roughness={0.7} /></Instances>
      {/* small dragon perch near the dragon NPC */}
      <group position={[216.5, 0, 9.5]}>{[0, 1, 2].map((i) => <mesh key={i} position={[i * 0.9 - 0.9, 0.35, 0]} castShadow><sphereGeometry args={[0.5, 8, 6]} /><meshStandardMaterial color="#ffcf3d" metalness={0.7} roughness={0.3} emissive="#ffb300" emissiveIntensity={0.3} /></mesh>)}</group>
    </group>
  );
}

const LABELS: Record<string, string> = { 'i-lib': '📚 ספרייה', 'i-caf': '🥪 קפיטריה', 'i-art': '🎨 כיתת אמנות', 'i-cabin': '🛖 בקתת היער', 'i-ware': '⚓ מחסן הנמל', 'i-hut': '🐟 צריף הדייגים' };
export const Islands = memo(function Islands() {
  return (
    <group>
      {ISLANDS.map((i) => <IslandBase key={i.r} i={i} />)}
      {BRIDGES.map((b) => <Bridge key={b.r} b={b} />)}
      {ISLAND_HOUSES.map((h, i) => (
        <group key={h.id}><HouseModel h={h} idx={i} />{LABELS[h.id] && <group position={[h.x, h.h + 3.4, h.z]}><Tag y={0} text={LABELS[h.id]} /></group>}</group>
      ))}
      <SchoolTown /><MysteryForest /><Harbor /><Kingdom />
    </group>
  );
});

export function BridgeGates() {
  return <>{BRIDGES.map((b) => <BridgeGate key={b.r} b={b} />)}</>;
}
