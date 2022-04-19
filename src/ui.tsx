import './ui.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { App } from './App'
import { Preview } from './Preview'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app')
  const root = ReactDOM.createRoot(container)
  root.render(process.env.NODE_ENV === 'development' ? <Preview /> : <App />)
})
