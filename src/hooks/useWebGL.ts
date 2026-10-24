import { useSyncExternalStore } from 'react'

let cachedSupport: boolean | undefined

function detectWebGL() {
  if (cachedSupport !== undefined) return cachedSupport
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    cachedSupport = Boolean(gl)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cachedSupport = false
  }
  return cachedSupport
}

const subscribe = () => () => {}

/** Detects WebGL once without creating a render/effect state cascade. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, detectWebGL, () => false)
}
