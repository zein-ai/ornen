import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/useMedia'
import { heroState } from '@/components/heroState'

const COLORS = {
  white: new THREE.Color('#f4f4f0'),
  paper: new THREE.Color('#d9d9d2'),
  dim: new THREE.Color('#8a8a80'),
  acid: new THREE.Color('#c8ff4d'),
  faint: new THREE.Color('#3a3a34'),
}

/* ------------------------------------------------------------------ */
/*  Particle field — instanced points on a spherical shell             */
/* ------------------------------------------------------------------ */

function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [COLORS.paper, COLORS.dim, COLORS.faint, COLORS.paper]
    for (let i = 0; i < count; i++) {
      // Random point in a hollow sphere shell
      const r = 7 + Math.random() * 16
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      positions[i * 3 + 2] = r * Math.cos(phi) - 6
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.012
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/*  Central core — pulsing icosahedron with wireframe shell            */
/* ------------------------------------------------------------------ */

function Core() {
  const solid = useRef<THREE.Mesh>(null!)
  const wire = useRef<THREE.Mesh>(null!)
  const halo = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * 1.4) * 0.05
    solid.current.scale.setScalar(pulse)
    wire.current.scale.setScalar(pulse * 1.35)
    halo.current.scale.setScalar(2.1 + Math.sin(t * 1.4) * 0.12)
    wire.current.rotation.y = t * 0.18
    wire.current.rotation.x = Math.sin(t * 0.12) * 0.25
    solid.current.rotation.y = -t * 0.1
  })

  return (
    <group>
      <mesh ref={halo}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color={COLORS.paper} transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <mesh ref={solid}>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshBasicMaterial color={COLORS.paper} />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshBasicMaterial color={COLORS.white} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Orbiting service nodes + rings + live data streams to the core     */
/* ------------------------------------------------------------------ */

interface OrbitDef {
  radius: number
  speed: number
  tilt: [number, number, number]
  color: THREE.Color
  offset: number
  nodeSize: number
}

function OrbitNode({ def }: { def: OrbitDef }) {
  const nodeRef = useRef<THREE.Mesh>(null!)

  const ringGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * def.radius, 0, Math.sin(a) * def.radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [def.radius])

  // Live stream line built imperatively (R3F's <line> collides with SVG typings)
  const stream = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    const mat = new THREE.LineBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geo, mat)
  }, [def.color])

  useFrame((state) => {
    const t = state.clock.elapsedTime * def.speed + def.offset
    const x = Math.cos(t) * def.radius
    const z = Math.sin(t) * def.radius
    nodeRef.current.position.set(x, 0, z)
    const s = 1 + Math.sin(state.clock.elapsedTime * 2 + def.offset) * 0.15
    nodeRef.current.scale.setScalar(s)

    // Stream: node → core, opacity breathing
    const attr = stream.geometry.getAttribute('position') as THREE.BufferAttribute
    attr.setXYZ(0, x, 0, z)
    attr.needsUpdate = true
    const mat = stream.material as THREE.LineBasicMaterial
    mat.opacity = 0.22 + (Math.sin(state.clock.elapsedTime * 1.8 + def.offset) + 1) * 0.14
  })

  return (
    <group rotation={def.tilt}>
      <lineLoop geometry={ringGeometry}>
        <lineBasicMaterial color={def.color} transparent opacity={0.18} />
      </lineLoop>
      <primitive object={stream} />
      <mesh ref={nodeRef}>
        <sphereGeometry args={[def.nodeSize, 24, 24]} />
        <meshBasicMaterial color={def.color} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene rig — scroll dolly + pointer parallax                        */
/* ------------------------------------------------------------------ */

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const isMobile = useIsMobile()

  useFrame((_state, delta) => {
    const s = heroState.scroll
    // Camera dollies in as the user scrolls; group tilts open
    const baseZ = isMobile ? 10 : 9
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ - s * (isMobile ? 1.6 : 3.2), 2.5, delta)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, heroState.pointerX * (isMobile ? 0.9 : 0.6), 2.5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.4 + s * 1.1 - heroState.pointerY * 0.5, 2.5, delta)
    camera.lookAt(0, 0, 0)

    const targetY = heroState.pointerX * 0.22 + s * 1.2
    const targetX = heroState.pointerY * 0.14 - s * 0.35
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3, delta)
    // On phones the scene is centered in its own framed block above the copy
    const baseScale = isMobile ? 0.8 : 1
    const baseY = 0
    const scale = baseScale * (1 - s * 0.28)
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 3, delta))
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, baseY + s * 1.4, 3, delta)
  })

  return <group ref={group}>{children}</group>
}

/* ------------------------------------------------------------------ */
/*  Canvas root                                                        */
/* ------------------------------------------------------------------ */

export default function HeroScene({ active }: { active: boolean }) {
  const isMobile = useIsMobile()
  const dpr = Math.min(isMobile ? 1.5 : 1.75, typeof window !== 'undefined' ? window.devicePixelRatio : 1)

  const orbits: OrbitDef[] = useMemo(
    () => [
      { radius: 2.4, speed: 0.5, tilt: [0.35, 0, 0.12], color: COLORS.white, offset: 0, nodeSize: 0.11 },
      { radius: 3.5, speed: -0.34, tilt: [-0.5, 0.3, 0.4], color: COLORS.acid, offset: 2.1, nodeSize: 0.13 },
      { radius: 4.7, speed: 0.22, tilt: [0.9, -0.4, -0.25], color: COLORS.dim, offset: 4.4, nodeSize: 0.15 },
    ],
    [],
  )

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 42, position: [0, 0.4, isMobile ? 10 : 9], near: 0.1, far: 60 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Rig>
        <ParticleField count={isMobile ? 1400 : 3600} />
        <Core />
        {orbits.map((def, i) => (
          <OrbitNode key={i} def={def} />
        ))}
      </Rig>
    </Canvas>
  )
}
