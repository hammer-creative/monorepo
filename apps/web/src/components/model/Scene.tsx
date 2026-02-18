/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/model/Scene.tsx

'use client';

import { OrbitControls, useGLTF, useVideoTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// ==========================================
// TUNABLE PARAMETERS
// ==========================================
const MAX_ROTATION = 8; // Max rotation in degrees
const LERP_SPEED = 0.2; // Inertia speed (0.01 = slow drift, 0.1 = snappy)
const PARALLAX_FACTOR = 0.2; // Pupil lag (0.5 = lots of lag, 0.9 = almost none)

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
const IRIS_SATURATION = 1.5; // Iris color saturation (1.0 = normal, >1.0 = more saturated)
const IRIS_CONTRAST = 1.2; // Iris contrast (1.0 = normal, >1.0 = more contrast)

// LIGHTING PARAMETERS
const AMBIENT_LIGHT_INTENSITY = 0.1; // Overall scene brightness (0-5, try 0.5, 1.0, 1.5)
const DIRECTIONAL_LIGHT_INTENSITY = 0.9; // Directional light strength (0-2, try 0.3, 0.5, 0.8)
const DIRECTIONAL_LIGHT_POSITION = [1, 5, 5]; // Light position [x, y, z]
const TONE_MAPPING_EXPOSURE = 1.0; // Exposure control (0.5 = darker, 1.5 = brighter)
// ==========================================

const PLAY_BUTTON_Z = 0.14;
const PLAY_BUTTON_SCALE = 0.01;
const PLAY_BUTTON_COLOR = '#D4A843';

function PlayButton3D({ onClick, isPlaying }) {
  const triangleGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, -0.5);
    shape.lineTo(-0.4, 0.5);
    shape.lineTo(0.6, 0);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape);
    geo.center();
    return geo;
  }, []);

  const [hovered, setHovered] = useState(false);

  return (
    <>
      <mesh
        position={[0, 0, PLAY_BUTTON_Z]}
        scale={[PLAY_BUTTON_SCALE, PLAY_BUTTON_SCALE, 1]}
        geometry={triangleGeometry}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshBasicMaterial
          color={hovered ? '#E8C060' : PLAY_BUTTON_COLOR}
          side={THREE.DoubleSide}
          depthTest={false}
          transparent
          opacity={1}
        />
      </mesh>
    </>
  );
}

