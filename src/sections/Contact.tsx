import { useState } from 'react'
import ContactForm from '@/components/ContactForm'
import LegalModal, { type LegalDoc } from '@/components/LegalModal'

export default function Contact({ index = '05' }: { index?: string }) {
  const [legal, setLegal] = useState<LegalDoc | null>(null)

  return (
    <footer className="relative overflow-hidden px-6 pb-32 pt-24 sm:px-10 sm:pb-10 sm:pt-36 lg:px-16" id="contact">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh]" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 110%, rgba(200,255,77,0.07), transparent 65%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.22em] text-faint"><span className="text-acid">{index}</span> / Last step</p>
        <h2 className="reveal font-display mt-10 text-[10.5vw] font-extrabold uppercase leading-[0.94] tracking-[-0.01em] sm:text-[9.5vw] lg:text-[7.2rem]">
          <span className="block">Tell us what</span>
          <span className="text-outline block">to automate.</span>
        </h2>
        <div className="reveal mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-[16px] leading-[1.7] text-dim">Share enough for a useful first reply. We’ll respond within one day with the three things we would improve or automate first.</p>
          <a href="mailto:hello@ornen.co" className="font-mono shrink-0 text-[11px] uppercase tracking-[0.14em] text-acid underline-offset-4 hover:underline">Prefer email? hello@ornen.co</a>
        </div>

        <div className="reveal mt-12">
          <ContactForm onPrivacy={() => setLegal('privacy')} />
        </div>

        <div className="reveal mt-20 flex flex-col items-center gap-6 border-t pt-10 text-center sm:mt-24 sm:flex-row sm:justify-between sm:gap-5 sm:pt-8 sm:text-left" style={{ borderColor: 'var(--line)' }}>
          <img src="/logo-full.png" alt="Ornen" className="h-6 w-auto sm:h-8" width="512" height="128" />
          <p className="font-mono text-[10px] uppercase leading-[1.9] tracking-[0.18em] text-faint">Websites · AI Chatbots ·<br className="sm:hidden" /> Workflow Automation</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">© 2026 Ornen Studio</p>
        </div>

        <div className="reveal mt-8 flex items-center justify-center gap-6 sm:justify-start">
          <button onClick={() => setLegal('privacy')} className="min-h-11 cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-white">Privacy Policy</button>
          <button onClick={() => setLegal('terms')} className="min-h-11 cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-white">Terms of Service</button>
        </div>
      </div>

      <LegalModal doc={legal} onClose={() => setLegal(null)} />
    </footer>
  )
}
