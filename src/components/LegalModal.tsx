import { useEffect, useState } from 'react'

export type LegalDoc = 'privacy' | 'terms'

interface Section {
  heading: string
  body: string
}

const DOCS: Record<LegalDoc, { label: string; title: string; updated: string; sections: Section[] }> = {
  privacy: {
    label: 'Legal / 01',
    title: 'Privacy Policy',
    updated: 'Last updated — 2026',
    sections: [
      {
        heading: 'Data handling',
        body: 'We collect only what you hand us directly: your name, email, and project details when you reach out, plus anonymous, cookie-free usage analytics. We never sell, rent, or trade your data. The information your automations touch — leads, customers, orders — lives in your own accounts (your CRM, your sheets, your inbox), not on our servers.',
      },
      {
        heading: 'AI disclaimer',
        body: 'Our chatbots answer from the documents and policies you provide. They can occasionally be wrong, and their answers are not legal, medical, or financial advice. Every assistant we ship includes a human handoff path, and you can review or correct its knowledge at any time.',
      },
      {
        heading: 'Your rights',
        body: 'Email hello@ornen.co anytime to access, correct, export, or delete the personal data we hold about you. We honor every request within 7 days — no forms, no dark patterns.',
      },
    ],
  },
  terms: {
    label: 'Legal / 02',
    title: 'Terms of Service',
    updated: 'Last updated — 2026',
    sections: [
      {
        heading: 'Services',
        body: 'Ornen designs, builds, and operates websites, AI chatbots, and workflow automations as described on the pricing page. Care plans are month-to-month and can be canceled anytime — your site and automations keep running after cancellation; you simply lose monitoring, updates, and improvements.',
      },
      {
        heading: 'Intellectual property',
        body: 'Upon full payment, you own 100% of your site code, content, and workflow configurations — outright and forever. Domains are registered in your name, hosting is transferable, and nothing is held hostage. We retain only our generic internal tooling and know-how used to build your systems.',
      },
      {
        heading: 'AI disclaimer',
        body: 'AI features produce outputs based on your materials and may occasionally be inaccurate. You are responsible for reviewing automated customer-facing replies, and AI output should not be treated as professional, legal, medical, or financial advice.',
      },
      {
        heading: 'Liability',
        body: 'We build carefully and monitor what we run, but software is software: to the maximum extent permitted by law, our total liability is capped at the fees you paid us in the three months preceding a claim. Plain and simple.',
      },
    ],
  },
}

/** Clean legal overlay — brief, plain-language summaries on the Ornen dark system. */
export default function LegalModal({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  // Entrance choreography + scroll lock + Escape
  useEffect(() => {
    if (!doc) return
    const raf = requestAnimationFrame(() => setMounted(true))
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      setMounted(false)
    }
  }, [doc, onClose])

  if (!doc) return null
  const content = DOCS[doc]

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 cursor-pointer transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(10,10,10,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      />

      {/* Panel — scrolls internally, Lenis hands wheel events to it */}
      <div
        data-lenis-prevent
        className={`relative flex max-h-[86svh] w-full max-w-xl flex-col border transition-all duration-500 ease-out sm:max-h-[80vh] ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 border-b px-6 py-5 sm:px-8"
          style={{ borderColor: 'var(--line)' }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-acid">{content.label}</p>
            <h3 className="font-display mt-2 text-xl font-bold uppercase tracking-[0.01em] text-white sm:text-2xl">
              {content.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="group flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border transition-colors hover:border-[var(--acid)]"
            style={{ borderColor: 'var(--line)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-faint transition-colors group-hover:text-acid">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="no-scrollbar overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {content.sections.map((s, i) => (
            <div key={s.heading} className={i > 0 ? 'mt-7' : ''}>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">
                {String(i + 1).padStart(2, '0')} — {s.heading}
              </p>
              <p className="mt-2.5 text-[13.5px] leading-[1.75] text-dim">{s.body}</p>
            </div>
          ))}
          <p className="mt-8 border-t pt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-faint" style={{ borderColor: 'var(--line)' }}>
            {content.updated} · Questions — hello@ornen.co
          </p>
        </div>
      </div>
    </div>
  )
}