function Model({ url, isPaused }: { url: string; isPaused: boolean }) {
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
    if (groupRef.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;
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

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
      <PlayButton3D onClick={handleTogglePlay} isPlaying={isPlaying} />
    </group>
  );
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
        <Model url="/model/model-v7-compressed.glb" isPaused={isPaused} />
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
  const [panelVisible, setPanelVisible] = useState(true);

  const [maskStart, setMaskStart] = useState(50);
  const [maskEnd, setMaskEnd] = useState(71);
  const [maskDiameter, setMaskDiameter] = useState(50);

  // Backdrop bokeh 1 controls
  const [bokeh1Enabled, setBokeh1Enabled] = useState(true);
  const [backdropSize1, setBackdropSize1] = useState(59);
  const [backdropBlur1, setBackdropBlur1] = useState(66);
  const [backdropOpacity1, setBackdropOpacity1] = useState(1.0);
  const [backdropColor1_1, setBackdropColor1_1] = useState('#c8d5d9');
  const [backdropColor1_2, setBackdropColor1_2] = useState('#000000');
  const [backdropGradientStart1, setBackdropGradientStart1] = useState(0);
  const [backdropGradientEnd1, setBackdropGradientEnd1] = useState(0);

  // Backdrop bokeh 2 controls
  const [bokeh2Enabled, setBokeh2Enabled] = useState(true);
  const [backdropSize2, setBackdropSize2] = useState(70);
  const [backdropBlur2, setBackdropBlur2] = useState(98);
  const [backdropOpacity2, setBackdropOpacity2] = useState(0.8);
  const [backdropColor2_1, setBackdropColor2_1] = useState('#ffffff');
  const [backdropColor2_2, setBackdropColor2_2] = useState('#666666');
  const [backdropGradientStart2, setBackdropGradientStart2] = useState(0);
  const [backdropGradientEnd2, setBackdropGradientEnd2] = useState(100);

  // Bottom to top linear gradient
  const [linearGradientEnabled, setLinearGradientEnabled] = useState(true);
  const [bottomGradientColor, setBottomGradientColor] = useState('#000000');
  const [topGradientColor, setTopGradientColor] = useState('#c8d5d9');
  const [linearGradientOpacity, setLinearGradientOpacity] = useState(0.6);
  const [linearGradientStart, setLinearGradientStart] = useState(0);
  const [linearGradientEnd, setLinearGradientEnd] = useState(32);

  const [presets, setPresets] = useState([]);
  const [presetCounter, setPresetCounter] = useState(1);

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

  useEffect(() => {
    const saved = localStorage.getItem('bokeh-presets');
    const savedCounter = localStorage.getItem('bokeh-preset-counter');
    if (saved) {
      setPresets(JSON.parse(saved));
    }
    if (savedCounter) {
      setPresetCounter(parseInt(savedCounter));
    }
  }, []);

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const savePreset = () => {
    const preset = {
      name: `preset-${String(presetCounter).padStart(3, '0')}`,
      maskStart,
      maskEnd,
      maskDiameter,
      bokeh1Enabled,
      backdropSize1,
      backdropBlur1,
      backdropOpacity1,
      backdropColor1_1,
      backdropColor1_2,
      backdropGradientStart1,
      backdropGradientEnd1,
      bokeh2Enabled,
      backdropSize2,
      backdropBlur2,
      backdropOpacity2,
      backdropColor2_1,
      backdropColor2_2,
      backdropGradientStart2,
      backdropGradientEnd2,
      linearGradientEnabled,
      bottomGradientColor,
      topGradientColor,
      linearGradientOpacity,
      linearGradientStart,
      linearGradientEnd,
    };
    const newPresets = [...presets, preset];
    const newCounter = presetCounter + 1;
    setPresets(newPresets);
    setPresetCounter(newCounter);
    localStorage.setItem('bokeh-presets', JSON.stringify(newPresets));
    localStorage.setItem('bokeh-preset-counter', String(newCounter));
  };

  const loadPreset = (preset) => {
    setMaskStart(preset.maskStart);
    setMaskEnd(preset.maskEnd);
    setMaskDiameter(preset.maskDiameter);
    setBokeh1Enabled(preset.bokeh1Enabled);
    setBackdropSize1(preset.backdropSize1);
    setBackdropBlur1(preset.backdropBlur1);
    setBackdropOpacity1(preset.backdropOpacity1);
    setBackdropColor1_1(preset.backdropColor1_1);
    setBackdropColor1_2(preset.backdropColor1_2);
    setBackdropGradientStart1(preset.backdropGradientStart1);
    setBackdropGradientEnd1(preset.backdropGradientEnd1);
    setBokeh2Enabled(preset.bokeh2Enabled);
    setBackdropSize2(preset.backdropSize2);
    setBackdropBlur2(preset.backdropBlur2);
    setBackdropOpacity2(preset.backdropOpacity2);
    setBackdropColor2_1(preset.backdropColor2_1);
    setBackdropColor2_2(preset.backdropColor2_2);
    setBackdropGradientStart2(preset.backdropGradientStart2);
    setBackdropGradientEnd2(preset.backdropGradientEnd2);
    setLinearGradientEnabled(preset.linearGradientEnabled);
    setBottomGradientColor(preset.bottomGradientColor);
    setTopGradientColor(preset.topGradientColor);
    setLinearGradientOpacity(preset.linearGradientOpacity);
    setLinearGradientStart(preset.linearGradientStart);
    setLinearGradientEnd(preset.linearGradientEnd);
  };

  const deletePreset = (index) => {
    const newPresets = presets.filter((_, i) => i !== index);
    setPresets(newPresets);
    localStorage.setItem('bokeh-presets', JSON.stringify(newPresets));
  };

  const copyToClipboard = () => {
    const css = `
/* Mask */
mask-image: radial-gradient(circle ${maskDiameter}% at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%);
-webkit-mask-image: radial-gradient(circle ${maskDiameter}% at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%);

${
  bokeh1Enabled
    ? `/* Backdrop Bokeh 1 */
.bokeh-1 {
  position: absolute;
  width: min(${backdropSize1}vw, ${backdropSize1}vh);
  height: min(${backdropSize1}vw, ${backdropSize1}vh);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${backdropColor1_1} ${backdropGradientStart1}%, ${backdropColor1_2} ${backdropGradientEnd1}%);
  opacity: ${backdropOpacity1};
  filter: blur(${backdropBlur1}px);
  pointer-events: none;
  z-index: 1;
}
`
    : ''
}
${
  bokeh2Enabled
    ? `/* Backdrop Bokeh 2 */
.bokeh-2 {
  position: absolute;
  width: min(${backdropSize2}vw, ${backdropSize2}vh);
  height: min(${backdropSize2}vw, ${backdropSize2}vh);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${backdropColor2_1} ${backdropGradientStart2}%, ${backdropColor2_2} ${backdropGradientEnd2}%);
  opacity: ${backdropOpacity2};
  filter: blur(${backdropBlur2}px);
  pointer-events: none;
  z-index: 2;
}
`
    : ''
}
${
  linearGradientEnabled
    ? `/* Linear Gradient */
