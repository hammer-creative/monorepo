/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/model/SceneContent.tsx

'use client';

import { OrbitControls } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';

import SceneModel from './SceneModel';

export default function SceneContent({
  helpersVisible,
  orbitEnabled,
  isPaused,
  onPlayClick,
  ambientLightEnabled,
  ambientLightIntensity,
  ambientLightColor,
  directionalLightEnabled,
  directionalLightIntensity,
  directionalLightColor,
  directionalLightPosition,
  spotLightEnabled,
  spotLightIntensity,
  spotLightColor,
  spotLightPosition,
  spotLightAngle,
  spotLightPenumbra,
  pointLightEnabled,
  pointLightIntensity,
  pointLightColor,
  pointLightPosition,
  pointLightDistance,
  pointLightDecay,
  cycloLightEnabled,
  cycloLightIntensity,
  cycloLightColor,
  cycloLightPosition,
}) {
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();

  useEffect(() => {
    if (spotLightRef.current && spotLightTargetRef.current) {
      spotLightRef.current.target = spotLightTargetRef.current;
    }
  }, []);

  return (
    <>
      {helpersVisible && (
        <>
          <axesHelper args={[1]} />
          <gridHelper args={[10, 10]} />
        </>
      )}

      {ambientLightEnabled && (
        <ambientLight
          intensity={ambientLightIntensity}
          color={ambientLightColor}
        />
      )}

      {directionalLightEnabled && (
        <>
          <directionalLight
            position={directionalLightPosition}
            intensity={directionalLightIntensity}
            color={directionalLightColor}
          />
          {helpersVisible && (
            <mesh position={directionalLightPosition}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={directionalLightColor} />
            </mesh>
          )}
        </>
      )}

      {spotLightEnabled && (
        <>
          <object3D ref={spotLightTargetRef} position={[0, 0, 0]} />
          <spotLight
            ref={spotLightRef}
            position={spotLightPosition}
            intensity={spotLightIntensity}
            color={spotLightColor}
            angle={spotLightAngle}
            penumbra={spotLightPenumbra}
          />
          {helpersVisible && (
            <>
              <mesh position={spotLightPosition}>
                <coneGeometry args={[0.05, 0.2, 8]} />
                <meshBasicMaterial color={spotLightColor} />
              </mesh>
              <line>
                <bufferGeometry attach="geometry">
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={
                      new Float32Array([
                        spotLightPosition[0],
                        spotLightPosition[1],
                        spotLightPosition[2],
                        0,
                        0,
                        0,
                      ])
                    }
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  attach="material"
                  color={spotLightColor}
                  opacity={0.5}
                  transparent
                />
              </line>
            </>
          )}
        </>
      )}

      {pointLightEnabled && (
        <>
          <pointLight
            position={pointLightPosition}
            intensity={pointLightIntensity}
            color={pointLightColor}
            distance={pointLightDistance}
            decay={pointLightDecay}
          />
          {helpersVisible && (
            <mesh position={pointLightPosition}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={pointLightColor} />
            </mesh>
          )}
        </>
      )}

      {cycloLightEnabled && (
        <>
          <pointLight
            position={cycloLightPosition}
            intensity={cycloLightIntensity}
            color={cycloLightColor}
          />
          {helpersVisible && (
            <mesh position={cycloLightPosition}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={cycloLightColor} />
            </mesh>
          )}
        </>
      )}

      <Suspense fallback={null}>
        <SceneModel
          url="/model/model-v7-modified-v3.glb"
          isPaused={isPaused}
          onPlayClick={onPlayClick}
        />
      </Suspense>
      <OrbitControls
        enabled={orbitEnabled}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}
