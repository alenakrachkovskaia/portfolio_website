import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stage } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/slimak.glb')
  return <primitive object={scene} />
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  )
}

export default function ModelViewer() {
  return (
    <div className="model-viewer-banner">
      <div className="model-viewer-canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Stage
            environment="city"
            intensity={2.6}
            adjustCamera={1.2}
            shadows={false}
          >
            <Suspense fallback={<Loader />}>
              <Model />
            </Suspense>
          </Stage>

          <OrbitControls
            autoRotate
            autoRotateSpeed={1.5}
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>
    </div>
  )
}

useGLTF.preload('/slimak.glb')
