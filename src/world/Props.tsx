import { useRef, useMemo, useLayoutEffect, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { HOUSES, FENCES, WORLD, POND, FOUNTAIN, WELL, WINDMILL, STALLS, HAY, FIELD, GARDEN, GATE, type House } from './layout.ts';

/* ---------- helpers ---------- */
type V3 = [number, number, number];
type Item = { p: V3; s?: number | V3; r?: number; c?: string };

export function Instances({ items, children, cast = true, receive = false }: { items: Item[]; children: ReactNode; cast?: boolean; receive?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  useLayoutEffect(() => {
    const m = ref.current; if (!m) return;
    const o = new THREE.Object3D(), col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      const s = it.s ?? 1; if (Array.isArray(s)) o.scale.set(...s); else o.scale.setScalar(s);
      o.rotation.set(0, it.r ?? 0, 0); o.updateMatrix(); m.setMatrixAt(i, o.matrix);
      if (it.c) m.setColorAt(i, col.set(it.c));
    });
    m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [items]);
  if (!items.length) return null;
  return <instancedMesh ref={ref} args={[undefined as any, undefined as any, items.length]} castShadow={cast} receiveShadow={receive} frustumCulled={false}>{children}</instancedMesh>;
}

const Bx = ({ p, s, c, rot, cast = true, e, ei = 0.3, rough }: { p: V3; s: V3; c: string; rot?: V3; cast?: boolean; e?: string; ei?: number; rough?: number }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow><boxGeometry args={s} /><meshStandardMaterial color={c} emissive={e} emissiveIntensity={e ? ei : 0} roughness={rough ?? 0.85} /></mesh>
);

function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, n: number) => void, repeat: [number, number]) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d')!, size);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------- ground, sea, paths ---------- */
export function Ground() {
  const grass = useMemo(() => canvasTex(256, (g, n) => {
    g.fillStyle = '#e6e6e6'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '150,170,120'},${rand(0.05, 0.16)})`; g.beginPath(); g.ellipse(rand(0, n), rand(0, n), rand(2, 9), rand(1, 5), rand(0, 3), 0, 6.3); g.fill(); }
    for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(90,140,70,${rand(0.12, 0.3)})`; g.lineWidth = 1.2; const x = rand(0, n), y = rand(0, n); g.beginPath(); g.moveTo(x, y); g.lineTo(x + rand(-2, 2), y - rand(3, 7)); g.stroke(); }
  }, [34, 20]), []);
  const cobble = useMemo(() => canvasTex(256, (g, n) => {
    g.fillStyle = '#b79c6c'; g.fillRect(0, 0, n, n);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const ox = (y % 2) * 16, l = 58 + Math.random() * 14;
      g.fillStyle = `rgb(${226 + rand(-14, 10)},${203 + rand(-14, 10)},${150 + rand(-14, 10)})`;
      g.beginPath(); if ((g as any).roundRect) (g as any).roundRect(x * 32 + ox + 2, y * 32 + 2, 28, 28, 8); else g.rect(x * 32 + ox + 2, y * 32 + 2, 28, 28); g.fill();
      void l;
    }
  }, [1, 1]), []);
  const sea = useMemo(() => canvasTex(256, (g, n) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(120,200,230,${rand(0.15, 0.4)})`; g.lineWidth = rand(1, 3); const x = rand(0, n), y = rand(0, n), w = rand(10, 40); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y - 5, x + w, y); g.stroke(); }
  }, [26, 26]), []);
  const seaMat = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime; sea.offset.set(t * 0.02, t * 0.012);
  });
  const path = (x: number, z: number, w: number, d: number, k: string) => (
    <group key={k}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, z]} receiveShadow><planeGeometry args={[w + 0.5, d + 0.5]} /><meshStandardMaterial color="#a7885a" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.035, z]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={cobbleFor(cobble, w, d)} color="#f6e7bd" /></mesh>
    </group>
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -1.4, 0]}><planeGeometry args={[400, 400]} /><meshStandardMaterial color="#2f9cc4" roughness={0.35} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -1.32, 0]}><planeGeometry args={[400, 400]} /><meshStandardMaterial ref={seaMat} map={sea} color="#6fd3e8" transparent opacity={0.55} depthWrite={false} /></mesh>
      <RoundedBox args={[92, 0.9, 58]} radius={0.45} smoothness={3} position={[5, -1.0, 0]} receiveShadow><meshStandardMaterial color="#f2dfa6" /></RoundedBox>
      <RoundedBox args={[84, 1.9, 50]} radius={0.5} smoothness={3} position={[5, -0.95, 0]} receiveShadow><meshStandardMaterial color="#9b7345" /></RoundedBox>
      <RoundedBox args={[84.4, 0.35, 50.4]} radius={0.17} smoothness={3} position={[5, -0.17, 0]} receiveShadow><meshStandardMaterial color="#6fbd5a" /></RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16.5, 0.01, 0]} receiveShadow><planeGeometry args={[37, 48]} /><meshStandardMaterial map={grass} color="#8ed66e" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[23.5, 0.01, 0]} receiveShadow><planeGeometry args={[43, 48]} /><meshStandardMaterial map={grass} color="#b3d96b" /></mesh>
      {path(5, 0, 80, 3, 'main')}
      {path(-16, 0, 3, 26, 'vil')}
      {path(24, 0, 3, 20, 'farm')}
      {path(12, -3, 2.4, 12, 'br')}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[FOUNTAIN.x, 0.05, FOUNTAIN.z]} receiveShadow><circleGeometry args={[4.6, 32]} /><meshStandardMaterial color="#e8d3a0" map={cobble} /></mesh>
    </group>
  );
}
const _ct = new WeakMap<THREE.Texture, Map<string, THREE.Texture>>();
function cobbleFor(base: THREE.Texture, w: number, d: number) {
  let m = _ct.get(base); if (!m) { m = new Map(); _ct.set(base, m); }
  const k = w + 'x' + d; let t = m.get(k);
  if (!t) { t = base.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(d / 2))); t.colorSpace = THREE.SRGBColorSpace; m.set(k, t); }
  return t;
}

/* ---------- trees, grass, flowers, rocks ---------- */
const PINE = ['#2f8f55', '#3aa061', '#277a49', '#43a869'], ROUND = ['#63c05f', '#74cc6c', '#53ab52', '#86d26f'], ORANGE = ['#58a850', '#68b95c'];
export function Forest() {
  const d = useMemo(() => {
    const trunks: Item[] = [], c1: Item[] = [], c2: Item[] = [], c3: Item[] = [], r1: Item[] = [], r2: Item[] = [], r3: Item[] = [], fruit: Item[] = [], blossom: Item[] = [];
    WORLD.trees.forEach((t, i) => {
      const s = t.s, ry = i * 1.7;
      if (t.kind === 'pine') {
        const col = PINE[i % PINE.length];
        trunks.push({ p: [t.x, 0.6 * s, t.z], s: [s, s, s], c: '#7a5233' });
        c1.push({ p: [t.x, 1.5 * s, t.z], s, c: col }); c2.push({ p: [t.x, 2.3 * s, t.z], s, c: col }); c3.push({ p: [t.x, 3.0 * s, t.z], s, c: col });
      } else {
        const col = (t.kind === 'orange' ? ORANGE : ROUND)[i % (t.kind === 'orange' ? 2 : 4)];
        trunks.push({ p: [t.x, 0.7 * s, t.z], s: [s, s * 1.15, s], c: '#8a5c36' });
        r1.push({ p: [t.x, 2.2 * s, t.z], s: s * 1.05, r: ry, c: col });
        r2.push({ p: [t.x + 0.65 * s, 1.85 * s, t.z + 0.2 * s], s: s * 0.7, r: ry, c: col });
        r3.push({ p: [t.x - 0.55 * s, 1.95 * s, t.z - 0.3 * s], s: s * 0.75, r: ry, c: col });
        if (t.kind === 'orange') for (let k = 0; k < 5; k++) { const a = k * 1.3 + i; fruit.push({ p: [t.x + Math.cos(a) * 0.95 * s, (1.8 + (k % 3) * 0.3) * s, t.z + Math.sin(a) * 0.95 * s], s: 1, c: '#ff9a1f' }); }
        else if (i % 4 === 0) for (let k = 0; k < 4; k++) { const a = k * 1.7 + i; blossom.push({ p: [t.x + Math.cos(a) * 0.9 * s, (2.0 + (k % 2) * 0.4) * s, t.z + Math.sin(a) * 0.9 * s], s: 1, c: '#ffd0e0' }); }
      }
    });
    return { trunks, c1, c2, c3, r1, r2, r3, fruit, blossom };
  }, []);
  return (
    <group>
      <Instances items={d.trunks}><cylinderGeometry args={[0.16, 0.26, 1.3, 7]} /><meshStandardMaterial roughness={1} /></Instances>
      <Instances items={d.c1}><coneGeometry args={[1.25, 1.5, 8]} /><meshStandardMaterial flatShading roughness={0.9} /></Instances>
      <Instances items={d.c2}><coneGeometry args={[1.0, 1.4, 8]} /><meshStandardMaterial flatShading roughness={0.9} /></Instances>
      <Instances items={d.c3}><coneGeometry args={[0.7, 1.2, 8]} /><meshStandardMaterial flatShading roughness={0.9} /></Instances>
      <Instances items={d.r1}><icosahedronGeometry args={[1.05, 1]} /><meshStandardMaterial flatShading roughness={0.9} /></Instances>
      <Instances items={d.r2}><icosahedronGeometry args={[0.9, 1]} /><meshStandardMaterial flatShading roughness={0.9} /></Instances>
      <Instances items={d.r3}><icosahedronGeometry args={[0.9, 1]} /><meshStandardMaterial flatShading roughness={0.9} /></Instances>
      <Instances items={d.fruit} cast={false}><sphereGeometry args={[0.15, 8, 6]} /><meshStandardMaterial roughness={0.5} /></Instances>
      <Instances items={d.blossom} cast={false}><sphereGeometry args={[0.13, 6, 5]} /><meshStandardMaterial roughness={0.7} /></Instances>
    </group>
  );
}

export function Meadow() {
  const d = useMemo(() => {
    const G = ['#5faa4a', '#6dbb55', '#83cb62'], F = ['#ff7aa8', '#ffd54a', '#ffffff', '#b794f4', '#ff9a56'];
    return {
      tuftA: WORLD.tufts.map((t) => ({ p: [t.x, 0.2 * t.s, t.z] as V3, s: [t.s, t.s, t.s] as V3, r: t.x, c: G[t.c] })),
      tuftB: WORLD.tufts.filter((_, i) => i % 2 === 0).map((t) => ({ p: [t.x + 0.12, 0.17 * t.s, t.z + 0.1] as V3, s: [t.s * 0.8, t.s * 1.1, t.s * 0.8] as V3, r: t.z, c: G[(t.c + 1) % 3] })),
      stem: WORLD.flowers.map((f) => ({ p: [f.x, 0.18, f.z] as V3, s: f.s, c: '#4f9a44' })),
      head: WORLD.flowers.map((f) => ({ p: [f.x, 0.4 * f.s, f.z] as V3, s: f.s, c: F[f.c] })),
      rocks: WORLD.rocks.map((r) => ({ p: [r.x, 0.2 * r.s, r.z] as V3, s: [r.s, r.s * 0.7, r.s] as V3, r: r.x, c: '#a6a9ad' })),
      b1: WORLD.bushes.map((b) => ({ p: [b.x, 0.45 * b.s, b.z] as V3, s: b.s, c: b.c ? '#4aa35a' : '#5fb554' })),
      b2: WORLD.bushes.map((b) => ({ p: [b.x + 0.4 * b.s, 0.35 * b.s, b.z + 0.1] as V3, s: b.s * 0.7, c: b.c ? '#58b161' : '#6cc15e' })),
      berries: WORLD.bushes.filter((b) => b.c).map((b) => ({ p: [b.x + 0.2, 0.6 * b.s, b.z + 0.42 * b.s] as V3, s: 1, c: '#e63946' })),
    };
  }, []);
  return (
    <group>
      <Instances items={d.tuftA} cast={false}><coneGeometry args={[0.1, 0.5, 4]} /><meshStandardMaterial flatShading /></Instances>
      <Instances items={d.tuftB} cast={false}><coneGeometry args={[0.08, 0.42, 4]} /><meshStandardMaterial flatShading /></Instances>
      <Instances items={d.stem} cast={false}><cylinderGeometry args={[0.012, 0.012, 0.36, 4]} /><meshStandardMaterial /></Instances>
      <Instances items={d.head} cast={false}><sphereGeometry args={[0.095, 8, 6]} /><meshStandardMaterial roughness={0.6} /></Instances>
      <Instances items={d.rocks}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial flatShading roughness={1} /></Instances>
      <Instances items={d.b1}><icosahedronGeometry args={[0.65, 1]} /><meshStandardMaterial flatShading /></Instances>
      <Instances items={d.b2}><icosahedronGeometry args={[0.55, 1]} /><meshStandardMaterial flatShading /></Instances>
      <Instances items={d.berries} cast={false}><sphereGeometry args={[0.07, 6, 5]} /><meshStandardMaterial /></Instances>
    </group>
  );
}

/* ---------- buildings ---------- */
function Smoke({ p }: { p: V3 }) {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((m, i) => { if (!m) return; const k = ((t * 0.35 + i / 4) % 1); m.position.set(p[0] + k * 0.8, p[1] + k * 2.4, p[2]); m.scale.setScalar(0.2 + k * 0.55); (m.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k); });
  });
  return <>{[0, 1, 2, 3].map((i) => <mesh key={i} ref={(m) => { if (m) refs.current[i] = m; }}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} /></mesh>)}</>;
}

export const Tag = ({ y, text, tone = 'wood' }: { y: number; text: string; tone?: 'wood' | 'gold' }) => (
  <Html position={[0, y, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
    <div className={tone === 'gold' ? 'tag tag-gold' : 'tag'}>{text}</div>
  </Html>
);

function Window({ p, rot = 0, trim = '#fff', shutter }: { p: V3; rot?: number; trim?: string; shutter: string }) {
  return (
    <group position={p} rotation={[0, rot, 0]}>
      <Bx p={[0, 0, 0]} s={[1.0, 1.0, 0.1]} c={trim} />
      <Bx p={[0, 0, 0.03]} s={[0.78, 0.78, 0.1]} c="#a8dcf5" e="#ffd98a" ei={0.35} rough={0.2} />
      <Bx p={[0, 0, 0.1]} s={[0.05, 0.8, 0.04]} c={trim} cast={false} /><Bx p={[0, 0, 0.1]} s={[0.8, 0.05, 0.04]} c={trim} cast={false} />
      <Bx p={[-0.68, 0, 0.02]} s={[0.34, 0.95, 0.07]} c={shutter} /><Bx p={[0.68, 0, 0.02]} s={[0.34, 0.95, 0.07]} c={shutter} />
      <Bx p={[0, -0.62, 0.18]} s={[1.0, 0.2, 0.26]} c="#7a4b26" />
      {[-0.32, -0.1, 0.12, 0.34].map((x, i) => <mesh key={i} position={[x, -0.46, 0.2]}><sphereGeometry args={[0.1, 6, 5]} /><meshStandardMaterial color={['#ff6b8b', '#ffd54a', '#ff8e5a', '#fff'][i]} /></mesh>)}
    </group>
  );
}

export function HouseModel({ h, idx }: { h: House; idx: number }) {
  const gableZ = idx % 2 === 0;
  const baseW = gableZ ? h.w : h.d, len = gableZ ? h.d : h.w, rh = h.kind === 'barn' ? 2.3 : h.kind === 'school' ? 1.9 : 1.8;
  const roofGeo = useMemo(() => {
    const sh = new THREE.Shape(); const hw = baseW / 2 + 0.5;
    sh.moveTo(-hw, 0); sh.lineTo(hw, 0); sh.lineTo(0, rh); sh.closePath();
    const g = new THREE.ExtrudeGeometry(sh, { depth: len + 1, bevelEnabled: false }); g.translate(0, 0, -(len + 1) / 2); return g;
  }, [baseW, len, rh]);
  const trim = h.kind === 'barn' ? '#ffffff' : '#fffaf0';
  const door = h.kind === 'barn' ? '#f4efe6' : '#8b5a2b';
  const front = h.d / 2 + 0.04;
  return (
    <group position={[h.x, 0, h.z]}>
      <Bx p={[0, 0.17, 0]} s={[h.w + 0.3, 0.34, h.d + 0.3]} c="#9aa0a6" />
      <Bx p={[0, h.h / 2 + 0.17, 0]} s={[h.w, h.h, h.d]} c={h.wall} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Bx key={i} p={[(a * h.w) / 2, h.h / 2 + 0.17, (b * h.d) / 2]} s={[0.2, h.h, 0.2]} c={trim} cast={false} />)}
      <group position={[0, h.h + 0.17, 0]} rotation={[0, gableZ ? 0 : Math.PI / 2, 0]}>
        <mesh geometry={roofGeo} castShadow receiveShadow><meshStandardMaterial color={h.roof} flatShading roughness={0.8} /></mesh>
        <mesh position={[0, rh, 0]}><boxGeometry args={[0.18, 0.14, len + 1.05]} /><meshStandardMaterial color="#5a3b22" /></mesh>
      </group>
      {/* door */}
      {h.kind === 'barn' ? (
        <group position={[0, 0, front]}>
          <Bx p={[0, 1.55, 0]} s={[2.9, 2.6, 0.12]} c={door} />
          <Bx p={[0, 1.55, 0.08]} s={[0.1, 2.6, 0.06]} c="#c0392b" cast={false} />
          <Bx p={[-0.7, 1.55, 0.09]} s={[0.1, 3.1, 0.05]} c="#c0392b" rot={[0, 0, 0.75]} cast={false} /><Bx p={[0.7, 1.55, 0.09]} s={[0.1, 3.1, 0.05]} c="#c0392b" rot={[0, 0, -0.75]} cast={false} />
          <Bx p={[0, h.h + 0.9, 0]} s={[1.1, 1.1, 0.1]} c="#5a2a1e" />
        </group>
      ) : (
        <group position={[h.kind === 'shop' ? 0.5 : 0, 0, front]}>
          <Bx p={[0, 1.15, 0]} s={[1.3, 2.05, 0.12]} c={trim} />
          <Bx p={[0, 1.05, 0.05]} s={[1.0, 1.85, 0.1]} c={door} />
          <mesh position={[0.32, 1.05, 0.14]}><sphereGeometry args={[0.07, 8, 6]} /><meshStandardMaterial color="#f4c542" metalness={0.5} roughness={0.3} /></mesh>
          <Bx p={[0, 0.06, 0.45]} s={[1.6, 0.14, 0.9]} c="#b9b2a5" />
        </group>
      )}
      {h.kind !== 'barn' && <Window p={[h.kind === 'shop' ? -h.w * 0.3 : -h.w * 0.3, h.h * 0.62, front]} shutter={h.roof} />}
      {h.kind !== 'barn' && h.w > 4.5 && <Window p={[h.w * 0.32, h.h * 0.62, front]} shutter={h.roof} />}
      {h.kind !== 'barn' && h.w <= 4.5 && <Window p={[h.w / 2 + 0.04, h.h * 0.62, 0]} rot={Math.PI / 2} shutter={h.roof} />}
      {h.kind !== 'barn' && <Window p={[h.w / 2 + 0.04, h.h * 0.62, h.d * 0.2]} rot={Math.PI / 2} shutter={h.roof} />}
      {h.kind === 'house' && <><Bx p={[h.w * 0.22, h.h + rh * 0.7, -h.d * 0.15]} s={[0.6, 1.3, 0.6]} c="#b0583b" /><Smoke p={[h.w * 0.22, h.h + rh * 0.7 + 0.8, -h.d * 0.15]} /></>}
      {h.kind === 'school' && (
        <group position={[0, h.h + 0.9, 0]}>
          <Bx p={[0, 0.9, 0]} s={[1.5, 1.8, 1.5]} c="#f8ecc8" />
          <mesh position={[0, 2.3, 0]} castShadow><coneGeometry args={[1.25, 1.2, 4]} /><meshStandardMaterial color="#3f7fc2" flatShading /></mesh>
          <mesh position={[0, 1.2, 0.78]}><sphereGeometry args={[0.28, 10, 8]} /><meshStandardMaterial color="#f4c542" metalness={0.6} roughness={0.3} /></mesh>
          <Bx p={[0.85, 2.55, 0]} s={[0.06, 1.4, 0.06]} c="#ddd" /><Bx p={[1.2, 3.0, 0]} s={[0.65, 0.38, 0.03]} c="#2f7fd1" />
        </group>
      )}
      {h.kind === 'shop' && (
        <group position={[0, 0, front + 0.5]}>
          {Array.from({ length: 7 }).map((_, i) => <Bx key={i} p={[-h.w / 2 + 0.5 + i * ((h.w - 1) / 6), 2.55, 0.35]} s={[(h.w - 1) / 6 + 0.02, 0.1, 1.5]} c={i % 2 ? '#ffffff' : '#e53950'} rot={[0.38, 0, 0]} />)}
          <Bx p={[-h.w / 2 + 1.2, 0.5, 1.0]} s={[1.3, 0.9, 0.8]} c="#a9783f" /><Bx p={[h.w / 2 - 1.2, 0.5, 1.0]} s={[1.3, 0.9, 0.8]} c="#a9783f" />
          {[-0.4, -0.1, 0.25].map((x, i) => <mesh key={i} position={[-h.w / 2 + 1.2 + x, 1.05, 1.0]}><sphereGeometry args={[0.17, 8, 6]} /><meshStandardMaterial color={['#e63946', '#ff9a1f', '#6dbb55'][i]} /></mesh>)}
          {[-0.4, -0.1, 0.25].map((x, i) => <mesh key={i} position={[h.w / 2 - 1.2 + x, 1.05, 1.0]}><sphereGeometry args={[0.17, 8, 6]} /><meshStandardMaterial color={['#ffd54a', '#e63946', '#ff9a1f'][i]} /></mesh>)}
        </group>
      )}
      {h.kind === 'house' && <><Bx p={[-h.w * 0.1, 0.45, h.d / 2 + 1.2]} s={[1.4, 0.18, 0.5]} c="#9c6b3a" /><Bx p={[-h.w * 0.1 - 0.55, 0.22, h.d / 2 + 1.2]} s={[0.12, 0.44, 0.4]} c="#7a4b26" /><Bx p={[-h.w * 0.1 + 0.55, 0.22, h.d / 2 + 1.2]} s={[0.12, 0.44, 0.4]} c="#7a4b26" /></>}
      {h.kind === 'school' && <Tag y={h.h + rh + 3.4} text="🏫 בית ספר" />}
      {h.kind === 'shop' && <Tag y={h.h + rh + 0.9} text="🛒 החנות" />}
      {h.kind === 'barn' && <Tag y={h.h + rh + 0.9} text="🐄 האסם" />}
    </group>
  );
}

/* ---------- fences, gate, lamps, props ---------- */
export function Fences() {
  return (
    <group>
      {FENCES.map(([x1, z1, x2, z2], i) => {
        const len = Math.hypot(x2 - x1, z2 - z1), n = Math.max(1, Math.round(len / 1.5)), ang = Math.atan2(x2 - x1, z2 - z1);
        return (
          <group key={i} position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, ang - Math.PI / 2, 0]}>
            {Array.from({ length: n + 1 }).map((_, k) => <mesh key={k} position={[-len / 2 + (k / n) * len, 0.55, 0]} castShadow><boxGeometry args={[0.16, 1.1, 0.16]} /><meshStandardMaterial color="#b98650" /></mesh>)}
            <mesh position={[0, 0.82, 0]} castShadow><boxGeometry args={[len, 0.1, 0.09]} /><meshStandardMaterial color="#d3a368" /></mesh>
            <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[len, 0.1, 0.09]} /><meshStandardMaterial color="#d3a368" /></mesh>
          </group>
        );
      })}
    </group>
  );
}

export function Gate({ open }: { open: boolean }) {
  const l = useRef<THREE.Group>(null!), r = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    const t = open ? 1.45 : 0, k = Math.min(1, dt * 2.5);
    l.current.rotation.y += (-t - l.current.rotation.y) * k; r.current.rotation.y += (t - r.current.rotation.y) * k;
  });
  const leaf = (
    <group>
      <Bx p={[0, 0.9, GATE.half / 2]} s={[0.12, 1.5, GATE.half]} c="#9c6b3a" />
      {[0.25, 0.9, 1.5].map((y) => <Bx key={y} p={[0.08, y, GATE.half / 2]} s={[0.08, 0.14, GATE.half]} c="#7a4b26" cast={false} />)}
      {[0.35, 0.9, 1.45, 2.0, 2.4].map((z) => <Bx key={z} p={[0.07, 0.9, z]} s={[0.07, 1.5, 0.1]} c="#caa064" cast={false} />)}
    </group>
  );
  return (
    <group position={[GATE.x, 0, 0]}>
      <Bx p={[0, 1.4, -GATE.half]} s={[0.4, 2.8, 0.4]} c="#6b4423" /><Bx p={[0, 1.4, GATE.half]} s={[0.4, 2.8, 0.4]} c="#6b4423" />
      <Bx p={[0, 2.85, 0]} s={[0.35, 0.3, GATE.half * 2 + 0.7]} c="#7a4b26" />
      <mesh position={[0, 3.15, -GATE.half]}><coneGeometry args={[0.3, 0.4, 4]} /><meshStandardMaterial color="#d3a368" /></mesh>
      <mesh position={[0, 3.15, GATE.half]}><coneGeometry args={[0.3, 0.4, 4]} /><meshStandardMaterial color="#d3a368" /></mesh>
      <group ref={l} position={[0, 0, -GATE.half]}>{leaf}</group>
      <group ref={r} position={[0, 0, GATE.half]} scale={[1, 1, -1]}>{leaf}</group>
      <Html position={[0, 3.5, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}><div className="tag tag-gold">{open ? '🐑 חוות החיות' : '🔒 השער נעול'}</div></Html>
    </group>
  );
}

export function Lamps() {
  const spots: [number, number][] = [[-30, 2.4], [-22, -2.4], [-10, 2.4], [-3, -2.4], [8, 2.4], [18, -2.4], [30, 2.4], [40, -2.4], [-16, 9], [-16, -9]];
  const glow = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => { if (glow.current) glow.current.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 2) * 0.08; });
  return (
    <group>
      {spots.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.07, 0.1, 2.4, 6]} /><meshStandardMaterial color="#3f3a36" /></mesh>
          <mesh position={[0, 2.5, 0]}><boxGeometry args={[0.38, 0.45, 0.38]} /><meshStandardMaterial ref={i === 0 ? glow : undefined} color="#fff0b8" emissive="#ffc857" emissiveIntensity={0.8} /></mesh>
          <mesh position={[0, 2.82, 0]}><coneGeometry args={[0.3, 0.25, 4]} /><meshStandardMaterial color="#3f3a36" /></mesh>
        </group>
      ))}
    </group>
  );
}

export function Fountain() {
  const jets = useRef<THREE.Mesh[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    jets.current.forEach((m, i) => { if (!m) return; const k = (t * 0.9 + i / 9) % 1, a = (i / 9) * Math.PI * 2; const r = Math.sin(k * Math.PI) * 0.9; m.position.set(Math.cos(a) * r, 2.0 + Math.sin(k * Math.PI) * 1.0 - k * 0.2, Math.sin(a) * r); });
  });
  return (
    <group position={[FOUNTAIN.x, 0, FOUNTAIN.z]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow><cylinderGeometry args={[2.0, 2.15, 0.6, 24]} /><meshStandardMaterial color="#c9c4bb" /></mesh>
      <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[1.75, 1.75, 0.15, 24]} /><meshStandardMaterial color="#58c3e0" roughness={0.2} transparent opacity={0.9} /></mesh>
      <mesh position={[0, 1.1, 0]} castShadow><cylinderGeometry args={[0.22, 0.32, 1.2, 10]} /><meshStandardMaterial color="#d6d1c7" /></mesh>
      <mesh position={[0, 1.8, 0]} castShadow><cylinderGeometry args={[0.8, 0.35, 0.3, 16]} /><meshStandardMaterial color="#cfc9bd" /></mesh>
      {Array.from({ length: 9 }).map((_, i) => <mesh key={i} ref={(m) => { if (m) jets.current[i] = m; }}><sphereGeometry args={[0.07, 6, 5]} /><meshStandardMaterial color="#bfeeff" emissive="#7fd7f2" emissiveIntensity={0.5} /></mesh>)}
    </group>
  );
}

export function Well() {
  return (
    <group position={[WELL.x, 0, WELL.z]}>
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.85, 0.95, 1.0, 14]} /><meshStandardMaterial color="#b9b4aa" flatShading /></mesh>
      <mesh position={[0, 1.02, 0]}><cylinderGeometry args={[0.65, 0.65, 0.05, 14]} /><meshStandardMaterial color="#2c6f86" /></mesh>
      <Bx p={[-0.8, 1.6, 0]} s={[0.12, 1.4, 0.12]} c="#7a4b26" /><Bx p={[0.8, 1.6, 0]} s={[0.12, 1.4, 0.12]} c="#7a4b26" />
      <mesh position={[0, 2.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow><coneGeometry args={[1.35, 0.8, 4]} /><meshStandardMaterial color="#c9741f" flatShading /></mesh>
      <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 1.6, 6]} /><meshStandardMaterial color="#5a3b22" /></mesh>
    </group>
  );
}

export function Stalls() {
  return (
    <group>
      {STALLS.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]}>
          <Bx p={[0, 0.5, 0]} s={[s.w, 1, s.d]} c="#a9783f" />
          {[-1, 1].map((k) => <Bx key={k} p={[(k * s.w) / 2, 1.5, -s.d / 2 + 0.1]} s={[0.1, 2, 0.1]} c="#6b4423" />)}
          {Array.from({ length: 6 }).map((_, k) => <Bx key={k} p={[-s.w / 2 + 0.25 + k * ((s.w - 0.5) / 5), 2.4, 0.1]} s={[(s.w - 0.5) / 5 + 0.02, 0.08, s.d + 0.9]} c={k % 2 ? '#fff' : s.color} rot={[0.25, 0, 0]} />)}
          {s.kind === 'bread' ? [-0.9, -0.3, 0.3, 0.9].map((x, k) => <mesh key={k} position={[x, 1.1, 0.1]} scale={[1.5, 0.8, 1]} castShadow><sphereGeometry args={[0.2, 10, 8]} /><meshStandardMaterial color={k % 2 ? '#d99a55' : '#c98544'} /></mesh>)
            : [-0.9, -0.45, 0, 0.45, 0.9].map((x, k) => <mesh key={k} position={[x, 1.12, 0.1]} castShadow><sphereGeometry args={[0.17, 8, 6]} /><meshStandardMaterial color={['#e63946', '#ff9a1f', '#6dbb55', '#ffd54a', '#e63946'][k]} /></mesh>)}
        </group>
      ))}
    </group>
  );
}

export function Hay() {
  return (
    <group>
      {HAY.map(([x, z], i) => (
        <group key={i} position={[x, 0.75, z]} rotation={[0, i * 1.1, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.75, 0.75, 1.4, 14]} /><meshStandardMaterial color="#e6c15a" flatShading /></mesh>
          {[-0.35, 0.35].map((k) => <mesh key={k} position={[k, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.77, 0.77, 0.06, 14]} /><meshStandardMaterial color="#b9852d" /></mesh>)}
        </group>
      ))}
    </group>
  );
}

export function Crops() {
  const d = useMemo(() => {
    const wheat: Item[] = [], soil: Item[] = [], veg: Item[] = [], leaf: Item[] = [];
    for (let z = FIELD.z1 + 0.6; z < FIELD.z2; z += 1.2) {
      soil.push({ p: [(FIELD.x1 + FIELD.x2) / 2, 0.05, z], s: [FIELD.x2 - FIELD.x1, 0.1, 0.7] });
      for (let x = FIELD.x1 + 0.6; x < FIELD.x2; x += 0.8) wheat.push({ p: [x, 0.4, z], s: [1, 1 + ((x * 7 + z * 3) % 1) * 0.3, 1], c: ((x + z) * 3) % 2 > 1 ? '#e8c547' : '#d9b23a' });
    }
    for (let z = GARDEN.z1 + 0.8; z < GARDEN.z2; z += 1.4) {
      soil.push({ p: [(GARDEN.x1 + GARDEN.x2) / 2, 0.05, z], s: [GARDEN.x2 - GARDEN.x1, 0.1, 0.8] });
      for (let x = GARDEN.x1 + 0.6; x < GARDEN.x2; x += 0.9) { const k = Math.floor((x * 3 + z) % 3); veg.push({ p: [x, 0.25, z], s: 1, c: ['#6dbb55', '#e63946', '#ff9a1f'][Math.abs(k)] }); leaf.push({ p: [x, 0.22, z], s: 1, c: '#4c9a46' }); }
    }
    return { wheat, soil, veg, leaf };
  }, []);
  return (
    <group>
      <Instances items={d.soil} cast={false} receive><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#7b5230" /></Instances>
      <Instances items={d.wheat} cast={false}><coneGeometry args={[0.1, 0.8, 5]} /><meshStandardMaterial flatShading /></Instances>
      <Instances items={d.leaf} cast={false}><icosahedronGeometry args={[0.28, 1]} /><meshStandardMaterial flatShading /></Instances>
      <Instances items={d.veg} cast={false}><sphereGeometry args={[0.17, 8, 6]} /><meshStandardMaterial /></Instances>
      {/* scarecrow post for the boss */}
      <Bx p={[38, 1.3, -5.1]} s={[0.12, 2.6, 0.12]} c="#6b4423" /><Bx p={[38, 1.9, -5.1]} s={[1.8, 0.1, 0.1]} c="#6b4423" />
    </group>
  );
}

export function Windmill() {
  const blades = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { blades.current.rotation.z += dt * 0.7; });
  return (
    <group position={[WINDMILL.x, 0, WINDMILL.z]}>
      <mesh position={[0, 3, 0]} castShadow><cylinderGeometry args={[1.0, 1.8, 6, 12]} /><meshStandardMaterial color="#f7efe0" /></mesh>
      <mesh position={[0, 6.7, 0]} castShadow><coneGeometry args={[1.5, 1.8, 12]} /><meshStandardMaterial color="#c0392b" flatShading /></mesh>
      <Bx p={[0, 0.9, 1.7]} s={[0.9, 1.5, 0.15]} c="#8b5a2b" />
      <mesh position={[0, 4.6, 1.15]} rotation={[0, 0, 0]}><sphereGeometry args={[0.28, 8, 6]} /><meshStandardMaterial color="#6b4423" /></mesh>
      <group ref={blades} position={[0, 4.6, 1.5]}>
        {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}><Bx p={[0, 1.8, 0]} s={[0.12, 3.6, 0.1]} c="#7a4b26" /><Bx p={[0.32, 2.2, 0.04]} s={[0.6, 2.2, 0.04]} c="#fff7e6" /></group>)}
      </group>
    </group>
  );
}

export function Pond() {
  const rings = useRef<THREE.Mesh[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    rings.current.forEach((m, i) => { if (!m) return; const k = (t * 0.3 + i / 3) % 1; m.scale.setScalar(0.4 + k * 2.4); (m.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k); });
  });
  const reeds = useMemo(() => Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2 + 0.2; return { x: POND.x + Math.cos(a) * (POND.r + 0.15), z: POND.z + Math.sin(a) * (POND.r + 0.15), h: 0.9 + (i % 3) * 0.3 }; }), []);
  const stones = useMemo(() => Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return { x: POND.x + Math.cos(a) * (POND.r + 0.1), z: POND.z + Math.sin(a) * (POND.r + 0.1), s: 0.3 + (i % 4) * 0.08 }; }), []);
  return (
    <group>
      <mesh position={[POND.x, 0.05, POND.z]} receiveShadow><cylinderGeometry args={[POND.r, POND.r, 0.1, 40]} /><meshStandardMaterial color="#3fb4d6" roughness={0.15} metalness={0.1} /></mesh>
      <group position={[POND.x, 0.12, POND.z]}>
        {[0, 1, 2].map((i) => <mesh key={i} ref={(m) => { if (m) rings.current[i] = m; }} rotation={[-Math.PI / 2, 0, 0]} position={[0.8 - i * 0.9, 0, -0.3 + i * 0.5]}><ringGeometry args={[0.8, 0.9, 24]} /><meshBasicMaterial color="#fff" transparent opacity={0.4} depthWrite={false} /></mesh>)}
        {[[1.5, 1.2], [-1.2, -1.6], [-2.2, 1.5], [2.3, -1.0]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><mesh><cylinderGeometry args={[0.38, 0.38, 0.03, 12]} /><meshStandardMaterial color="#4eaa57" /></mesh>{i % 2 === 0 && <mesh position={[0, 0.07, 0]}><sphereGeometry args={[0.1, 8, 6]} /><meshStandardMaterial color="#ffb3d1" /></mesh>}</group>)}
      </group>
      {stones.map((s, i) => <mesh key={i} position={[s.x, 0.15, s.z]} scale={[s.s, s.s * 0.7, s.s]} castShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#aaa8a2" flatShading /></mesh>)}
      {reeds.map((r, i) => <mesh key={i} position={[r.x, r.h / 2, r.z]}><cylinderGeometry args={[0.025, 0.04, r.h, 5]} /><meshStandardMaterial color="#6aa84f" /></mesh>)}
    </group>
  );
}

/** Invisible clouds that cast big soft moving shadows on the island (they never block the view). */
export function CloudShadows() {
  const refs = useRef<THREE.Group[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((g, i) => { if (!g) return; g.position.x = ((t * (0.6 + i * 0.12) + i * 23) % 120) - 50; });
  });
  return (
    <>
      {[-14, -2, 8, -20, 14].map((z, i) => (
        <group key={i} ref={(g) => { if (g) refs.current[i] = g; }} position={[0, 30, z]}>
          {[[0, 0, 0, 3.4], [2.8, 0, 0.6, 2.6], [-2.8, 0, -0.5, 2.4], [0.4, 0, 2, 2.2]].map(([x, y, zz, r], k) => (
            <mesh key={k} position={[x, y, zz]} castShadow><sphereGeometry args={[r, 8, 6]} /><meshBasicMaterial colorWrite={false} depthWrite={false} /></mesh>
          ))}
        </group>
      ))}
    </>
  );
}

export function Houses() {
  return <group>{HOUSES.map((h, i) => <HouseModel key={h.id} h={h} idx={i} />)}</group>;
}
