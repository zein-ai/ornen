import { useState } from 'react'
import SectionTag from '@/components/SectionTag'

const faqs = [
  {
    q: 'Do I own everything you build?',
    a: 'Yes. The domain is registered in your name, the site code and automation workflows are yours, and hosting is transferable. If you ever leave, nothing is held hostage.',
  },
  {
    q: 'What happens if I cancel the monthly plan?',
    a: 'Everything keeps running. The site stays live and the automations keep firing. You simply lose monitoring, updates, and improvements, and you can restart anytime.',
  },
  {
    q: 'I already have a website. Can you work with it?',
    a: 'Usually, yes. We can bolt a chatbot and automations onto most existing stacks. If the site itself is the bottleneck, we will tell you honestly and quote a rebuild separately.',
  },
  {
    q: 'What is n8n, and why should I care?',
    a: 'It is the open-source automation engine we build on. Think Zapier without the per-task tax. You should care because it is why our automations cost a fixed monthly fee instead of growing with your volume.',
  },
  {
    q: 'How fast do you actually deliver?',
    a: 'Launch-tier sites ship in about 5 working days. Grow and Autopilot builds run 1 to 3 weeks depending on how many systems we connect. You see progress in a live preview from day one.',
  },
]

export default function FAQ({ index = '04' }: { index?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16" id="faq">
      <div className="mx-auto max-w-4xl">
        <SectionTag index={index}>Straight answers</SectionTag>
        <h2 className="reveal font-display text-[8.5vw] font-bold uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-[4.8rem]">
          Asked <span className="text-outline">every time.</span>
        </h2>

        <div className="mt-14">
          {faqs.map((f, i) => {
            const open = openIndex === i
            return (
              <div key={i} className="reveal border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={open}
                >
                  <span className="font-body text-base font-medium text-white sm:text-lg">{f.q}</span>
                  <span
                    className="font-mono text-xl leading-none text-acid transition-transform duration-300"
                    style={{ transform: open ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-all duration-500"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-[14px] leading-[1.7] text-dim">{f.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="border-t" style={{ borderColor: 'var(--line)' }} />
        </div>
      </div>
    </section>
  )
}
