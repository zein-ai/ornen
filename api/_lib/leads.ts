import { Resend } from 'resend'
import { z } from 'zod'
import { getRedis } from './http'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(2000),
})

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80).regex(/^[^\r\n]+$/),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  company: z.string().trim().max(100).default(''),
  service: z.string().trim().max(100).default('Not specified'),
  budget: z.string().trim().max(100).default('Not specified'),
  message: z.string().trim().min(10).max(2500),
  source: z.enum(['contact', 'chatbot']).default('contact'),
  consent: z.literal(true),
  website: z.string().max(200).default(''),
  conversation: z.array(messageSchema).max(16).default([]),
})

export type LeadInput = z.infer<typeof leadSchema>

function escapeText(value: string) {
  return value.replace(/\r/g, '').trim()
}

export async function saveLead(input: LeadInput) {
  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const lead = { ...input, id, createdAt, website: undefined }
  const redis = getRedis()

  await redis.pipeline()
    .set(`ornen:lead:${id}`, JSON.stringify(lead))
    .lpush('ornen:leads:recent', id)
    .ltrim('ornen:leads:recent', 0, 499)
    .exec()

  let notificationSent = false
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.LEAD_NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const transcript = input.conversation.length
        ? `\n\nChat transcript (submitted with consent):\n${input.conversation.map((m) => `${m.role === 'user' ? 'Visitor' : 'Assistant'}: ${escapeText(m.content)}`).join('\n\n')}`
        : ''
      const text = [
        `New ${input.source} enquiry`,
        '',
        `Reference: ${id}`,
        `Received: ${createdAt}`,
        `Name: ${escapeText(input.name)}`,
        `Email: ${escapeText(input.email)}`,
        `Company: ${escapeText(input.company) || '—'}`,
        `Service: ${escapeText(input.service)}`,
        `Budget: ${escapeText(input.budget)}`,
        '',
        `Project details:\n${escapeText(input.message) || '—'}`,
        transcript,
      ].join('\n')

      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.LEAD_NOTIFICATION_EMAIL],
        replyTo: input.email,
        subject: `New Ornen lead — ${input.name} (${input.service})`,
        text,
      })
      notificationSent = !result.error
      if (result.error) console.error('Lead notification failed', result.error)
    } catch (error) {
      console.error('Lead notification failed', error)
    }
  }

  return { id, notificationSent }
}
