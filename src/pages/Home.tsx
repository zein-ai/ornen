import Nav from '@/components/Nav'
import LogoMarquee from '@/components/LogoMarquee'
import Hero from '@/sections/Hero'
import Manifesto from '@/sections/Manifesto'
import Services from '@/sections/Services'
import Process from '@/sections/Process'
import ChatDemo from '@/sections/ChatDemo'
import UseCases from '@/sections/UseCases'
import FAQ from '@/sections/FAQ'
import Contact from '@/sections/Contact'
import { usePageFx } from '@/hooks/usePageFx'

export default function Home() {
  usePageFx()

  return (
    <main className="relative">
      <Nav />
      <Hero />
      <LogoMarquee />
      <Manifesto />
      <Services />
      <Process />
      <ChatDemo />
      <UseCases />
      <FAQ index="05" />
      <Contact index="06" />
    </main>
  )
}
