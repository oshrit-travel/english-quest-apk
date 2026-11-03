import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type Look = {
  shirt: string; hair: string; skin?: string; pants?: string;
  hat?: string; pack?: string | null; hairStyle?: 'short' | 'long' | 'bun' | 'spiky' | 'bob';
  accent?: string;
};
export type Pose = { speed: number; wave: number; cheer: number; talk?: number };

const SKIN = ['#f6c9a0', '#e9b68c', '#d49a6a', '#ffd9b8', '#c68642'];
export const skinFor = (i: number) => SKIN[i % SKIN.length];

/** A friendly chibi-style character: big head, expressive eyes, blush, smile; animated procedurally. */
export function Humanoid({ look, pose, phase = 0 }: { look: Look; pose: () => Pose; phase?: number }) {
  const root = useRef<THREE.Group>(null!);
  const torso = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const lLeg = useRef<THREE.Group>(null!), rLeg = useRef<THREE.Group>(null!);
  const lArm = useRef<THREE.Group>(null!), rArm = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const walk = useRef(0);
  const skin = look.skin || '#f6c9a0';
  const pants = look.pants || '#4a5d8a';

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime + phase;
    const p = pose();
    const moving = p.speed > 0.4;
    if (moving) walk.current += dt * (4 + p.speed * 1.6);
    const s = Math.sin(walk.current) * Math.min(1, p.speed / 3) * 0.85;
    lLeg.current.rotation.x = s; rLeg.current.rotation.x = -s;
    lArm.current.rotation.x = -s * 0.9; rArm.current.rotation.x = s * 0.9;
    lArm.current.rotation.z = 0.08; rArm.current.rotation.z = -0.08;
    const bob = moving ? Math.abs(Math.sin(walk.current)) * 0.09 : Math.sin(t * 2.2) * 0.018;
    torso.current.position.y = 0.62 + bob;
    torso.current.rotation.x = moving ? 0.1 : 0;
    torso.current.scale.set(1, 1 + (moving ? 0 : Math.sin(t * 2.2) * 0.015), 1);
    if (p.wave > 0) { rArm.current.rotation.x = -2.5 + Math.sin(t * 13) * 0.25; rArm.current.rotation.z = -0.35; head.current.rotation.z = Math.sin(t * 5) * 0.06; }
    else if (p.cheer > 0) { lArm.current.rotation.x = rArm.current.rotation.x = -2.7; lArm.current.rotation.z = 0.5; rArm.current.rotation.z = -0.5; torso.current.position.y += Math.abs(Math.sin(t * 12)) * 0.14; head.current.rotation.z = 0; }
    else head.current.rotation.z = Math.sin(t * 1.3) * 0.03;
    if (p.talk && p.talk > 0) head.current.rotation.x = Math.sin(t * 9) * 0.05; else head.current.rotation.x = 0;
    // blink
    const b = (t % 3.8) < 0.13 ? 0.12 : 1;
    eyes.current.scale.y += (b - eyes.current.scale.y) * 0.6;
  });

  const hs = look.hairStyle || 'short';
  return (
    <group ref={root}>
      {/* legs */}
      <group ref={lLeg} position={[-0.17, 0.56, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color={pants} /></mesh>
        <mesh position={[0, -0.5, 0.06]} castShadow><boxGeometry args={[0.22, 0.12, 0.34]} /><meshStandardMaterial color="#6b3f22" /></mesh>
      </group>
      <group ref={rLeg} position={[0.17, 0.56, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color={pants} /></mesh>
        <mesh position={[0, -0.5, 0.06]} castShadow><boxGeometry args={[0.22, 0.12, 0.34]} /><meshStandardMaterial color="#6b3f22" /></mesh>
      </group>
      <group ref={torso} position={[0, 0.62, 0]}>
        {/* body */}
        <mesh position={[0, 0.38, 0]} castShadow><capsuleGeometry args={[0.3, 0.32, 6, 12]} /><meshStandardMaterial color={look.shirt} /></mesh>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.31, 0.31, 0.07, 14]} /><meshStandardMaterial color={look.accent || '#7a4a24'} /></mesh>
        {look.pack && look.pack !== 'none' && (
          <mesh position={[0, 0.42, -0.33]} castShadow><boxGeometry args={[0.42, 0.52, 0.2]} /><meshStandardMaterial color={look.pack} /></mesh>
        )}
        {/* arms */}
        <group ref={lArm} position={[-0.38, 0.62, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow><capsuleGeometry args={[0.085, 0.3, 4, 8]} /><meshStandardMaterial color={look.shirt} /></mesh>
          <mesh position={[0, -0.47, 0]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color={skin} /></mesh>
        </group>
        <group ref={rArm} position={[0.38, 0.62, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow><capsuleGeometry args={[0.085, 0.3, 4, 8]} /><meshStandardMaterial color={look.shirt} /></mesh>
          <mesh position={[0, -0.47, 0]}><sphereGeometry args={[0.1, 10, 8]} /><meshStandardMaterial color={skin} /></mesh>
        </group>
        {/* head */}
        <group ref={head} position={[0, 1.08, 0]}>
          <mesh castShadow><sphereGeometry args={[0.43, 24, 18]} /><meshStandardMaterial color={skin} /></mesh>
          <group ref={eyes} position={[0, 0.02, 0.37]}>
            {[-0.16, 0.16].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <mesh scale={[1, 1.25, 0.6]}><sphereGeometry args={[0.085, 12, 10]} /><meshStandardMaterial color="#2a1a14" roughness={0.3} /></mesh>
                <mesh position={[0.025, 0.04, 0.045]}><sphereGeometry args={[0.027, 8, 6]} /><meshBasicMaterial color="#ffffff" /></mesh>
              </group>
            ))}
          </group>
          {[-0.27, 0.27].map((x) => (
            <mesh key={x} position={[x, -0.1, 0.33]} scale={[1, 0.6, 0.4]}><sphereGeometry args={[0.09, 10, 8]} /><meshStandardMaterial color="#f48a8a" transparent opacity={0.65} /></mesh>
          ))}
          <mesh position={[0, -0.12, 0.41]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.07, 0.014, 8, 16, Math.PI]} /><meshStandardMaterial color="#8a3b2b" /></mesh>
          {/* hair */}
          <mesh position={[0, 0.05, -0.02]} rotation={[-0.15, 0, 0]}><sphereGeometry args={[0.455, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.56]} /><meshStandardMaterial color={look.hair} /></mesh>
          <mesh position={[0, 0.2, 0.28]} scale={[1.2, 0.5, 0.6]}><sphereGeometry args={[0.2, 12, 8]} /><meshStandardMaterial color={look.hair} /></mesh>
          {hs === 'long' && <mesh position={[0, -0.18, -0.2]}><capsuleGeometry args={[0.28, 0.36, 4, 10]} /><meshStandardMaterial color={look.hair} /></mesh>}
          {hs === 'bob' && <mesh position={[0, -0.04, -0.12]} scale={[1.1, 0.9, 1]}><sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.55]} /><meshStandardMaterial color={look.hair} /></mesh>}
          {hs === 'bun' && <mesh position={[0, 0.55, -0.08]}><sphereGeometry args={[0.17, 12, 10]} /><meshStandardMaterial color={look.hair} /></mesh>}
          {hs === 'spiky' && [-0.25, -0.08, 0.1, 0.27].map((x, i) => (
            <mesh key={i} position={[x, 0.44, 0.02 - Math.abs(x) * 0.2]} rotation={[0, 0, -x * 1.6]}><coneGeometry args={[0.09, 0.26, 6]} /><meshStandardMaterial color={look.hair} /></mesh>
          ))}
          <Hat kind={look.hat} />
        </group>
      </group>
    </group>
  );
}

function Hat({ kind }: { kind?: string }) {
  if (!kind || kind === 'none') return null;
  if (kind === 'cap') return (
    <group position={[0, 0.3, 0.02]}>
      <mesh><sphereGeometry args={[0.47, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} /><meshStandardMaterial color="#ef4444" /></mesh>
      <mesh position={[0, -0.02, 0.4]} rotation={[0.1, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.04, 16, 1, false, -Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#b91c1c" /></mesh>
    </group>
  );
  if (kind === 'party') return (
    <group position={[0, 0.62, 0]}>
      <mesh><coneGeometry args={[0.24, 0.5, 14]} /><meshStandardMaterial color="#a855f7" /></mesh>
      <mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.07, 8, 6]} /><meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} /></mesh>
    </group>
  );
  if (kind === 'crown') return (
    <group position={[0, 0.5, 0]}>
      <mesh><cylinderGeometry args={[0.28, 0.25, 0.18, 10]} /><meshStandardMaterial color="#facc15" metalness={0.5} roughness={0.3} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return <mesh key={i} position={[Math.sin(a) * 0.25, 0.16, Math.cos(a) * 0.25]}><coneGeometry args={[0.06, 0.18, 5]} /><meshStandardMaterial color="#facc15" metalness={0.5} roughness={0.3} /></mesh>; })}
    </group>
  );
  if (kind === 'wizard') return (
    <group position={[0, 0.45, 0]}>
      <mesh position={[0, 0.3, 0]}><coneGeometry args={[0.3, 0.75, 14]} /><meshStandardMaterial color="#3730a3" /></mesh>
      <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.52, 0.52, 0.05, 20]} /><meshStandardMaterial color="#312e81" /></mesh>
      <mesh position={[0.1, 0.1, 0.28]}><octahedronGeometry args={[0.06]} /><meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.6} /></mesh>
    </group>
  );
  if (kind === 'straw') return (
    <group position={[0, 0.42, 0]}>
      <mesh><cylinderGeometry args={[0.55, 0.58, 0.05, 20]} /><meshStandardMaterial color="#e6c15a" /></mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.28, 0.33, 0.28, 16]} /><meshStandardMaterial color="#d9ae45" /></mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.335, 0.335, 0.07, 16]} /><meshStandardMaterial color="#c0392b" /></mesh>
    </group>
  );
  return null;
}

