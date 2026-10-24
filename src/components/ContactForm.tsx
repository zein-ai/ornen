import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router'
import { submitLead } from '@/lib/leads'

const services = ['Launch', 'Grow', 'Autopilot', 'Care plan', 'Website', 'AI chatbot', 'Workflow automation', 'Free audit', 'Not sure yet']
const budgets = ['Under $500', '$500–$1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000+', 'Not sure yet']

const inputClass = 'form-input mt-2 w-full px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-faint'
const labelClass = 'font-mono block text-[10px] uppercase tracking-[0.16em] text-dim'

export default function ContactForm({ onPrivacy }: { onPrivacy: () => void }) {
  const location = useLocation()
  const requestedPlan = new URLSearchParams(location.search).get('plan') || ''
  const [form, setForm] = useState({
    name: '', email: '', company: '', service: requestedPlan, budget: '', message: '', consent: false, website: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (status === 'error') setStatus('idle')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const result = await submitLead({ ...form, source: 'contact' })
      setReference(result.id || '')
      setStatus('success')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your enquiry could not be sent. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border p-7 sm:p-9" style={{ borderColor: 'var(--acid)', background: 'var(--bg-2)' }} role="status">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid">Enquiry received</p>
        <h3 className="font-display mt-4 text-3xl font-bold uppercase text-white">Thanks, {form.name.split(' ')[0]}.</h3>
        <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-dim">
          Your project is now with the Ornen team. Expect a human reply at <span className="text-white">{form.email}</span> within one day.
        </p>
        {reference && <p className="font-mono mt-5 text-[10px] uppercase tracking-[0.16em] text-faint">Reference — {reference.slice(0, 8)}</p>}
        <button
          type="button"
          className="btn mt-7 cursor-pointer"
          onClick={() => {
            setForm({ name: '', email: '', company: '', service: '', budget: '', message: '', consent: false, website: '' })
            setStatus('idle')
          }}
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="border p-5 sm:p-8" style={{ borderColor: 'var(--line-strong)', background: 'var(--bg-2)' }}>
      <fieldset disabled={status === 'submitting'} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact-name">Your name *</label>
          <input id="contact-name" className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required minLength={2} maxLength={80} autoComplete="name" placeholder="Jane Smith" />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-email">Work email *</label>
          <input id="contact-email" className={inputClass} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required maxLength={254} autoComplete="email" placeholder="jane@company.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-company">Company</label>
          <input id="contact-company" className={inputClass} value={form.company} onChange={(e) => update('company', e.target.value)} maxLength={100} autoComplete="organization" placeholder="Your business" />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-service">What are you interested in?</label>
          <select id="contact-service" className={inputClass} value={form.service} onChange={(e) => update('service', e.target.value)}>
            <option value="">Choose a service</option>
            {services.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="contact-budget">Approximate budget</label>
          <select id="contact-budget" className={inputClass} value={form.budget} onChange={(e) => update('budget', e.target.value)}>
            <option value="">Choose a range</option>
            {budgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="contact-message">What should we build or automate? *</label>
          <textarea id="contact-message" className={`${inputClass} min-h-32 resize-y`} value={form.message} onChange={(e) => update('message', e.target.value)} required minLength={10} maxLength={2500} placeholder="Tell us what is taking your time, what you already use, and what a good result would look like." />
        </div>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.6] text-dim sm:col-span-2">
          <input className="form-checkbox mt-0.5" type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} required />
          <span>
            I agree to Ornen storing these details so the team can respond. Read the{' '}
            <button type="button" onClick={onPrivacy} className="cursor-pointer text-white underline underline-offset-4">privacy policy</button>.
          </span>
        </label>
      </fieldset>

      {status === 'error' && <p className="mt-5 text-[14px] leading-relaxed text-[#ff9d8f]" role="alert">{error}</p>}

      <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-acid w-full cursor-pointer justify-center py-4 sm:w-auto" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending enquiry…' : 'Send my project →'}
        </button>
        <p className="font-mono text-[9px] uppercase leading-[1.7] tracking-[0.14em] text-faint">No newsletter. No sales sequence.<br />Just a reply about your project.</p>
      </div>
    </form>
  )
}
