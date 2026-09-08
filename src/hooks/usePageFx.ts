import { useEffect } from 'react'
import { useLocation } from 'react-router'
import Lenis from 'lenis'

let lenisRef: Lenis | null = null

/**
 * Shared page behavior for every route:
 * - Lenis smooth scroll (skipped for reduced motion)
 * - In-page anchor clicks glide through Lenis
 * - Route changes scroll to top; "/page#section" scrolls to the section
 * - Scroll-reveal choreography for .reveal elements
 */
export function usePageFx() {
  const location = useLocation()

  // Lenis + anchor interception (once per page mount)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis: Lenis | null = null
    let rafId = 0
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1 })
      lenisRef = lenis
      const raf = (time: number) => {
        lenis!.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: id === '#top' ? 0 : -20 })
        else el.scrollIntoView({ block: 'start' })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      lenis?.destroy()
      lenisRef = null
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Route change: hash → glide to section, otherwise → top
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        const t = setTimeout(() => {
          if (lenisRef) lenisRef.scrollTo(el as HTMLElement, { offset: location.hash === '#top' ? 0 : -20 })
          else (el as HTMLElement).scrollIntoView({ block: 'start' })
        }, 60)
        return () => clearTimeout(t)
      }
    }
    window.scrollTo(0, 0)
    lenisRef?.scrollTo(0, { immediate: true })
  }, [location.pathname, location.hash])

  // Reveal choreography — re-scan after each route renders
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => observer.observe(el))
    })
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [location.pathname])
}
