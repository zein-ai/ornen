import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useWebGLSupport } from '@/hooks/useWebGL'
import { useReducedMotion, useIsMobile } from '@/hooks/useMedia'
import { heroState } from '@/components/heroState'

const HeroScene = lazy(() => import('@/components/HeroScene'))

/** Pure-CSS twin of the 3D scene: same composition, zero GPU cost. */
function HeroFallback() {
  return (
    <div className="hero-fallback grain" aria-hidden="true">
      <div className="orb orb-teal" />
      <div className="orb orb-pink" />
      <div className="orb orb-violet" />
      <div className="ring ring-1 ring-spin"><span className="satellite" /></div>
      <div className="ring ring-2 ring-spin"><span className="satellite" /></div>
      <div className="ring ring-3 ring-spin"><span className="satellite" /></div>
      <div className="core" />
    </div>
  )
}

function SceneLayer({ active, useFallback, webgl }: { active: boolean; useFallback: boolean; webgl: boolean | null }) {
  if (useFallback) return <HeroFallback />
  if (!webgl) return null
  return (
    <Suspense fallback={<HeroFallback />}>
      <HeroScene active={active} />
    </Suspense>
  )
}

/* ------------------------------------------------------------------ */
/*  Phone hero — its own page, not a shrunken desktop:                 */
/*  scene lives in a framed block, copy flows below, thumb CTAs        */
/* ------------------------------------------------------------------ */

