import { useEffect, useRef, useState } from 'react'
import SectionTag from '@/components/SectionTag'

interface Message {
  from: 'bot' | 'user'
  text: string
}

const SCRIPT: Message[] = [
  { from: 'user', text: 'Hey, do you guys build chatbots for small businesses?' },
  {
    from: 'bot',
    text: 'We do. This one you are talking to is the demo, trained on Ornen’s own service docs. Yours would answer questions about your pricing, availability, and process, in your tone.',
  },
  { from: 'user', text: 'What happens if someone asks something it doesn’t know?' },
  {
    from: 'bot',
    text: 'It captures their name and email, tells them a human will follow up, and pings you instantly. No lead ever hits a dead end.',
  },
  { from: 'user', text: 'Nice. How fast could this be live on my site?' },
  {
    from: 'bot',
    text: 'Typically inside a week, including training on your documents. Want me to book you a free 20-minute audit call? I can grab your email right here.',
  },
]

export default function ChatDemo() {
  const [started, setStarted] = useState(false)
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || visible >= SCRIPT.length) return
    const next = SCRIPT[visible]
    const isBot = next.from === 'bot'
    if (isBot) setTyping(true)
    const timer = setTimeout(
      () => {
        setTyping(false)
        setVisible((v) => v + 1)
      },
      isBot ? 1400 + next.text.length * 6 : 900,
    )
    return () => clearTimeout(timer)
  }, [started, visible])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [visible, typing])

  const done = visible >= SCRIPT.length

  return (
    <section ref={sectionRef} className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16" id="demo">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionTag index="03">Live proof</SectionTag>
          <h2 className="reveal font-display text-[8.5vw] font-bold uppercase leading-[0.98] tracking-[-0.01em] sm:text-6xl lg:text-[4.2rem]">
            This bot is <span className="text-outline-acid">selling us</span> right now.
          </h2>
          <p className="reveal mt-8 max-w-md text-[15px] leading-[1.7] text-dim">
            No actors, no mockup. A scripted demo of exactly what we install on client sites. It
            answers, qualifies, and books. Imagine it working your leads while you are off the
            clock.
          </p>
          <ul className="reveal mt-10 space-y-0">
            {['Trained on your real documents', 'Captures contact details on autopilot', 'Hands off to a human when it should'].map((f, i) => (
              <li
                key={f}
                className="font-mono flex items-center gap-4 border-t py-4 text-[12px] uppercase tracking-[0.14em] text-dim"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="text-acid">0{i + 1}</span>
                {f}
              </li>
            ))}
            <li className="border-t" style={{ borderColor: 'var(--line)' }} />
          </ul>
        </div>

        {/* Chat window — square, flat, hairlines */}
        <div className="reveal border" style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)' }}>
          <div className="flex items-center justify-between border-b px-5 py-3.5" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-3">
              <span
                className="font-mono flex h-7 w-7 items-center justify-center text-[11px] font-medium"
                style={{ background: 'var(--acid)', color: 'var(--acid-ink)' }}
              >
                O
              </span>
              <div>
                <p className="font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-white">Ornen Assistant</p>
                <p className="font-mono flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-faint">
                  <span className="blink-dot h-1 w-1" style={{ background: 'var(--acid)' }} />
                  Online
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Demo</span>
          </div>

          <div ref={scrollRef} className="h-80 space-y-4 overflow-y-auto px-5 py-5 sm:h-96">
            {SCRIPT.slice(0, visible).map((m, i) => (
              <div key={i} className={`msg-in flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className="max-w-[85%] px-4 py-3 text-[13.5px] leading-[1.6]"
                  style={
                    m.from === 'user'
                      ? { background: 'rgba(244,244,240,0.08)', color: 'var(--ink)' }
                      : { border: '1px solid var(--line-strong)', color: 'var(--ink)' }
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 px-4 py-3"
                  style={{ border: '1px solid var(--line-strong)' }}
                >
                  <span className="typing-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />
                  <span className="typing-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />
                  <span className="typing-dot h-1.5 w-1.5" style={{ background: 'var(--acid)' }} />
                </div>
              </div>
            )}
          </div>

          <div className="border-t px-5 py-4" style={{ borderColor: 'var(--line)' }}>
            {done ? (
              <a href="mailto:hello@ornen.co?subject=I%20want%20this%20chatbot%20on%20my%20site" className="btn btn-acid w-full justify-center">
                Get one for your site →
              </a>
            ) : (
              <div className="font-mono border px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-faint" style={{ borderColor: 'var(--line)' }}>
                Watching the demo…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
