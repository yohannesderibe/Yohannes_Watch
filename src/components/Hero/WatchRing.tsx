import { useRef, useMemo, RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';
import { Watch } from '../../types';
import { THEMES } from '../../data/themes';

interface WatchRingProps {
  watches: Watch[];
  targetRotation: number;
  activeIndex: number;
}

const STRAP_COLOR = '#1a1a1e';

// A stylized 3D watch: case, bezel, dial, hour markers, hands, crown, strap
function WatchModel({
  watch,
  isActive,
}: {
  watch: Watch;
  isActive: boolean;
}) {
  const theme = THEMES[watch.theme];
  const caseColor = isActive ? watch.colorway : '#3a3a42';
  const caseRadius = 0.34;
  const caseDepth = 0.12;

  const markers = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const isCardinal = i % 3 === 0;
        return {
          x: Math.sin(a) * (caseRadius - 0.055),
          y: Math.cos(a) * (caseRadius - 0.055),
          size: isCardinal ? 0.026 : 0.014,
        };
      }),
    []
  );

  return (
    <group>
      {/* Strap — top segment */}
      <mesh position={[0, caseRadius + 0.22, -0.01]}>
        <boxGeometry args={[0.22, 0.46, 0.06]} />
        <meshStandardMaterial color={STRAP_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Strap — bottom segment */}
      <mesh position={[0, -(caseRadius + 0.22), -0.01]}>
        <boxGeometry args={[0.22, 0.46, 0.06]} />
        <meshStandardMaterial color={STRAP_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Lugs */}
      {[1, -1].map((sy) =>
        [1, -1].map((sx) => (
          <mesh
            key={`${sx}-${sy}`}
            position={[sx * 0.12, sy * (caseRadius - 0.03), -0.01]}
          >
            <boxGeometry args={[0.08, 0.1, 0.05]} />
            <meshStandardMaterial color={caseColor} metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Case body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[caseRadius, caseRadius, caseDepth, 48]} />
        <meshStandardMaterial
          color={caseColor}
          metalness={0.9}
          roughness={0.22}
          emissive={isActive ? watch.colorway : '#000'}
          emissiveIntensity={isActive ? 0.25 : 0}
        />
      </mesh>

      {/* Crown */}
      <mesh position={[caseRadius + 0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 0.07, 16]} />
        <meshStandardMaterial color={caseColor} metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Bezel ring */}
      <Torus args={[caseRadius - 0.015, 0.02, 16, 48]} position={[0, 0, caseDepth / 2 + 0.005]}>
        <meshStandardMaterial
          color={isActive ? theme.accent : '#55555c'}
          metalness={0.7}
          roughness={0.3}
          emissive={isActive ? theme.accent : '#000'}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </Torus>

      {/* Dial face */}
      <mesh position={[0, 0, caseDepth / 2 + 0.015]}>
        <circleGeometry args={[caseRadius - 0.06, 48]} />
        <meshStandardMaterial
          color="#050508"
          emissive={theme.accent}
          emissiveIntensity={isActive ? 0.55 : 0.1}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      {/* Hour markers */}
      {markers.map((m, i) => (
        <mesh key={i} position={[m.x, m.y, caseDepth / 2 + 0.022]}>
          <circleGeometry args={[m.size, 12]} />
          <meshStandardMaterial
            color={isActive ? theme.accent : '#888'}
            emissive={isActive ? theme.accent : '#000'}
            emissiveIntensity={isActive ? 0.6 : 0}
          />
        </mesh>
      ))}

      {/* Hands — fixed at a classic ~10:10 angle */}
      <mesh position={[0, 0, caseDepth / 2 + 0.028]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.018, caseRadius * 0.5, 0.008]} />
        <meshStandardMaterial color="#eaeaea" />
      </mesh>
      <mesh position={[0, 0, caseDepth / 2 + 0.03]} rotation={[0, 0, 2.1]}>
        <boxGeometry args={[0.014, caseRadius * 0.72, 0.008]} />
        <meshStandardMaterial color="#eaeaea" />
      </mesh>
      {/* Center pin */}
      <mesh position={[0, 0, caseDepth / 2 + 0.032]}>
        <circleGeometry args={[0.018, 16]} />
        <meshStandardMaterial color={isActive ? theme.accent : '#aaa'} />
      </mesh>

      {isActive && (
        <pointLight color={watch.colorway} intensity={2.4} distance={2.5} position={[0, 0, 0.6]} />
      )}
    </group>
  );
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// A single watch node placed around a half-circle arc that hugs the left edge.
// The arc lives in the X-Y (screen-facing) plane; the parent wheel spins around Z,
// so pressing "next" reads as a clockwise sweep. Nodes on the far side of the arc
// (more than ~90° from the front-facing point) fade out, which is what keeps the
// wheel reading as a half-circle instead of a full one.
function WatchNode({
  watch,
  angle,
  radius,
  isActive,
  wheelGroupRef,
}: {
  watch: Watch;
  angle: number;
  radius: number;
  isActive: boolean;
  wheelGroupRef: RefObject<THREE.Group>;
}) {
  const group = useRef<THREE.Group>(null);

  // Fixed local position on the arc — the parent group's Z rotation carries it around.
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  useFrame((state) => {
    if (!group.current || !wheelGroupRef.current) return;
    const rotZ = wheelGroupRef.current.rotation.z;
    const cosVal = Math.cos(angle + rotZ);
    const fade = smoothstep(-0.12, 0.18, cosVal);

    group.current.visible = fade > 0.01;

    const t = state.clock.getElapsedTime();
    // gentle depth sway (arc plane is X-Y, so sway lives on Z)
    group.current.position.z = Math.sin(t * 0.6 + angle) * 0.04;

    const baseScale = isActive ? 1.25 : 0.72;
    const targetScale = baseScale * (0.55 + 0.45 * fade);
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  return (
    <group ref={group} position={[x, y, 0]}>
      <WatchModel watch={watch} isActive={isActive} />
    </group>
  );
}

export default function WatchRing({ watches, targetRotation, activeIndex }: WatchRingProps) {
  const wheelGroup = useRef<THREE.Group>(null);
  const radius = 1.9;
  // Push the wheel's center off to the left so only its right-facing half
  // (a half-circle) reads as visible/prominent within the frame.
  const edgeOffset = -radius * 0.92;

  useFrame(() => {
    if (!wheelGroup.current) return;
    wheelGroup.current.rotation.z = THREE.MathUtils.lerp(
      wheelGroup.current.rotation.z,
      targetRotation,
      0.08
    );
  });

  const positions = useMemo(
    () => watches.map((_, i) => (i / watches.length) * Math.PI * 2),
    [watches]
  );

  return (
    <group>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />
      <directionalLight position={[-3, -2, 3]} intensity={0.3} />

      <group ref={wheelGroup} position={[edgeOffset, 0, 0]}>
        {/* Half-circle guide track, aligned to the visible right-facing arc */}
        <Torus args={[radius, 0.008, 8, 96, Math.PI]} rotation={[0, 0, -Math.PI / 2]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </Torus>
        {watches.map((watch, i) => (
          <WatchNode
            key={watch.id}
            watch={watch}
            angle={positions[i]}
            radius={radius}
            isActive={i === activeIndex}
            wheelGroupRef={wheelGroup}
          />
        ))}
      </group>
    </group>
  );
}
