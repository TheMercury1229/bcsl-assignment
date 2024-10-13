// App.js
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Plane } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

// Globe Component with Slow Rotation (without texture)
function Globe() {
  const globeRef = useRef();

  useFrame(() => {
    globeRef.current.rotation.y += 0.003; // Slow rotation for the globe
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="lightblue" wireframe />
    </mesh>
  );
}

// Country Flag as a Plane that orbits the globe
function CountryFlag({ texturePath, radius, angle, speed }) {
  const flagRef = useRef();
  const flagTexture = useLoader(THREE.TextureLoader, texturePath); // Load flag texture

  useFrame(() => {
    angle += speed;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    flagRef.current.position.set(x, y, 0);
    flagRef.current.rotation.y += 0.01; // Subtle rotation for the flag
  });

  return (
    <Plane args={[0.6, 0.4]} ref={flagRef}>
      <meshStandardMaterial map={flagTexture} />
    </Plane>
  );
}

export default function App() {
  // List of country flags to display (you can add more flags here)
  const flags = [
    { path: "./usa.webp", speed: 0.002 },
    { path: "./spain.webp", speed: 0.002 },
    { path: "./france.webp", speed: 0.002 },
    { path: "./india.webp", speed: 0.002 },
  ];

  return (
    <div className="canvas-container">
      <Canvas>
        {/* Add stars background for depth */}
        <Stars radius={100} depth={50} count={5000} factor={7} fade />

        {/* Basic lighting setup */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.7} />

        {/* Rotating Globe without texture */}
        <Globe />

        {/* Orbiting Country Flags */}
        {flags.map((flag, index) => (
          <CountryFlag
            key={index}
            texturePath={flag.path}
            radius={3.5} // Orbit radius
            angle={(index / flags.length) * 2 * Math.PI} // Spread flags evenly
            speed={flag.speed} // Control flag speed
          />
        ))}

        {/* Controls for user interaction */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
