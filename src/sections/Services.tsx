import SectionTag from '@/components/SectionTag'

const services = [
  {
    index: '01',
    name: 'Websites & Hosting',
    description:
      'Conversion-first sites with domain setup, managed hosting, and analytics wired in from day one. Built to load fast on a phone in a parking lot.',
    tags: ['Next-gen builds', 'Domain + DNS', 'Managed hosting', 'Analytics'],
  },
  {
    index: '02',
    name: 'AI Chatbots',
    description:
      'An assistant trained on your documents, pricing, and FAQs. Captures leads, books calls, and answers customers at 2am in your tone of voice.',
    tags: ['Trained on your data', 'Lead capture', 'Booking flows', 'Human handoff'],
  },
  {
    index: '03',
    name: 'Workflow Automation',
    description:
      'n8n pipelines that erase copy-paste work. Lead intake to CRM, follow-up sequences, invoice chasing, weekly reports, all on infrastructure we maintain.',
    tags: ['n8n pipelines', 'CRM sync', 'Auto follow-ups', 'Report synthesis'],
  },
  {
    index: '04',
    name: 'Care & Optimization',
    description:
      'We stay on. Monitoring, updates, monthly improvements, and a real human on email when something needs a judgment call.',
    tags: ['24/7 monitoring', 'Monthly updates', 'Priority support', 'Quarterly reviews'],
  },
]

export default function Services() {
  return (
    <section className="py-20 sm:px-10 sm:py-28 lg:px-16" id="services">
      <div className="mx-auto max-w-6xl px-6 sm:px-0">
        <SectionTag index="01">What we build</SectionTag>
        <h2 className="reveal font-display max-w-4xl text-[9.5vw] font-bold uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-[4.8rem]">
          Four pieces. <span className="text-outline">One machine.</span>
        </h2>
      </div>

      {/* Phone: swipeable snap rail of service cards */}
      <div className="mt-12 sm:hidden">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
          {services.map((s) => (
            <article
              key={s.index}
              className="reveal flex w-[80vw] max-w-[330px] shrink-0 snap-start flex-col border p-6"
              style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)' }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] tracking-[0.22em] text-acid">/{s.index}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Service</span>
              </div>
              <h3 className="font-display mt-6 text-2xl font-bold uppercase leading-[1.02] text-white">
                {s.name}
              </h3>
              <p className="mt-4 flex-1 text-[13.5px] leading-[1.65] text-dim">{s.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <li
                    key={t}
                    className="font-mono border px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-faint"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {/* End spacer so the last card can snap clear of the edge */}
          <div className="w-3 shrink-0" aria-hidden="true" />
        </div>
        <p className="font-mono mt-4 px-6 text-[9px] uppercase tracking-[0.22em] text-faint">
          ← Swipe to explore — 04 services
        </p>
      </div>

      {/* Desktop: editorial rows */}
      <div className="mx-auto mt-16 hidden max-w-6xl px-6 sm:mt-20 sm:block sm:px-0">
        {services.map((s) => (
          <div
            key={s.index}
            className="reveal group grid grid-cols-1 gap-4 border-t py-9 sm:grid-cols-12 sm:gap-6 sm:py-12"
            style={{ borderColor: 'var(--line)' }}
          >
            <span className="font-mono text-[11px] tracking-[0.22em] text-faint sm:col-span-1">
              /{s.index}
            </span>
            <h3 className="font-display text-2xl font-bold uppercase tracking-[0.01em] text-white transition-all duration-500 group-hover:translate-x-2 group-hover:text-acid sm:col-span-4 sm:text-3xl">
              {s.name}
            </h3>
            <p className="max-w-md text-[14px] leading-[1.7] text-dim sm:col-span-4">
              {s.description}
            </p>
            <ul className="flex flex-wrap gap-2 sm:col-span-3 sm:justify-end sm:content-start">
              {s.tags.map((t) => (
                <li
                  key={t}
                  className="font-mono h-fit border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-faint transition-colors duration-300 group-hover:text-dim"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="border-t" style={{ borderColor: 'var(--line)' }} />
      </div>
    </section>
  )
}
