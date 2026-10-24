import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import PricingPage from './pages/PricingPage'
import NotFound from './pages/NotFound'
import LeadChatbot from './components/LeadChatbot'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <LeadChatbot />
    </>
  )
}
