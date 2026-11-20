// Data-driven world layout. The renderer AND the collision system both read from here,
// so what you see is exactly what blocks you.
import { NPCS } from '../data/content.ts';
import { regionOpen } from '../engine/engine.ts';

export const BOUND = { x1: -35, x2: 45, z1: -22.5, z2: 22.5 };

export type House = { id: string; x: number; z: number; w: number; d: number; h: number; wall: string; roof: string; kind: 'house' | 'school' | 'shop' | 'barn' | 'farm'; };
export const HOUSES: House[] = [
  { id: 'h1', x: -33, z: -8, w: 4, d: 4, h: 3, wall: '#f6cf8a', roof: '#d9603b', kind: 'house' },
  { id: 'school', x: -26, z: -15, w: 9, d: 5, h: 4, wall: '#f8ecc8', roof: '#3f7fc2', kind: 'school' },
  { id: 'h3', x: -14, z: -16, w: 5, d: 4, h: 3, wall: '#dcebf7', roof: '#e0563d', kind: 'house' },
  { id: 'h4', x: -6, z: -14.5, w: 5, d: 5, h: 3.4, wall: '#f7d9d2', roof: '#8a5a33', kind: 'house' },
  { id: 'h5', x: -30, z: 14, w: 5, d: 5, h: 3.2, wall: '#e5f2cf', roof: '#c9741f', kind: 'house' },
  { id: 'h6', x: -20, z: 17, w: 5, d: 4, h: 3, wall: '#f3e0f6', roof: '#7d4fc4', kind: 'house' },
  { id: 'shop', x: -8, z: 15, w: 7, d: 5, h: 3.4, wall: '#ffe6a6', roof: '#d83a56', kind: 'shop' },
  { id: 'barn', x: 8, z: 18.5, w: 8, d: 6, h: 4, wall: '#c0392b', roof: '#8a2a22', kind: 'barn' },
  { id: 'farm', x: 18, z: -16, w: 6, d: 5, h: 3.4, wall: '#f7ead0', roof: '#b8502f', kind: 'farm' },
];

export const FENCES: [number, number, number, number][] = [
  [2, -22.5, 2, -2.6], [2, 2.6, 2, 22.5],
  [14, 13, 22, 13], [14, 20, 22, 20], [14, 13, 14, 20], [22, 13, 22, 20],
  [26, 13, 36, 13], [26, 20, 36, 20], [26, 13, 26, 20], [36, 13, 36, 20],
  [24, -15, 32, -15], [24, -20, 32, -20], [24, -15, 24, -20], [32, -15, 32, -20],
];
export const PENS = {
  sheep: [14.8, 13.8, 21.2, 19.2], horses: [26.8, 13.8, 35.2, 19.2], chickens: [24.8, -19.2, 31.2, -15.8],
};
export const POND = { x: -24, z: 6.5, r: 4 };
export const FOUNTAIN = { x: -16, z: 0, r: 2.1 };
export const WELL = { x: -4.5, z: 7, r: 0.9 };
export const WINDMILL = { x: 40.5, z: 11.5, r: 2.2 };
export const STALLS = [{ x: -12.5, z: -6.5, w: 3, d: 1.6, color: '#ef7d57', kind: 'bread' }, { x: -13.5, z: 9.8, w: 3, d: 1.6, color: '#46a86a', kind: 'fruit' }];
export const HAY = [[10, 5], [12, 4.5], [32, 0], [30.5, 1.2]];
export const FIELD = { x1: 34, x2: 44, z1: -8.5, z2: 4.5 };
export const GARDEN = { x1: 7, x2: 13, z1: -21, z2: -13.5 };
export const GATE = { x: 2, z: 0, half: 2.6 };


