/* eslint-disable */
// @ts-nocheck

'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

import '../../styles/scene/model.css';

import * as C from './sceneConstants';
import SceneContent from './SceneContent';

const { TONE_MAPPING_EXPOSURE, LIGHTING_CONFIG: L, SHOW_HELPER_PANELS } = C;

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
          environmentrotation={[0, Math.PI * 1.2, 0]}
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: TONE_MAPPING_EXPOSURE,
            alpha: true,
          }}
        >
          <SceneContent
            helpersVisible={SHOW_HELPER_PANELS}
            orbitEnabled={SHOW_HELPER_PANELS}
            isPaused={isPaused}
            onPlayClick={onPlayClick}
            ambientLightEnabled={L.ambientLight.enabled}
            ambientLightIntensity={L.ambientLight.intensity}
            ambientLightColor={L.ambientLight.color}
            directionalLightEnabled={L.directionalLight.enabled}
            directionalLightIntensity={L.directionalLight.intensity}
            directionalLightColor={L.directionalLight.color}
            directionalLightPosition={L.directionalLight.position}
            spotLightEnabled={L.spotLight.enabled}
            spotLightIntensity={L.spotLight.intensity}
            spotLightColor={L.spotLight.color}
            spotLightPosition={L.spotLight.position}
            spotLightAngle={L.spotLight.angle}
            spotLightPenumbra={L.spotLight.penumbra}
            pointLightEnabled={L.pointLight.enabled}
            pointLightIntensity={L.pointLight.intensity}
            pointLightColor={L.pointLight.color}
            pointLightPosition={L.pointLight.position}
            pointLightDistance={L.pointLight.distance}
            pointLightDecay={L.pointLight.decay}
            cycloLightEnabled={L.cycloLight.enabled}
            cycloLightIntensity={L.cycloLight.intensity}
            cycloLightColor={L.cycloLight.color}
            cycloLightPosition={L.cycloLight.position}
          />
        </Canvas>
      </div>
    </div>
  );
}
