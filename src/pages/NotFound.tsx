import { Link } from 'react-router'
import Nav from '@/components/Nav'
import Seo from '@/components/Seo'

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col">
      <Seo title="Page not found — Ornen" description="The requested page could not be found." path="/404" noindex />
      <Nav />
      <section className="flex flex-1 items-center px-6 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-acid">404 — Off the map</p>
          <h1 className="font-display mt-8 text-[15vw] font-extrabold uppercase leading-[0.9] sm:text-8xl">Nothing here.</h1>
          <p className="mt-6 max-w-md text-[16px] leading-[1.7] text-dim">This page does not exist. The services, pricing, and project form are still where they should be.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-acid">Back home</Link>
            <Link to="/pricing" className="btn">See pricing</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
