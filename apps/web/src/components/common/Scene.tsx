/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/common/Scene.tsx

'use client';

import { OrbitControls, useGLTF, useVideoTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

// ==========================================
// TUNABLE PARAMETERS
// ==========================================
const MAX_ROTATION = 20; // Max rotation in degrees
const LERP_SPEED = 0.05; // Inertia speed (0.01 = slow drift, 0.1 = snappy)

// PUPIL PARALLAX PARAMETERS
const ENABLE_PUPIL_LAG = false; // Set to false to disable pupil lag
const PARALLAX_FACTOR = 0.5; // Pupil lag amount (0.5 = lots of lag, 0.9 = almost none) - only used if ENABLE_PUPIL_LAG is true

// VIDEO PUPIL PARAMETERS
const VIDEO_PUPIL_SCALE = 1.0; // Scale of the video relative to original pupil (1.0 = same size, 1.5 = 50% larger, etc.)

// EDGE GLOW PARAMETERS
const EDGE_SCALE = 1.2; // 1.01-1.2, how much bigger the glow layer is
const EDGE_GLOW_COLOR = new THREE.Color(0x88bbff); // Edge glow color
const EDGE_GLOW_INTENSITY = 2.0; // 0-5, brightness
const EDGE_GLOW_FALLOFF = 10; // 1-10, how sharp/soft the edge is (higher = softer)
const EDGE_THICKNESS = 10; // 0-1, how thick the glow band is
// ==========================================

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const { camera } = useThree();

  const videoTexture = useVideoTexture('/video/sizzle-test.mp4', {
    loop: true,
    muted: true,
    start: true,
  });

  // Refs to track rotation state
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentPupilRotation = useRef({ x: 0, y: 0 });

  // Refs for drift detection
  const lastPointer = useRef({ x: 0, y: 0 });
  const idleFrames = useRef(0);

  // Ref to the pupil mesh for separate rotation control
  const pupilMeshRef = useRef(null);

  // Store edge glow meshes
  const edgeGlowMeshes = useRef([]);

  // Convert max rotation from degrees to radians
  const MAX_ROTATION_RAD = THREE.MathUtils.degToRad(MAX_ROTATION);

  // Create edge glow material with soft falloff
  const createEdgeGlowMaterial = () => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: EDGE_GLOW_COLOR },
        intensity: { value: EDGE_GLOW_INTENSITY },
        falloff: { value: EDGE_GLOW_FALLOFF },
        thickness: { value: EDGE_THICKNESS },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        uniform float falloff;
        uniform float thickness;

        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = abs(dot(viewDir, vNormal));

          // Create soft edge glow with adjustable falloff
          float edgeFactor = 1.0 - fresnel;
          float glow = pow(edgeFactor, falloff);

          // Add thickness control - fade in/out
          glow = smoothstep(0.0, thickness, glow) * smoothstep(1.0, thickness, glow);

          vec3 finalColor = glowColor * intensity;

          gl_FragColor = vec4(finalColor, glow);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  };

  // Log everything in the model
  console.log('=== MODEL STRUCTURE ===');
  gltf.scene.traverse((child) => {
    if (child.name === 'Shadow_Catch') {
      child.visible = false;
    }

    // @ts-ignore
    if (child.isMesh) {
      console.log('Mesh:', child.name);
      console.log('  Material:', child.material?.name);
      console.log('  Has texture?', !!child.material?.map);
      if (child.material?.map) {
        console.log(
          '  Texture size:',
          child.material.map.image?.width,
          'x',
          child.material.map.image?.height,
        );
      }
      console.log('  Vertex count:', child.geometry.attributes.position.count);
      console.log('---');

      // Create edge glow layer for cornea and sclera
      if (child.name === 'Cornea_Mesh' || child.name === 'Sclera_Mesh') {
        const edgeGlowMesh = new THREE.Mesh(
          child.geometry,
          createEdgeGlowMaterial(),
        );
        edgeGlowMesh.scale.set(EDGE_SCALE, EDGE_SCALE, EDGE_SCALE);
        child.add(edgeGlowMesh);
        edgeGlowMeshes.current.push(edgeGlowMesh);
      }

      // Replace pupil texture with video
      if (child.name === 'Pupil_Mesh' && videoTexture) {
        // Clone the original material to preserve ALL its properties
        const originalMaterial = child.material.clone();
        originalMaterial.map = videoTexture;
        originalMaterial.needsUpdate = true;

        child.material = originalMaterial;

        // Apply scale to the pupil
        child.scale.set(
          VIDEO_PUPIL_SCALE,
          VIDEO_PUPIL_SCALE,
          VIDEO_PUPIL_SCALE,
        );

        pupilMeshRef.current = child;
        console.log(
          'Pupil material cloned and texture replaced with scale:',
          VIDEO_PUPIL_SCALE,
        );
        console.log('Pupil lag enabled:', ENABLE_PUPIL_LAG);
      }
    }
  });

  // Mouse tracking - update target rotation based on mouse position
  useFrame((state) => {
    // Detect if mouse has moved since last frame
    const hasMouseMoved =
      Math.abs(state.pointer.x - lastPointer.current.x) > 0.001 ||
      Math.abs(state.pointer.y - lastPointer.current.y) > 0.001;

    if (hasMouseMoved) {
      // Mouse is active - reset idle counter and update last position
      idleFrames.current = 0;
      lastPointer.current = { x: state.pointer.x, y: state.pointer.y };

      // Calculate target rotation from mouse position
      targetRotation.current.y = state.pointer.x * MAX_ROTATION_RAD;
      targetRotation.current.x = -state.pointer.y * MAX_ROTATION_RAD;
    } else {
      // Mouse hasn't moved - increment idle counter
      idleFrames.current++;

      // After 60 frames (~1 second) of no movement, start random drift
      if (idleFrames.current > 60) {
        // Smooth random drift - use current rotation as base, don't reset to center
        const time = Date.now() * 0.001;
        const driftX = Math.sin(time * 0.7) * MAX_ROTATION_RAD * 0.3;
        const driftY = Math.cos(time * 0.5) * MAX_ROTATION_RAD * 0.3;

        // Drift from current position instead of snapping
        targetRotation.current.x += (driftX - targetRotation.current.x) * 0.01;
        targetRotation.current.y += (driftY - targetRotation.current.y) * 0.01;

        // Clamp to max rotation limits
        const maxRad = MAX_ROTATION_RAD;
        targetRotation.current.x = Math.max(
          -maxRad,
          Math.min(maxRad, targetRotation.current.x),
        );
        targetRotation.current.y = Math.max(
          -maxRad,
          Math.min(maxRad, targetRotation.current.y),
        );
      }
    }

    // Smoothly interpolate current rotation toward target (creates inertia/lag)
    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * LERP_SPEED;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * LERP_SPEED;

    // Apply rotation to entire eyeball model
    if (gltf.scene) {
      gltf.scene.rotation.x = currentRotation.current.x;
      gltf.scene.rotation.y = currentRotation.current.y;
    }

    // Pupil rotation - either with lag (parallax) or locked to eyeball
    if (pupilMeshRef.current) {
      if (ENABLE_PUPIL_LAG) {
        // Pupil lags behind eyeball rotation (parallax effect)
        const targetPupilX = currentRotation.current.x * PARALLAX_FACTOR;
        const targetPupilY = currentRotation.current.y * PARALLAX_FACTOR;

        // Smoothly interpolate pupil rotation (double smoothing for extra lag)
        currentPupilRotation.current.x +=
          (targetPupilX - currentPupilRotation.current.x) * LERP_SPEED;
        currentPupilRotation.current.y +=
          (targetPupilY - currentPupilRotation.current.y) * LERP_SPEED;

        // Apply rotation to pupil mesh
        pupilMeshRef.current.rotation.x = currentPupilRotation.current.x;
        pupilMeshRef.current.rotation.y = currentPupilRotation.current.y;
      } else {
        // Pupil locked to eyeball - no separate rotation
        pupilMeshRef.current.rotation.x = 0;
        pupilMeshRef.current.rotation.y = 0;
      }
    }
  });

  return <primitive object={gltf.scene} />;
}

const SceneContent = ({
  helpersVisible,
  orbitEnabled,
}: {
  helpersVisible: boolean;
  orbitEnabled: boolean;
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      {helpersVisible && (
        <>
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
        </>
      )}
      <Suspense fallback={null}>
        <Model url="/model/model-v4.glb" />
      </Suspense>
      {/* OrbitControls only enabled when helpers are visible */}
      <OrbitControls
        enabled={orbitEnabled}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
};

export default function Scene() {
  const [helpersVisible, setHelpersVisible] = useState(false);

  return (
    <div className="model">
      <button
        onClick={() => setHelpersVisible(!helpersVisible)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: '10px 20px',
          background: helpersVisible ? '#4a4' : '#444',
          color: helpersVisible ? '#000' : '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        Helpers/Orbit: {helpersVisible ? 'ON' : 'OFF'}
      </button>

      <Canvas camera={{ position: [0, 0, 0.4], fov: 50 }}>
        <SceneContent
          helpersVisible={helpersVisible}
          orbitEnabled={helpersVisible}
        />
      </Canvas>
    </div>
  );
}
