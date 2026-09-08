import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import Home from './pages/Home'
import PricingPage from './pages/PricingPage'
import Preloader, { introSeen } from './components/Preloader'

export default function App() {
  // Full intro plays once per browser session; repeat visits skip it entirely
  const [loading, setLoading] = useState(() => !introSeen())

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
