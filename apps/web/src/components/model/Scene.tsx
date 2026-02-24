/* eslint-disable */
// @ts-nocheck

'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

import * as C from './sceneConstants';
import SceneContent from './SceneContent';

const {
  TONE_MAPPING_EXPOSURE,
  AMBIENT_LIGHT_ENABLED,
  AMBIENT_LIGHT_COLOR,
  AMBIENT_LIGHT_INTENSITY_DEFAULT,
  DIRECTIONAL_LIGHT_ENABLED,
  DIRECTIONAL_LIGHT_COLOR,
  DIRECTIONAL_LIGHT_INTENSITY_DEFAULT,
  DIRECTIONAL_LIGHT_POSITION_DEFAULT,
  SPOT_LIGHT_ENABLED,
  SPOT_LIGHT_INTENSITY,
  SPOT_LIGHT_COLOR,
  SPOT_LIGHT_POSITION,
  SPOT_LIGHT_ANGLE,
  SPOT_LIGHT_PENUMBRA,
  POINT_LIGHT_ENABLED,
  POINT_LIGHT_INTENSITY,
  POINT_LIGHT_COLOR,
  POINT_LIGHT_POSITION,
  POINT_LIGHT_DISTANCE,
  POINT_LIGHT_DECAY,
  CYCLO_LIGHT_ENABLED,
  CYCLO_LIGHT_INTENSITY,
  CYCLO_LIGHT_COLOR,
  CYCLO_LIGHT_POSITION,
} = C;

export default function Scene({ onPlayClick }: { onPlayClick?: () => void }) {
  const [isPaused, setIsPaused] = useState(false);

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
    <div
      className="model__special-fx"
      style={{ position: 'relative', height: '100vh', width: '100vw' }}
    >
      <div className="bokeh-1" />
      <div className="bokeh-2" />
      <div className="linear-gradient" />

      <div
        className="model"
        style={{ position: 'relative', height: '100%', width: '100%' }}
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
            helpersVisible={false}
            orbitEnabled={false}
            isPaused={isPaused}
            onPlayClick={onPlayClick}
            ambientLightEnabled={AMBIENT_LIGHT_ENABLED}
            ambientLightIntensity={AMBIENT_LIGHT_INTENSITY_DEFAULT}
            ambientLightColor={AMBIENT_LIGHT_COLOR}
            directionalLightEnabled={DIRECTIONAL_LIGHT_ENABLED}
            directionalLightIntensity={DIRECTIONAL_LIGHT_INTENSITY_DEFAULT}
            directionalLightColor={DIRECTIONAL_LIGHT_COLOR}
            directionalLightPosition={DIRECTIONAL_LIGHT_POSITION_DEFAULT}
            spotLightEnabled={SPOT_LIGHT_ENABLED}
            spotLightIntensity={SPOT_LIGHT_INTENSITY}
            spotLightColor={SPOT_LIGHT_COLOR}
            spotLightPosition={SPOT_LIGHT_POSITION}
            spotLightAngle={SPOT_LIGHT_ANGLE}
            spotLightPenumbra={SPOT_LIGHT_PENUMBRA}
            pointLightEnabled={POINT_LIGHT_ENABLED}
            pointLightIntensity={POINT_LIGHT_INTENSITY}
            pointLightColor={POINT_LIGHT_COLOR}
            pointLightPosition={POINT_LIGHT_POSITION}
            pointLightDistance={POINT_LIGHT_DISTANCE}
            pointLightDecay={POINT_LIGHT_DECAY}
            cycloLightEnabled={CYCLO_LIGHT_ENABLED}
            cycloLightIntensity={CYCLO_LIGHT_INTENSITY}
            cycloLightColor={CYCLO_LIGHT_COLOR}
            cycloLightPosition={CYCLO_LIGHT_POSITION}
          />
        </Canvas>
      </div>
    </div>
  );
}
