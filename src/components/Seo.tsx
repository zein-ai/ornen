import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path: string
  noindex?: boolean
}

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector)
  element?.setAttribute(attribute, value)
}

export default function Seo({ title, description, path, noindex = false }: SeoProps) {
  useEffect(() => {
    const url = `https://www.ornen.co${path}`
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url)

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = noindex ? 'noindex, nofollow' : 'index, follow'
  }, [title, description, path, noindex])

  return null
}
