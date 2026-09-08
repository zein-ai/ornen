import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

const sectionLinks = [
  { label: 'Services', to: '/#services' },
  { label: 'Process', to: '/#process' },
  { label: 'Demo', to: '/#demo' },
]

const allMenuLinks = [
  ...sectionLinks,
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/#contact' },
]

const MAILTO = 'mailto:hello@ornen.co?subject=Project%20inquiry%20—%20Ornen'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [barVisible, setBarVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setBarVisible(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation; lock body scroll while open
  useEffect(() => setOpen(false), [location.pathname, location.hash])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.classList.remove('menu-open')
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          background: open ? 'rgba(10, 10, 10, 0.85)' : scrolled ? 'rgba(10, 10, 10, 0.52)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled || open ? 'blur(18px)' : 'none',
          borderBottom: scrolled && !open ? '1px solid var(--line)' : '1px solid transparent',
        }}
      >
        <nav className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <Link to="/#top" className="flex items-center" aria-label="Ornen home">
            <img src="/logo-full.png" alt="Ornen" className="h-6 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-9 md:flex">
            {sectionLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim transition-colors duration-300 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-white ${
                location.pathname === '/pricing' ? 'text-acid' : 'text-dim'
              }`}
            >
              Pricing
            </Link>
            <a
              href={MAILTO}
              className="font-mono border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-black"
              style={{ borderColor: 'var(--line-strong)' }}
            >
              Start a project
            </a>
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className="h-px w-6 bg-white transition-all duration-300"
              style={{ transform: open ? 'translateY(3.5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="h-px w-6 bg-white transition-all duration-300"
              style={{ transform: open ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`mobile-menu fixed inset-0 z-50 flex flex-col md:hidden ${open ? 'is-open' : ''}`}
        style={{ background: 'var(--bg)', pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
      >
        <div className="flex flex-1 flex-col justify-center overflow-y-auto px-6 pb-8 pt-20" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
          <p className="font-mono mb-6 text-[11px] uppercase tracking-[0.22em] text-faint">
            <span className="text-acid">Ornen Studio</span> — Menu
          </p>
          <nav className="flex flex-col">
            {allMenuLinks.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                tabIndex={open ? 0 : -1}
                className="group flex items-baseline gap-5 border-t py-4"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="font-mono text-[11px] tracking-[0.22em] text-faint">0{i + 1}</span>
                <span className="font-display text-[9.5vw] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-white transition-colors duration-300 group-active:text-acid">
                  {l.label}
                </span>
              </Link>
            ))}
            <div className="border-t" style={{ borderColor: 'var(--line)' }} />
          </nav>
          <a href={MAILTO} tabIndex={open ? 0 : -1} className="btn btn-acid mt-6 w-full justify-center py-4">
            Start a project
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="font-mono mt-5 text-center text-[10px] uppercase tracking-[0.2em] text-faint">
            hello@ornen.co — replies within a day
          </p>
        </div>
      </div>

      {/* Sticky mobile action bar — thumb-reach conversion zone */}
      <div className={`mobile-action-bar md:hidden ${barVisible ? 'is-visible' : ''}`}>
        <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--line)' }}>
          <Link
            to="/pricing"
            className="font-mono flex items-center justify-center gap-2 py-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white"
            style={{ background: 'rgba(17,17,17,0.95)' }}
          >
            Pricing
          </Link>
          <a
            href={MAILTO}
            className="font-mono flex items-center justify-center gap-2 py-4 text-[11px] font-medium uppercase tracking-[0.16em]"
            style={{ background: 'var(--acid)', color: 'var(--acid-ink)' }}
          >
            Start a project
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
