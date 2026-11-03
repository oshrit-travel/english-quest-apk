import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Bounds = [number, number, number, number];

function useWander(bounds: Bounds, speed: number, hop: number, start: [number, number], circle?: { x: number; z: number; r: number }) {
  const g = useRef<THREE.Group>(null!);
  const st = useRef({ tx: start[0], tz: start[1], wait: Math.random() * 3, moving: false, t: Math.random() * 10 });
  const pick = () => {
    for (let i = 0; i < 12; i++) {
      const x = bounds[0] + Math.random() * (bounds[2] - bounds[0]), z = bounds[1] + Math.random() * (bounds[3] - bounds[1]);
      if (!circle || Math.hypot(x - circle.x, z - circle.z) < circle.r) { st.current.tx = x; st.current.tz = z; return; }
    }
  };
  useFrame((_, dt) => {
    const s = st.current, o = g.current;
    s.t += dt;
    if (s.wait > 0) { s.wait -= dt; s.moving = false; }
    else {
      const dx = s.tx - o.position.x, dz = s.tz - o.position.z, d = Math.hypot(dx, dz);
      if (d < 0.15) { s.wait = 1.5 + Math.random() * 4; pick(); s.moving = false; }
      else {
        s.moving = true;
        o.position.x += (dx / d) * speed * dt; o.position.z += (dz / d) * speed * dt;
        const ta = Math.atan2(dx, dz); let da = ta - o.rotation.y; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
        o.rotation.y += da * Math.min(1, dt * 6);
      }
    }
    o.position.y = s.moving && hop ? Math.abs(Math.sin(s.t * (6 + speed * 3))) * hop : 0;
  });
  return { g, st };
}

export function Sheep({ bounds, start }: { bounds: Bounds; start: [number, number] }) {
  const { g } = useWander(bounds, 0.7, 0.07, start);
  const wool = useMemo(() => [[0, 0.62, 0, 0.5], [0.22, 0.6, 0.18, 0.38], [-0.22, 0.6, 0.18, 0.38], [0.22, 0.6, -0.2, 0.38], [-0.22, 0.6, -0.2, 0.38], [0, 0.78, 0, 0.34], [0, 0.6, -0.34, 0.34]] as const, []);
  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      {wool.map((w, i) => <mesh key={i} position={[w[0], w[1], w[2]]} castShadow><icosahedronGeometry args={[w[3], 1]} /><meshStandardMaterial color="#f7f3e8" flatShading /></mesh>)}
      <mesh position={[0, 0.7, 0.5]} castShadow scale={[0.9, 1, 1.05]}><sphereGeometry args={[0.2, 12, 10]} /><meshStandardMaterial color="#4a3f3c" /></mesh>
      {[-0.17, 0.17].map((x) => <mesh key={x} position={[x, 0.78, 0.46]} rotation={[0, 0, x * 3]} scale={[1, 0.5, 0.7]}><sphereGeometry args={[0.11, 8, 6]} /><meshStandardMaterial color="#4a3f3c" /></mesh>)}
      {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.74, 0.68]}><sphereGeometry args={[0.03, 6, 6]} /><meshBasicMaterial color="#fff" /></mesh>)}
      {[[-0.22, 0.25], [0.22, 0.25], [-0.22, -0.25], [0.22, -0.25]].map(([x, z], i) => <mesh key={i} position={[x, 0.17, z]}><cylinderGeometry args={[0.05, 0.05, 0.34, 6]} /><meshStandardMaterial color="#3b3330" /></mesh>)}
    </group>
  );
}

export function Horse({ bounds, start, coat = '#8b5a2b', mane = '#3a2414' }: { bounds: Bounds; start: [number, number]; coat?: string; mane?: string }) {
  const { g } = useWander(bounds, 1.2, 0.05, start);
  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.38, 0.9, 6, 12]} /><meshStandardMaterial color={coat} /></mesh>
      <mesh position={[0, 1.45, 0.62]} rotation={[0.55, 0, 0]} castShadow><capsuleGeometry args={[0.17, 0.55, 4, 8]} /><meshStandardMaterial color={coat} /></mesh>
      <mesh position={[0, 1.72, 0.88]} rotation={[1.1, 0, 0]} castShadow><capsuleGeometry args={[0.15, 0.32, 4, 8]} /><meshStandardMaterial color={coat} /></mesh>
      <mesh position={[0, 1.62, 0.5]} rotation={[0.55, 0, 0]}><boxGeometry args={[0.07, 0.62, 0.12]} /><meshStandardMaterial color={mane} /></mesh>
      {[-0.1, 0.1].map((x) => <mesh key={x} position={[x, 1.95, 0.78]}><coneGeometry args={[0.05, 0.14, 5]} /><meshStandardMaterial color={coat} /></mesh>)}
      {[-0.13, 0.13].map((x) => <mesh key={x} position={[x, 1.78, 1.0]}><sphereGeometry args={[0.03, 6, 6]} /><meshBasicMaterial color="#111" /></mesh>)}
      <mesh position={[0, 1.1, -0.85]} rotation={[0.5, 0, 0]}><capsuleGeometry args={[0.07, 0.6, 4, 8]} /><meshStandardMaterial color={mane} /></mesh>
      {[[-0.2, 0.5], [0.2, 0.5], [-0.2, -0.5], [0.2, -0.5]].map(([x, z], i) => <mesh key={i} position={[x, 0.4, z]} castShadow><cylinderGeometry args={[0.07, 0.06, 0.8, 8]} /><meshStandardMaterial color={coat} /></mesh>)}
    </group>
  );
}

