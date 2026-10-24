import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, LoaderCircle, MessageCircle, Send, X } from 'lucide-react'
import LegalModal, { type LegalDoc } from '@/components/LegalModal'
import { OPEN_CHAT_EVENT } from '@/lib/chat'
import { submitLead, type ConversationMessage } from '@/lib/leads'

interface Message extends ConversationMessage {
  id: number
}

const INITIAL_MESSAGE: Message = {
  id: 1,
  role: 'assistant',
  content: 'Hi — I’m Ornen’s AI assistant. Ask me what we build, what it costs, or whether we can help with your project.',
}

const QUICK_PROMPTS = ['What do you do?', 'How much does it cost?', 'Can you build something for me?']

export default function LeadChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captureOpen, setCaptureOpen] = useState(false)
  const [lead, setLead] = useState({ name: '', email: '', consent: false, website: '' })
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [legal, setLegal] = useState<LegalDoc | null>(null)
  const nextId = useRef(2)
  const wasOpen = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_CHAT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open || legal) return
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, legal])

  useEffect(() => {
    if (open) {
      wasOpen.current = true
      return
    }
    if (!wasOpen.current || legal) return
    wasOpen.current = false
    // Wait for the launcher's closing-visibility styles to clear before focusing it.
    const timer = window.setTimeout(() => launcherRef.current?.focus(), 230)
    return () => window.clearTimeout(timer)
  }, [open, legal])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, captureOpen])

  function append(role: ConversationMessage['role'], content: string) {
    const message = { id: nextId.current++, role, content }
    setMessages((current) => [...current, message])
  }

  async function sendMessage(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const userMessage: Message = { id: nextId.current++, role: 'user', content }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)
    setCaptureOpen(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.slice(-12).map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      })
      const data = await response.json().catch(() => ({})) as { reply?: string; error?: string }
      if (!response.ok || !data.reply) throw new Error(data.error || 'The assistant could not answer. Please try again.')
      append('assistant', data.reply)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The assistant is unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function captureLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLeadStatus('submitting')
    setError('')
    const conversation = messages.slice(-16).map(({ role, content }) => ({ role, content }))
    const projectSummary = messages
      .filter((message) => message.role === 'user')
      .slice(-5)
      .map((message) => message.content)
      .join('\n')

    try {
      await submitLead({
        name: lead.name,
        email: lead.email,
        service: 'Chatbot enquiry',
        message: projectSummary || 'Visitor requested a human follow-up from the chat.',
        source: 'chatbot',
        consent: lead.consent,
        website: lead.website,
        conversation,
      })
      setCaptureOpen(false)
      setLeadStatus('idle')
      append('assistant', `Thanks, ${lead.name.split(' ')[0]} — your details and this conversation are with the Ornen team. Expect a human reply at ${lead.email} within one day.`)
      setLead({ name: '', email: '', consent: false, website: '' })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your details could not be sent. Please try again.')
      setLeadStatus('error')
    }
  }

  return (
    <>
      <div className={`chat-panel ${open ? 'is-open' : ''}`} role="dialog" aria-label="Ornen AI assistant" aria-hidden={!open}>
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-3">
            <span className="font-mono flex h-8 w-8 items-center justify-center text-[12px]" style={{ background: 'var(--acid)', color: 'var(--acid-ink)' }}>O</span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white">Ornen Assistant</p>
              <p className="mt-1 text-[11px] text-dim">AI answers · human follow-up</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close assistant"
            className="chat-icon-button"
            onClick={() => setOpen(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div ref={scrollRef} data-lenis-prevent className="chat-messages no-scrollbar" role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message) => (
            <div key={message.id} className={`msg-in flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p
                className="max-w-[88%] whitespace-pre-wrap px-4 py-3 text-[14px] leading-[1.6]"
                style={message.role === 'user'
                  ? { background: 'rgba(244,244,240,0.09)', color: 'var(--ink)' }
                  : { border: '1px solid var(--line-strong)', color: 'var(--ink)' }}
              >
                {message.content}
              </p>
            </div>
          ))}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt} type="button" className="chat-prompt" onClick={() => sendMessage(prompt)}>{prompt}</button>
              ))}
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-[12px] text-dim" role="status">
              <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> Thinking…
            </div>
          )}
          {captureOpen && (
            <form onSubmit={captureLead} className="msg-in border p-4" style={{ borderColor: 'var(--acid)', background: 'var(--bg)' }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-acid">Share your project</p>
              <p className="mt-2 text-[12px] leading-[1.55] text-dim">Your name, email, and this chat will go to the Ornen team.</p>
              <label className="font-mono mt-4 block text-[9px] uppercase tracking-[0.14em] text-dim" htmlFor="chat-name">Name *</label>
              <input id="chat-name" className="form-input mt-1.5 w-full px-3 py-2.5 text-[14px] text-white" required minLength={2} maxLength={80} autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
              <label className="font-mono mt-3 block text-[9px] uppercase tracking-[0.14em] text-dim" htmlFor="chat-email">Email *</label>
              <input id="chat-email" className="form-input mt-1.5 w-full px-3 py-2.5 text-[14px] text-white" required type="email" maxLength={254} autoComplete="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
              <div className="hidden" aria-hidden="true">
                <label htmlFor="chat-website">Website</label>
                <input id="chat-website" tabIndex={-1} autoComplete="off" value={lead.website} onChange={(e) => setLead({ ...lead, website: e.target.value })} />
              </div>
              <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-[11px] leading-[1.5] text-dim">
                <input className="form-checkbox mt-0.5" type="checkbox" required checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} />
                <span>I agree to storing my details and this chat so Ornen can respond. <button type="button" className="cursor-pointer text-white underline underline-offset-2" onClick={() => setLegal('privacy')}>Privacy policy</button></span>
              </label>
              <button type="submit" className="btn btn-acid mt-4 w-full cursor-pointer justify-center py-3" disabled={leadStatus === 'submitting'}>
                {leadStatus === 'submitting' ? 'Sending…' : 'Send to Ornen →'}
              </button>
            </form>
          )}
        </div>

        <div className="border-t p-4" style={{ borderColor: 'var(--line)' }}>
          {error && <p className="mb-3 text-[12px] leading-[1.5] text-[#ff9d8f]" role="alert">{error}</p>}
          {!captureOpen && (
            <button type="button" className="font-mono mb-3 flex min-h-9 w-full cursor-pointer items-center justify-between border px-3 py-2 text-[10px] uppercase tracking-[0.13em] text-acid transition-colors hover:bg-white/5" style={{ borderColor: 'var(--line-strong)' }} onClick={() => setCaptureOpen(true)}>
              Want a human to look at your project? <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          )}
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(input) }} className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Message Ornen Assistant</label>
            <input
              ref={inputRef}
              id="chat-input"
              className="form-input min-w-0 flex-1 px-3 py-3 text-[14px] text-white placeholder:text-faint"
              placeholder="Ask about your project…"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1800}
              disabled={loading}
            />
            <button type="submit" className="chat-send" aria-label="Send message" disabled={loading || !input.trim()}>
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="mt-2.5 text-center text-[10px] leading-[1.4] text-faint">AI can make mistakes. No sensitive information, please.</p>
        </div>
      </div>

      <button
        ref={launcherRef}
        type="button"
        className={`chat-launcher ${open ? 'is-hidden' : ''}`}
        aria-label="Open Ornen AI assistant"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">Ask Ornen</span>
      </button>

      <LegalModal doc={legal} onClose={() => setLegal(null)} />
    </>
  )
}