.linear-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, ${bottomGradientColor} ${linearGradientStart}%, ${topGradientColor} ${linearGradientEnd}%);
  opacity: ${linearGradientOpacity};
  pointer-events: none;
  z-index: 3;
}
`
    : ''
}`;

    navigator.clipboard.writeText(css.trim());
    alert('CSS copied to clipboard!');
  };

  const maskStyle = {
    maskImage: `radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%)`,
    WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%)`,
    maskSize: `${maskDiameter}vh ${maskDiameter}vh`,
    WebkitMaskSize: `${maskDiameter}vh ${maskDiameter}vh`,
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };

  const backdropBokehStyle1 = {
    position: 'absolute' as const,
    width: `min(${backdropSize1}vw, ${backdropSize1}vh)`,
    height: `min(${backdropSize1}vw, ${backdropSize1}vh)`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${backdropColor1_1} ${backdropGradientStart1}%, ${backdropColor1_2} ${backdropGradientEnd1}%)`,
    opacity: backdropOpacity1,
    filter: `blur(${backdropBlur1}px)`,
    pointerEvents: 'none' as const,
    zIndex: 1,
  };

  const backdropBokehStyle2 = {
    position: 'absolute' as const,
    width: `min(${backdropSize2}vw, ${backdropSize2}vh)`,
    height: `min(${backdropSize2}vw, ${backdropSize2}vh)`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${backdropColor2_1} ${backdropGradientStart2}%, ${backdropColor2_2} ${backdropGradientEnd2}%)`,
    opacity: backdropOpacity2,
    filter: `blur(${backdropBlur2}px)`,
    pointerEvents: 'none' as const,
    zIndex: 2,
  };

  const linearGradientStyle = {
    position: 'absolute' as const,
    inset: 0,
    background: `linear-gradient(to top, ${bottomGradientColor} ${linearGradientStart}%, ${topGradientColor} ${linearGradientEnd}%)`,
    opacity: linearGradientOpacity,
    pointerEvents: 'none' as const,
    zIndex: 3,
  };

  return (
    <>
      <button
        onClick={() => setPanelVisible(!panelVisible)}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1001,
          padding: '8px 12px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        {panelVisible ? 'Hide' : 'Show'} Panel
      </button>

      {panelVisible && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 10,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            pointerEvents: 'all',
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={copyToClipboard}
            style={{
              padding: '8px 12px',
              background: '#4a9eff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            Copy CSS
          </button>

          <button
            onClick={savePreset}
            style={{
              padding: '8px 12px',
              background: '#4a9e4a',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            Save Preset
          </button>

          {presets.length > 0 && (
            <>
              <hr
                style={{
                  width: '100%',
                  border: 'none',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              <strong>Presets</strong>
              {presets.map((preset, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => loadPreset(preset)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      background: '#555',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => deletePreset(i)}
                    style={{
                      padding: '6px 10px',
                      background: '#a44',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </>
          )}

          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          <strong>Mask</strong>
          <label>
            diameter {maskDiameter}%
            <input
              type="range"
              min={10}
              max={100}
              value={maskDiameter}
              onChange={(e) => setMaskDiameter(+e.target.value)}
              style={{ width: 120, marginLeft: 8 }}
            />
          </label>
          <label>
            start {maskStart}%
            <input
              type="range"
              min={0}
              max={100}
              value={maskStart}
              onChange={(e) => setMaskStart(+e.target.value)}
              style={{ width: 120, marginLeft: 8 }}
            />
          </label>
          <label>
            feather {maskEnd}%
            <input
              type="range"
              min={0}
              max={100}
              value={maskEnd}
              onChange={(e) => setMaskEnd(+e.target.value)}
              style={{ width: 120, marginLeft: 8 }}
            />
          </label>

          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={bokeh1Enabled}
              onChange={(e) => setBokeh1Enabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Backdrop Bokeh 1</strong>
          </label>

          {bokeh1Enabled && (
            <>
              <label>
                size {backdropSize1}
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={backdropSize1}
                  onChange={(e) => setBackdropSize1(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                blur {backdropBlur1}px
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={backdropBlur1}
                  onChange={(e) => setBackdropBlur1(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                opacity {backdropOpacity1.toFixed(2)}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={backdropOpacity1}
                  onChange={(e) => setBackdropOpacity1(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                color 1
                <input
                  type="color"
                  value={backdropColor1_1}
                  onChange={(e) => setBackdropColor1_1(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(backdropColor1_1)}
                </code>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                color 2
                <input
                  type="color"
                  value={backdropColor1_2}
                  onChange={(e) => setBackdropColor1_2(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(backdropColor1_2)}
                </code>
              </label>
              <label>
                gradient start {backdropGradientStart1}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backdropGradientStart1}
                  onChange={(e) => setBackdropGradientStart1(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                gradient end {backdropGradientEnd1}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backdropGradientEnd1}
                  onChange={(e) => setBackdropGradientEnd1(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
            </>
          )}

          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={bokeh2Enabled}
              onChange={(e) => setBokeh2Enabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Backdrop Bokeh 2</strong>
          </label>

          {bokeh2Enabled && (
            <>
              <label>
                size {backdropSize2}
                <input
                  type="range"
                  min={10}
                  max={200}
                  value={backdropSize2}
                  onChange={(e) => setBackdropSize2(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                blur {backdropBlur2}px
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={backdropBlur2}
                  onChange={(e) => setBackdropBlur2(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                opacity {backdropOpacity2.toFixed(2)}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={backdropOpacity2}
                  onChange={(e) => setBackdropOpacity2(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                color 1
                <input
                  type="color"
                  value={backdropColor2_1}
                  onChange={(e) => setBackdropColor2_1(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(backdropColor2_1)}
                </code>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                color 2
                <input
                  type="color"
                  value={backdropColor2_2}
                  onChange={(e) => setBackdropColor2_2(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(backdropColor2_2)}
                </code>
              </label>
              <label>
                gradient start {backdropGradientStart2}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backdropGradientStart2}
                  onChange={(e) => setBackdropGradientStart2(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                gradient end {backdropGradientEnd2}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backdropGradientEnd2}
                  onChange={(e) => setBackdropGradientEnd2(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
            </>
          )}

          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          <label>
            <input
              type="checkbox"
              checked={linearGradientEnabled}
              onChange={(e) => setLinearGradientEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Linear Gradient (Bottom to Top)</strong>
          </label>

          {linearGradientEnabled && (
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                bottom color
                <input
                  type="color"
                  value={bottomGradientColor}
                  onChange={(e) => setBottomGradientColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(bottomGradientColor)}
                </code>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                top color
                <input
                  type="color"
                  value={topGradientColor}
                  onChange={(e) => setTopGradientColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(topGradientColor)}
                </code>
              </label>
              <label>
                gradient start {linearGradientStart}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={linearGradientStart}
                  onChange={(e) => setLinearGradientStart(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                gradient end {linearGradientEnd}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={linearGradientEnd}
                  onChange={(e) => setLinearGradientEnd(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                opacity {linearGradientOpacity.toFixed(2)}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={linearGradientOpacity}
                  onChange={(e) => setLinearGradientOpacity(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
            </>
          )}
        </div>
      )}

      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        {bokeh1Enabled && <div style={backdropBokehStyle1} />}
        {bokeh2Enabled && <div style={backdropBokehStyle2} />}
        {linearGradientEnabled && <div style={linearGradientStyle} />}

        <div
          className="model"
          style={{
            ...maskStyle,
            position: 'relative',
            zIndex: 10,
            height: '100%',
            width: '100%',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 0.4], fov: 50 }}
            gl={{
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: TONE_MAPPING_EXPOSURE,
              alpha: true,
            }}
          >
            <SceneContent
              helpersVisible={helpersVisible}
              orbitEnabled={helpersVisible}
              isPaused={isPaused}
            />
          </Canvas>
        </div>
      </div>
    </>
  );
}
