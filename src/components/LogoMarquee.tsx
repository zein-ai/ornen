import {
  siReact, siThreedotjs, siN8n, siClaude, siVercel, siTypescript,
  siStripe, siHubspot, siGooglesheets, siWhatsapp, siNotion, siShopify, siCalendly,
} from 'simple-icons'

// Slack was removed from simple-icons v14+ — official path preserved from the final v13 release
const SI_SLACK_PATH =
  'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z'

interface StackItem {
  title: string
  role: string
  path: string
}

const ROW_ONE: StackItem[] = [
  { title: 'React', role: 'Interfaces', path: siReact.path },
  { title: 'Three.js', role: '3D scenes', path: siThreedotjs.path },
  { title: 'n8n', role: 'Automation core', path: siN8n.path },
  { title: 'Claude', role: 'AI reasoning', path: siClaude.path },
  { title: 'Vercel', role: 'Edge hosting', path: siVercel.path },
  { title: 'TypeScript', role: 'Type safety', path: siTypescript.path },
]

const ROW_TWO: StackItem[] = [
  { title: 'Stripe', role: 'Payments', path: siStripe.path },
  { title: 'Slack', role: 'Team alerts', path: SI_SLACK_PATH },
  { title: 'HubSpot', role: 'CRM sync', path: siHubspot.path },
  { title: 'Google Sheets', role: 'Data & tracking', path: siGooglesheets.path },
  { title: 'WhatsApp', role: 'Direct messaging', path: siWhatsapp.path },
  { title: 'Notion', role: 'Knowledge base', path: siNotion.path },
  { title: 'Shopify', role: 'E-commerce', path: siShopify.path },
  { title: 'Calendly', role: 'Automated scheduling', path: siCalendly.path },
]

function StackChip({ title, role, path }: StackItem) {
  return (
    <span className="pr-3">
      <span
        className="group flex items-center gap-4 border px-5 py-3.5 transition-colors duration-300 hover:border-[var(--acid)] sm:px-6 sm:py-4"
        style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-white opacity-70 transition-opacity duration-300 group-hover:opacity-100 sm:h-7 sm:w-7"
          fill="currentColor"
          role="img"
          aria-label={title}
        >
          <path d={path} />
        </svg>
        <span className="flex flex-col gap-0.5">
          <span className="font-display text-[14px] font-bold uppercase tracking-[0.02em] text-white sm:text-[15px]">
            {title}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">
            {role}
          </span>
        </span>
      </span>
    </span>
  )
}

function MarqueeRow({ items, reverse = false, duration }: { items: StackItem[]; reverse?: boolean; duration: string }) {
  return (
    <div className="marquee-mask overflow-hidden" aria-hidden="true">
      <div
        className={`marquee items-stretch ${reverse ? 'marquee-reverse' : ''}`}
        style={{ animationDuration: duration }}
      >
        {[...items, ...items].map((item, i) => (
          <StackChip key={i} {...item} />
        ))}
      </div>
    </div>
  )
}

/** The stack — agency-style dual marquee, every tool named with its job. */
export default function LogoMarquee() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20" aria-label="Technology stack">
      {/* Header */}
      <div className="mx-auto mb-10 flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 sm:mb-12 sm:px-10 lg:px-16">
        <div>
          <p className="reveal font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
            <span className="text-acid">The stack</span> — what powers every build
          </p>
          <h2 className="reveal font-display mt-5 text-3xl font-extrabold uppercase leading-[0.98] tracking-[-0.01em] sm:text-5xl">
            Serious tools. <span className="text-outline">No duct tape.</span>
          </h2>
        </div>
        <p className="reveal max-w-xs text-[13.5px] leading-[1.65] text-dim">
          We wire into the software your team already uses. No need to migrate platforms
          or change your existing workflow.
        </p>
      </div>

      {/* Dual-direction agency marquee */}
      <p className="reveal mx-auto mb-3 max-w-6xl px-6 font-mono text-[9px] uppercase tracking-[0.22em] text-faint sm:px-10 lg:px-16">
        01 — Core technologies
      </p>
      <MarqueeRow items={ROW_ONE} duration="46s" />
      <p className="reveal mx-auto mb-3 mt-8 max-w-6xl px-6 font-mono text-[9px] uppercase tracking-[0.22em] text-faint sm:px-10 lg:px-16">
        02 — Plugs into your business
      </p>
      <MarqueeRow items={ROW_TWO} reverse duration="52s" />

      {/* Footnote */}
      <div className="mx-auto mt-10 flex max-w-6xl items-center gap-5 px-6 sm:px-10 lg:px-16">
        <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
        <p className="reveal font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          Zero lock-in · 100% owned workflows · Connected to your favorite tools
        </p>
        <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
      </div>
    </section>
  )
}