function MobileHero({ active, useFallback, webgl }: { active: boolean; useFallback: boolean; webgl: boolean | null }) {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col">
      {/* Meta strip under the nav */}
      <div className="build-in font-mono flex flex-wrap items-center gap-x-5 gap-y-2 px-6 pt-24 text-[10px] uppercase tracking-[0.2em] text-faint" style={{ animationDelay: '0.15s' }}>
        <span className="text-acid">Ornen Studio</span>
        <span>Websites / Chatbots / Automation</span>
      </div>

      {/* Framed scene block */}
      <div className="build-in relative mt-5 h-[44svh] min-h-[300px] border-y" style={{ borderColor: 'var(--line)', animationDelay: '0.35s' }}>
        <SceneLayer active={active} useFallback={useFallback} webgl={webgl} />
        <p className="font-mono absolute bottom-3 left-6 border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.22em] text-dim" style={{ background: 'rgba(10,10,10,0.72)', borderColor: 'var(--line)', backdropFilter: 'blur(6px)' }}>
          Live system — three services, one core
        </p>
      </div>

      {/* Copy flows in normal document order */}
      <div className="flex flex-1 flex-col px-6 pb-28 pt-8">
        <h1 className="build-in font-display text-[10.5vw] font-extrabold uppercase leading-[0.94] tracking-[-0.01em]" style={{ animationDelay: '0.55s' }}>
          <span className="block">Your business,</span>
          <span className="text-outline block">on autopilot.</span>
        </h1>

        <p className="build-in mt-6 text-[15px] leading-[1.65] text-dim" style={{ animationDelay: '0.75s' }}>
          We design, build, and run your entire online presence. Website, AI chatbot, workflow
          automation. One studio, one monthly price, zero busywork left for you.
        </p>

        <div className="build-in mt-8 flex flex-col gap-3" style={{ animationDelay: '0.95s' }}>
          <a href="mailto:hello@ornen.co?subject=Project%20inquiry%20—%20Ornen" className="btn btn-acid w-full justify-center py-4">
            Start a project
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <Link to="/pricing" className="btn w-full justify-center py-4">
            See pricing
          </Link>
        </div>

        <p className="build-in font-mono mt-7 inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-faint" style={{ animationDelay: '1.1s' }}>
          <span className="blink-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />
          Accepting new clients
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Desktop / tablet hero — full-viewport scene with overlaid copy     */
/* ------------------------------------------------------------------ */

function DesktopHero({ active, useFallback, webgl }: { active: boolean; useFallback: boolean; webgl: boolean | null }) {
  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden" id="top">
      <SceneLayer active={active} useFallback={useFallback} webgl={webgl} />

      {/* Bottom fade into next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(180deg, transparent, #0a0a0a)' }}
      />

      {/* Copy layer */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-14 lg:px-16">
        <div className="max-w-none">
          <div
            className="build-in font-mono flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-faint"
            style={{ animationDelay: '0.15s' }}
          >
            <span className="text-acid">Ornen Studio</span>
            <span>Websites / Chatbots / Automation</span>
            <span className="hidden sm:inline">Boutique Studio</span>
          </div>

          <h1
            className="build-in font-display mt-8 text-[14vw] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] sm:text-[11.5vw] lg:text-[8.2rem]"
            style={{ animationDelay: '0.7s' }}
          >
            <span className="block">Your business,</span>
            <span className="text-outline block">on autopilot.</span>
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-12 sm:items-end">
            <p
              className="build-in max-w-md text-[15px] leading-[1.65] text-dim sm:col-span-5"
              style={{ animationDelay: '1.15s' }}
            >
              We design, build, and run your entire online presence. Website, AI chatbot, workflow
              automation. One studio, one monthly price, zero busywork left for you.
            </p>
            <div
              className="build-in flex flex-wrap items-center gap-4 sm:col-span-7 sm:justify-end"
              style={{ animationDelay: '1.8s' }}
            >
              <span className="font-mono inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-faint">
                <span className="blink-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />
                Accepting new clients
              </span>
              <Link to="/#services" className="btn">
                See what we build
              </Link>
              <Link to="/pricing" className="btn">
                See pricing
              </Link>
              <a href="mailto:hello@ornen.co?subject=Project%20inquiry%20—%20Ornen" className="btn btn-acid">
                Start a project
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  const webgl = useWebGLSupport()
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  const useFallback = reducedMotion || webgl === false

  // Feed the frame loop: scroll progress across the hero zone + pointer parallax
  useEffect(() => {
    if (useFallback) return

    const onScroll = () => {
      const zone = window.innerHeight * 1.4
      heroState.scroll = Math.min(1, Math.max(0, window.scrollY / zone))
    }
    const onPointer = (e: PointerEvent) => {
      heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      heroState.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }

    // Touch drag steers the scene directly
    let lastTouchAt = 0
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      lastTouchAt = Date.now()
      heroState.pointerX = (t.clientX / window.innerWidth) * 2 - 1
      heroState.pointerY = (t.clientY / window.innerHeight) * 2 - 1
    }

    // Gyroscope tilt steers the scene when the user isn't touching
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      if (Date.now() - lastTouchAt < 1200) return
      heroState.pointerX = Math.max(-1, Math.min(1, e.gamma / 32))
      heroState.pointerY = Math.max(-1, Math.min(1, (e.beta - 55) / 32))
    }
    const enableOrientation = () => {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      if (typeof DOE?.requestPermission === 'function') {
        // iOS 13+: sensor access requires a user gesture — ask on first tap
        const ask = () => {
          DOE.requestPermission!()
            .then((res) => {
              if (res === 'granted') window.addEventListener('deviceorientation', onOrient)
            })
            .catch(() => {})
        }
        window.addEventListener('touchend', ask, { once: true })
        return () => window.removeEventListener('touchend', ask)
      }
      window.addEventListener('deviceorientation', onOrient)
      return () => window.removeEventListener('deviceorientation', onOrient)
    }
    const cleanupOrientation = enableOrientation()

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('touchmove', onTouchMove)
      cleanupOrientation?.()
    }
  }, [useFallback])

  // Pause the render loop entirely when the hero scrolls out of view
  useEffect(() => {
    if (useFallback || !rootRef.current) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.02,
    })
    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [useFallback])

  return (
    <div ref={rootRef}>
      {isMobile ? (
        <MobileHero active={active} useFallback={useFallback} webgl={webgl} />
      ) : (
        <DesktopHero active={active} useFallback={useFallback} webgl={webgl} />
      )}
    </div>
  )
}