/** Friendly pet that trots after the player. */
export function Pet({ type, color }: { type: string; color: string }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((s) => { g.current.position.y = Math.abs(Math.sin(s.clock.elapsedTime * 9)) * 0.06; });
  if (type === 'none') return null;
  const chick = type === 'chick';
  return (
    <group ref={g} scale={chick ? 0.8 : 1}>
      <mesh position={[0, 0.3, 0]} scale={[1, 0.85, 1.25]} castShadow><sphereGeometry args={[chick ? 0.22 : 0.27, 14, 10]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.52, 0.27]} castShadow><sphereGeometry args={[chick ? 0.15 : 0.2, 14, 10]} /><meshStandardMaterial color={color} /></mesh>
      {[-0.07, 0.07].map((x) => <mesh key={x} position={[x, 0.55, 0.42]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#222" /></mesh>)}
      {!chick && [-0.1, 0.1].map((x) => <mesh key={x} position={[x, 0.75, 0.24]} rotation={[0, 0, x * 2]}><coneGeometry args={[0.07, 0.2, 5]} /><meshStandardMaterial color={color} /></mesh>)}
      {!chick && <mesh position={[0, 0.45, -0.34]} rotation={[-0.9, 0, 0]}><capsuleGeometry args={[0.04, 0.3, 3, 6]} /><meshStandardMaterial color={color} /></mesh>}
      {chick && <mesh position={[0, 0.5, 0.44]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.05, 0.12, 5]} /><meshStandardMaterial color="#f59e0b" /></mesh>}
      {[-0.1, 0.1].map((x) => <mesh key={x} position={[x, 0.07, 0.08]}><cylinderGeometry args={[0.05, 0.05, 0.14, 6]} /><meshStandardMaterial color={chick ? '#f59e0b' : color} /></mesh>)}
    </group>
  );
}
