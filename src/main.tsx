import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.tsx'

import store from './redux/store.ts'
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google'


createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="133017213466-khfo6iemgc8sk0bijeie1l87r2qb8k3b.apps.googleusercontent.com">
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  </GoogleOAuthProvider>
)
