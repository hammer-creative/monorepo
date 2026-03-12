/* eslint-disable */
// @ts-nocheck

'use client';

import { useGLTF, useTexture, useVideoTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { VIDEO_SOURCE } from './sceneConstants';
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
  PUPIL_CONVEXITY,
  ENABLE_IRIS_ROTATION,
  IRIS_ROTATION_SPEED,
  IRIS_ROTATION_SPEED_ON_MOVE,
  IRIS_SPEED_LERP,
  IRIS_SATURATION,
  IRIS_CONTRAST,
  IRIS_EDGE_FADE_START,
  IRIS_EDGE_FADE_END,
  IRIS_EDGE_COLOR_R,
  IRIS_EDGE_COLOR_G,
  IRIS_EDGE_COLOR_B,
  ENABLE_CONSOLE_LOGS,
  SCLERA_INNER_FADE_START,
  SCLERA_INNER_FADE_END,
  EYE_LIGHTS,
  EYE_LERP_SPEED,
  INERTIA_FACTOR,
  DRIFT_SPEED,
  DRIFT_AMPLITUDE,
} = C;

const log = (...args) => {
  if (ENABLE_CONSOLE_LOGS) console.log(...args);
};

// ─── SceneModel ───
export default function SceneModel({ url, isPaused, onPlayClick }) {
  const gltf = useGLTF(url);
  const { camera } = useThree();

  const videoTexture = useVideoTexture(`/video/${VIDEO_SOURCE}`, {
    loop: true,
    muted: true,
    start: true,
  });
  videoTexture.flipY = false;

  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  const handleTogglePlay = () => {
    const video = videoTexture?.image;
    if (!video) return;
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  const groupRef = useRef();
  const corneaGroupRef = useRef();
  const scleraMeshRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const currentPupilRotation = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  const idleFrames = useRef(0);
  const pupilMeshRef = useRef(null);
  const irisMeshRef = useRef(null);
  const corneaMeshRef = useRef(null);
  const currentIrisSpeed = useRef(IRIS_ROTATION_SPEED);
  const irisRotationAccumulator = useRef(0);
  const lastTime = useRef(0);

  const MAX_ROTATION_RAD = THREE.MathUtils.degToRad(MAX_ROTATION);

  // ─── Scene setup ───
  useEffect(() => {
    // ── Material setup ───
    gltf.scene.traverse((child) => {
      if (child.isLight) child.visible = false;
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.name === 'Cornea_V5') {
        corneaMeshRef.current = child;
        child.visible = SHOW_CORNEA;
        child.material = new THREE.MeshPhysicalMaterial({
          transparent: true,
          roughness: 0,
          metalness: 0,
          clearcoat: 0,
          clearcoatRoughness: 0,
          transmission: 1.0,
          depthWrite: false,
        });
      }

      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        child.visible = SHOW_IRIS;
        child.scale.set(1, 1, 1);
        child.material = child.material.clone();
        child.material.roughness = 1;
        child.material.metalness = 0.0;
        child.material.envMapIntensity = 0;
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

      if (child.name === 'Pupil_V5') {
        child.visible = SHOW_PUPIL;
        if (ENABLE_VIDEO_PUPIL && videoTexture) {
          child.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: false,
          });
        } else {
          child.material = new THREE.MeshBasicMaterial({
            color: PUPIL_COLOR,
          });
        }

        child.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            #ifdef USE_MAP
              vec2 centered = vMapUv - vec2(0.5);
              float edgeDist = length(centered) * 2.0;
              float edgeFade = 1.0 - smoothstep(${IRIS_EDGE_FADE_START.toFixed(2)}, ${IRIS_EDGE_FADE_END.toFixed(2)}, edgeDist);
              diffuseColor.rgb = mix(
                vec3(${IRIS_EDGE_COLOR_R.toFixed(2)}, ${IRIS_EDGE_COLOR_G.toFixed(2)}, ${IRIS_EDGE_COLOR_B.toFixed(2)}),
                diffuseColor.rgb,
                edgeFade
              );
            #endif
            `,
          );
        };

        child.material.needsUpdate = true;
        pupilMeshRef.current = child;
        child.position.z = PUPIL_Z_POSITION;
        child.scale.set(1.2, 1.2, 1);

        if (PUPIL_CONVEXITY > 0) {
          const pos = child.geometry.attributes.position;
          const center = new THREE.Vector3();

          for (let i = 0; i < pos.count; i++) {
            center.x += pos.getX(i);
            center.y += pos.getY(i);
          }
          center.x /= pos.count;
          center.y /= pos.count;

          let maxDist = 0;
          for (let i = 0; i < pos.count; i++) {
            const dx = pos.getX(i) - center.x;
            const dy = pos.getY(i) - center.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > maxDist) maxDist = dist;
          }

          for (let i = 0; i < pos.count; i++) {
            const dx = pos.getX(i) - center.x;
            const dy = pos.getY(i) - center.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const normalized = 1 - dist / maxDist;
            const bulge = normalized * normalized * PUPIL_CONVEXITY;
            pos.setZ(i, pos.getZ(i) + bulge);
          }

          pos.needsUpdate = true;
          child.geometry.computeVertexNormals();
        }
      }

      if (child.name === 'ComtactLens_V6') {
        child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      }

      if (child.name === 'Sclera_V5') {
        scleraMeshRef.current = child;
        child.visible = SHOW_SCLERA;
        child.material = child.material.clone();
        child.material.roughness = 0.1;
        child.material.metalness = 0.0;
        child.material.envMapIntensity = 1.0;
        child.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
      #include <map_fragment>
      #ifdef USE_MAP
        vec2 scleraCentered = vMapUv - vec2(0.5);
        float scleraDist = length(scleraCentered);
        float scleraFade = smoothstep(${SCLERA_INNER_FADE_START.toFixed(2)}, ${SCLERA_INNER_FADE_END.toFixed(2)}, scleraDist);
        diffuseColor.rgb *= scleraFade;
      #endif
      `,
          );
        };
        child.material.needsUpdate = true;
      }
    });

    setSceneReady(true);

    if (ENABLE_CONSOLE_LOGS) {
      console.log('=== SCENE REPORT ===');

      console.log('--- Scene Graph ---');
      gltf.scene.traverse((child) => {
        console.log(
          child.type,
          '|',
          child.name,
          '|',
          child.material?.name ?? 'no mat',
        );
      });

      console.log('--- Mesh Details ---');
      gltf.scene.traverse((child) => {
        if (!child.isMesh) return;
        const box = new THREE.Box3().setFromObject(child);
        const uvs = child.geometry.attributes.uv;
        let uvRange = 'no UVs';
        if (uvs) {
          let minU = Infinity,
            maxU = -Infinity,
            minV = Infinity,
            maxV = -Infinity;
          for (let i = 0; i < uvs.count; i++) {
            const u = uvs.getX(i),
              v = uvs.getY(i);
            if (u < minU) minU = u;
            if (u > maxU) maxU = u;
            if (v < minV) minV = v;
            if (v > maxV) maxV = v;
          }
          uvRange = `U ${minU.toFixed(3)}→${maxU.toFixed(3)} V ${minV.toFixed(3)}→${maxV.toFixed(3)}`;
        }
        console.log(
          [
            `MESH: ${child.name}`,
            `mat: ${child.material.name || '(unnamed)'}`,
            `type: ${child.material.type}`,
            `map: ${child.material.map?.uuid.slice(0, 8) ?? 'none'}`,
            `UV: ${uvRange}`,
            `verts: ${child.geometry.attributes.position.count}`,
            `bbox z: ${box.min.z.toFixed(4)}→${box.max.z.toFixed(4)}`,
            `visible: ${child.visible}`,
          ].join(' | '),
        );
      });

      if (corneaMeshRef.current && scleraMeshRef.current) {
        const corneaBox = new THREE.Box3().setFromObject(corneaMeshRef.current);
        const scleraBox = new THREE.Box3().setFromObject(scleraMeshRef.current);
        const corneaSize = new THREE.Vector3();
        corneaBox.getSize(corneaSize);
        console.log('--- Cornea Analysis ---');
        console.log(
          'cornea z range:',
          corneaBox.min.z.toFixed(4),
          '→',
          corneaBox.max.z.toFixed(4),
        );
        console.log(
          'sclera z range:',
          scleraBox.min.z.toFixed(4),
          '→',
          scleraBox.max.z.toFixed(4),
        );
        console.log(
          'cornea is full sphere (z symmetric):',
          Math.abs(corneaBox.min.z + corneaBox.max.z) < 0.01,
        );
        console.log(
          'cornea wraps entire model:',
          corneaBox.min.z < scleraBox.min.z &&
            corneaBox.max.z > scleraBox.max.z,
        );
        console.log(
          'cornea extends behind sclera by:',
          (scleraBox.min.z - corneaBox.min.z).toFixed(4),
        );
        console.log(
          'cornea extends in front of sclera by:',
          (corneaBox.max.z - scleraBox.max.z).toFixed(4),
        );
      }

      console.log('===================');
    }
  }, [gltf]);

  // ─── Frame loop ───
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
      const time = state.clock.elapsedTime;
      const driftX =
        Math.sin(time * 0.41) *
        Math.sin(time * 0.17) *
        MAX_ROTATION_RAD *
        DRIFT_AMPLITUDE;
      const driftY =
        Math.sin(time * 0.37) *
        Math.sin(time * 0.23) *
        MAX_ROTATION_RAD *
        DRIFT_AMPLITUDE;
      targetRotation.current.x =
        -lastPointer.current.y * MAX_ROTATION_RAD + driftX;
      targetRotation.current.y =
        lastPointer.current.x * MAX_ROTATION_RAD + driftY;
    }

    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * EYE_LERP_SPEED;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * EYE_LERP_SPEED;

    if (groupRef.current) {
      groupRef.current.rotation.x +=
        (currentRotation.current.x - groupRef.current.rotation.x) *
        INERTIA_FACTOR;
      groupRef.current.rotation.y +=
        (currentRotation.current.y - groupRef.current.rotation.y) *
        INERTIA_FACTOR;
    }

    if (corneaGroupRef.current) {
      corneaGroupRef.current.rotation.x = groupRef.current.rotation.x * 0.115;
      corneaGroupRef.current.rotation.y = groupRef.current.rotation.y * 0.115;
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
    <group ref={groupRef} scale={1.035}>
      <primitive object={gltf.scene} />
      <ScenePlayButton onClick={() => onPlayClick?.()} isPlaying={isPlaying} />
    </group>
  );
}
