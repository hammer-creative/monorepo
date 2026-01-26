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
const MAX_ROTATION = 10; // Max rotation in degrees
const LERP_SPEED = 0.05; // Inertia speed (0.01 = slow drift, 0.1 = snappy)
const PARALLAX_FACTOR = 0.5; // Pupil lag (0.5 = lots of lag, 0.9 = almost none)

// VIDEO PUPIL PARAMETERS
const ENABLE_VIDEO_PUPIL = true; // Set to false to use solid color instead of video
const PUPIL_COLOR = new THREE.Color(0xffffff); // Pupil color when video is disabled (black by default)
const PUPIL_Z_POSITION = -0.15; // How far back the pupil sits (more negative = deeper inside)
const PUPIL_SCALE = 1.5; // Pupil size (1.5 = 50% bigger)

// IRIS PARAMETERS
const ENABLE_IRIS_ROTATION = true; // Set to false to disable iris spinning
const IRIS_ROTATION_SPEED = 0.05; // Iris base spin speed (radians per second)
const IRIS_ROTATION_SPEED_ON_MOVE = 0.75; // Iris spin speed when mouse is moving (radians per second)
const IRIS_SPEED_LERP = 0.05; // How fast iris accelerates/decelerates (0.01 = slow, 0.1 = fast)

// LIGHTING PARAMETERS
const AMBIENT_LIGHT_INTENSITY = 1.0; // Overall scene brightness (0-5, try 0.5, 1.0, 1.5)
const DIRECTIONAL_LIGHT_INTENSITY = 0.5; // Directional light strength (0-2, try 0.3, 0.5, 0.8)
const DIRECTIONAL_LIGHT_POSITION = [0, 2, 5]; // Light position [x, y, z]
const TONE_MAPPING_EXPOSURE = 1.0; // Exposure control (0.5 = darker, 1.5 = brighter)
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

  // Refs to meshes
  const pupilMeshRef = useRef(null);
  const irisMeshRef = useRef(null);

  // Ref for iris rotation speed and accumulated rotation
  const currentIrisSpeed = useRef(IRIS_ROTATION_SPEED);
  const irisRotationAccumulator = useRef(0);
  const lastTime = useRef(0);

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
      console.log('  Material type:', child.material?.type);
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

      // Store reference to iris mesh for spinning
      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        console.log('>>> Iris mesh FOUND and stored:', child.name);
      }

      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        child.scale.set(1.01, 1.01, 1.0); // Scale iris 5% bigger to close gap
        console.log('>>> Iris mesh FOUND and stored:', child.name);
      }

      // Store reference to iris mesh for spinning
      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        child.scale.set(1.008, 1.008, 1.0);

        // Modify material properties
        child.material.roughness = 0.9; // Make it glossier (0 = shiny, 1 = matte)
        child.material.metalness = 0.0; // Keep non-metallic

        // The only way to actually boost saturation is emissive, but we already know
        // that won't work with the shared texture

        console.log('>>> Iris mesh FOUND and stored:', child.name);
      }

      // Replace pupil texture with video or solid color
      if (child.name === 'Pupil_Mesh_2' && videoTexture) {
        if (ENABLE_VIDEO_PUPIL) {
          child.material.map = videoTexture;
        } else {
          child.material.map = null;
          child.material.color = PUPIL_COLOR;
        }
        child.material.needsUpdate = true;

        // Store reference to pupil mesh for parallax rotation
        pupilMeshRef.current = child;
        // Position pupil behind the sclera opening
        child.position.z = PUPIL_Z_POSITION;
        child.scale.set(PUPIL_SCALE, PUPIL_SCALE, PUPIL_SCALE);

        console.log('Video pupil enabled:', ENABLE_VIDEO_PUPIL);
        console.log('Pupil Z position:', PUPIL_Z_POSITION);
        console.log('Pupil scale:', PUPIL_SCALE);
        if (!ENABLE_VIDEO_PUPIL) {
          console.log('Pupil color:', PUPIL_COLOR);
        }
      }
    }
  });

  // Mouse tracking - update target rotation based on mouse position
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime;
    const deltaTime =
      lastTime.current === 0 ? 0 : currentTime - lastTime.current;
    lastTime.current = currentTime;

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

    // Iris spin - speed up when mouse moves
    if (ENABLE_IRIS_ROTATION && irisMeshRef.current && deltaTime > 0) {
      // Target speed based on mouse movement
      const targetSpeed = hasMouseMoved
        ? IRIS_ROTATION_SPEED_ON_MOVE
        : IRIS_ROTATION_SPEED;

      // Smoothly interpolate speed (acceleration/deceleration)
      currentIrisSpeed.current +=
        (targetSpeed - currentIrisSpeed.current) * IRIS_SPEED_LERP;

      // Accumulate rotation
      irisRotationAccumulator.current += currentIrisSpeed.current * deltaTime;
      irisMeshRef.current.rotation.z = irisRotationAccumulator.current;
    }

    // Pupil parallax - pupil lags behind eyeball rotation
    if (pupilMeshRef.current) {
      // Target pupil rotation is a fraction of the eyeball rotation (creates parallax)
      const targetPupilX = currentRotation.current.x * PARALLAX_FACTOR;
      const targetPupilY = currentRotation.current.y * PARALLAX_FACTOR;

      // Smoothly interpolate pupil rotation
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
      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
      <directionalLight
        position={DIRECTIONAL_LIGHT_POSITION}
        intensity={DIRECTIONAL_LIGHT_INTENSITY}
      />
      {/* {helpersVisible && (
        <>
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
        </>
      )} */}
      <Suspense fallback={null}>
        <Model url="/model/model-v5.glb" />
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

      <Canvas
        camera={{ position: [0, 0, 0.4], fov: 50 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: TONE_MAPPING_EXPOSURE,
        }}
      >
        <SceneContent
          helpersVisible={helpersVisible}
          orbitEnabled={helpersVisible}
        />
      </Canvas>
    </div>
  );
}