/* ---------- outer islands: regions 3-6, connected by bridges to the east ---------- */
export type Island = { r: number; cx: number; x1: number; x2: number; z1: number; z2: number; grass: string; edge: string };
export const ISLANDS: Island[] = [
  { r: 3, cx: 72, x1: 55, x2: 89, z1: -16, z2: 16, grass: '#9fdc7a', edge: '#6fbd5a' },
  { r: 4, cx: 116, x1: 99, x2: 133, z1: -16, z2: 16, grass: '#5fae62', edge: '#3f8f4f' },
  { r: 5, cx: 160, x1: 143, x2: 177, z1: -16, z2: 16, grass: '#ecd9a0', edge: '#d9c079' },
  { r: 6, cx: 204, x1: 187, x2: 221, z1: -16, z2: 16, grass: '#b4df78', edge: '#8fc45a' },
];
export const BRIDGES = [{ r: 3, x1: 45, x2: 55 }, { r: 4, x1: 89, x2: 99 }, { r: 5, x1: 133, x2: 143 }, { r: 6, x1: 177, x2: 187 }];
export const BRIDGE_HALF = 1.9;
export const PIER = { x1: 155, x2: 165, z1: 15, z2: 27 };
export const LAND_MAX_X = 222;
export function walkable(x: number, z: number) {
  if (x > BOUND.x1 && x < BOUND.x2 && z > BOUND.z1 && z < BOUND.z2) return true;
  for (const i of ISLANDS) if (x > i.x1 + 0.4 && x < i.x2 - 0.4 && z > i.z1 + 0.4 && z < i.z2 - 0.4) return true;
  for (const b of BRIDGES) if (x > b.x1 - 0.7 && x < b.x2 + 0.7 && Math.abs(z) < BRIDGE_HALF) return true;
  if (x > PIER.x1 && x < PIER.x2 && z > PIER.z1 - 0.5 && z < PIER.z2) return true;
  return false;
}
export const ISLAND_HOUSES: House[] = [
  { id: 'i-school', x: 72, z: -10, w: 11, d: 6, h: 4.4, wall: '#f8ecc8', roof: '#3f7fc2', kind: 'school' },
  { id: 'i-lib', x: 62, z: -9.5, w: 6, d: 5, h: 3.4, wall: '#e5f2cf', roof: '#7d4fc4', kind: 'house' },
  { id: 'i-caf', x: 83, z: -9.5, w: 6, d: 5, h: 3.2, wall: '#ffe6a6', roof: '#d83a56', kind: 'house' },
  { id: 'i-art', x: 83, z: 11, w: 6, d: 5, h: 3.2, wall: '#fbe0e8', roof: '#d9603b', kind: 'house' },
  { id: 'i-cabin', x: 106, z: -9.5, w: 5, d: 4, h: 3, wall: '#b98a5a', roof: '#3f7a4a', kind: 'house' },
  { id: 'i-ware', x: 150, z: -11.5, w: 7, d: 5, h: 3.4, wall: '#cfd8dc', roof: '#546e7a', kind: 'house' },
  { id: 'i-hut', x: 150, z: 11, w: 5, d: 4, h: 3, wall: '#f3e0c2', roof: '#2f7fa8', kind: 'house' },
];
export const SCHOOL_FIELD = { x1: 62.5, x2: 76, z1: 5.5, z2: 13.5 };
export const CLOCK_TOWER = { x: 67, z: 3.2 };
export const STONES = { x: 125, z: -8, r: 3.3, n: 8 };
export const CAMPFIRE = { x: 112.4, z: 6.4 };
export const BIG_TREE = { x: 122, z: -6.6 };
export const LIGHTHOUSE = { x: 172.5, z: -11 };
export const CRATES: [number, number][] = [[146.5, 5], [147.8, 6.3], [171.5, -3.5], [172.8, -2.4], [156, -14], [165, 12.6]];
export const BOATS: { x: number; z: number; rot: number; c: string }[] = [{ x: 152, z: 21, rot: Math.PI / 2, c: '#e5604a' }, { x: 168, z: 22, rot: Math.PI / 2, c: '#3b82f6' }, { x: 152, z: 14.2, rot: 0.2, c: '#f2b13a' }];
export const CASTLE = { x: 204, z: -11.5, w: 18, d: 6, h: 6.5 };
export const KFOUNTAIN = { x: 204, z: 6, r: 2 };

export type Collider = { t: 'c'; x: number; z: number; r: number } | { t: 'b'; x1: number; x2: number; z1: number; z2: number; gate?: boolean; region?: number };

