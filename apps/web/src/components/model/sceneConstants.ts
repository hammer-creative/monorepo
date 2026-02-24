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
export const SHOW_CORNEA = true;
export const SHOW_IRIS = true;
export const SHOW_PUPIL = true;
export const SHOW_SCLERA = true;

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
export const IRIS_SATURATION = 1.5;
export const IRIS_CONTRAST = 1.2;

// ==========================================
// LIGHTING PARAMETERS
// ==========================================
export const AMBIENT_LIGHT_INTENSITY = 2;
export const DIRECTIONAL_LIGHT_INTENSITY = 1;
export const DIRECTIONAL_LIGHT_POSITION = [1, 1, 1] as [number, number, number];
export const TONE_MAPPING_EXPOSURE = 1.0;

// ==========================================
// LIGHTING DEFAULTS
// ==========================================
export const AMBIENT_LIGHT_ENABLED = true;
export const AMBIENT_LIGHT_COLOR = '#ffffff';
export const AMBIENT_LIGHT_INTENSITY_DEFAULT = 0.4;

export const DIRECTIONAL_LIGHT_ENABLED = true;
export const DIRECTIONAL_LIGHT_COLOR = '#ffffff';
export const DIRECTIONAL_LIGHT_INTENSITY_DEFAULT = 3.6;
export const DIRECTIONAL_LIGHT_POSITION_DEFAULT: [number, number, number] = [
  0.0, 0.3, 0.3,
];

export const SPOT_LIGHT_ENABLED = false;
export const SPOT_LIGHT_INTENSITY = 0;
export const SPOT_LIGHT_COLOR = '#000000';
export const SPOT_LIGHT_POSITION: [number, number, number] = [0, 0, 0];
export const SPOT_LIGHT_ANGLE = 0;
export const SPOT_LIGHT_PENUMBRA = 0;

export const POINT_LIGHT_ENABLED = false;
export const POINT_LIGHT_INTENSITY = 0;
export const POINT_LIGHT_COLOR = '#000000';
export const POINT_LIGHT_POSITION: [number, number, number] = [0, 0, 0];
export const POINT_LIGHT_DISTANCE = 0;
export const POINT_LIGHT_DECAY = 0;

export const CYCLO_LIGHT_ENABLED = false;
export const CYCLO_LIGHT_INTENSITY = 0;
export const CYCLO_LIGHT_COLOR = '#000000';
export const CYCLO_LIGHT_POSITION: [number, number, number] = [0, 0, 0];

// ==========================================
// PLAY BUTTON PARAMETERS
// ==========================================
export const PLAY_BUTTON_Z = 0.14;
export const PLAY_BUTTON_SCALE = 0.01;
export const PLAY_BUTTON_COLOR = '#D4A843';
