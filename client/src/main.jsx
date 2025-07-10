import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner' // ✅ native Sonner import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster /> {/* ✅ visible */}
  </StrictMode>,
)
