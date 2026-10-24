export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface LeadPayload {
  name: string
  email: string
  company?: string
  service?: string
  budget?: string
  message?: string
  source: 'contact' | 'chatbot'
  consent: boolean
  website?: string
  conversation?: ConversationMessage[]
}

export async function submitLead(payload: LeadPayload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({})) as { error?: string; id?: string }
  if (!response.ok) throw new Error(data.error || 'Your enquiry could not be sent. Please try again.')
  return data
}
