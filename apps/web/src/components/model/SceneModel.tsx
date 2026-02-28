/* eslint-disable */
// @ts-nocheck

'use client';

import { useGLTF, useTexture, useVideoTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';

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
  CORNEA_INSERT_PNG,
  CORNEA_INSERT_Z,
  CORNEA_INSERT_SIZE,
  EYE_LERP_SPEED,
  INERTIA_FACTOR,
  DRIFT_SPEED,
  DRIFT_AMPLITUDE,
} = C;

const log = (...args) => {
  if (ENABLE_CONSOLE_LOGS) console.log(...args);
};

// ─── Procedural catchlight texture ───────────────────────────────────────────
function makeCatchlightTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gradient.addColorStop(0.0, 'rgba(255,255,255,1.0)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(1.0, 'rgba(255,255,255,0.0)');

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 0.75, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── EyeLight via DecalGeometry ───────────────────────────────────────────────
// To use a PNG: set png: '/textures/your-file.png' in EYE_LIGHTS in sceneConstants.ts
// PNG should be white blob on transparent background (RGBA)
function EyeLight({ config, proceduralTexture, corneaMesh }) {
  const pngTexture = config.png ? useTexture(config.png) : null;
  const texture = pngTexture ?? proceduralTexture;

  const decalMesh = useMemo(() => {
    if (!corneaMesh) return null;

    const position = new THREE.Vector3(...config.position);
    const orientation = new THREE.Euler(
      Math.atan2(config.position[1], config.position[2]),
      Math.atan2(-config.position[0], config.position[2]),
      0,
    );
    const size = new THREE.Vector3(config.size[0], config.size[1], 0.1);

    const geometry = new DecalGeometry(corneaMesh, position, orientation, size);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });

    return new THREE.Mesh(geometry, material);
  }, [corneaMesh, texture]);

  if (!decalMesh) return null;
  return <primitive object={decalMesh} renderOrder={999} />;
}

function CorneaInsert({ texture }) {
  return (
    <mesh
      position={[0, 0, CORNEA_INSERT_Z]}
      renderOrder={2} // render after cornea
    >
      <circleGeometry args={[CORNEA_INSERT_SIZE, 64]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        stencilWrite={true} // enable stencil test
        stencilRef={1} // match cornea mesh
        stencilFunc={THREE.EqualStencilFunc} // only draw where cornea wrote
        stencilFail={THREE.KeepStencilOp}
        stencilZFail={THREE.KeepStencilOp}
        stencilZPass={THREE.KeepStencilOp}
      />
    </mesh>
  );
}

// ─── SceneModel ───────────────────────────────────────────────────────────────
export default function SceneModel({
  url,
  isPaused,
  onPlayClick,
  wireframe = false,
}) {
  const gltf = useGLTF(url);
  const { camera } = useThree();

  const corneaInsertTexture = CORNEA_INSERT_PNG
    ? useTexture(CORNEA_INSERT_PNG)
    : null;

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
  const catchlightTexture = useMemo(() => makeCatchlightTexture(128), []);

  // ─── Scene setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isLight) child.visible = false;
      if (!child.isMesh) return;

      if (child.isLight) child.visible = false;
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.name === 'Cornea_V5') {
        corneaMeshRef.current = child;
        child.visible = SHOW_CORNEA;
        child.material = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          stencilWrite: true,
          stencilRef: 1,
          stencilFunc: THREE.AlwaysStencilFunc,
          stencilZPass: THREE.ReplaceStencilOp,
        });
      }

      if (child.name === 'Iris_Mesh') {
        irisMeshRef.current = child;
        child.visible = SHOW_IRIS;
        child.scale.set(1, 1, 1);
        // child.scale.set(1.008, 1.008, 1.0);
        child.material.roughness = 1;
        child.material.metalness = 0.0;
        child.material.envMapIntensity = 0;
        child.material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            #ifdef USE_MAP
              // Saturation
              float saturation = ${IRIS_SATURATION.toFixed(2)};
              vec3 luminance = vec3(0.299, 0.587, 0.114);
              float gray = dot(diffuseColor.rgb, luminance);
              diffuseColor.rgb = mix(vec3(gray), diffuseColor.rgb, saturation);

              // Contrast
              float contrast = ${IRIS_CONTRAST.toFixed(2)};
              diffuseColor.rgb = (diffuseColor.rgb - 0.5) * contrast + 0.5;
              diffuseColor.rgb = clamp(diffuseColor.rgb, 0.0, 1.0);
            #endif
            `,
          );
        };
        child.material.needsUpdate = true;
      }

      if (child.name === 'Pupil_V5' && videoTexture) {
        child.visible = SHOW_PUPIL;
        if (ENABLE_VIDEO_PUPIL) {
          child.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: false,
          });
        } else {
          child.material = new THREE.MeshBasicMaterial({
            color: PUPIL_COLOR,
          });
        }

        // ─── Edge gradient on pupil ──────────────────────────────
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
        child.scale.set(PUPIL_SCALE, PUPIL_SCALE, PUPIL_SCALE);

        // ─── Convexity ────────────────────────────────────────────
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

      if (child.name === 'Sclera_V5') {
        child.visible = SHOW_SCLERA;
        child.material.envMapIntensity = 0;
      }

      if (child.name === 'Sclera_V5') {
        child.visible = SHOW_SCLERA;
        child.material.envMapIntensity = 0;
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

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      const box = new THREE.Box3().setFromObject(child);
      console.log(child.name, 'bbox:', box.min, box.max);
    });

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
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
          `type: ${child.material.type}`,
          `mat: ${child.material.name || '(unnamed)'}`,
          `mat uuid: ${child.material.uuid.slice(0, 8)}`,
          `map: ${child.material.map?.uuid.slice(0, 8) ?? 'none'}`,
          `uv2: ${child.geometry.attributes.uv1 ? 'yes' : 'no'}`,
          `UV: ${uvRange}`,
          `verts: ${child.geometry.attributes.position.count}`,
          `visible: ${child.visible}`,
        ].join(' | '),
      );
    });
  }, [gltf]);

  // ─── Wireframe ────────────────────────────────────────────────────────────
  gltf.scene.traverse((child) => {
    if (!child.isMesh) return;
    child.material.wireframe = wireframe;
  });

  // ─── Frame loop ───────────────────────────────────────────────────────────
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
      targetRotation.current.x +=
        (driftX - targetRotation.current.x) * DRIFT_SPEED;
      targetRotation.current.y +=
        (driftY - targetRotation.current.y) * DRIFT_SPEED;
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
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
      <ScenePlayButton onClick={() => onPlayClick?.()} isPlaying={isPlaying} />

      <group ref={corneaGroupRef}>
        {/* {sceneReady &&
          EYE_LIGHTS.map((config) => (
            <EyeLight
              key={config.id}
              config={config}
              proceduralTexture={catchlightTexture}
              corneaMesh={corneaMeshRef.current}
            />
          ))} */}
      </group>
    </group>
  );
}
