// This code bootstraps a React application by rendering the App component inside the DOM element with id root, 
// wrapped in <StrictMode> to highlight potential problems 
// and enforce best practices during development.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
