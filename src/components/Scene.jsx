import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  MeshReflectorMaterial,
  SpotLight,
  PerspectiveCamera,
} from '@react-three/drei';
import MclarenP1 from './MclarenP1';
import { useCarControls } from './Controls';

/**
 * ReflectiveFloor — a large ground plane with mirror-like material.
 */
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.6}
      />
    </mesh>
  );
}

/**
 * Lighting — dramatic studio-style lights with rim and key lights.
 */
function Lighting({ headlightsOn }) {
  return (
    <>
      {/* Ambient — very low so shadows are dramatic */}
      <ambientLight intensity={0.15} />

      {/* Key SpotLight — above-front */}
      <SpotLight
        position={[3, 6, 5]}
        angle={0.35}
        penumbra={0.5}
        intensity={120}
        distance={20}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff8f0"
      />

      {/* Fill SpotLight — above-rear */}
      <SpotLight
        position={[-2, 5, -6]}
        angle={0.4}
        penumbra={0.6}
        intensity={80}
        distance={18}
        castShadow
        color="#f0f4ff"
      />

      {/* Rim PointLight — left side */}
      <pointLight position={[-4, 2, 0]} intensity={30} color="#ff6622" distance={12} />

      {/* Rim PointLight — right side */}
      <pointLight position={[4, 2, 0]} intensity={20} color="#4488ff" distance={12} />

      {/* Headlight fill — only active when headlights are on */}
      {headlightsOn && (
        <pointLight position={[0, 0.5, 3.5]} intensity={15} color="#ffffff" distance={8} />
      )}
    </>
  );
}

/**
 * CarScene — the main scene composition rendered inside the Canvas.
 */
function CarScene() {
  const { bodyColor, spoilerHeight, headlightsOn, rotateCar, environment } =
    useCarControls();

  return (
    <>
      {/* Camera positioned at a dramatic 45° angle, slightly elevated */}
      <PerspectiveCamera makeDefault fov={45} position={[4.5, 2.2, 6]} />

      {/* Orbit controls — damping for smooth interaction */}
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={3}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 0.4, 0]}
      />

      {/* Environment HDR preset */}
      <Environment preset={environment} background={false} />

      {/* Lighting rig */}
      <Lighting headlightsOn={headlightsOn} />

      {/* The McLaren P1 car */}
      <MclarenP1
        bodyColor={bodyColor}
        spoilerHeight={spoilerHeight}
        headlightsOn={headlightsOn}
        rotateCar={rotateCar}
      />

      {/* Reflective ground plane */}
      <ReflectiveFloor />
    </>
  );
}

/**
 * Scene — root component that sets up the R3F Canvas.
 */
export default function Scene() {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}
      shadows
      gl={{ antialias: true, toneMapping: 2 /* ACESFilmicToneMapping */ }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <CarScene />
      </Suspense>
    </Canvas>
  );
}
