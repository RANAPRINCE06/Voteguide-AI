"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function AnimatedGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#1e40af"
          attach="material"
          distort={0.25}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </mesh>
  );
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.z += 0.004; });
  return (
    <mesh ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[2.4, 0.04, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.6} />
    </mesh>
  );
}

function Ring2() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.x += 0.003; });
  return (
    <mesh ref={ref} rotation={[0, Math.PI / 4, Math.PI / 6]}>
      <torusGeometry args={[2.8, 0.02, 16, 100]} />
      <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.4} />
    </mesh>
  );
}

export default function GlobeHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a78bfa" />
      <Stars radius={80} depth={50} count={3000} factor={4} fade speed={1} />
      <AnimatedGlobe />
      <Ring />
      <Ring2 />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
