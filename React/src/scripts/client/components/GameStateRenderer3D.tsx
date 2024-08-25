import React, { useRef, useState } from 'react';
import { GameState, CubeData } from './App';
import { Typography, Box } from '@mui/material';
import * as THREE from '@react-three/fiber';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three';
import { blue, grey } from '@mui/material/colors';

interface GameStateRendererProps {
  gameState: GameState;
  onCubeClick: (cube: CubeData) => void;
}

type CubeProps = THREE.ThreeElements['mesh'] & {
  cubeData: CubeData;
  onCubeClick: (cube: CubeData) => void;
};

function Cube(props: CubeProps) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  THREE.useFrame((state, delta) => (meshRef.current.rotation.x += delta * 0.5));
  const getColor = (): Color => {
    return props.cubeData.isAvailable ? new Color(blue[400]) : new Color(grey[200]);
  };

  const connectToRelay = async (nextRelay: string) => {};

  return (
    <mesh
      {...props}
      ref={meshRef}
      position={[props.cubeData.x * 1.1, props.cubeData.y, props.cubeData.z]}
      onPointerDown={(event) => props.cubeData.isAvailable && props.onCubeClick(props.cubeData)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
}

const GameStateRenderer2D: React.FC<GameStateRendererProps> = ({ gameState, onCubeClick }) => {
  return (
    <Box maxHeight={150} flexDirection={'column'} display={'flex'} alignItems={'left'} justifyContent={'top'}>
      <Typography sx={{ marginBottom: 2 }}></Typography>
      <Typography variant="caption">Game State Renderer 3D</Typography>
      {/** 3D **/}
      <THREE.Canvas camera={{ fov: 10, near: 0.1, far: 1000, position: [0, 0, -30] }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {gameState.cubeDatas.map((cubeData, index) => (
          <Cube key={index} cubeData={cubeData} onCubeClick={onCubeClick} />
        ))}
      </THREE.Canvas>
    </Box>
  );
};

export default GameStateRenderer2D;
