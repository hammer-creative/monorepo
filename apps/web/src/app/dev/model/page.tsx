// apps/web/src/dev/model/page.tsx

'use client';

/* eslint-disable */
// @ts-nocheck
import * as C from '@/components/model/sceneConstants';
import SceneContent from '@/components/model/SceneContent';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';

const { TONE_MAPPING_EXPOSURE } = C;

export default function ModelDevPage() {
  const [helpersVisible, setHelpersVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [lightingPanelVisible, setLightingPanelVisible] = useState(false);

  const [maskEnabled, setMaskEnabled] = useState(false);
  const [maskStart, setMaskStart] = useState(0);
  const [maskEnd, setMaskEnd] = useState(0);
  const [maskDiameter, setMaskDiameter] = useState(0);

  const [bokeh1Enabled, setBokeh1Enabled] = useState(true);
  const [backdropSize1, setBackdropSize1] = useState(0);
  const [backdropBlur1, setBackdropBlur1] = useState(0);
  const [backdropOpacity1, setBackdropOpacity1] = useState(0);
  const [backdropColor1_1, setBackdropColor1_1] = useState('#000000');
  const [backdropColor1_2, setBackdropColor1_2] = useState('#000000');
  const [backdropGradientStart1, setBackdropGradientStart1] = useState(0);
  const [backdropGradientEnd1, setBackdropGradientEnd1] = useState(0);

  const [bokeh2Enabled, setBokeh2Enabled] = useState(true);
  const [backdropSize2, setBackdropSize2] = useState(0);
  const [backdropBlur2, setBackdropBlur2] = useState(0);
  const [backdropOpacity2, setBackdropOpacity2] = useState(0);
  const [backdropColor2_1, setBackdropColor2_1] = useState('#000000');
  const [backdropColor2_2, setBackdropColor2_2] = useState('#000000');
  const [backdropGradientStart2, setBackdropGradientStart2] = useState(0);
  const [backdropGradientEnd2, setBackdropGradientEnd2] = useState(0);

  const [linearGradientEnabled, setLinearGradientEnabled] = useState(false);
  const [linearGradientColor, setLinearGradientColor] = useState('#000000');
  const [linearGradientOpacity, setLinearGradientOpacity] = useState(0);
  const [linearGradientHeight, setLinearGradientHeight] = useState(0);

  const [ambientLightEnabled, setAmbientLightEnabled] = useState(
    C.AMBIENT_LIGHT_ENABLED,
  );
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(
    C.AMBIENT_LIGHT_INTENSITY_DEFAULT,
  );
  const [ambientLightColor, setAmbientLightColor] = useState(
    C.AMBIENT_LIGHT_COLOR,
  );

  const [directionalLightEnabled, setDirectionalLightEnabled] = useState(
    C.DIRECTIONAL_LIGHT_ENABLED,
  );
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(
    C.DIRECTIONAL_LIGHT_INTENSITY_DEFAULT,
  );
  const [directionalLightColor, setDirectionalLightColor] = useState(
    C.DIRECTIONAL_LIGHT_COLOR,
  );
  const [directionalLightPosition, setDirectionalLightPosition] = useState(
    C.DIRECTIONAL_LIGHT_POSITION_DEFAULT,
  );

  const [spotLightEnabled, setSpotLightEnabled] = useState(
    C.SPOT_LIGHT_ENABLED,
  );
  const [spotLightIntensity, setSpotLightIntensity] = useState(
    C.SPOT_LIGHT_INTENSITY,
  );
  const [spotLightColor, setSpotLightColor] = useState(C.SPOT_LIGHT_COLOR);
  const [spotLightPosition, setSpotLightPosition] = useState(
    C.SPOT_LIGHT_POSITION,
  );
  const [spotLightAngle, setSpotLightAngle] = useState(C.SPOT_LIGHT_ANGLE);
  const [spotLightPenumbra, setSpotLightPenumbra] = useState(
    C.SPOT_LIGHT_PENUMBRA,
  );

  const [pointLightEnabled, setPointLightEnabled] = useState(
    C.POINT_LIGHT_ENABLED,
  );
  const [pointLightIntensity, setPointLightIntensity] = useState(
    C.POINT_LIGHT_INTENSITY,
  );
  const [pointLightColor, setPointLightColor] = useState(C.POINT_LIGHT_COLOR);
  const [pointLightPosition, setPointLightPosition] = useState(
    C.POINT_LIGHT_POSITION,
  );
  const [pointLightDistance, setPointLightDistance] = useState(
    C.POINT_LIGHT_DISTANCE,
  );
  const [pointLightDecay, setPointLightDecay] = useState(C.POINT_LIGHT_DECAY);

  const [cycloLightEnabled, setCycloLightEnabled] = useState(
    C.CYCLO_LIGHT_ENABLED,
  );
  const [cycloLightIntensity, setCycloLightIntensity] = useState(
    C.CYCLO_LIGHT_INTENSITY,
  );
  const [cycloLightColor, setCycloLightColor] = useState(C.CYCLO_LIGHT_COLOR);
  const [cycloLightPosition, setCycloLightPosition] = useState(
    C.CYCLO_LIGHT_POSITION,
  );

  const [presets, setPresets] = useState([]);
  const [presetCounter, setPresetCounter] = useState(1);

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const removeAll = () => {
    setMaskEnabled(false);
    setBokeh1Enabled(false);
    setBokeh2Enabled(false);
    setLinearGradientEnabled(false);
  };

  const savePreset = () => {
    const preset = {
      name: `preset-${String(presetCounter).padStart(3, '0')}`,
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
    const newPresets = [...presets, preset];
    const newCounter = presetCounter + 1;
    setPresets(newPresets);
    setPresetCounter(newCounter);
    localStorage.setItem('bokeh-presets', JSON.stringify(newPresets));
    localStorage.setItem('bokeh-preset-counter', String(newCounter));
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
    const newPresets = presets.filter((_, i) => i !== index);
    setPresets(newPresets);
    localStorage.setItem('bokeh-presets', JSON.stringify(newPresets));
  };

  const copyCssToClipboard = () => {
    const css = `
${
  maskEnabled
    ? `/* Mask */
mask-image: radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%);
-webkit-mask-image: radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%);
mask-size: ${maskDiameter}vh ${maskDiameter}vh;
-webkit-mask-size: ${maskDiameter}vh ${maskDiameter}vh;
mask-position: center;
-webkit-mask-position: center;
mask-repeat: no-repeat;
-webkit-mask-repeat: no-repeat;`
    : ''
}

${
  bokeh1Enabled
    ? `.bokeh-1 {
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
}`
    : ''
}

${
  bokeh2Enabled
    ? `.bokeh-2 {
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
}`
    : ''
}

${
  linearGradientEnabled
    ? `.linear-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${linearGradientHeight}%;
  background: linear-gradient(to top, ${linearGradientColor}, transparent);
  opacity: ${linearGradientOpacity};
  pointer-events: none;
  z-index: 3;
}`
    : ''
}`.trim();

    navigator.clipboard.writeText(css);
    alert('CSS copied to clipboard!');
  };

  const copyLightingToClipboard = () => {
    const config = `// Lighting config — paste into sceneConstants.ts
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
};`;

    navigator.clipboard.writeText(config);
    alert('Lighting config copied to clipboard!');
  };

  const maskStyle = maskEnabled
    ? {
        maskImage: `radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%)`,
        WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${maskStart}%, transparent ${maskEnd}%)`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }
    : {};

  const backdropBokehStyle1 = {
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
    zIndex: 1,
  };

  const backdropBokehStyle2 = {
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
    zIndex: 2,
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
    zIndex: 3,
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Effects Panel */}
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

      <button
        onClick={() => setHelpersVisible(!helpersVisible)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1001,
          padding: '8px 12px',
          background: helpersVisible ? '#4a4' : '#444',
          color: helpersVisible ? '#000' : '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        Helpers: {helpersVisible ? 'ON' : 'OFF'}
      </button>

      <button
        onClick={() => setLightingPanelVisible(!lightingPanelVisible)}
        style={{
          position: 'absolute',
          top: 50,
          left: 10,
          zIndex: 1001,
          padding: '8px 12px',
          background: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        {lightingPanelVisible ? 'Hide' : 'Show'} Lighting
      </button>

      {panelVisible && (
        <div
          style={{
            position: 'absolute',
            top: 90,
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
            onClick={copyCssToClipboard}
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
            <strong>Bottom Fade</strong>
          </label>
          {linearGradientEnabled && (
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                color
                <input
                  type="color"
                  value={linearGradientColor}
                  onChange={(e) => setLinearGradientColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(linearGradientColor)}
                </code>
              </label>
              <label>
                height {linearGradientHeight}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={linearGradientHeight}
                  onChange={(e) => setLinearGradientHeight(+e.target.value)}
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

          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          <button
            onClick={removeAll}
            style={{
              padding: '8px 12px',
              background: '#a44',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            Remove All Effects
          </button>
        </div>
      )}

      {lightingPanelVisible && (
        <div
          style={{
            position: 'absolute',
            top: 90,
            right: 10,
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
            width: 220,
          }}
        >
          <strong>Lighting Controls</strong>
          <button
            onClick={copyLightingToClipboard}
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
            Copy Lighting Config
          </button>

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
              checked={ambientLightEnabled}
              onChange={(e) => setAmbientLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Ambient Light</strong>
          </label>
          {ambientLightEnabled && (
            <>
              <label>
                intensity {ambientLightIntensity.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={ambientLightIntensity}
                  onChange={(e) => setAmbientLightIntensity(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                color
                <input
                  type="color"
                  value={ambientLightColor}
                  onChange={(e) => setAmbientLightColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(ambientLightColor)}
                </code>
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
              checked={directionalLightEnabled}
              onChange={(e) => setDirectionalLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Directional Light</strong>
          </label>
          {directionalLightEnabled && (
            <>
              <label>
                intensity {directionalLightIntensity.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={directionalLightIntensity}
                  onChange={(e) =>
                    setDirectionalLightIntensity(+e.target.value)
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                color
                <input
                  type="color"
                  value={directionalLightColor}
                  onChange={(e) => setDirectionalLightColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(directionalLightColor)}
                </code>
              </label>
              <label>
                X {directionalLightPosition[0].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={directionalLightPosition[0]}
                  onChange={(e) =>
                    setDirectionalLightPosition([
                      +e.target.value,
                      directionalLightPosition[1],
                      directionalLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Y {directionalLightPosition[1].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={directionalLightPosition[1]}
                  onChange={(e) =>
                    setDirectionalLightPosition([
                      directionalLightPosition[0],
                      +e.target.value,
                      directionalLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Z {directionalLightPosition[2].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={directionalLightPosition[2]}
                  onChange={(e) =>
                    setDirectionalLightPosition([
                      directionalLightPosition[0],
                      directionalLightPosition[1],
                      +e.target.value,
                    ])
                  }
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
              checked={spotLightEnabled}
              onChange={(e) => setSpotLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Spot Light</strong>
          </label>
          {spotLightEnabled && (
            <>
              <label>
                intensity {spotLightIntensity.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.1}
                  value={spotLightIntensity}
                  onChange={(e) => setSpotLightIntensity(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                color
                <input
                  type="color"
                  value={spotLightColor}
                  onChange={(e) => setSpotLightColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(spotLightColor)}
                </code>
              </label>
              <label>
                angle {spotLightAngle.toFixed(2)}
                <input
                  type="range"
                  min={0.1}
                  max={1.57}
                  step={0.01}
                  value={spotLightAngle}
                  onChange={(e) => setSpotLightAngle(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                penumbra {spotLightPenumbra.toFixed(2)}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={spotLightPenumbra}
                  onChange={(e) => setSpotLightPenumbra(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                X {spotLightPosition[0].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={spotLightPosition[0]}
                  onChange={(e) =>
                    setSpotLightPosition([
                      +e.target.value,
                      spotLightPosition[1],
                      spotLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Y {spotLightPosition[1].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={spotLightPosition[1]}
                  onChange={(e) =>
                    setSpotLightPosition([
                      spotLightPosition[0],
                      +e.target.value,
                      spotLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Z {spotLightPosition[2].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={spotLightPosition[2]}
                  onChange={(e) =>
                    setSpotLightPosition([
                      spotLightPosition[0],
                      spotLightPosition[1],
                      +e.target.value,
                    ])
                  }
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
              checked={pointLightEnabled}
              onChange={(e) => setPointLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Point Light</strong>
          </label>
          {pointLightEnabled && (
            <>
              <label>
                intensity {pointLightIntensity.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.1}
                  value={pointLightIntensity}
                  onChange={(e) => setPointLightIntensity(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                color
                <input
                  type="color"
                  value={pointLightColor}
                  onChange={(e) => setPointLightColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(pointLightColor)}
                </code>
              </label>
              <label>
                distance {pointLightDistance.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={pointLightDistance}
                  onChange={(e) => setPointLightDistance(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                decay {pointLightDecay.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={0.1}
                  value={pointLightDecay}
                  onChange={(e) => setPointLightDecay(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                X {pointLightPosition[0].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={pointLightPosition[0]}
                  onChange={(e) =>
                    setPointLightPosition([
                      +e.target.value,
                      pointLightPosition[1],
                      pointLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Y {pointLightPosition[1].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={pointLightPosition[1]}
                  onChange={(e) =>
                    setPointLightPosition([
                      pointLightPosition[0],
                      +e.target.value,
                      pointLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Z {pointLightPosition[2].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={pointLightPosition[2]}
                  onChange={(e) =>
                    setPointLightPosition([
                      pointLightPosition[0],
                      pointLightPosition[1],
                      +e.target.value,
                    ])
                  }
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
              checked={cycloLightEnabled}
              onChange={(e) => setCycloLightEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <strong>Cyclorama Light</strong>
          </label>
          {cycloLightEnabled && (
            <>
              <label>
                intensity {cycloLightIntensity.toFixed(1)}
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={cycloLightIntensity}
                  onChange={(e) => setCycloLightIntensity(+e.target.value)}
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                color
                <input
                  type="color"
                  value={cycloLightColor}
                  onChange={(e) => setCycloLightColor(e.target.value)}
                />
                <code style={{ fontSize: 10 }}>
                  {hexToRgba(cycloLightColor)}
                </code>
              </label>
              <label>
                X {cycloLightPosition[0].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={cycloLightPosition[0]}
                  onChange={(e) =>
                    setCycloLightPosition([
                      +e.target.value,
                      cycloLightPosition[1],
                      cycloLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Y {cycloLightPosition[1].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={cycloLightPosition[1]}
                  onChange={(e) =>
                    setCycloLightPosition([
                      cycloLightPosition[0],
                      +e.target.value,
                      cycloLightPosition[2],
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
              <label>
                Z {cycloLightPosition[2].toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={cycloLightPosition[2]}
                  onChange={(e) =>
                    setCycloLightPosition([
                      cycloLightPosition[0],
                      cycloLightPosition[1],
                      +e.target.value,
                    ])
                  }
                  style={{ width: 120, marginLeft: 8 }}
                />
              </label>
            </>
          )}
        </div>
      )}

      <div
        className="model__special-fx"
        style={{ position: 'relative', height: '100%', width: '100%' }}
      >
        {bokeh1Enabled && (
          <div className="bokeh-1" style={backdropBokehStyle1} />
        )}
        {bokeh2Enabled && (
          <div className="bokeh-2" style={backdropBokehStyle2} />
        )}
        {linearGradientEnabled && (
          <div className="linear-gradient" style={linearGradientStyle} />
        )}

        <div
          style={{
            position: 'relative',
            width: '100vh',
            height: '100vh',
            margin: '0 auto',
          }}
        >
          <div
            className="model"
            style={{
              ...maskStyle,
              position: 'relative',
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
