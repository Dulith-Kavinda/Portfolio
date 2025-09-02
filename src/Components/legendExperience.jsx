import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Legend from './Legend';

export default function Experience({Play}) {
    return (
        <Canvas className='legend !w-[550px] !h-[700px] absolute z-[20]'
            camera={{
                fov: 64,
                position: [0.5, 1.5, 3.2],
            }}
        >
            <ambientLight intensity={1} />
            <directionalLight position={[5, 0, -5]} color="yellow" />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} color="yellow" />
            <pointLight position={[-10, -10, -10]} color="yellow" />
            <Suspense fallback={null}>
                <group scale={1}>
                    <Legend command={Play}/>
                </group>
            </Suspense>
            <OrbitControls enableZoom={false} />
        </Canvas>
    )
}