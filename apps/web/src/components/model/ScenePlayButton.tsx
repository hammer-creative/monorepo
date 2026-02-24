/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/model/ScenePlayButton.tsx

'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import * as C from './sceneConstants';

const { PLAY_BUTTON_Z, PLAY_BUTTON_SCALE, PLAY_BUTTON_COLOR } = C;

interface ScenePlayButtonProps {
  onClick: () => void;
  isPlaying: boolean;
}

export default function ScenePlayButton({
  onClick,
  isPlaying,
}: ScenePlayButtonProps) {
  const triangleGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(25.5 / 17.32, -8.66 / 17.32);
    shape.lineTo(0, -17.32 / 17.32);
    shape.lineTo(0, 0);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape);
    geo.center();
    return geo;
  }, []);

  const hoveredRef = useRef(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef(
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(PLAY_BUTTON_COLOR),
      side: THREE.DoubleSide,
      depthTest: false,
      transparent: true,
      opacity: 1,
    }),
  );

  useFrame(() => {
    const targetColor = new THREE.Color(
      hoveredRef.current ? '#C7D3D3' : PLAY_BUTTON_COLOR,
    );
    materialRef.current.color.lerp(targetColor, 0.2);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, PLAY_BUTTON_Z]}
      scale={[PLAY_BUTTON_SCALE, PLAY_BUTTON_SCALE, 1]}
      geometry={triangleGeometry}
      material={materialRef.current}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        hoveredRef.current = true;
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        hoveredRef.current = false;
        document.body.style.cursor = 'auto';
      }}
    />
  );
}
