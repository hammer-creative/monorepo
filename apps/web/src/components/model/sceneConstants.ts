import * as THREE from 'three';

export const GLB_SOURCE = 'Lv_EyeballExport_V5C_NewUV.glb';
export const VIDEO_SOURCE = 'Hammer_EyeballReel_1x1_EXR_V2.mp4';

// export const VIDEO_SOURCE = 'Hammer_EyeballReel_1x1_gradient.mp4';

export const ENVIRONMENT_MAP_SOURCE = 'studio_kontrast_04_4k.exr';

// ==========================================
// DEBUG
// ==========================================
export const SHOW_HELPER_PANELS = false;
export const ENABLE_CONSOLE_LOGS = false;

// ==========================================
// TUNABLE PARAMETERS
// ==========================================
export const MAX_ROTATION = 8;
export const LERP_SPEED = 0.2;
export const PARALLAX_FACTOR = 0.2;

// ==========================================
// MESH VISIBILITY
// ==========================================
export const SHOW_CORNEA = true;
export const SHOW_IRIS = true;
export const SHOW_PUPIL = true;
export const SHOW_SCLERA = true;
export const SCLERA_SCALE = 1.0;

// ==========================================
// VIDEO PUPIL PARAMETERS
// ==========================================
export const ENABLE_VIDEO_PUPIL = true;
export const PUPIL_COLOR = new THREE.Color(0x000000);
export const PUPIL_Z_POSITION = 0;
export const PUPIL_SCALE = 1;
export const PUPIL_CONVEXITY = 0; // how far center bulges forward, try 0.01–0.08

// ==========================================
// IRIS PARAMETERS
// ==========================================
export const ENABLE_IRIS_ROTATION = true;
export const IRIS_ROTATION_SPEED = 0.03;
export const IRIS_ROTATION_SPEED_ON_MOVE = 0.5;
export const IRIS_SPEED_LERP = 0.1;
export const IRIS_SATURATION = 1.2;
export const IRIS_CONTRAST = 1.2;

// ==========================================
// RENDER PARAMETERS
// ==========================================
export const TONE_MAPPING_EXPOSURE = 1.0;

// ==========================================
// PLAY BUTTON PARAMETERS
// ==========================================
export const PLAY_BUTTON_Z = 0.14;
export const PLAY_BUTTON_SCALE = 0.01;
export const PLAY_BUTTON_COLOR = '#FFCC98';

// ==========================================
// EYE LIGHTS (CATCHLIGHTS)
// Pixar-style painted highlights on cornea.
// Set png: '/path/to/file.png' to use a hand-painted texture instead of procedural.
// parallaxStrength — how far the light slides as eye rotates
// skewStrength     — how much it tilts on Y rotation
// stretchStrength  — how much it stretches horizontally on Y rotation
// ==========================================
export const EYE_LIGHTS = [
  {
    id: 'main',
    position: [-0.035, 0.032, 0.148] as [number, number, number],
    size: [0.055, 0.04] as [number, number],
    opacity: 0.75,
    parallaxStrength: 0.08,
    skewStrength: 1,
    stretchStrength: 0.5,
    png: '/model/textures/flare.png',
  },
  {
    id: 'secondary',
    position: [0.04, 0.025, 0.148] as [number, number, number],
    size: [0.03, 0.022] as [number, number],
    opacity: 0.45,
    parallaxStrength: 0.05,
    skewStrength: 0.2,
    stretchStrength: 0.3,
    png: null as string | null,
  },
  {
    id: 'tertiary',
    position: [-0.01, -0.02, 0.148] as [number, number, number],
    size: [0.02, 0.015] as [number, number],
    opacity: 0.25,
    parallaxStrength: 0.03,
    skewStrength: 0.15,
    stretchStrength: 0.2,
    png: null as string | null,
  },
];

// ==========================================
// IRIS EDGE GRADIENT
// ==========================================

export const IRIS_EDGE_FADE_START = 0.75;
export const IRIS_EDGE_FADE_END = 1;
export const IRIS_EDGE_COLOR_R = 0; // edge color RGB 0–1
export const IRIS_EDGE_COLOR_G = 0;
export const IRIS_EDGE_COLOR_B = 0;

export const CORNEA_RADIUS = 0.148;
export const EYE_LIGHT_Z_OFFSET = 0.005;

export const IRIS_ROUGHNESS = 1.0;

export const SCLERA_INNER_FADE_START = 0; // inner hole edge
export const SCLERA_INNER_FADE_END = 0; // fades to normal above this

export const CORNEA_INSERT_PNG = '/model/textures/brown_photostudio_02_1k.png';
export const CORNEA_INSERT_Z = 0.15;
export const CORNEA_INSERT_SIZE = 0.05;

export const EYE_LERP_SPEED = 0.08; // how fast eye follows mouse
export const INERTIA_FACTOR = 0.12; // how fast group rotation catches up (lower = more lag)
export const DRIFT_SPEED = 0.008; // how fast target drifts when idle
export const DRIFT_AMPLITUDE = 0.7; // how wide the drift wanders (0-1 multiplier of MAX_ROTATION)

// LIGHTING_CONFIG — paste into sceneConstants.ts
export const LIGHTING_CONFIG = {
  ambientLight: {
    enabled: true,
    intensity: 1,
    color: '#b9c3df',
  },
  directionalLight: {
    enabled: true,
    intensity: 2.9,
    color: '#e8f7f8',
    position: [-0.1, 2.5, 1.8],
  },
  spotLight: {
    enabled: false,
    intensity: 5,
    color: '#ffffff',
    position: [0, 5, 3],
    angle: 0.3,
    penumbra: 0.5,
  },
  pointLight: {
    enabled: false,
    intensity: 5,
    color: '#ffffff',
    position: [2, 2, 2],
    distance: 10,
    decay: 2,
  },
  cycloLight: {
    enabled: false,
    intensity: 2,
    color: '#ffffff',
    position: [0, -3, 0],
  },
};
