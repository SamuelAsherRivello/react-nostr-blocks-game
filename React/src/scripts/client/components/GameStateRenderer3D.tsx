import React, { useRef, useState } from 'react';
import { GameState, CubeDto } from './App';
import { Typography, Box } from '@mui/material';
import * as THREE from '@react-three/fiber';
import { Mesh } from 'three/src/objects/Mesh';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei/core';
import { Color } from 'three';
import type { Camera, Event } from 'three';

interface GameStateRendererProps {
  gameState: GameState;
  onCubeClick: (cube: CubeDto) => void;
}

type CubeProps = THREE.ThreeElements['mesh'] & {
  cubeData: CubeDto;
  onCubeClick: (cube: CubeDto) => void;
};

function Cube(props: CubeProps) {
  const xOffset = -GameState.RoundIndexMax / 2 - 2;
  const blueColor = new Color(0x74b7f0);
  const greyColor = new Color(0xe0e0e0);
  const meshRef = useRef<Mesh>(null!);
  const [isHovering, setIsHovering] = useState(false);
  THREE.useFrame((state, delta) => {
    if (isHovering) {
      meshRef.current.scale.set(1, 1, 1);
    } else {
      meshRef.current.scale.set(0.9, 0.9, 0.9);
    }
    meshRef.current.rotation.x += delta * 0.2;
  });

  const getColor = (): Color => {
    return props.cubeData.isAvailable ? blueColor : greyColor;
  };

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={[0.9, 0.9, 0.9]}
      position={[xOffset + props.cubeData.x, props.cubeData.y, props.cubeData.z]}
      onPointerDown={(event) => props.cubeData.isAvailable && props.onCubeClick(props.cubeData)}
      onPointerOver={(event) => setIsHovering(true)}
      onPointerOut={(event) => setIsHovering(false)}
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
      <THREE.Canvas camera={{ manual: true }}>
        <PerspectiveCamera makeDefault position={[0, 1, 20]} rotation={[0, 0, 0]} fov={10} near={0.1} far={1000} />
        <OrbitControls makeDefault />
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
