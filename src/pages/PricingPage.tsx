import { Link } from 'react-router'
import Nav from '@/components/Nav'
import SectionTag from '@/components/SectionTag'
import Seo from '@/components/Seo'
import FAQ from '@/sections/FAQ'
import Contact from '@/sections/Contact'
import { usePageFx } from '@/hooks/usePageFx'

const tiers = [
  { name: 'Launch', price: '$500', cadence: 'one-time', tagline: 'Get online properly.', features: ['Conversion website, mobile-first', 'Domain, DNS & hosting setup', 'Analytics + basic SEO', 'Delivered in about 5 days'], cta: 'Start with Launch', featured: false },
  { name: 'Grow', price: '$999', cadence: '+ $99 / month', tagline: 'The full stack, cared for.', features: ['Everything in Launch', 'AI chatbot trained on your docs', 'One workflow automation (lead intake to CRM to follow-up)', 'Hosting, monitoring & monthly updates'], cta: 'Start with Grow', featured: true },
  { name: 'Autopilot', price: '$2,500+', cadence: '+ from $290 / month', tagline: 'Your operations, automated.', features: ['Everything in Grow', 'Multi-workflow n8n automation suite', 'Priority support & quarterly reviews', 'We operate it, you watch the reports'], cta: 'Talk about Autopilot', featured: false },
]
const includes = ['Domain in your name', 'SSL & security handled', 'Analytics from day one', 'You own all code & workflows', 'Cancel anytime — nothing breaks']
type Cell = string | boolean
const comparison: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: 'Conversion website, mobile-first', cells: [true, true, true] },
  { label: 'Domain, DNS & hosting setup', cells: [true, true, true] },
  { label: 'Analytics + basic SEO', cells: [true, true, true] },
  { label: 'AI chatbot on your docs', cells: [false, true, true] },
  { label: 'Workflow automations', cells: [false, '1 pipeline', 'Full suite'] },
  { label: '24/7 monitoring & updates', cells: [false, true, true] },
  { label: 'Monthly improvements', cells: [false, true, true] },
  { label: 'Priority support', cells: [false, false, true] },
  { label: 'Quarterly strategy reviews', cells: [false, false, true] },
]
function Mark({ value }: { value: Cell }) {
  if (value === true) return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Included"><path d="M2 7.5L5.5 11L12 3.5" stroke="var(--acid)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  if (value === false) return <span className="font-mono text-[11px] text-faint">—</span>
  return <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">{value}</span>
}
export default function PricingPage() {
  usePageFx()
  return <main className="relative">
    <Seo title="Pricing — Ornen Websites, AI Chatbots & Automation" description="Transparent Ornen pricing: Launch from $500 one-time, Grow at $999 plus $99/month, and custom Autopilot workflows. Share your project for a tailored recommendation." path="/pricing" />
    <Nav />
    <section className="px-6 pb-16 pt-32 sm:px-10 sm:pt-40 lg:px-16"><div className="mx-auto max-w-6xl">
      <div className="build-in mb-12 flex items-baseline gap-5" style={{ animationDelay: '0.1s' }}><span className="font-mono text-[11px] tracking-[0.22em] text-acid">04</span><span className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">Pricing</span><span className="h-px flex-1 self-center" style={{ background: 'var(--line)' }} /></div>
      <h1 className="build-in font-display max-w-5xl text-[11vw] font-extrabold uppercase leading-[0.94] tracking-[-0.01em] sm:text-7xl lg:text-[6rem]" style={{ animationDelay: '0.25s' }}>Priced like a product. <span className="text-outline">Not a mystery.</span></h1>
      <p className="build-in mt-8 max-w-xl text-[15px] leading-[1.7] text-dim" style={{ animationDelay: '0.4s' }}>You own the domain, the site, and the automations. The monthly plan is us staying on as your operations team. Cancel anytime and everything keeps running.</p>
    </div></section>
    <section className="px-6 sm:px-10 lg:px-16"><div className="mx-auto grid max-w-6xl grid-cols-1 gap-px border lg:grid-cols-[1fr_1.25fr_1fr]" style={{ borderColor: 'var(--line-strong)', background: 'var(--line)' }}>
      {tiers.map((t, i) => <div key={t.name} className={`reveal relative flex flex-col p-7 transition-colors duration-300 sm:p-10 ${t.featured ? 'order-first lg:order-none' : ''}`} style={{ background: 'var(--bg)', transitionDelay: `${i * 90}ms` }}>
        <div className="flex items-baseline justify-between gap-3"><h2 className="font-mono text-[12px] font-medium uppercase tracking-[0.25em] text-dim">{t.name}</h2>{t.featured && <span className="font-mono border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-acid" style={{ borderColor: 'var(--acid)' }}>Most chosen</span>}</div>
        <p className="font-display mt-8 text-5xl font-extrabold uppercase tracking-[-0.01em] text-white sm:text-6xl">{t.price}</p><p className="font-mono mt-2 text-[10px] uppercase tracking-[0.18em] text-faint">{t.cadence}</p><p className="mt-5 text-[14px] text-dim">{t.tagline}</p>
        <ul className="mt-9 flex-1">{t.features.map((f) => <li key={f} className="border-t py-3.5 text-[13.5px] leading-relaxed text-dim" style={{ borderColor: 'var(--line)' }}>{f}</li>)}</ul>
        <Link to={`/?plan=${encodeURIComponent(t.name)}#contact`} className={`btn mt-10 justify-center py-4 ${t.featured ? 'btn-acid' : ''}`}>{t.cta}</Link>
      </div>)}
    </div>
    <div className="reveal mx-auto mt-px flex max-w-6xl flex-col gap-4 border border-t-0 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8" style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)' }}><p className="max-w-md text-[14px] leading-[1.65] text-dim"><span className="text-white">Already have a site you like?</span> We bolt on the chatbot and automations, then keep it all alive.</p><Link to="/?plan=Care%20plan#contact" className="font-mono flex min-h-11 items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-acid">Care plan from $99/mo<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H4M13 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></Link></div></section>
    <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16"><div className="mx-auto max-w-6xl"><SectionTag index="04.1">Every plan includes</SectionTag><div className="grid grid-cols-1 gap-px border sm:grid-cols-2 lg:grid-cols-5" style={{ borderColor: 'var(--line-strong)', background: 'var(--line)' }}>{includes.map((item, i) => <div key={item} className="reveal p-6" style={{ background: 'var(--bg)', transitionDelay: `${i * 60}ms` }}><p className="font-mono text-[10px] tracking-[0.22em] text-acid">0{i + 1}</p><p className="mt-4 text-[13.5px] font-medium leading-snug text-white">{item}</p></div>)}</div></div></section>
    <section className="py-4 sm:px-10 lg:px-16" style={{ background: 'var(--bg-2)' }}><div className="mx-auto max-w-6xl px-6 py-16 sm:px-0 sm:py-20"><SectionTag index="04.2">Side by side</SectionTag><div className="no-scrollbar overflow-x-auto"><div className="min-w-[600px]"><div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b" style={{ borderColor: 'var(--line-strong)' }}><span className="font-mono sticky left-0 py-4 pr-4 text-[10px] uppercase tracking-[0.2em] text-faint" style={{ background: 'var(--bg-2)' }}>Capability</span>{tiers.map((t) => <span key={t.name} className={`font-mono py-4 text-center text-[10px] uppercase tracking-[0.2em] ${t.featured ? 'text-acid' : 'text-dim'}`}>{t.name}</span>)}</div>{comparison.map((row) => <div key={row.label} className="reveal grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b" style={{ borderColor: 'var(--line)' }}><span className="sticky left-0 py-4 pr-4 text-[13px] text-white" style={{ background: 'var(--bg-2)' }}>{row.label}</span>{row.cells.map((c, j) => <span key={j} className="flex items-center justify-center py-4"><Mark value={c} /></span>)}</div>)}</div></div><p className="font-mono mt-5 text-[9px] uppercase tracking-[0.2em] text-faint sm:hidden">← Swipe sideways to compare</p></div></section>
    <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16"><div className="reveal mx-auto flex max-w-6xl flex-col items-start gap-8 border p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12" style={{ borderColor: 'var(--line-strong)' }}><div><h2 className="font-display text-3xl font-extrabold uppercase leading-[0.98] tracking-[-0.01em] sm:text-5xl">Not sure <span className="text-outline">which fits?</span></h2><p className="mt-4 max-w-md text-[14px] leading-[1.7] text-dim">Request a free project audit. Tell us what is eating your hours and we’ll reply with the tier that fits — even if the answer is none of them.</p></div><Link to="/?plan=Free%20audit#contact" className="btn btn-acid shrink-0 py-4">Request the free audit</Link></div></section>
    <FAQ index="05" /><Contact index="06" />
  </main>
}
