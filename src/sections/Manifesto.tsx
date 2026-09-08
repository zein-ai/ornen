export default function Manifesto() {
  return (
    <section className="relative px-6 py-20 sm:px-10 sm:py-40 lg:px-16" id="manifesto">
      <div className="mx-auto max-w-6xl">
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
          The problem with this industry
        </p>
        <h2
          className="reveal font-display mt-10 max-w-5xl text-[8.5vw] font-bold uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-[4.8rem]"
        >
          Most agencies sell you a website.{' '}
          <span className="text-outline">Then they disappear.</span>
        </h2>
        <div className="reveal mt-12 grid grid-cols-1 gap-8 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <p className="max-w-md text-[15px] leading-[1.7] text-dim">
              You are left with a digital brochure that nobody maintains, connected to nothing. We
              build the opposite: a site that converts, a chatbot that answers at 2am, and
              automations that move leads while you sleep. Then we stay on and run it.
            </p>
          </div>
          <div className="sm:col-span-7">
            <div className="grid grid-cols-3 gap-px border" style={{ borderColor: 'var(--line)', background: 'var(--line)' }}>
              {[
                ['5d', 'typical build time'],
                ['24/7', 'monitoring & bots'],
                ['1', 'studio, no handoffs'],
              ].map(([stat, label]) => (
                <div key={label} className="p-4 sm:p-8" style={{ background: 'var(--bg)' }}>
                  <p className="font-display text-[7vw] font-extrabold uppercase sm:text-4xl">{stat}</p>
                  <p className="font-mono mt-2 text-[8.5px] uppercase leading-[1.6] tracking-[0.14em] text-faint sm:text-[10px] sm:tracking-[0.18em]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
