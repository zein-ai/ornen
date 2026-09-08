import SectionTag from '@/components/SectionTag'

const steps = [
  {
    index: 'S.01',
    title: 'Audit',
    time: '20 min · free',
    body: 'A short call where we map what is eating your hours: missed leads, manual follow-ups, a site that does nothing. You leave with a plan even if we never work together.',
  },
  {
    index: 'S.02',
    title: 'Build',
    time: '5 to 10 days',
    body: 'We ship the site, train the chatbot on your material, and wire the automations. You review in a shared preview. No jargon, no 40-page proposals.',
  },
  {
    index: 'S.03',
    title: 'Run',
    time: 'Ongoing',
    body: 'Hosting, monitoring, and monthly improvements on a care plan. The system gets smarter every month. You get a short report instead of a headache.',
  },
]

export default function Process() {
  return (
    <section
      className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16"
      id="process"
      style={{ background: 'var(--bg-2)' }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionTag index="02">How it works</SectionTag>
        <h2 className="reveal font-display max-w-4xl text-[8.5vw] font-bold uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-[4.8rem]">
          Three steps. <span className="text-outline">Then it runs.</span>
        </h2>

        <div className="mt-16 sm:mt-20">
          {steps.map((s, i) => (
            <div
              key={s.index}
              className="reveal grid grid-cols-1 gap-3 border-t py-9 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              style={{ borderColor: 'var(--line)', transitionDelay: `${i * 80}ms` }}
            >
              <span className="font-mono text-[11px] tracking-[0.22em] text-acid sm:col-span-2">
                {s.index}
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-white sm:col-span-3 sm:text-3xl">
                {s.title}
              </h3>
              <p className="max-w-lg text-[14px] leading-[1.7] text-dim sm:col-span-5">{s.body}</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint sm:col-span-2 sm:text-right">
                {s.time}
              </span>
            </div>
          ))}
          <div className="border-t" style={{ borderColor: 'var(--line)' }} />
        </div>
      </div>
    </section>
  )
}
