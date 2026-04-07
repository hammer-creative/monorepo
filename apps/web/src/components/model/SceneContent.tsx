/* eslint-disable */
// @ts-nocheck

'use client';

import * as C from '@/components/model/sceneConstants';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';

import { ENVIRONMENT_MAP_SOURCE, GLB_SOURCE } from './sceneConstants';
import SceneModel from './SceneModel';

useGLTF.preload(`/model/${GLB_SOURCE}`);

const LC = C.LIGHTING_CONFIG;

export default function SceneContent({
  wireframe = false,
  helpersVisible = false,
  orbitEnabled = false,
  isPaused = false,
  onPlayClick,
  ambientLightEnabled = LC.ambientLight.enabled,
  ambientLightIntensity = LC.ambientLight.intensity,
  ambientLightColor = LC.ambientLight.color,
  directionalLightEnabled = LC.directionalLight.enabled,
  directionalLightIntensity = LC.directionalLight.intensity,
  directionalLightColor = LC.directionalLight.color,
  directionalLightPosition = LC.directionalLight.position,
  spotLightEnabled = LC.spotLight.enabled,
  spotLightIntensity = LC.spotLight.intensity,
  spotLightColor = LC.spotLight.color,
  spotLightPosition = LC.spotLight.position,
  spotLightAngle = LC.spotLight.angle,
  spotLightPenumbra = LC.spotLight.penumbra,
  pointLightEnabled = LC.pointLight.enabled,
  pointLightIntensity = LC.pointLight.intensity,
  pointLightColor = LC.pointLight.color,
  pointLightPosition = LC.pointLight.position,
  pointLightDistance = LC.pointLight.distance,
  pointLightDecay = LC.pointLight.decay,
  cycloLightEnabled = LC.cycloLight.enabled,
  cycloLightIntensity = LC.cycloLight.intensity,
  cycloLightColor = LC.cycloLight.color,
  cycloLightPosition = LC.cycloLight.position,
  envRotation = [0.5, Math.PI / 4, 0.5],
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
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.01}
            shadow-camera-far={10}
            shadow-camera-left={-0.5}
            shadow-camera-right={0.5}
            shadow-camera-top={0.5}
            shadow-camera-bottom={-0.5}
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
        <Environment
          files={`/model/environment/${ENVIRONMENT_MAP_SOURCE}`}
          background={false}
          environmentRotation={[0.4, 2.1, 2]} // <-- use these coordinates for production
        />

        <SceneModel
          url={`/model/${GLB_SOURCE}`}
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
