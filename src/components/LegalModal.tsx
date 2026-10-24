import { useEffect, useRef } from 'react'

export type LegalDoc = 'privacy' | 'terms'

interface Section {
  heading: string
  body: string
}

const DOCS: Record<LegalDoc, { label: string; title: string; updated: string; sections: Section[] }> = {
  privacy: {
    label: 'Legal / 01',
    title: 'Privacy Policy',
    updated: 'Last updated — October 2026',
    sections: [
      {
        heading: 'Information you share',
        body: 'When you send an enquiry, we collect the name, email, company, service, budget, and project details you choose to provide. Chat messages are processed by DeepSeek to generate answers. Your chat transcript is only added to your enquiry when you explicitly consent to sharing it with Ornen. Please do not send passwords, payment details, or confidential information.',
      },
      {
        heading: 'Storage and service providers',
        body: 'Consented enquiries and chat transcripts are stored in Upstash Redis and included in email notifications delivered through Resend. We use these providers only to respond to your request and operate the service. We do not sell, rent, or trade your personal information, and submitting the form does not subscribe you to marketing.',
      },
      {
        heading: 'Retention and your rights',
        body: 'We keep enquiry information only as long as needed for the conversation, service delivery, and legitimate business or legal obligations. Email hello@ornen.co to request access, correction, export, or deletion of the personal data we hold about you.',
      },
      {
        heading: 'AI disclaimer',
        body: 'AI answers can occasionally be wrong and are not legal, medical, or financial advice. Check important details with the Ornen team. Every assistant includes a human handoff path.',
      },
    ],
  },
  terms: {
    label: 'Legal / 02',
    title: 'Terms of Service',
    updated: 'Last updated — October 2026',
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
        body: 'We build carefully and monitor what we run, but software is software: to the maximum extent permitted by law, our total liability is capped at the fees you paid us in the three months preceding a claim.',
      },
    ],
  },
}

export default function LegalModal({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!doc) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => closeRef.current?.focus())

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus()
    }
  }, [doc])

  if (!doc) return null
  const content = DOCS[doc]

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-8" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <button tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 cursor-pointer" style={{ background: 'rgba(10,10,10,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
      <div ref={panelRef} data-lenis-prevent className="msg-in relative flex max-h-[86svh] w-full max-w-xl flex-col border sm:max-h-[80vh]" style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)' }}>
        <div className="flex items-center justify-between gap-4 border-b px-6 py-5 sm:px-8" style={{ borderColor: 'var(--line)' }}>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-acid">{content.label}</p>
            <h2 id="legal-title" className="font-display mt-2 text-xl font-bold uppercase tracking-[0.01em] text-white sm:text-2xl">{content.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close dialog" className="group flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border transition-colors hover:border-[var(--acid)]" style={{ borderColor: 'var(--line)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-faint transition-colors group-hover:text-acid" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="no-scrollbar overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {content.sections.map((section, index) => (
            <section key={section.heading} className={index > 0 ? 'mt-7' : ''}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">{String(index + 1).padStart(2, '0')} — {section.heading}</h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.75] text-dim">{section.body}</p>
            </section>
          ))}
          <p className="font-mono mt-8 border-t pt-5 text-[9px] uppercase tracking-[0.2em] text-faint" style={{ borderColor: 'var(--line)' }}>{content.updated} · Questions — hello@ornen.co</p>
        </div>
      </div>
    </div>
  )
}
