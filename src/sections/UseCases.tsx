import SectionTag from '@/components/SectionTag'

interface Workflow {
  index: string
  audience: string
  title: string
  pain: string
  steps: string[]
  impact: string
}

const workflows: Workflow[] = [
  {
    index: 'W.01',
    audience: 'Local Services · Clinics · Contractors',
    title: 'The 24/7 Lead Catcher',
    pain: 'Missed calls after 5pm and slow replies cost 40% of inbound leads.',
    steps: ['Inbound Form / Call', 'AI SMS Auto-Response (<30s)', 'Calendar Booking', 'Airtable CRM'],
    impact: 'Zero missed leads · Saves 10 hrs/wk',
  },
  {
    index: 'W.02',
    audience: 'B2B Services · Agencies · Consultants',
    title: 'Frictionless Client Onboarding',
    pain: 'Manual proposal generation, invoice chasing, and repetitive emails.',
    steps: ['Signed Deal (Stripe)', 'Auto-Create Slack Channel', 'Drive Folder + Contract Setup', 'Welcome Email Sequence'],
    impact: 'Onboarding time cut from 48h to 2 minutes',
  },
  {
    index: 'W.03',
    audience: 'E-Commerce · Operations',
    title: 'Autonomous Customer Care',
    pain: 'Repetitive order tracking and returns questions overloading support.',
    steps: ['Support Query', 'AI Docs & Policy Check', 'Shopify / Shipping API Lookup', 'Instant Resolution or Human Escalation'],
    impact: '65% of repetitive tickets answered instantly',
  },
]

function WorkflowCard({ w, i }: { w: Workflow; i: number }) {
  return (
    <article
      className="reveal flex h-full w-[84vw] max-w-[360px] shrink-0 snap-start flex-col border p-6 sm:p-7 lg:w-auto lg:max-w-none"
      style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)', transitionDelay: `${i * 80}ms` }}
    >
      {/* Card header: index + audience */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.22em] text-acid">/{w.index}</span>
        <span className="font-mono text-right text-[9px] uppercase leading-[1.5] tracking-[0.16em] text-faint">
          {w.audience}
        </span>
      </div>

      <h3 className="font-display mt-6 text-[22px] font-bold uppercase leading-[1.05] text-white">
        {w.title}
      </h3>

      {/* The pain */}
      <div className="mt-5 border-l-2 pl-4" style={{ borderColor: 'var(--line-strong)' }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">The pain</p>
        <p className="mt-2 text-[13px] leading-[1.6] text-dim">{w.pain}</p>
      </div>

      {/* Visual pipeline: step nodes connected with arrows */}
      <ol className="mt-6 flex-1">
        {w.steps.map((step, si) => {
          const isLast = si === w.steps.length - 1
          return (
            <li key={step}>
              <div
                className="flex items-start gap-3 border px-3 py-2.5"
                style={{ borderColor: isLast ? 'var(--line-strong)' : 'var(--line)' }}
              >
                <span className="font-mono pt-px text-[10px] text-faint">
                  {String(si + 1).padStart(2, '0')}
                </span>
                <span
                  className={`font-mono text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em] ${isLast ? 'text-acid' : 'text-white'}`}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div aria-hidden="true" className="flex items-center gap-2 py-1 pl-3">
                  <span className="font-mono text-[10px] leading-none text-acid">↓</span>
                  <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* Impact metric */}
      <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[10px] uppercase leading-[1.6] tracking-[0.14em] text-acid">
          {w.impact}
        </p>
      </div>
    </article>
  )
}

export default function UseCases() {
  return (
    <section className="py-20 sm:px-10 sm:py-28 lg:px-16" id="work">
      <div className="mx-auto max-w-6xl px-6 sm:px-0">
        <SectionTag index="04">Tangible Results</SectionTag>
        <h2 className="reveal font-display max-w-4xl text-[9.5vw] font-bold uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-[4.8rem]">
          Workflows we build. <span className="text-outline">Hours you save.</span>
        </h2>
        <p className="reveal mt-6 max-w-2xl text-[15px] leading-[1.7] text-dim">
          Three real-world automations we deploy to eliminate busywork and capture lost revenue.
        </p>
      </div>

      {/* Phone / tablet: swipeable snap rail */}
      <div className="mt-12 lg:hidden">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
          {workflows.map((w, i) => (
            <WorkflowCard key={w.index} w={w} i={i} />
          ))}
          {/* End spacer so the last card can snap clear of the edge */}
          <div className="w-3 shrink-0" aria-hidden="true" />
        </div>
        <p className="font-mono mt-4 px-6 text-[9px] uppercase tracking-[0.22em] text-faint">
          ← Swipe to explore — 03 workflows
        </p>
      </div>

      {/* Desktop: three-column grid */}
      <div className="mx-auto mt-16 hidden max-w-6xl px-6 sm:px-0 lg:mt-20 lg:grid lg:grid-cols-3 lg:gap-4">
        {workflows.map((w, i) => (
          <WorkflowCard key={w.index} w={w} i={i} />
        ))}
      </div>
    </section>
  )
}