export function Cow({ bounds, start }: { bounds: Bounds; start: [number, number] }) {
  const { g } = useWander(bounds, 0.6, 0.04, start);
  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.45, 0.8, 6, 12]} /><meshStandardMaterial color="#fbfbf7" /></mesh>
      {[[0.3, 1.0, 0.2, 0.25], [-0.32, 0.95, -0.25, 0.3], [0.2, 1.2, -0.4, 0.2]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} scale={[0.5, 1, 1]}><sphereGeometry args={[r, 10, 8]} /><meshStandardMaterial color="#2c2825" /></mesh>)}
      <mesh position={[0, 1.0, 0.85]} castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="#fbfbf7" /></mesh>
      <mesh position={[0, 0.9, 1.12]}><boxGeometry args={[0.34, 0.26, 0.12]} /><meshStandardMaterial color="#f4a6a6" /></mesh>
      {[-0.28, 0.28].map((x) => <mesh key={x} position={[x, 1.28, 0.8]} rotation={[0, 0, -x * 2.5]}><coneGeometry args={[0.05, 0.2, 6]} /><meshStandardMaterial color="#e8dcc0" /></mesh>)}
      {[-0.17, 0.17].map((x) => <mesh key={x} position={[x, 1.12, 1.1]}><sphereGeometry args={[0.04, 6, 6]} /><meshBasicMaterial color="#111" /></mesh>)}
      {[[-0.25, 0.5], [0.25, 0.5], [-0.25, -0.5], [0.25, -0.5]].map(([x, z], i) => <mesh key={i} position={[x, 0.3, z]}><cylinderGeometry args={[0.09, 0.08, 0.6, 8]} /><meshStandardMaterial color="#e9e3d6" /></mesh>)}
    </group>
  );
}

export function Chicken({ bounds, start, color = '#fffaf0' }: { bounds: Bounds; start: [number, number]; color?: string }) {
  const { g, st } = useWander(bounds, 0.9, 0.05, start);
  const head = useRef<THREE.Group>(null!);
  useFrame(() => { head.current.rotation.x = st.current.moving ? 0 : Math.max(0, Math.sin(st.current.t * 7)) * 0.9; });
  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      <mesh position={[0, 0.34, 0]} scale={[0.9, 0.85, 1.15]} castShadow><sphereGeometry args={[0.26, 14, 10]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.5, -0.27]} rotation={[0.7, 0, 0]}><coneGeometry args={[0.13, 0.3, 6]} /><meshStandardMaterial color={color} /></mesh>
      <group ref={head} position={[0, 0.58, 0.2]}>
        <mesh castShadow><sphereGeometry args={[0.14, 12, 10]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.03, 0.15]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.05, 0.12, 5]} /><meshStandardMaterial color="#f59e0b" /></mesh>
        <mesh position={[0, 0.16, 0.02]}><boxGeometry args={[0.04, 0.09, 0.14]} /><meshStandardMaterial color="#e53935" /></mesh>
        {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.04, 0.1]}><sphereGeometry args={[0.02, 6, 6]} /><meshBasicMaterial color="#111" /></mesh>)}
      </group>
      {[-0.08, 0.08].map((x) => <mesh key={x} position={[x, 0.1, 0.02]}><cylinderGeometry args={[0.018, 0.018, 0.2, 5]} /><meshStandardMaterial color="#f59e0b" /></mesh>)}
    </group>
  );
}

