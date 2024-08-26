import React, { useRef, useState, useEffect } from 'react';
import { Mesh, Color } from 'three';
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Box, Typography } from '@mui/material';
import { CubeDto, NostrBlocksBot } from './App';

type CubeProps = ThreeElements['mesh'] & {
  cubeData: CubeDto;
  isSelected: boolean;
  onCubeClick: (cube: CubeDto) => void;
};

function Cube(props: CubeProps) {
  const xOffset = -NostrBlocksBot.RoundIndexMax / 2 - 2;
  const yellowColor = new Color(0xf6e44d);
  const blueColor = new Color(0x74b7f0);
  const greyColor = new Color(0xe0e0e0);
  const meshRef = useRef<Mesh>(null!);
  const [isHovering, setIsHovering] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    isSelected && props.onCubeClick(props.cubeData);
  }, [isSelected]);

  useFrame((state, delta) => {
    if (isHovering && props.cubeData.isAvailable) {
      meshRef.current.scale.set(1, 1, 1);
    } else {
      meshRef.current.scale.set(0.9, 0.9, 0.9);
    }
    meshRef.current.rotation.x += delta * 0.2;
  });

  const getColor = (): Color => {
    if (isSelected) {
      return yellowColor;
    }
    return props.cubeData.isAvailable ? blueColor : greyColor;
  };

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={[0.9, 0.9, 0.9]}
      position={[xOffset + props.cubeData.x, props.cubeData.y, props.cubeData.z]}
      onPointerDown={(event) => props.cubeData.isAvailable && setIsSelected(!isSelected)}
      onPointerOver={(event) => props.cubeData.isAvailable && setIsHovering(true)}
      onPointerOut={(event) => props.cubeData.isAvailable && setIsHovering(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
}

type GameStateRenderer3DProps = {
  gameState: { cubeDatas: CubeDto[] };
  onCubeClick: (cube: CubeDto) => void;
};

const GameStateRenderer3D: React.FC<GameStateRenderer3DProps> = ({ gameState, onCubeClick }) => {
  const [selectedCube, setSelectedCube] = useState<CubeDto | null>(null);

  const handleCubeClick = (cube: CubeDto) => {
    console.log('clicking on cube', cube);
    setSelectedCube(cube);
    onCubeClick(cube);
  };

  return (
    <Box maxHeight={150} flexDirection={'column'} display={'flex'} alignItems={'left'} justifyContent={'top'}>
      <Typography sx={{ marginBottom: 2 }}></Typography>
      <Typography variant="caption">Game State Renderer 3D</Typography>
      {/** 3D **/}
      <Canvas camera={{ manual: true }}>
        <PerspectiveCamera makeDefault position={[0, 1, 20]} rotation={[0, 0, 0]} fov={10} near={0.1} far={1000} />
        <OrbitControls makeDefault />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {gameState.cubeDatas.map((cubeData, index) => (
          <Cube key={index} cubeData={cubeData} onCubeClick={handleCubeClick} isSelected={selectedCube === cubeData} />
        ))}
      </Canvas>
    </Box>
  );
};

export default GameStateRenderer3D;
