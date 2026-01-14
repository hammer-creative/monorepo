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
const PARALLAX_FACTOR = 0.5; // Pupil lag (0.5 = lots of lag, 0.9 = almost none)
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

  // Convert max rotation from degrees to radians
  const MAX_ROTATION_RAD = THREE.MathUtils.degToRad(MAX_ROTATION);

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

      // Replace pupil texture with video
      if (child.name === 'Pupil_Mesh' && videoTexture) {
        child.material.map = videoTexture;
        child.material.needsUpdate = true;

        // Store reference to pupil mesh for parallax rotation
        pupilMeshRef.current = child;
        // Position pupil slightly inside the eye (negative Z moves it back)
        child.position.z = -0.15; // Adjust this value - more negative = deeper inside
        child.scale.set(1.5, 1.5, 1.5); // Try 1.1 to 1.3
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

    // Pupil parallax - pupil lags behind eyeball rotation
    if (pupilMeshRef.current) {
      // Target pupil rotation is a fraction of the eyeball rotation (creates parallax)
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
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      {helpersVisible && (
        <>
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
        </>
      )}
      <Suspense fallback={null}>
        <Model url="/model/model-v3r4.glb" />
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
