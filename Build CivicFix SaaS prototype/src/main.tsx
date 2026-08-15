import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MvpContinuityLayer from './MvpContinuityLayer'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MvpContinuityLayer>
      <App />
    </MvpContinuityLayer>
  </React.StrictMode>,
)
