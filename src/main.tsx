import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// Static-host deep-link recovery: /pricing serves a tiny redirect page that
// bounces here; restore the intended route before the router reads it.
const redirect = sessionStorage.getItem('ornen:redirect')
if (redirect) {
  sessionStorage.removeItem('ornen:redirect')
  window.history.replaceState(null, '', redirect)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
