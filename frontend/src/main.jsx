import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {store} from './redux/store.js'
import {Provider} from 'react-redux'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  </Provider>
)