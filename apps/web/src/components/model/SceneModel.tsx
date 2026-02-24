/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/model/SceneModel.tsx

'use client';

import { useGLTF, useVideoTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

import * as C from './sceneConstants';
import ScenePlayButton from './ScenePlayButton';

const {
  MAX_ROTATION,
  LERP_SPEED,
  PARALLAX_FACTOR,
  SHOW_CORNEA,
  SHOW_IRIS,
  SHOW_PUPIL,
  SHOW_SCLERA,
  ENABLE_VIDEO_PUPIL,
  PUPIL_COLOR,
  PUPIL_Z_POSITION,
  PUPIL_SCALE,
  ENABLE_IRIS_ROTATION,
  IRIS_ROTATION_SPEED,
  IRIS_ROTATION_SPEED_ON_MOVE,
  IRIS_SPEED_LERP,
  IRIS_SATURATION,
  IRIS_CONTRAST,
  ENABLE_CONSOLE_LOGS,
} = C;

const log = (...args) => {
  if (ENABLE_CONSOLE_LOGS) console.log(...args);
};

export default function SceneModel({ url, isPaused, onPlayClick }) {
  const gltf = useGLTF(url);
  const { camera } = useThree();

  const videoTexture = useVideoTexture('/video/Hammer_EyeballReel_1x1.mp4', {
    loop: true,
    muted: true,
    start: true,
  });

  videoTexture.flipY = false;

  const [isPlaying, setIsPlaying] = useState(true);
  const handleTogglePlay = () => {
    const video = videoTexture?.image;
    if (!video) return;
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  const groupRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentPupilRotation = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  const idleFrames = useRef(0);
  const pupilMeshRef = useRef(null);
  const irisMeshRef = useRef(null);
  const currentIrisSpeed = useRef(IRIS_ROTATION_SPEED);
  const irisRotationAccumulator = useRef(0);
  const lastTime = useRef(0);

  const MAX_ROTATION_RAD = THREE.MathUtils.degToRad(MAX_ROTATION);

  gltf.scene.traverse((child) => {
    if (child.isLight) {
      log('LIGHT FOUND:', child.type, child);
      child.visible = false;
    }

    if (child.isMesh) {
      log('Mesh name:', child.name);
      log('Material type:', child.material.type);
      log('Material:', child.material);
      log('---');
    }

    if (child.isMesh) {
      if (child.name === 'Cornea_Mesh_2') {
        child.visible = SHOW_CORNEA;
      }

      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        child.visible = SHOW_IRIS;
        child.scale.set(1.008, 1.008, 1.0);
        child.material.roughness = 0.9;
        child.material.metalness = 0.0;

        child.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>

            #ifdef USE_MAP
              float saturation = ${IRIS_SATURATION.toFixed(2)};
              vec3 luminance = vec3(0.299, 0.587, 0.114);
              float gray = dot(diffuseColor.rgb, luminance);
              diffuseColor.rgb = mix(vec3(gray), diffuseColor.rgb, saturation);

              float contrast = ${IRIS_CONTRAST.toFixed(2)};
              diffuseColor.rgb = (diffuseColor.rgb - 0.5) * contrast + 0.5;
              diffuseColor.rgb = clamp(diffuseColor.rgb, 0.0, 1.0);
            #endif
            `,
          );
        };

        child.material.needsUpdate = true;
      }

      if (child.name === 'Pupil_Mesh_2' && videoTexture) {
        child.visible = SHOW_PUPIL;

        if (ENABLE_VIDEO_PUPIL) {
          child.material.map = videoTexture;
        } else {
          child.material.map = null;
          child.material.color = PUPIL_COLOR;
        }
        child.material.needsUpdate = true;

        pupilMeshRef.current = child;
        child.position.z = PUPIL_Z_POSITION;
        child.scale.set(PUPIL_SCALE, PUPIL_SCALE, PUPIL_SCALE);
      }

      if (child.name === 'Sclera_Mesh_2') {
        child.visible = SHOW_SCLERA;
      }
    }
  });

  useFrame((state) => {
    if (isPaused) return;

    const currentTime = state.clock.elapsedTime;
    const deltaTime =
      lastTime.current === 0 ? 0 : currentTime - lastTime.current;
    lastTime.current = currentTime;

    const hasMouseMoved =
      Math.abs(state.pointer.x - lastPointer.current.x) > 0.001 ||
      Math.abs(state.pointer.y - lastPointer.current.y) > 0.001;

    if (hasMouseMoved) {
      idleFrames.current = 0;
      lastPointer.current = { x: state.pointer.x, y: state.pointer.y };
      targetRotation.current.y = state.pointer.x * MAX_ROTATION_RAD;
      targetRotation.current.x = -state.pointer.y * MAX_ROTATION_RAD;
    } else {
      idleFrames.current++;

      if (idleFrames.current > 60) {
        const time = Date.now() * 0.001;
        const driftX = Math.sin(time * 0.7) * MAX_ROTATION_RAD * 0.3;
        const driftY = Math.cos(time * 0.5) * MAX_ROTATION_RAD * 0.3;

        targetRotation.current.x += (driftX - targetRotation.current.x) * 0.01;
        targetRotation.current.y += (driftY - targetRotation.current.y) * 0.01;

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

    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * LERP_SPEED;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * LERP_SPEED;

    if (groupRef.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;
    }

    if (ENABLE_IRIS_ROTATION && irisMeshRef.current && deltaTime > 0) {
      const targetSpeed = hasMouseMoved
        ? IRIS_ROTATION_SPEED_ON_MOVE
        : IRIS_ROTATION_SPEED;
      currentIrisSpeed.current +=
        (targetSpeed - currentIrisSpeed.current) * IRIS_SPEED_LERP;
      irisRotationAccumulator.current += currentIrisSpeed.current * deltaTime;
      irisMeshRef.current.rotation.z = irisRotationAccumulator.current;
    }

    if (pupilMeshRef.current) {
      const targetPupilX = currentRotation.current.x * PARALLAX_FACTOR;
      const targetPupilY = currentRotation.current.y * PARALLAX_FACTOR;

      currentPupilRotation.current.x +=
        (targetPupilX - currentPupilRotation.current.x) * LERP_SPEED;
      currentPupilRotation.current.y +=
        (targetPupilY - currentPupilRotation.current.y) * LERP_SPEED;

      pupilMeshRef.current.rotation.x = currentPupilRotation.current.x;
      pupilMeshRef.current.rotation.y = currentPupilRotation.current.y;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
      <ScenePlayButton onClick={() => onPlayClick?.()} isPlaying={isPlaying} />
    </group>
  );
}
