import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Hero3D() {
  const earthRef = useRef();
  const wireframeRef = useRef();

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
      earthRef.current.rotation.x += delta * 0.05;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.12;
      wireframeRef.current.rotation.x -= delta * 0.02;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={2} color="#c084fc" />
      <directionalLight position={[-5, -3, -5]} intensity={1} color="#3b82f6" />
      
      {/* Base Earth - solid but dark */}
      <Sphere ref={earthRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial 
          color="#09090b" 
          roughness={0.7} 
          metalness={0.8}
        />
      </Sphere>

      {/* Tech Wireframe Layer */}
      <Sphere ref={wireframeRef} args={[2.52, 32, 32]}>
        <meshBasicMaterial 
          color="#9333ea" 
          wireframe={true}
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer Glow / Atmosphere */}
      <Sphere args={[2.6, 64, 64]}>
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent={true}
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}