export function Rabbit({ bounds, start, color = '#d9cdbd' }: { bounds: Bounds; start: [number, number]; color?: string }) {
  const { g } = useWander(bounds, 1.4, 0.28, start);
  return (
    <group ref={g} position={[start[0], 0, start[1]]}>
      <mesh position={[0, 0.25, 0]} scale={[0.85, 0.8, 1.2]} castShadow><sphereGeometry args={[0.25, 14, 10]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.42, 0.22]} castShadow><sphereGeometry args={[0.16, 12, 10]} /><meshStandardMaterial color={color} /></mesh>
      {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.7, 0.18]} rotation={[0.1, 0, x * 1.5]} castShadow><capsuleGeometry args={[0.04, 0.26, 3, 6]} /><meshStandardMaterial color={color} /></mesh>)}
      {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.45, 0.35]}><sphereGeometry args={[0.025, 6, 6]} /><meshBasicMaterial color="#111" /></mesh>)}
      <mesh position={[0, 0.4, 0.38]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#f48a8a" /></mesh>
      <mesh position={[0, 0.27, -0.3]}><sphereGeometry args={[0.09, 8, 8]} /><meshStandardMaterial color="#fff" /></mesh>
    </group>
  );
}

export function Duck({ circle, start }: { circle: { x: number; z: number; r: number }; start: [number, number] }) {
  const { g } = useWander([circle.x - circle.r, circle.z - circle.r, circle.x + circle.r, circle.z + circle.r], 0.5, 0, start, circle);
  return (
    <group ref={g} position={[start[0], 0.12, start[1]]}>
      <mesh position={[0, 0.12, 0]} scale={[0.9, 0.6, 1.3]} castShadow><sphereGeometry args={[0.24, 12, 10]} /><meshStandardMaterial color="#f7e9a8" /></mesh>
      <mesh position={[0, 0.34, 0.2]} castShadow><sphereGeometry args={[0.13, 12, 10]} /><meshStandardMaterial color="#5aa04c" /></mesh>
      <mesh position={[0, 0.32, 0.34]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.5]}><coneGeometry args={[0.06, 0.14, 5]} /><meshStandardMaterial color="#f59e0b" /></mesh>
      {[-0.06, 0.06].map((x) => <mesh key={x} position={[x, 0.37, 0.29]}><sphereGeometry args={[0.02, 6, 6]} /><meshBasicMaterial color="#111" /></mesh>)}
    </group>
  );
}

/** A few birds circling high above the island. */
export function Birds() {
  const refs = useRef<THREE.Group[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((g, i) => {
      if (!g) return;
      const a = t * (0.18 + i * 0.03) + i * 2.1, r = 20 + i * 5;
      g.position.set(5 + Math.cos(a) * r, 9 + Math.sin(t + i) * 0.6, Math.sin(a) * r * 0.65);
      g.rotation.y = -a;
      const f = Math.sin(t * 9 + i) * 0.6;
      (g.children[0] as THREE.Object3D).rotation.z = f; (g.children[1] as THREE.Object3D).rotation.z = -f;
    });
  });
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <group><mesh position={[-0.35, 0, 0]}><boxGeometry args={[0.7, 0.04, 0.22]} /><meshStandardMaterial color="#ffffff" /></mesh></group>
          <group><mesh position={[0.35, 0, 0]}><boxGeometry args={[0.7, 0.04, 0.22]} /><meshStandardMaterial color="#ffffff" /></mesh></group>
          <mesh><sphereGeometry args={[0.1, 8, 6]} /><meshStandardMaterial color="#e8e8e8" /></mesh>
        </group>
      ))}
    </>
  );
}

export function Butterflies() {
  const refs = useRef<THREE.Group[]>([]);
  const cols = ['#ffb347', '#ff7aa8', '#7ad7ff', '#c7a6ff', '#ffe066', '#ffffff'];
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((g, i) => {
      if (!g) return;
      const cx = [-26, -10, -2, 14, 28, 36][i], cz = [-3, 8, -10, 6, -4, 8][i];
      g.position.set(cx + Math.sin(t * 0.6 + i) * 2.2, 1.1 + Math.sin(t * 1.7 + i * 2) * 0.35, cz + Math.cos(t * 0.5 + i * 1.3) * 2.2);
      g.rotation.y = t * 0.6 + i;
      const f = Math.sin(t * 16 + i) * 0.8;
      (g.children[0] as THREE.Object3D).rotation.z = f; (g.children[1] as THREE.Object3D).rotation.z = -f;
    });
  });
  return (
    <>
      {cols.map((c, i) => (
        <group key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <group><mesh position={[-0.09, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.18, 0.14]} /><meshBasicMaterial color={c} side={THREE.DoubleSide} /></mesh></group>
          <group><mesh position={[0.09, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.18, 0.14]} /><meshBasicMaterial color={c} side={THREE.DoubleSide} /></mesh></group>
        </group>
      ))}
    </>
  );
}
