import * as THREE from 'three';

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
export const SHOW_CORNEA = false;
export const SHOW_IRIS = true;
export const SHOW_PUPIL = true;
export const SHOW_SCLERA = true;
export const SCLERA_SCALE = 1.0;

// ==========================================
// VIDEO PUPIL PARAMETERS
// ==========================================
export const ENABLE_VIDEO_PUPIL = true;
export const PUPIL_COLOR = new THREE.Color(0xffffff);
export const PUPIL_Z_POSITION = 0;
export const PUPIL_SCALE = 1;

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
export const PLAY_BUTTON_COLOR = '#D4A843';

// ==========================================
// LIGHTING CONFIG — paste from dev panel to update
// ==========================================
export const LIGHTING_CONFIG = {
  ambientLight: {
    enabled: true,
    intensity: 5,
    color: '#a9b7bd',
  },
  directionalLight: {
    enabled: true,
    intensity: 5,
    color: '#dbe1e1',
    position: [0, 0, 0],
  },
  spotLight: {
    enabled: false,
    intensity: 0,
    color: '#000000',
    position: [0, 0, 0],
    angle: 0,
    penumbra: 0,
  },
  pointLight: {
    enabled: false,
    intensity: 0,
    color: '#000000',
    position: [0, 0, 0],
    distance: 0,
    decay: 0,
  },
  cycloLight: {
    enabled: false,
    intensity: 0,
    color: '#000000',
    position: [0, 0, 0],
  },
};
