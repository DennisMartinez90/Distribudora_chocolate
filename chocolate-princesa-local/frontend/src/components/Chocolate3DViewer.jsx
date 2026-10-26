/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Visor 3D Interactivo Three.js / React Three Fiber)
 * ====================================================================
 */

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center, ContactShadows } from '@react-three/drei';
import { Sparkles, Eye, RotateCw, Award, Scale, DollarSign } from 'lucide-react';

// Componente procedural del Chocolate Princesa con envoltura dorada
function ChocolateBarModel({ isHovered, autoRotateSpeed = 0.008 }) {
  const meshRef = useRef();

  // Rotación suave continua sobre el eje Y
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHovered ? 0.3 : 0.6);
    }
  });

  // Dimensiones de la barra
  const barWidth = 3.2;
  const barHeight = 4.8;
  const barDepth = 0.45;

  // Cuadrícula de 3 columnas x 4 filas de onzas de chocolate
  const cols = 3;
  const rows = 4;
  const blockW = 0.88;
  const blockH = 0.95;
  const blockD = 0.16;

  const blocks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * (blockW + 0.12);
      const y = ((rows - 1) / 2 - r) * (blockH + 0.14) + 0.2;
      blocks.push({ id: `${r}-${c}`, x, y });
    }
  }

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* 1. Base principal de chocolate oscuro fino */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[barWidth, barHeight, barDepth]} />
        <meshStandardMaterial
          color="#2A1105"
          roughness={0.28}
          metalness={0.08}
        />
      </mesh>

      {/* 2. Onzas de chocolate en relieve (Grilla 3x4) */}
      {blocks.map((b) => (
        <group key={b.id} position={[b.x, b.y, barDepth / 2 + blockD / 2]}>
          {/* Bloque superior con bisel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[blockW, blockH, blockD]} />
            <meshStandardMaterial
              color="#3B1908"
              roughness={0.22}
              metalness={0.12}
            />
          </mesh>
          {/* Relieve decorativo en cada onza de chocolate */}
          <mesh position={[0, 0, blockD / 2 + 0.01]}>
            <boxGeometry args={[blockW * 0.72, blockH * 0.72, 0.03]} />
            <meshStandardMaterial
              color="#4A220D"
              roughness={0.2}
              metalness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* 3. Envoltura inferior dorada metálica (Foil de Oro Imperial Princesa) */}
      <group position={[0, -barHeight * 0.25, 0.01]}>
        {/* Lámina dorada envolvente */}
        <mesh castShadow>
          <boxGeometry args={[barWidth + 0.08, barHeight * 0.55, barDepth + 0.08]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.88}
            roughness={0.22}
          />
        </mesh>

        {/* Doblez dorado con relieve superior */}
        <mesh position={[0, (barHeight * 0.55) / 2 + 0.04, 0.02]}>
          <boxGeometry args={[barWidth + 0.12, 0.12, barDepth + 0.1]} />
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* Sello de la Corona Princesa en relieve sobre el papel dorado */}
        <mesh position={[0, 0, (barDepth + 0.08) / 2 + 0.02]}>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#FFFBEB"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Chocolate3DViewer({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const activeProduct = product || {
    name: 'Tableta Princesa Real 70% Cacao Silvestre',
    cocoa_percentage: 70,
    weight_grams: 100,
    price: 28.50,
    stock: 150,
    category: { name: 'Tabletas Artesanales' },
    supplier: { origin_region: 'Baures, Beni' }
  };

  return (
    <div className="relative bg-gradient-to-b from-cacao-950 via-cacao-900 to-cacao-950 rounded-2xl border-2 border-oro-600/70 shadow-2xl overflow-hidden flex flex-col h-[460px]">
      
      {/* Encabezado del Visor 3D */}
      <div className="absolute top-0 inset-x-0 z-10 px-4 py-3 bg-gradient-to-b from-cacao-950/95 via-cacao-950/70 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-oro-500/20 rounded-lg text-oro-400 border border-oro-500/40">
            <Sparkles className="w-4 h-4 text-oro-400" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-crema-50 tracking-wide font-serif">
              Visor 3D Interactivo
            </h3>
            <p className="text-[11px] text-oro-300">
              Rotación 360° en tiempo real con WebGL & Three.js
            </p>
          </div>
        </div>

        <button
          onClick={handleResetCamera}
          className="pointer-events-auto bg-cacao-800/80 hover:bg-cacao-700 active:scale-95 text-oro-400 border border-oro-600/50 p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all shadow"
          title="Restablecer posición de cámara 3D"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Reiniciar Vista</span>
        </button>
      </div>

      {/* Escena 3D Canvas */}
      <div
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Canvas
          camera={{ position: [0, 1.2, 7.5], fov: 45 }}
          shadows
        >
          {/* Iluminación refinada de estudio */}
          <ambientLight intensity={0.8} />
          
          {/* Luz clave dorada cálida */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.2}
            color="#FFF2D6"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Luz de relleno suave */}
          <directionalLight
            position={[-5, 4, -3]}
            intensity={0.9}
            color="#D4AF37"
          />

          {/* Luz cenital para brillo del chocolate */}
          <pointLight position={[0, 4, 3]} intensity={1.5} color="#FFFFFF" />

          {/* Modelo Flotante */}
          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
          >
            <Center>
              <ChocolateBarModel isHovered={isHovered} />
            </Center>
          </Float>

          {/* Sombra de contacto suave debajo */}
          <ContactShadows
            position={[0, -2.8, 0]}
            opacity={0.65}
            scale={10}
            blur={2}
            far={4.5}
            color="#1A0A03"
          />

          {/* Controles de órbita y zoom con el cursor */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* Ficha técnica informativa del producto seleccionado */}
      <div className="absolute bottom-3 inset-x-3 z-10 bg-cacao-950/90 backdrop-blur-md rounded-xl p-3 border border-oro-600/40 shadow-lg text-crema-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          
          {/* Nombre y categoría */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-oro-400 bg-oro-900/50 px-2 py-0.5 rounded border border-oro-600/30">
                {activeProduct.category?.name || 'Tableta Artesanal'}
              </span>
              <span className="text-[11px] text-gray-300">
                {activeProduct.supplier?.origin_region ? `Origen: ${activeProduct.supplier.origin_region}` : 'Cacao Boliviano'}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-serif font-bold text-crema-50 truncate max-w-[280px] sm:max-w-[360px] mt-0.5">
              {activeProduct.name}
            </h4>
          </div>

          {/* Indicadores técnicos */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-cacao-800/80 px-2.5 py-1 rounded-md border border-cacao-700">
              <Award className="w-3.5 h-3.5 text-oro-400" />
              <span className="text-xs font-bold text-oro-300">{activeProduct.cocoa_percentage}% Cacao</span>
            </div>

            <div className="flex items-center gap-1 bg-cacao-800/80 px-2.5 py-1 rounded-md border border-cacao-700">
              <Scale className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-xs font-medium text-gray-200">{activeProduct.weight_grams}g</span>
            </div>

            <div className="flex items-center gap-1 bg-oro-600 text-cacao-950 px-3 py-1 rounded-md font-bold shadow">
              <span className="text-xs">Bs.</span>
              <span className="text-sm font-black">{Number(activeProduct.price).toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
