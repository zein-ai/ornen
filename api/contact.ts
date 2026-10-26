import { json, methodNotAllowed, rateLimit, readJson, safeError } from './_lib/http.js'
import { leadSchema, saveLead } from './_lib/leads.js'

export const config = { maxDuration: 15 }

async function handler(request: Request) {
  if (request.method !== 'POST') return methodNotAllowed()

  try {
    const parsed = leadSchema.safeParse(await readJson(request))
    if (!parsed.success) {
      return json({ error: 'Please check your name, email, project details, and consent.' }, 400)
    }
    if (parsed.data.website) return json({ ok: true })

    const limit = await rateLimit(request, 'contact', 5, '10 m')
    if (!limit.success) {
      const retryAfter = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))
      return json({ error: 'Too many enquiries from this connection. Please try again shortly.' }, 429, {
        'Retry-After': String(retryAfter),
      })
    }

    const result = await saveLead(parsed.data)
    return json({ ok: true, id: result.id }, 201)
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: 'Invalid request.' }, 400)
    if (error instanceof Error && error.message === 'Request too large') {
      return json({ error: 'This enquiry is too large. Please shorten it and try again.' }, 413)
    }
    if (error instanceof Error && error.message === 'Lead storage is not configured') {
      return json({ error: 'The form is temporarily unavailable. Please email hello@ornen.co.' }, 503)
    }
    return safeError(error)
  }
}

export default { fetch: handler }
