import { useEffect, useRef, useState } from 'react'

const STATUS_LINES = [
  'Waking the core',
  'Compiling shaders',
  'Wiring the automations',
  'System live',
]

const INTRO_KEY = 'ornen:intro_seen'

export const introSeen = () => {
  try {
    return !!sessionStorage.getItem(INTRO_KEY)
  } catch {
    return true // storage blocked → never trap the user behind the intro
  }
}

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, 'true')
  } catch {
    /* storage unavailable — nothing to persist */
  }
}

/**
 * Studio-style preloader: real progress (fonts, window load, 3D chunk),
 * mono counter, hairline bar, curtain-lift exit that hands off to the hero.
 * Plays once per browser session — repeat visits and skips hand off instantly.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [seen] = useState(introSeen)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'exit' | 'gone'>('loading')
  const readyRef = useRef(false)

  useEffect(() => {
    // Session bypass: intro already played — unlock and hand off instantly
    if (seen) {
      document.documentElement.classList.remove('is-loading')
      document.body.style.overflow = ''
      onDone()
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('is-loading')
    document.body.style.overflow = 'hidden'

    // Real readiness: document + fonts + the lazy Three.js scene chunk
    const whenLoaded = new Promise((res) => {
      if (document.readyState === 'complete') res(null)
      else window.addEventListener('load', () => res(null), { once: true })
    })
    const whenFonts = (document.fonts?.ready ?? Promise.resolve()).catch(() => null)
    const whenScene = import('@/components/HeroScene').catch(() => null)
    const minDisplay = new Promise((res) => setTimeout(res, reduced ? 300 : 1500))

    const start = performance.now()
    let readyAt = 0
    Promise.all([whenLoaded, whenFonts, whenScene, minDisplay]).then(() => {
      readyRef.current = true
      readyAt = performance.now()
    })
    // Failsafe: never trap the user behind the loader
    const failsafe = setTimeout(() => {
      readyRef.current = true
      readyAt = performance.now()
    }, 4000)

    let raf = 0
    const tick = () => {
      const elapsed = performance.now() - start
      // Sprint the last stretch once everything is genuinely loaded
      const next = !readyRef.current
        ? Math.min(92, elapsed / 16)
        : Math.min(100, 92 + 8 * Math.min(1, (performance.now() - readyAt) / 350))
      setProgress(next)
      if (next < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
      document.documentElement.classList.remove('is-loading')
      document.body.style.overflow = ''
    }
  }, [seen, onDone])

  // When the counter lands on 100, remember the session and lift the curtain
  useEffect(() => {
    if (progress < 100 || phase !== 'loading') return
    markIntroSeen()
    document.documentElement.classList.remove('is-loading')
    document.body.style.overflow = ''
    setPhase('exit')
  }, [progress, phase])

  // After the curtain has lifted, hand off to the page
  useEffect(() => {
    if (phase !== 'exit') return
    const t = setTimeout(() => {
      setPhase('gone')
      onDone()
    }, 900)
    return () => clearTimeout(t)
  }, [phase, onDone])

  if (seen || phase === 'gone') return null

  const shown = Math.floor(progress)
  const status = STATUS_LINES[Math.min(STATUS_LINES.length - 1, Math.floor(progress / 26))]

  return (
    <div className={`preloader ${phase === 'exit' ? 'preloader-exit' : ''}`} role="status" aria-label="Loading Ornen">
      {/* Center: enso mark, slow zen rotation */}
      <div className="flex flex-col items-center gap-6">
        <img src="/logo-mark.png" alt="" className="preloader-mark h-16 w-16 sm:h-20 sm:w-20" />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">Ornen Studio</p>
      </div>

      {/* Bottom instrumentation row */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="flex items-end justify-between px-6 pb-6 sm:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            {status}
            <span className="blink-dot ml-2 inline-block h-1 w-1" style={{ background: 'var(--acid)' }} />
          </p>
          <p className="font-mono text-4xl font-medium tabular-nums leading-none text-white sm:text-5xl">
            {String(shown).padStart(3, '0')}
            <span className="text-faint">%</span>
          </p>
        </div>
        {/* Hairline progress bar */}
        <div className="h-px w-full" style={{ background: 'var(--line)' }}>
          <div
            className="h-px transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%`, background: 'var(--acid)' }}
          />
        </div>
      </div>
    </div>
  )
}
