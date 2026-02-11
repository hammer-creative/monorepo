/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/model/Scene.tsx

'use client';

import { OrbitControls, useGLTF, useVideoTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ==========================================
// TUNABLE PARAMETERS
// ==========================================
const MAX_ROTATION = 8; // Max rotation in degrees
const LERP_SPEED = 0.1; // Inertia speed (0.01 = slow drift, 0.1 = snappy)
const PARALLAX_FACTOR = 0; // Pupil lag (0.5 = lots of lag, 0.9 = almost none)

// MESH VISIBILITY
const SHOW_CORNEA = true;
const SHOW_IRIS = true;
const SHOW_PUPIL = true;
const SHOW_SCLERA = true;

// VIDEO PUPIL PARAMETERS
const ENABLE_VIDEO_PUPIL = true; // Set to false to use solid color instead of video
const PUPIL_COLOR = new THREE.Color(0xffffff); // Pupil color when video is disabled (black by default)
const PUPIL_Z_POSITION = 0; // How far back the pupil sits (more negative = deeper inside)
const PUPIL_SCALE = 1; // Pupil size (1.5 = 50% bigger)

// IRIS PARAMETERS
const ENABLE_IRIS_ROTATION = true; // Set to false to disable iris spinning
const IRIS_ROTATION_SPEED = 0.03; // Iris base spin speed (radians per second)
const IRIS_ROTATION_SPEED_ON_MOVE = 0.5; // Iris spin speed when mouse is moving (radians per second)
const IRIS_SPEED_LERP = 0.1; // How fast iris accelerates/decelerates (0.01 = slow, 0.1 = fast)
const IRIS_SATURATION = 1.3; // Iris color saturation (1.0 = normal, >1.0 = more saturated)
const IRIS_CONTRAST = 1.2; // Iris contrast (1.0 = normal, >1.0 = more contrast)

// LIGHTING PARAMETERS
const AMBIENT_LIGHT_INTENSITY = 0.5; // Overall scene brightness (0-5, try 0.5, 1.0, 1.5)
const DIRECTIONAL_LIGHT_INTENSITY = 0.5; // Directional light strength (0-2, try 0.3, 0.5, 0.8)
const DIRECTIONAL_LIGHT_POSITION = [0, 2, 5]; // Light position [x, y, z]
const TONE_MAPPING_EXPOSURE = 1.0; // Exposure control (0.5 = darker, 1.5 = brighter)
// ==========================================

function Model({ url, isPaused }: { url: string; isPaused: boolean }) {
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
  gltf.scene.traverse((child) => {
    if (child.name === 'Shadow_Catch') {
      child.visible = false;
    }

    // @ts-ignore
    if (child.isMesh) {
      // Toggle cornea visibility
      if (child.name === 'Cornea_Mesh_2') {
        child.visible = SHOW_CORNEA;
      }

      // Store reference to iris mesh for spinning
      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        child.visible = SHOW_IRIS;
        child.scale.set(1.008, 1.008, 1.0);

        // Modify material properties
        child.material.roughness = 0.9;
        child.material.metalness = 0.0;

        // Custom shader to control saturation and contrast
        child.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>

            #ifdef USE_MAP
              // Saturation adjustment
              float saturation = ${IRIS_SATURATION.toFixed(2)}; // 1.0 = normal, >1.0 = more saturated
              vec3 luminance = vec3(0.299, 0.587, 0.114);
              float gray = dot(diffuseColor.rgb, luminance);
              diffuseColor.rgb = mix(vec3(gray), diffuseColor.rgb, saturation);

              // Contrast adjustment
              float contrast = ${IRIS_CONTRAST.toFixed(2)}; // 1.0 = normal, >1.0 = more contrast
              diffuseColor.rgb = (diffuseColor.rgb - 0.5) * contrast + 0.5;
              diffuseColor.rgb = clamp(diffuseColor.rgb, 0.0, 1.0);
            #endif
            `,
          );
        };

        child.material.needsUpdate = true;
      }

      // Replace pupil texture with video or solid color
      if (child.name === 'Pupil_Mesh_2' && videoTexture) {
        child.visible = SHOW_PUPIL;

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
      }

      // Toggle sclera visibility
      if (child.name === 'Sclera_Mesh_2') {
        child.visible = SHOW_SCLERA;
      }
    }
  });

  // Mouse tracking - update target rotation based on mouse position
  useFrame((state) => {
    // Skip all rendering when paused
    if (isPaused) return;

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
  isPaused,
}: {
  helpersVisible: boolean;
  orbitEnabled: boolean;
  isPaused: boolean;
}) => {
  return (
    <>
      <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
      <directionalLight
        position={DIRECTIONAL_LIGHT_POSITION}
        intensity={DIRECTIONAL_LIGHT_INTENSITY}
      />
      <Suspense fallback={null}>
        <Model url="/model/model-v7.glb" isPaused={isPaused} />
      </Suspense>
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
  const [isPaused, setIsPaused] = useState(false);

  // Pause Three.js rendering during scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsPaused(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsPaused(false), 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="model">
      {/* <button
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
      </button> */}

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
          isPaused={isPaused}
        />
      </Canvas>
    </div>
  );
}
