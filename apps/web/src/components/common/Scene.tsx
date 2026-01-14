/* eslint-disable */
// @ts-nocheck

// apps/web/src/components/common/Scene.tsx

'use client';

import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);

  // Log everything in the model
  console.log('=== MODEL STRUCTURE ===');
  gltf.scene.traverse((child) => {
    if (child.name === 'Shadow_Catch') {
      child.visible = false;
    }

    // @ts-ignore
    if (child.isMesh) {
      console.log('Mesh:', child.name);
      console.log('  Material:', child.material?.name);
      console.log('  Has texture?', !!child.material?.map);
      if (child.material?.map) {
        console.log(
          '  Texture size:',
          child.material.map.image?.width,
          'x',
          child.material.map.image?.height,
        );
      }
      console.log('  Vertex count:', child.geometry.attributes.position.count);
      console.log('---');
    }
  });

  return <primitive object={gltf.scene} />;
}
const SceneContent = ({
  helpersVisible,
  orbitEnabled,
}: {
  helpersVisible: boolean;
  orbitEnabled: boolean;
}) => {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      {helpersVisible && (
        <>
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
        </>
      )}
      <Suspense fallback={null}>
        <Model url="/model/model-v3r4.glb" />
      </Suspense>
      <OrbitControls
        enabled={orbitEnabled}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
};

export default function Scene() {
  const [helpersVisible, setHelpersVisible] = useState(false);

  return (
    <div className="model">
      <button
        onClick={() => setHelpersVisible(!helpersVisible)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: '10px 20px',
          background: helpersVisible ? '#4a4' : '#444',
          color: helpersVisible ? '#000' : '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        Helpers/Orbit: {helpersVisible ? 'ON' : 'OFF'}
      </button>

      <Canvas camera={{ position: [0, 0, 1.1], fov: 50 }}>
        <SceneContent
          helpersVisible={helpersVisible}
          orbitEnabled={helpersVisible}
        />
      </Canvas>
    </div>
  );
}
