import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Removed .tsx extension to prevent strict TS errors in bundler CI environments
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)