/* eslint-disable */
// @ts-nocheck

'use client';

import { TONE_MAPPING_EXPOSURE } from '@/components/model/sceneConstants';
import * as C from '@/components/model/sceneConstants';
import SceneContent from '@/components/model/SceneContent';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';

const LC = C.LIGHTING_CONFIG;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const hexToRgba = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

const HR = () => (
  <hr
    style={{
      width: '100%',
      border: 'none',
      borderTop: '1px solid rgba(255,255,255,0.2)',
    }}
  />
);

const btnBase = {
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  padding: '8px 12px',
  color: '#fff',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function ModelDevPage() {
  const [envRotation, setEnvRotation] = useState([0.5, Math.PI / 4, 0.5]);
  const [helpersVisible, setHelpersVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [lightingPanelVisible, setLightingPanelVisible] = useState(false);

  const [maskEnabled, setMaskEnabled] = useState(false);
  const [maskStart, setMaskStart] = useState(42);
  const [maskEnd, setMaskEnd] = useState(63);
  const [maskDiameter, setMaskDiameter] = useState(97);

  const [bokeh1Enabled, setBokeh1Enabled] = useState(false);
  const [backdropSize1, setBackdropSize1] = useState(100);
  const [backdropBlur1, setBackdropBlur1] = useState(0);
  const [backdropOpacity1, setBackdropOpacity1] = useState(0);
  const [backdropColor1_1, setBackdropColor1_1] = useState('#000000');
  const [backdropColor1_2, setBackdropColor1_2] = useState('#000000');
  const [backdropGradientStart1, setBackdropGradientStart1] = useState(0);
  const [backdropGradientEnd1, setBackdropGradientEnd1] = useState(100);

  const [bokeh2Enabled, setBokeh2Enabled] = useState(false);
  const [backdropSize2, setBackdropSize2] = useState(100);
  const [backdropBlur2, setBackdropBlur2] = useState(0);
  const [backdropOpacity2, setBackdropOpacity2] = useState(0);
  const [backdropColor2_1, setBackdropColor2_1] = useState('#000000');
  const [backdropColor2_2, setBackdropColor2_2] = useState('#000000');
  const [backdropGradientStart2, setBackdropGradientStart2] = useState(0);
  const [backdropGradientEnd2, setBackdropGradientEnd2] = useState(100);

  const [linearGradientEnabled, setLinearGradientEnabled] = useState(false);
  const [linearGradientColor, setLinearGradientColor] = useState('#000000');
  const [linearGradientOpacity, setLinearGradientOpacity] = useState(0);
  const [linearGradientHeight, setLinearGradientHeight] = useState(30);

  const [presets, setPresets] = useState([]);
  const [presetCounter, setPresetCounter] = useState(1);

  const [ambientLightEnabled, setAmbientLightEnabled] = useState(
    LC.ambientLight.enabled,
  );
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(
    LC.ambientLight.intensity,
  );
  const [ambientLightColor, setAmbientLightColor] = useState(
    LC.ambientLight.color,
  );

  const [directionalLightEnabled, setDirectionalLightEnabled] = useState(
    LC.directionalLight.enabled,
  );
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(
    LC.directionalLight.intensity,
  );
  const [directionalLightColor, setDirectionalLightColor] = useState(
    LC.directionalLight.color,
  );
  const [directionalLightPosition, setDirectionalLightPosition] = useState(
    LC.directionalLight.position,
  );

  const [spotLightEnabled, setSpotLightEnabled] = useState(
    LC.spotLight.enabled,
  );
  const [spotLightIntensity, setSpotLightIntensity] = useState(
    LC.spotLight.intensity,
  );
  const [spotLightColor, setSpotLightColor] = useState(LC.spotLight.color);
  const [spotLightPosition, setSpotLightPosition] = useState(
    LC.spotLight.position,
  );
  const [spotLightAngle, setSpotLightAngle] = useState(LC.spotLight.angle);
  const [spotLightPenumbra, setSpotLightPenumbra] = useState(
    LC.spotLight.penumbra,
  );

  const [pointLightEnabled, setPointLightEnabled] = useState(
    LC.pointLight.enabled,
  );
  const [pointLightIntensity, setPointLightIntensity] = useState(
    LC.pointLight.intensity,
  );
  const [pointLightColor, setPointLightColor] = useState(LC.pointLight.color);
  const [pointLightPosition, setPointLightPosition] = useState(
    LC.pointLight.position,
  );
  const [pointLightDistance, setPointLightDistance] = useState(
    LC.pointLight.distance,
  );
  const [pointLightDecay, setPointLightDecay] = useState(LC.pointLight.decay);

  const [cycloLightEnabled, setCycloLightEnabled] = useState(
    LC.cycloLight.enabled,
  );
  const [cycloLightIntensity, setCycloLightIntensity] = useState(
    LC.cycloLight.intensity,
  );
  const [cycloLightColor, setCycloLightColor] = useState(LC.cycloLight.color);
  const [cycloLightPosition, setCycloLightPosition] = useState(
    LC.cycloLight.position,
  );

  const removeAllEffects = () => {
    setMaskEnabled(false);
    setBokeh1Enabled(false);
    setBokeh2Enabled(false);
    setLinearGradientEnabled(false);
  };

  const savePreset = () => {
    const name = `preset-${String(presetCounter).padStart(3, '0')}`;
    const preset = {
      name,
      maskEnabled,
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
      linearGradientColor,
      linearGradientOpacity,
      linearGradientHeight,
    };
    const next = [...presets, preset];
    setPresets(next);
    setPresetCounter((c) => c + 1);
    localStorage.setItem('bokeh-presets', JSON.stringify(next));
    localStorage.setItem('bokeh-preset-counter', String(presetCounter + 1));
  };

  const loadPreset = (preset) => {
    setMaskEnabled(preset.maskEnabled);
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
    setLinearGradientColor(preset.linearGradientColor);
    setLinearGradientOpacity(preset.linearGradientOpacity);
    setLinearGradientHeight(preset.linearGradientHeight);
  };

  const deletePreset = (index) => {
    const next = presets.filter((_, i) => i !== index);
    setPresets(next);
    localStorage.setItem('bokeh-presets', JSON.stringify(next));
  };

  const copyCssToClipboard = () => {
    const parts: string[] = [];
    if (maskEnabled) {
      parts.push(`.model {
  mask-image: radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%);
  mask-size: ${maskDiameter}vh ${maskDiameter}vh;
  -webkit-mask-size: ${maskDiameter}vh ${maskDiameter}vh;
  mask-position: center;
  -webkit-mask-position: center;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}`);
    }
    if (bokeh1Enabled) {
      parts.push(`.bokeh-1 {
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
}`);
    }
    if (bokeh2Enabled) {
      parts.push(`.bokeh-2 {
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
}`);
    }
    if (linearGradientEnabled) {
      parts.push(`.linear-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${linearGradientHeight}%;
  background: linear-gradient(to top, ${linearGradientColor}, transparent);
  opacity: ${linearGradientOpacity};
  pointer-events: none;
}`);
    }
    navigator.clipboard.writeText(parts.join('\n\n'));
    alert('CSS copied to clipboard!');
  };

  const copyLightingToClipboard = () => {
    const config = `// LIGHTING_CONFIG — paste into sceneConstants.ts
export const LIGHTING_CONFIG = {
  ambientLight: {
    enabled: ${ambientLightEnabled},
    intensity: ${ambientLightIntensity},
    color: '${ambientLightColor}',
  },
  directionalLight: {
    enabled: ${directionalLightEnabled},
    intensity: ${directionalLightIntensity},
    color: '${directionalLightColor}',
    position: [${directionalLightPosition.join(', ')}],
  },
  spotLight: {
    enabled: ${spotLightEnabled},
    intensity: ${spotLightIntensity},
    color: '${spotLightColor}',
    position: [${spotLightPosition.join(', ')}],
    angle: ${spotLightAngle},
    penumbra: ${spotLightPenumbra},
  },
  pointLight: {
    enabled: ${pointLightEnabled},
    intensity: ${pointLightIntensity},
    color: '${pointLightColor}',
    position: [${pointLightPosition.join(', ')}],
    distance: ${pointLightDistance},
    decay: ${pointLightDecay},
  },
  cycloLight: {
    enabled: ${cycloLightEnabled},
    intensity: ${cycloLightIntensity},
    color: '${cycloLightColor}',
    position: [${cycloLightPosition.join(', ')}],
  },
};

// Environment rotation: [${envRotation.map((v) => v.toFixed(4)).join(', ')}]`;
    navigator.clipboard.writeText(config);
    alert('Lighting config copied to clipboard!');
  };

  const maskStyle = maskEnabled
    ? {
        maskImage: `radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%)`,
        WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%)`,
        maskSize: `${maskDiameter}vh ${maskDiameter}vh`,
        WebkitMaskSize: `${maskDiameter}vh ${maskDiameter}vh`,
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }
    : {};

  const bokeh1Style = {
    position: 'absolute',
    width: `min(${backdropSize1}vw, ${backdropSize1}vh)`,
    height: `min(${backdropSize1}vw, ${backdropSize1}vh)`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${backdropColor1_1} ${backdropGradientStart1}%, ${backdropColor1_2} ${backdropGradientEnd1}%)`,
    opacity: backdropOpacity1,
    filter: `blur(${backdropBlur1}px)`,
    pointerEvents: 'none',
  };

  const bokeh2Style = {
    position: 'absolute',
    width: `min(${backdropSize2}vw, ${backdropSize2}vh)`,
    height: `min(${backdropSize2}vw, ${backdropSize2}vh)`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${backdropColor2_1} ${backdropGradientStart2}%, ${backdropColor2_2} ${backdropGradientEnd2}%)`,
    opacity: backdropOpacity2,
    filter: `blur(${backdropBlur2}px)`,
    pointerEvents: 'none',
  };

  const linearGradientStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: `${linearGradientHeight}%`,
    background: `linear-gradient(to top, ${linearGradientColor}, transparent)`,
    opacity: linearGradientOpacity,
    pointerEvents: 'none',
  };

  const panelStyle = {
    position: 'absolute',
    zIndex: 1000,
    background: 'rgba(0,0,0,0.75)',
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
  };

  const slider = (min, max, step, value, onChange) => (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      style={{ width: 110, marginLeft: 8 }}
    />
  );

  const colorRow = (label: string, value: string, onChange) => (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      {label}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <code style={{ fontSize: 10 }}>{hexToRgba(value)}</code>
    </label>
  );

  const xyzSliders = (pos, setPos, range = 20) => (
    <>
      {['X', 'Y', 'Z'].map((axis, i) => (
        <label key={axis}>
          {axis} {pos[i].toFixed(2)}
          {slider(-range, range, 0.01, pos[i], (v) => {
            const next = [...pos];
            next[i] = v;
            setPos(next);
          })}
        </label>
      ))}
    </>
  );

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <button
        onClick={() => setPanelVisible((v) => !v)}
        style={{
          ...btnBase,
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1001,
          background: '#333',
        }}
      >
        {panelVisible ? 'Hide' : 'Show'} Panel
      </button>

      <button
        onClick={() => setLightingPanelVisible((v) => !v)}
        style={{
          ...btnBase,
          position: 'absolute',
          top: 50,
          left: 10,
          zIndex: 1001,
          background: '#555',
        }}
      >
        {lightingPanelVisible ? 'Hide' : 'Show'} Lighting
      </button>

      <button
        onClick={() => setHelpersVisible((v) => !v)}
        style={{
          ...btnBase,
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1001,
          background: helpersVisible ? '#4a4' : '#444',
          color: helpersVisible ? '#000' : '#fff',
        }}
      >
        Helpers: {helpersVisible ? 'ON' : 'OFF'}
      </button>

      {/* ── Effects panel ── */}
      {panelVisible && (
        <div style={{ ...panelStyle, top: 90, left: 10, width: 220 }}>
          <button
            onClick={copyCssToClipboard}
            style={{ ...btnBase, background: '#4a9eff' }}
          >
            Copy CSS
          </button>
          <button
            onClick={savePreset}
            style={{ ...btnBase, background: '#4a9e4a' }}
          >
            Save Preset
          </button>

          {presets.length > 0 && (
            <>
              <HR />
              <strong>Presets</strong>
              {presets.map((preset, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => loadPreset(preset)}
                    style={{
                      ...btnBase,
                      flex: 1,
                      background: '#555',
                      fontWeight: 'normal',
                    }}
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => deletePreset(i)}
                    style={{
                      ...btnBase,
                      background: '#a44',
                      fontWeight: 'normal',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </>
          )}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={maskEnabled}
              onChange={(e) => setMaskEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Mask</strong>
          </label>
          {maskEnabled && (
            <>
              <label>
                diameter {maskDiameter}vh/w{' '}
                {slider(10, 150, 1, maskDiameter, setMaskDiameter)}
              </label>
              <label>
                solid end {maskStart}%{' '}
                {slider(0, 100, 1, maskStart, setMaskStart)}
              </label>
              <label>
                feather {maskEnd}% {slider(0, 100, 1, maskEnd, setMaskEnd)}
              </label>
            </>
          )}

          <HR />

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
                size {backdropSize1}{' '}
                {slider(10, 200, 1, backdropSize1, setBackdropSize1)}
              </label>
              <label>
                blur {backdropBlur1}px{' '}
                {slider(0, 200, 1, backdropBlur1, setBackdropBlur1)}
              </label>
              <label>
                opacity {backdropOpacity1.toFixed(2)}{' '}
                {slider(0, 1, 0.05, backdropOpacity1, setBackdropOpacity1)}
              </label>
              {colorRow('color 1', backdropColor1_1, setBackdropColor1_1)}
              {colorRow('color 2', backdropColor1_2, setBackdropColor1_2)}
              <label>
                grad start {backdropGradientStart1}%{' '}
                {slider(
                  0,
                  100,
                  1,
                  backdropGradientStart1,
                  setBackdropGradientStart1,
                )}
              </label>
              <label>
                grad end {backdropGradientEnd1}%{' '}
                {slider(
                  0,
                  100,
                  1,
                  backdropGradientEnd1,
                  setBackdropGradientEnd1,
                )}
              </label>
            </>
          )}

          <HR />

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
                size {backdropSize2}{' '}
                {slider(10, 500, 1, backdropSize2, setBackdropSize2)}
              </label>
              <label>
                blur {backdropBlur2}px{' '}
                {slider(0, 500, 1, backdropBlur2, setBackdropBlur2)}
              </label>
              <label>
                opacity {backdropOpacity2.toFixed(2)}{' '}
                {slider(0, 1, 0.05, backdropOpacity2, setBackdropOpacity2)}
              </label>
              {colorRow('color 1', backdropColor2_1, setBackdropColor2_1)}
              {colorRow('color 2', backdropColor2_2, setBackdropColor2_2)}
              <label>
                grad start {backdropGradientStart2}%{' '}
                {slider(
                  0,
                  200,
                  1,
                  backdropGradientStart2,
                  setBackdropGradientStart2,
                )}
              </label>
              <label>
                grad end {backdropGradientEnd2}%{' '}
                {slider(
                  0,
                  200,
                  1,
                  backdropGradientEnd2,
                  setBackdropGradientEnd2,
                )}
              </label>
            </>
          )}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={linearGradientEnabled}
              onChange={(e) => setLinearGradientEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Bottom Fade</strong>
          </label>
          {linearGradientEnabled && (
            <>
              {colorRow('color', linearGradientColor, setLinearGradientColor)}
              <label>
                height {linearGradientHeight}%{' '}
                {slider(
                  0,
                  100,
                  1,
                  linearGradientHeight,
                  setLinearGradientHeight,
                )}
              </label>
              <label>
                opacity {linearGradientOpacity.toFixed(2)}{' '}
                {slider(
                  0,
                  1,
                  0.05,
                  linearGradientOpacity,
                  setLinearGradientOpacity,
                )}
              </label>
            </>
          )}

          <HR />

          <button
            onClick={removeAllEffects}
            style={{ ...btnBase, background: '#a44' }}
          >
            Remove All Effects
          </button>
        </div>
      )}

      {/* ── Lighting panel ── */}
      {lightingPanelVisible && (
        <div style={{ ...panelStyle, top: 90, right: 10, width: 230 }}>
          <strong>Lighting Controls</strong>
          <p style={{ margin: 0, fontSize: 10, opacity: 0.6, lineHeight: 1.4 }}>
            Tweak here → Copy Config → paste into sceneConstants.ts
          </p>
          <button
            onClick={copyLightingToClipboard}
            style={{ ...btnBase, background: '#4a9eff' }}
          >
            Copy Lighting Config
          </button>

          <HR />

          {/* Environment Rotation */}
          <strong>Environment Rotation</strong>
          {['X', 'Y', 'Z'].map((axis, i) => (
            <label key={axis}>
              {axis} {envRotation[i].toFixed(2)}
              {slider(-Math.PI, Math.PI, 0.01, envRotation[i], (v) => {
                const next = [...envRotation];
                next[i] = v;
                setEnvRotation(next);
              })}
            </label>
          ))}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={ambientLightEnabled}
              onChange={(e) => setAmbientLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Ambient Light</strong>
          </label>
          {ambientLightEnabled && (
            <>
              <label>
                intensity {ambientLightIntensity.toFixed(1)}{' '}
                {slider(
                  0,
                  10,
                  0.1,
                  ambientLightIntensity,
                  setAmbientLightIntensity,
                )}
              </label>
              {colorRow('color', ambientLightColor, setAmbientLightColor)}
            </>
          )}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={directionalLightEnabled}
              onChange={(e) => setDirectionalLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Directional Light</strong>
          </label>
          {directionalLightEnabled && (
            <>
              <label>
                intensity {directionalLightIntensity.toFixed(1)}{' '}
                {slider(
                  0,
                  10,
                  0.1,
                  directionalLightIntensity,
                  setDirectionalLightIntensity,
                )}
              </label>
              {colorRow(
                'color',
                directionalLightColor,
                setDirectionalLightColor,
              )}
              {xyzSliders(
                directionalLightPosition,
                setDirectionalLightPosition,
              )}
            </>
          )}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={spotLightEnabled}
              onChange={(e) => setSpotLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Spot Light</strong>
          </label>
          {spotLightEnabled && (
            <>
              <label>
                intensity {spotLightIntensity.toFixed(1)}{' '}
                {slider(0, 20, 0.1, spotLightIntensity, setSpotLightIntensity)}
              </label>
              {colorRow('color', spotLightColor, setSpotLightColor)}
              <label>
                angle {spotLightAngle.toFixed(2)}{' '}
                {slider(0.01, 1.57, 0.01, spotLightAngle, setSpotLightAngle)}
              </label>
              <label>
                penumbra {spotLightPenumbra.toFixed(2)}{' '}
                {slider(0, 1, 0.01, spotLightPenumbra, setSpotLightPenumbra)}
              </label>
              {xyzSliders(spotLightPosition, setSpotLightPosition)}
            </>
          )}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={pointLightEnabled}
              onChange={(e) => setPointLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Point Light</strong>
          </label>
          {pointLightEnabled && (
            <>
              <label>
                intensity {pointLightIntensity.toFixed(1)}{' '}
                {slider(
                  0,
                  20,
                  0.1,
                  pointLightIntensity,
                  setPointLightIntensity,
                )}
              </label>
              {colorRow('color', pointLightColor, setPointLightColor)}
              <label>
                distance {pointLightDistance.toFixed(1)}{' '}
                {slider(0, 10, 0.1, pointLightDistance, setPointLightDistance)}
              </label>
              <label>
                decay {pointLightDecay.toFixed(1)}{' '}
                {slider(0, 3, 0.1, pointLightDecay, setPointLightDecay)}
              </label>
              {xyzSliders(pointLightPosition, setPointLightPosition)}
            </>
          )}

          <HR />

          <label>
            <input
              type="checkbox"
              checked={cycloLightEnabled}
              onChange={(e) => setCycloLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Cyclorama Light</strong>
          </label>
          {cycloLightEnabled && (
            <>
              <label>
                intensity {cycloLightIntensity.toFixed(1)}{' '}
                {slider(
                  0,
                  10,
                  0.1,
                  cycloLightIntensity,
                  setCycloLightIntensity,
                )}
              </label>
              {colorRow('color', cycloLightColor, setCycloLightColor)}
              {xyzSliders(cycloLightPosition, setCycloLightPosition)}
            </>
          )}
        </div>
      )}

      {/* ── Scene ── */}
      <div
        className="model__special-fx"
        style={{ position: 'relative', height: '100%', width: '100%' }}
      >
        <div className="bokeh-1" style={bokeh1Style} />
        <div className="bokeh-2" style={bokeh2Style} />
        <div className="linear-gradient" style={linearGradientStyle} />
        <div
          className="model"
          style={{ position: 'relative', height: '100%', width: '100%' }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100vh',
              height: '100vh',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              ...maskStyle,
            }}
          >
            <Canvas
              camera={{ position: [0, 0, 0.4], fov: 50 }}
              gl={{
                toneMapping: THREE.LinearToneMapping,
                toneMappingExposure: 1.0,
                alpha: true,
              }}
            >
              <SceneContent
                envRotation={envRotation}
                helpersVisible={helpersVisible}
                orbitEnabled={helpersVisible}
                isPaused={isPaused}
                onPlayClick={undefined}
                ambientLightEnabled={ambientLightEnabled}
                ambientLightIntensity={ambientLightIntensity}
                ambientLightColor={ambientLightColor}
                directionalLightEnabled={directionalLightEnabled}
                directionalLightIntensity={directionalLightIntensity}
                directionalLightColor={directionalLightColor}
                directionalLightPosition={directionalLightPosition}
                spotLightEnabled={spotLightEnabled}
                spotLightIntensity={spotLightIntensity}
                spotLightColor={spotLightColor}
                spotLightPosition={spotLightPosition}
                spotLightAngle={spotLightAngle}
                spotLightPenumbra={spotLightPenumbra}
                pointLightEnabled={pointLightEnabled}
                pointLightIntensity={pointLightIntensity}
                pointLightColor={pointLightColor}
                pointLightPosition={pointLightPosition}
                pointLightDistance={pointLightDistance}
                pointLightDecay={pointLightDecay}
                cycloLightEnabled={cycloLightEnabled}
                cycloLightIntensity={cycloLightIntensity}
                cycloLightColor={cycloLightColor}
                cycloLightPosition={cycloLightPosition}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
