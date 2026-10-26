import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import contactHandler from '../api/contact'
import chatHandler from '../api/chat'
import { leadSchema } from '../api/_lib/leads'

const originalFetch = globalThis.fetch
const originalEnv = { ...process.env }
const validLead = {
  name: 'Jane Smith',
  email: 'JANE@example.com',
  company: 'Example Co',
  service: 'Grow',
  budget: '$1,000–$2,500',
  message: 'We need a website and qualified lead follow-up.',
  source: 'contact',
  consent: true,
  website: '',
  conversation: [],
}

function post(path: string, body: unknown) {
  return new Request(`https://www.ornen.co${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.10' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function configureServices() {
  process.env.DEEPSEEK_API_KEY = 'test-deepseek-key'
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-redis-token'
  process.env.RESEND_API_KEY = 'test-resend-key'
  process.env.RESEND_FROM_EMAIL = 'Ornen Leads <leads@ornen.co>'
  process.env.LEAD_NOTIFICATION_EMAIL = 'hello@ornen.co'
}

beforeEach(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) delete process.env[key]
  }
  Object.assign(process.env, originalEnv)
  for (const key of ['DEEPSEEK_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'LEAD_NOTIFICATION_EMAIL']) {
    delete process.env[key]
  }
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

test('lead schema normalizes email and requires consent and project context', () => {
  const parsed = leadSchema.parse(validLead)
  assert.equal(parsed.email, 'jane@example.com')
  assert.equal(leadSchema.safeParse({ ...validLead, consent: false }).success, false)
  assert.equal(leadSchema.safeParse({ ...validLead, message: '' }).success, false)
})

test('handlers reject unsupported methods', async () => {
  const contact = await contactHandler.fetch(new Request('https://www.ornen.co/api/contact'))
  const chat = await chatHandler.fetch(new Request('https://www.ornen.co/api/chat'))
  assert.equal(contact.status, 405)
  assert.equal(chat.status, 405)
  assert.equal(contact.headers.get('allow'), 'POST')
})

test('invalid enquiries are rejected before storage or rate-limit calls', async () => {
  let fetchCalled = false
  globalThis.fetch = async () => {
    fetchCalled = true
    throw new Error('Unexpected network call')
  }
  const response = await contactHandler.fetch(post('/api/contact', { ...validLead, email: 'not-an-email' }))
  assert.equal(response.status, 400)
  assert.equal(fetchCalled, false)
})

test('honeypot enquiries are accepted without creating a lead', async () => {
  let fetchCalled = false
  globalThis.fetch = async () => {
    fetchCalled = true
    throw new Error('Unexpected network call')
  }
  const response = await contactHandler.fetch(post('/api/contact', { ...validLead, website: 'spam.example' }))
  assert.equal(response.status, 200)
  assert.equal(fetchCalled, false)
})

test('missing infrastructure degrades to safe configuration messages', async () => {
  const contact = await contactHandler.fetch(post('/api/contact', validLead))
  assert.equal(contact.status, 503)
  assert.match((await contact.json()).error, /hello@ornen\.co/)

  const chat = await chatHandler.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'What do you do?' }] }))
  assert.equal(chat.status, 503)
  assert.match((await chat.json()).error, /contact form/)
})

test('oversized JSON bodies return 413 even without a content-length header', async () => {
  configureServices()
  const response = await contactHandler.fetch(post('/api/contact', { ...validLead, message: 'x'.repeat(33_000) }))
  assert.equal(response.status, 413)
})

test('a valid contact lead is stored and triggers a reply-to notification', async () => {
  configureServices()
  let pipelineCalled = false
  let emailBody: { reply_to?: string; to?: string[] } = {}
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.includes('api.resend.com')) {
      emailBody = JSON.parse(String(init?.body))
      return new Response(JSON.stringify({ id: 'email_test' }), { status: 200 })
    }
    if (url.includes('/pipeline')) {
      const commands = JSON.parse(String(init?.body)) as string[][]
      if (commands.length === 1 && commands[0][0].toUpperCase().startsWith('EVAL')) {
        return new Response(JSON.stringify([{ result: [4, 5] }]), { status: 200 })
      }
      pipelineCalled = true
      return new Response(JSON.stringify([{ result: 'OK' }, { result: 1 }, { result: 'OK' }]), { status: 200 })
    }
    return new Response(JSON.stringify([{ result: [4, 5] }]), { status: 200 })
  }

  const response = await contactHandler.fetch(post('/api/contact', validLead))
  const body = await response.json()
  assert.equal(response.status, 201)
  assert.equal(body.ok, true)
  assert.match(body.id, /^[0-9a-f-]{36}$/)
  assert.equal(pipelineCalled, true)
  assert.equal(emailBody.reply_to, 'jane@example.com')
  assert.deepEqual(emailBody.to, ['hello@ornen.co'])
})

test('chat sends grounded history to DeepSeek and returns its answer', async () => {
  configureServices()
  let deepSeekBody: { model?: string; thinking?: { type?: string }; messages?: unknown[] } = {}
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.includes('api.deepseek.com')) {
      deepSeekBody = JSON.parse(String(init?.body))
      return new Response(JSON.stringify({ choices: [{ message: { content: 'Ornen builds websites, chatbots, and automations.' } }] }), { status: 200 })
    }
    return new Response(JSON.stringify([{ result: [19, 20] }]), { status: 200 })
  }

  const response = await chatHandler.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'What do you do?' }] }))
  assert.equal(response.status, 200)
  assert.match((await response.json()).reply, /websites/)
  assert.equal(deepSeekBody.model, 'deepseek-flash')
  assert.equal(deepSeekBody.thinking?.type, 'disabled')
  assert.equal(deepSeekBody.messages?.length, 2)
})

test('distributed rate-limit denials return 429 and Retry-After', async () => {
  configureServices()
  globalThis.fetch = async () => new Response(JSON.stringify([{ result: [-1, 5] }]), { status: 200 })
  const response = await chatHandler.fetch(post('/api/chat', { messages: [{ role: 'user', content: 'How much does it cost?' }] }))
  assert.equal(response.status, 429)
  assert.ok(Number(response.headers.get('retry-after')) >= 1)
})
