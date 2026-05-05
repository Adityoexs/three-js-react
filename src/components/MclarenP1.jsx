import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MclarenP1 — Procedural 3D McLaren P1 mesh built from Three.js geometries.
 * All geometry is created programmatically; no external model files required.
 *
 * Props:
 *   bodyColor      {string}  - hex color for the car body
 *   spoilerHeight  {number}  - 0–1, animates the active rear wing
 *   headlightsOn   {boolean} - toggles headlight emissive intensity
 *   rotateCar      {boolean} - enables auto-rotation on Y axis
 */
export default function MclarenP1({
  bodyColor = '#FF4500',
  spoilerHeight = 0,
  headlightsOn = true,
  rotateCar = false,
}) {
  const groupRef = useRef();
  const spoilerRef = useRef();

  // --- Materials (memoized to avoid recreation on every render) -----------

  // Main body — glossy metallic paint (MeshPhysicalMaterial)
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(bodyColor),
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0,
      }),
    [bodyColor]
  );

  // Carbon fiber panels — dark matte composite look
  const carbonMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#111111'),
        metalness: 0.5,
        roughness: 0.4,
      }),
    []
  );

  // Glass — highly transparent, slightly tinted
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#88aacc'),
        transmission: 0.95,
        transparent: true,
        opacity: 0.3,
        roughness: 0,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Rim — gunmetal metallic
  const rimMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#444455'),
        metalness: 1,
        roughness: 0.2,
      }),
    []
  );

  // Tyre — dark rubber
  const tyreMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a1a1a'),
        roughness: 0.9,
        metalness: 0,
      }),
    []
  );

  // Headlight emissive — intensity toggles with headlightsOn prop
  const headlightMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: headlightsOn ? 2 : 0,
        metalness: 0.5,
        roughness: 0.1,
      }),
    [headlightsOn]
  );

  // Taillight emissive
  const taillightMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ff0000'),
        emissive: new THREE.Color('#ff0000'),
        emissiveIntensity: 2,
        metalness: 0.5,
        roughness: 0.1,
      }),
    []
  );

  // Brake caliper — shared orange material
  const caliperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: '#ff8800', roughness: 0.5 }),
    []
  );

  // --- Animation -----------------------------------------------------------

  useFrame((_, delta) => {
    // Auto-rotate the whole car
    if (rotateCar && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    // Animate spoiler up/down based on slider
    if (spoilerRef.current) {
      spoilerRef.current.position.y = 0.72 + spoilerHeight * 0.35;
      spoilerRef.current.rotation.x = -spoilerHeight * 0.3;
    }
  });

  // --- Wheel helper --------------------------------------------------------

  /**
   * A single wheel: Torus tyre + Cylinder rim, oriented correctly.
   * position: [x, y, z]
   */
  function Wheel({ position }) {
    return (
      <group position={position} rotation={[0, 0, Math.PI / 2]}>
        {/* Tyre */}
        <mesh material={tyreMat} castShadow>
          <torusGeometry args={[0.38, 0.13, 16, 40]} />
        </mesh>
        {/* Outer rim disc */}
        <mesh material={rimMat} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 24]} />
        </mesh>
        {/* Rim hub */}
        <mesh material={rimMat} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 12]} />
        </mesh>
        {/* Five spokes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            material={rimMat}
            rotation={[0, (i * Math.PI * 2) / 5, 0]}
            castShadow
          >
            <boxGeometry args={[0.04, 0.22, 0.04]} />
          </mesh>
        ))}
      </group>
    );
  }

  // -------------------------------------------------------------------------
  // BUILD THE CAR
  // -------------------------------------------------------------------------
  return (
    <group ref={groupRef}>

      {/* ========================
          MAIN CHASSIS / BODY
          ======================== */}

      {/* Lower chassis sill — wide, flat base */}
      <mesh material={bodyMat} position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.92, 0.18, 4.4]} />
      </mesh>

      {/* Central cabin — slightly narrower, taller */}
      <mesh material={bodyMat} position={[0, 0.48, -0.1]} castShadow>
        <boxGeometry args={[1.6, 0.32, 2.6]} />
      </mesh>

      {/* Cabin roof — arched top */}
      <mesh material={bodyMat} position={[0, 0.75, -0.15]} castShadow>
        <boxGeometry args={[1.3, 0.22, 1.8]} />
      </mesh>

      {/* Roof taper (rear slope) */}
      <mesh
        material={bodyMat}
        position={[0, 0.62, 0.62]}
        rotation={[0.38, 0, 0]}
        castShadow
      >
        <boxGeometry args={[1.28, 0.16, 1.0]} />
      </mesh>

      {/* ========================
          HOOD (front tapered)
          ======================== */}
      <mesh
        material={bodyMat}
        position={[0, 0.38, 1.7]}
        rotation={[-0.22, 0, 0]}
        castShadow
      >
        <boxGeometry args={[1.55, 0.18, 1.5]} />
      </mesh>

      {/* Front nose tip */}
      <mesh material={bodyMat} position={[0, 0.28, 2.35]} castShadow>
        <boxGeometry args={[1.2, 0.14, 0.5]} />
      </mesh>

      {/* ========================
          REAR DECK
          ======================== */}
      <mesh
        material={bodyMat}
        position={[0, 0.46, -1.85]}
        rotation={[0.15, 0, 0]}
        castShadow
      >
        <boxGeometry args={[1.55, 0.22, 1.1]} />
      </mesh>

      {/* ========================
          SIDE SKIRTS (Left & Right)
          ======================== */}
      {[-1.0, 1.0].map((side) => (
        <mesh
          key={side}
          material={carbonMat}
          position={[side, 0.2, 0]}
          castShadow
        >
          <boxGeometry args={[0.08, 0.22, 3.8]} />
        </mesh>
      ))}

      {/* ========================
          FRONT SPLITTER
          ======================== */}
      <mesh material={carbonMat} position={[0, 0.14, 2.55]} castShadow>
        <boxGeometry args={[1.7, 0.05, 0.35]} />
      </mesh>

      {/* ========================
          REAR DIFFUSER
          ======================== */}
      <mesh
        material={carbonMat}
        position={[0, 0.18, -2.38]}
        rotation={[-0.3, 0, 0]}
        castShadow
      >
        <boxGeometry args={[1.65, 0.06, 0.7]} />
      </mesh>

      {/* Diffuser fins */}
      {[-0.5, -0.16, 0.16, 0.5].map((x) => (
        <mesh
          key={x}
          material={carbonMat}
          position={[x, 0.22, -2.38]}
          rotation={[-0.3, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.04, 0.14, 0.7]} />
        </mesh>
      ))}

      {/* ========================
          ACTIVE REAR WING / SPOILER
          ======================== */}
      <group ref={spoilerRef} position={[0, 0.72, -1.85]}>
        {/* Wing blade */}
        <mesh material={carbonMat} castShadow>
          <boxGeometry args={[1.55, 0.07, 0.42]} />
        </mesh>
        {/* Wing end plates */}
        {[-0.78, 0.78].map((side) => (
          <mesh key={side} material={carbonMat} position={[side, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.22, 0.42]} />
          </mesh>
        ))}
        {/* Wing pylons */}
        {[-0.38, 0.38].map((x) => (
          <mesh key={x} material={carbonMat} position={[x, -0.16, 0.1]} castShadow>
            <boxGeometry args={[0.06, 0.32, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* ========================
          ROOF INTAKE SCOOP
          ======================== */}
      <mesh material={carbonMat} position={[0, 0.9, -0.3]} castShadow>
        <boxGeometry args={[0.45, 0.14, 0.55]} />
      </mesh>
      <mesh material={carbonMat} position={[0, 0.84, -0.62]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.14, 12]} />
      </mesh>

      {/* ========================
          WINDSHIELD & WINDOWS
          ======================== */}

      {/* Front windshield */}
      <mesh
        material={glassMat}
        position={[0, 0.74, 0.72]}
        rotation={[-0.72, 0, 0]}
        castShadow
      >
        <planeGeometry args={[1.18, 0.68]} />
      </mesh>

      {/* Rear window */}
      <mesh
        material={glassMat}
        position={[0, 0.71, -0.9]}
        rotation={[0.72, 0, 0]}
        castShadow
      >
        <planeGeometry args={[1.0, 0.48]} />
      </mesh>

      {/* Left & right side windows */}
      {[
        { x: -0.81, rz: Math.PI / 2 + 0.12, z: -0.18 },
        { x: 0.81, rz: -Math.PI / 2 - 0.12, z: -0.18 },
      ].map(({ x, rz, z }) => (
        <mesh
          key={x}
          material={glassMat}
          position={[x, 0.72, z]}
          rotation={[0.06, 0, rz]}
          castShadow
        >
          <planeGeometry args={[1.0, 0.42]} />
        </mesh>
      ))}

      {/* ========================
          HEADLIGHTS (front pair)
          ======================== */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} material={headlightMat} position={[x, 0.32, 2.58]} castShadow>
          <boxGeometry args={[0.32, 0.1, 0.06]} />
        </mesh>
      ))}

      {/* Headlight DRL strip */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x + 10} material={headlightMat} position={[x, 0.38, 2.56]} castShadow>
          <boxGeometry args={[0.28, 0.04, 0.05]} />
        </mesh>
      ))}

      {/* ========================
          TAILLIGHTS (rear pair)
          ======================== */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} material={taillightMat} position={[x, 0.36, -2.38]} castShadow>
          <boxGeometry args={[0.34, 0.1, 0.06]} />
        </mesh>
      ))}

      {/* Taillight strip */}
      <mesh material={taillightMat} position={[0, 0.4, -2.38]} castShadow>
        <boxGeometry args={[1.1, 0.04, 0.05]} />
      </mesh>

      {/* ========================
          DOOR MIRRORS
          ======================== */}
      {[-0.98, 0.98].map((x) => (
        <mesh key={x} material={carbonMat} position={[x, 0.64, 0.78]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.28]} />
        </mesh>
      ))}
      {[-0.98, 0.98].map((x) => (
        <mesh key={x + 20} material={carbonMat} position={[x, 0.62, 0.66]} castShadow>
          <boxGeometry args={[0.22, 0.05, 0.12]} />
        </mesh>
      ))}

      {/* ========================
          WHEELS (four corners)
          Front: z positive, Rear: z negative
          ======================== */}
      {/* Front-left */}
      <Wheel position={[-1.05, 0.38, 1.42]} />
      {/* Front-right */}
      <Wheel position={[1.05, 0.38, 1.42]} />
      {/* Rear-left */}
      <Wheel position={[-1.05, 0.38, -1.38]} />
      {/* Rear-right */}
      <Wheel position={[1.05, 0.38, -1.38]} />

      {/* ========================
          BRAKE CALIPERS
          ======================== */}
      {[
        [-1.06, 0.38, 1.42],
        [1.06, 0.38, 1.42],
        [-1.06, 0.38, -1.38],
        [1.06, 0.38, -1.38],
      ].map(([cx, cy, cz], i) => (
        <mesh
          key={i}
          material={caliperMat}
          position={[cx, cy, cz]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.1, 0.14]} />
        </mesh>
      ))}

    </group>
  );
}
