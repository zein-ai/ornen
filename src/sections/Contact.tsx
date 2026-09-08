import { useState } from 'react'
import LegalModal, { type LegalDoc } from '@/components/LegalModal'

export default function Contact({ index = '05' }: { index?: string }) {
  const [legal, setLegal] = useState<LegalDoc | null>(null)

  return (
    <footer className="relative overflow-hidden px-6 pb-32 pt-24 sm:px-10 sm:pb-10 sm:pt-44 lg:px-16" id="contact">
      {/* Ambient wash — flat, no neon */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 110%, rgba(200, 255, 77, 0.07), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
          <span className="text-acid">{index}</span> / Last step
        </p>

        <h2 className="reveal font-display mt-10 text-[10.5vw] font-extrabold uppercase leading-[0.94] tracking-[-0.01em] sm:text-[9.5vw] lg:text-[7.2rem]">
          <span className="block">Tell us what</span>
          <span className="text-outline block">to automate.</span>
        </h2>

        <div className="reveal mt-14 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="mailto:hello@ornen.co?subject=Project%20inquiry%20—%20Ornen&body=Hi%20Ornen%2C%0A%0AWhat%27s%20eating%20my%20hours%20right%20now%3A%0A%0A"
            className="btn btn-acid"
          >
            hello@ornen.co
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="max-w-xs text-[14px] leading-[1.7] text-dim">
            One email is enough. We reply within a day with three things we would automate first.
            Free, whether or not you hire us.
          </p>
        </div>

        <div
          className="reveal mt-20 flex flex-col items-center gap-6 border-t pt-10 text-center sm:mt-28 sm:flex-row sm:justify-between sm:gap-5 sm:pt-8 sm:text-left"
          style={{ borderColor: 'var(--line)' }}
        >
          <img src="/logo-full.png" alt="Ornen" className="h-6 w-auto sm:h-8" />
          <p className="font-mono text-[10px] uppercase leading-[1.9] tracking-[0.18em] text-faint">
            Websites · AI Chatbots ·<br className="sm:hidden" /> Workflow Automation
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            © 2026 Ornen Studio
          </p>
        </div>

        {/* Legal */}
        <div className="reveal mt-8 flex items-center justify-center gap-6 sm:justify-start">
          <button
            onClick={() => setLegal('privacy')}
            className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-white"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setLegal('terms')}
            className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-white"
          >
            Terms of Service
          </button>
        </div>
      </div>

      <LegalModal doc={legal} onClose={() => setLegal(null)} />
    </footer>
  )
}
