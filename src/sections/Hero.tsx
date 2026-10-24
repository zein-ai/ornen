import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useWebGLSupport } from '@/hooks/useWebGL'
import { useReducedMotion, useIsMobile } from '@/hooks/useMedia'
import { heroState } from '@/components/heroState'

const HeroScene = lazy(() => import('@/components/HeroScene'))

function HeroFallback() {
  return <div className="hero-fallback grain" aria-hidden="true"><div className="orb orb-teal" /><div className="orb orb-pink" /><div className="orb orb-violet" /><div className="ring ring-1 ring-spin"><span className="satellite" /></div><div className="ring ring-2 ring-spin"><span className="satellite" /></div><div className="ring ring-3 ring-spin"><span className="satellite" /></div><div className="core" /></div>
}

function SceneLayer({ active, useFallback, webgl }: { active: boolean; useFallback: boolean; webgl: boolean | null }) {
  if (useFallback) return <HeroFallback />
  if (!webgl) return null
  return <Suspense fallback={<HeroFallback />}><HeroScene active={active} /></Suspense>
}

const projectLink = <><span>Start a project</span><svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></>

function MobileHero({ active, useFallback, webgl }: { active: boolean; useFallback: boolean; webgl: boolean | null }) {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col">
      <div className="build-in font-mono flex flex-wrap items-center gap-x-5 gap-y-2 px-6 pt-24 text-[10px] uppercase tracking-[0.2em] text-faint" style={{ animationDelay: '0.1s' }}><span className="text-acid">Ornen Studio</span><span>Websites / Chatbots / Automation</span></div>
      <div className="px-6 pb-8 pt-8">
        <h1 className="build-in font-display text-[11vw] font-extrabold uppercase leading-[0.94] tracking-[-0.01em]" style={{ animationDelay: '0.2s' }}><span className="block">Your business,</span><span className="text-outline block">on autopilot.</span></h1>
        <p className="build-in mt-6 max-w-lg text-[15px] leading-[1.65] text-dim" style={{ animationDelay: '0.3s' }}>We design, build, and run your online presence: website, AI chatbot, and workflow automation. Clear setup pricing, optional ongoing care, zero busywork left for you.</p>
        <div className="build-in mt-7 flex flex-col gap-3" style={{ animationDelay: '0.4s' }}><Link to="/#contact" className="btn btn-acid w-full justify-center py-4">{projectLink}</Link><Link to="/pricing" className="btn w-full justify-center py-4">See pricing</Link></div>
        <p className="build-in font-mono mt-6 inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-faint" style={{ animationDelay: '0.5s' }}><span className="blink-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />Accepting new clients</p>
      </div>
      <div className="build-in relative mx-6 mb-24 h-[32svh] min-h-[230px] border" style={{ borderColor: 'var(--line)', animationDelay: '0.55s' }}><SceneLayer active={active} useFallback={useFallback} webgl={webgl} /><p className="font-mono absolute bottom-3 left-3 border px-2.5 py-1.5 text-[8px] uppercase tracking-[0.18em] text-dim" style={{ background: 'rgba(10,10,10,0.72)', borderColor: 'var(--line)', backdropFilter: 'blur(6px)' }}>Three services, one core</p></div>
    </section>
  )
}

function DesktopHero({ active, useFallback, webgl }: { active: boolean; useFallback: boolean; webgl: boolean | null }) {
  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden" id="top">
      <SceneLayer active={active} useFallback={useFallback} webgl={webgl} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(180deg, transparent, #0a0a0a)' }} />
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-14 lg:px-16"><div className="max-w-none">
        <div className="build-in font-mono flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-faint" style={{ animationDelay: '0.15s' }}><span className="text-acid">Ornen Studio</span><span>Websites / Chatbots / Automation</span><span className="hidden sm:inline">Boutique Studio</span></div>
        <h1 className="build-in font-display mt-8 text-[14vw] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] sm:text-[11.5vw] lg:text-[8.2rem]" style={{ animationDelay: '0.35s' }}><span className="block">Your business,</span><span className="text-outline block">on autopilot.</span></h1>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-12 sm:items-end">
          <p className="build-in max-w-md text-[15px] leading-[1.65] text-dim sm:col-span-5" style={{ animationDelay: '0.5s' }}>We design, build, and run your online presence: website, AI chatbot, and workflow automation. Clear setup pricing, optional ongoing care, zero busywork left for you.</p>
          <div className="build-in flex flex-wrap items-center gap-4 sm:col-span-7 sm:justify-end" style={{ animationDelay: '0.65s' }}><span className="font-mono inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-faint"><span className="blink-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />Accepting new clients</span><Link to="/#services" className="btn">See what we build</Link><Link to="/pricing" className="btn">See pricing</Link><Link to="/#contact" className="btn btn-acid">{projectLink}</Link></div>
        </div>
      </div></div>
    </section>
  )
}

export default function Hero() {
  const webgl = useWebGLSupport()
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)
  const useFallback = isMobile || reducedMotion || webgl === false || !sceneReady

  useEffect(() => {
    if (isMobile || reducedMotion || webgl !== true) return
    const timer = window.setTimeout(() => setSceneReady(true), 180)
    return () => window.clearTimeout(timer)
  }, [isMobile, reducedMotion, webgl])

  useEffect(() => {
    if (useFallback) return
    const onScroll = () => { const zone = window.innerHeight * 1.4; heroState.scroll = Math.min(1, Math.max(0, window.scrollY / zone)) }
    const onPointer = (event: PointerEvent) => { heroState.pointerX = (event.clientX / window.innerWidth) * 2 - 1; heroState.pointerY = (event.clientY / window.innerHeight) * 2 - 1 }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onPointer) }
  }, [useFallback])

  useEffect(() => {
    if (useFallback || !rootRef.current) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.02 })
    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [useFallback])

  return <div ref={rootRef}>{isMobile ? <MobileHero active={active} useFallback={useFallback} webgl={webgl} /> : <DesktopHero active={active} useFallback={useFallback} webgl={webgl} />}</div>
}
