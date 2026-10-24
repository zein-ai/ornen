import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  })
}

export function methodNotAllowed() {
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' })
}

export async function readJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 32_000) throw new Error('Request too large')
  const body = await request.text()
  if (new TextEncoder().encode(body).byteLength > 32_000) throw new Error('Request too large')
  return JSON.parse(body) as unknown
}

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

let redis: Redis | null = null
const limiters = new Map<string, Ratelimit>()

export function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Lead storage is not configured')
  }
  redis ??= Redis.fromEnv()
  return redis
}

export async function rateLimit(
  request: Request,
  scope: 'chat' | 'contact',
  requests: number,
  window: `${number} ${'s' | 'm' | 'h' | 'd'}`,
) {
  const limiter = limiters.get(scope) ?? new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `ornen:ratelimit:${scope}`,
    analytics: false,
    timeout: 3000,
  })
  limiters.set(scope, limiter)
  return limiter.limit(clientIp(request))
}

export function safeError(error: unknown) {
  console.error(error)
  return json({ error: 'Something went wrong. Please try again or email hello@ornen.co.' }, 500)
}