function rngMaker(seed: number) {
  let s = seed | 0;
  return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const rng = rngMaker(11);

export type Tree = { x: number; z: number; s: number; kind: 'pine' | 'round' | 'orange'; tint: number };
export type Deco = { x: number; z: number; s: number; c: number };

const houseBox = (h: House): Collider => ({ t: 'b', x1: h.x - h.w / 2 - 0.15, x2: h.x + h.w / 2 + 0.15, z1: h.z - h.d / 2 - 0.15, z2: h.z + h.d / 2 + 0.15 });

export function buildWorld() {
  const colliders: Collider[] = [];
  HOUSES.forEach((h) => colliders.push(houseBox(h)));
  FENCES.forEach(([x1, z1, x2, z2]) => colliders.push({ t: 'b', x1: Math.min(x1, x2) - 0.2, x2: Math.max(x1, x2) + 0.2, z1: Math.min(z1, z2) - 0.2, z2: Math.max(z1, z2) + 0.2 }));
  colliders.push({ t: 'c', x: POND.x, z: POND.z, r: POND.r + 0.2 });
  colliders.push({ t: 'c', x: FOUNTAIN.x, z: FOUNTAIN.z, r: FOUNTAIN.r });
  colliders.push({ t: 'c', x: WELL.x, z: WELL.z, r: WELL.r });
  colliders.push({ t: 'c', x: WINDMILL.x, z: WINDMILL.z, r: WINDMILL.r });
  STALLS.forEach((s) => colliders.push({ t: 'b', x1: s.x - s.w / 2, x2: s.x + s.w / 2, z1: s.z - s.d / 2, z2: s.z + s.d / 2 }));
  HAY.forEach(([x, z]) => colliders.push({ t: 'c', x, z, r: 0.9 }));
  colliders.push({ t: 'b', x1: GATE.x - 0.3, x2: GATE.x + 0.3, z1: -GATE.half - 0.1, z2: GATE.half + 0.1, gate: true });
  Object.values(NPCS as Record<string, { x: number; z: number }>).forEach((n) => colliders.push({ t: 'c', x: n.x, z: n.z, r: 0.6 }));

  const npcs = Object.values(NPCS as Record<string, { x: number; z: number }>);
  const blocked = (x: number, z: number, pad: number) => {
    for (const n of npcs) if (Math.hypot(x - n.x, z - n.z) < 3.2) return true;
    if (Math.hypot(x + 31, z) < 4 || Math.hypot(x - 2, z) < 5) return true;
    for (const c of colliders) {
      if (c.t === 'c') { if (Math.hypot(x - c.x, z - c.z) < c.r + pad + 0.8) return true; }
      else if (x > c.x1 - pad - 1.2 && x < c.x2 + pad + 1.2 && z > c.z1 - pad - 1.2 && z < c.z2 + pad + 1.2) return true;
    }
    if (Math.abs(z) < 2.8) return true;                      // main road
    if (Math.abs(x + 16) < 2.4 && Math.abs(z) < 13) return true; // village road
    if (Math.abs(x - 24) < 2.4 && Math.abs(z) < 10) return true; // farm road
    if (Math.abs(x - 12) < 2.2 && z > -9 && z < 3) return true;
    return false;
  };
  const trees: Tree[] = [];
  const inPen = (x: number, z: number) => (x > 13 && x < 37 && z > 11) || (x > 23 && x < 33 && z < -13 && z > -21) || (x > 33 && x < 44.5 && z > -9 && z < 5) || (x > 6 && x < 13.5 && z < -12 && z > -21.5);
  for (let i = 0; i < 700 && trees.length < 105; i++) {
    const x = -34 + rng() * 78, z = -22 + rng() * 44;
    if (blocked(x, z, 0.3) || inPen(x, z) || (x > 28 && x < 43 && z < -11 && z > -23)) continue;
    const k = rng();
    trees.push({ x, z, s: 0.8 + rng() * 0.7, kind: k < 0.45 ? 'pine' : 'round', tint: rng() });
  }
  for (let x = 29.5; x <= 42; x += 3) for (let z = -21; z <= -13; z += 3.3) {
    if (Math.abs(x - 30) < 1 && Math.abs(z + 9) < 3) continue;
    trees.push({ x: x + (rng() - 0.5) * 0.6, z: z + (rng() - 0.5) * 0.5, s: 0.9, kind: 'orange', tint: rng() });
  }
  trees.forEach((t) => colliders.push({ t: 'c', x: t.x, z: t.z, r: 0.5 * t.s }));

  const flowers: Deco[] = [], tufts: Deco[] = [], rocks: Deco[] = [], bushes: Deco[] = [];
  for (let i = 0; i < 900 && flowers.length < 120; i++) { const x = -34 + rng() * 78, z = -22 + rng() * 44; if (!blocked(x, z, 0) && !inPen(x, z) && Math.hypot(x - POND.x, z - POND.z) > POND.r + 0.5) flowers.push({ x, z, s: 0.7 + rng() * 0.6, c: Math.floor(rng() * 5) }); }
  for (let i = 0; i < 2500 && tufts.length < 520; i++) { const x = -34.5 + rng() * 79, z = -22 + rng() * 44; if (Math.abs(z) < 1.9 || (Math.abs(x + 16) < 1.9 && Math.abs(z) < 13) || (Math.abs(x - 24) < 1.9 && Math.abs(z) < 10)) continue; tufts.push({ x, z, s: 0.6 + rng() * 0.9, c: Math.floor(rng() * 3) }); }
  for (let i = 0; i < 300 && rocks.length < 18; i++) { const x = -34 + rng() * 78, z = -22 + rng() * 44; if (!blocked(x, z, 0.5) && !inPen(x, z)) { rocks.push({ x, z, s: 0.4 + rng() * 0.6, c: 0 }); colliders.push({ t: 'c', x, z, r: 0.35 + rng() * 0.2 }); } }
  for (let i = 0; i < 400 && bushes.length < 26; i++) { const x = -34 + rng() * 78, z = -22 + rng() * 44; if (!blocked(x, z, 0.5) && !inPen(x, z)) { bushes.push({ x, z, s: 0.7 + rng() * 0.6, c: Math.floor(rng() * 2) }); colliders.push({ t: 'c', x, z, r: 0.55 }); } }

  buildIslands(colliders, trees, flowers, tufts, rocks, bushes);
  return { colliders, trees, flowers, tufts, rocks, bushes };
}
function buildIslands(colliders: Collider[], trees: Tree[], flowers: Deco[], tufts: Deco[], rocks: Deco[], bushes: Deco[]) {
  const box = (x1: number, x2: number, z1: number, z2: number) => colliders.push({ t: 'b', x1, x2, z1, z2 });
  const circ = (x: number, z: number, r: number) => colliders.push({ t: 'c', x, z, r });
  ISLAND_HOUSES.forEach((h) => colliders.push(houseBox(h)));
  circ(CLOCK_TOWER.x, CLOCK_TOWER.z, 1.3); circ(CAMPFIRE.x, CAMPFIRE.z, 0.9); circ(BIG_TREE.x, BIG_TREE.z, 1.6); circ(LIGHTHOUSE.x, LIGHTHOUSE.z, 2); circ(KFOUNTAIN.x, KFOUNTAIN.z, KFOUNTAIN.r + 0.1);
  for (let k = 0; k < STONES.n; k++) { const a = (k / STONES.n) * Math.PI * 2; circ(STONES.x + Math.cos(a) * STONES.r, STONES.z + Math.sin(a) * STONES.r, 0.55); }
  CRATES.forEach(([x, z]) => circ(x, z, 0.75));
  BOATS.forEach((b) => circ(b.x, b.z, 1.6));
  box(CASTLE.x - CASTLE.w / 2 - 0.4, CASTLE.x + CASTLE.w / 2 + 0.4, CASTLE.z - CASTLE.d / 2 - 0.4, CASTLE.z + CASTLE.d / 2 + 0.4);
  box(166.5, 170.5, 6.2, 7.8); // fish stall
  // gates on the bridges (closed until the previous boss + word mastery open the region)
  BRIDGES.forEach((b) => colliders.push({ t: 'b', x1: b.x1 + 0.7, x2: b.x1 + 1.3, z1: -2.6, z2: 2.6, region: b.r }));
  const npcs = Object.values(NPCS as Record<string, { x: number; z: number }>);
  const solid = [...ISLAND_HOUSES.map((h) => [h.x - h.w / 2 - 1.2, h.x + h.w / 2 + 1.2, h.z - h.d / 2 - 1.2, h.z + h.d / 2 + 1.2]), [CASTLE.x - 10, CASTLE.x + 10, CASTLE.z - 4.5, CASTLE.z + 4.5], [SCHOOL_FIELD.x1, SCHOOL_FIELD.x2, SCHOOL_FIELD.z1, SCHOOL_FIELD.z2]];
  const blocked = (x: number, z: number) => {
    if (Math.abs(z) < 2.8) return true;
    if (Math.hypot(x - STONES.x, z - STONES.z) < STONES.r + 1.4) return true;
    if (Math.hypot(x - KFOUNTAIN.x, z - KFOUNTAIN.z) < 4 || Math.hypot(x - CAMPFIRE.x, z - CAMPFIRE.z) < 3 || Math.hypot(x - BIG_TREE.x, z - BIG_TREE.z) < 3.4) return true;
    if (x > 165 && x < 175 && z > 5 && z < 9) return true;
    for (const n of npcs) if (Math.hypot(x - n.x, z - n.z) < 3.2) return true;
    for (const c of solid) if (x > c[0] && x < c[1] && z > c[2] && z < c[3]) return true;
    if (x > 144 && x < 176 && z > 13) return true; // harbour front stays open
    if (Math.abs(x - 204) < 2.6 && z < 0 && z > -8) return true; // carpet
    return false;
  };
  const edge = (i: Island, x: number, z: number) => Math.min(x - i.x1, i.x2 - x, z - i.z1, i.z2 - z);
  for (const i of ISLANDS) {
    const want = i.r === 4 ? 78 : i.r === 3 ? 22 : i.r === 5 ? 9 : 24;
    let placed = 0;
    for (let t = 0; t < 900 && placed < want; t++) {
      const x = i.x1 + 1 + rng() * (i.x2 - i.x1 - 2), z = i.z1 + 1 + rng() * (i.z2 - i.z1 - 2);
      if (blocked(x, z)) continue;
      if (i.r !== 4 && edge(i, x, z) > 4.5 && rng() < 0.75) continue; // calm islands keep trees near the rim
      const k = rng();
      trees.push({ x, z, s: i.r === 4 ? 1 + rng() * 0.8 : 0.8 + rng() * 0.6, kind: i.r === 4 ? (k < 0.82 ? 'pine' : 'round') : i.r === 5 ? 'round' : k < 0.5 ? 'round' : i.r === 6 ? 'orange' : 'pine', tint: rng() });
      colliders.push({ t: 'c', x, z, r: 0.5 }); placed++;
    }
    const nf = i.r === 6 ? 70 : i.r === 3 ? 40 : i.r === 5 ? 6 : 30;
    for (let t = 0; t < 600 && flowers.filter((f) => f.x > i.x1 && f.x < i.x2).length < nf; t++) { const x = i.x1 + 0.8 + rng() * (i.x2 - i.x1 - 1.6), z = i.z1 + 0.8 + rng() * (i.z2 - i.z1 - 1.6); if (!blocked(x, z)) flowers.push({ x, z, s: 0.7 + rng() * 0.6, c: Math.floor(rng() * 6) }); }
    const nt = i.r === 5 ? 80 : 190;
    for (let t = 0; t < 700 && tufts.filter((f) => f.x > i.x1 && f.x < i.x2).length < nt; t++) { const x = i.x1 + 0.6 + rng() * (i.x2 - i.x1 - 1.2), z = i.z1 + 0.6 + rng() * (i.z2 - i.z1 - 1.2); if (Math.abs(z) > 1.9) tufts.push({ x, z, s: 0.8 + rng() * 0.6, c: Math.floor(rng() * 3) }); }
    for (let t = 0; t < 200 && rocks.filter((f) => f.x > i.x1 && f.x < i.x2).length < (i.r === 5 ? 9 : 4); t++) { const x = i.x1 + 1.5 + rng() * (i.x2 - i.x1 - 3), z = i.z1 + 1.5 + rng() * (i.z2 - i.z1 - 3); if (!blocked(x, z)) { rocks.push({ x, z, s: 0.4 + rng() * 0.6, c: 0 }); circ(x, z, 0.45); } }
  }
}
export const WORLD = buildWorld();

export const COINS: [number, number][] = [[-26, -4], [-20, 10], [-12, -10], [-8, 3], [-33, -3], [-14, 6], [-4, 12], [-1, 5], [8, -8], [10, 4], [16, -12], [20, 2], [28, 4], [30, -6], [34, -2], [38, 16]];

export function hit(x: number, z: number, r: number, gateOpen: boolean) {
  for (const c of WORLD.colliders) {
    if (c.t === 'c') { const dx = x - c.x, dz = z - c.z, rr = r + c.r; if (dx * dx + dz * dz < rr * rr) return true; }
    else { if (c.region) { if (regionOpen(c.region)) continue; } else if (c.gate && gateOpen) continue; if (x > c.x1 - r && x < c.x2 + r && z > c.z1 - r && z < c.z2 + r) return true; }
  }
  return false;
}
