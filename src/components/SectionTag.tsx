/** Editorial section marker: mono index + label + hairline rule. */
export default function SectionTag({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="reveal mb-12 flex items-baseline gap-5">
      <span className="font-mono text-[11px] tracking-[0.22em] text-acid">{index}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">{children}</span>
      <span className="h-px flex-1 self-center" style={{ background: 'var(--line)' }} />
    </div>
  )
}
