// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react'

import AuthProvider from './auth/AuthContext.jsx'

import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FpjsProvider loadOptions={
      {
        apiKey: import.meta.env.VITE_FPJS_API_KEY,
        region: import.meta.env.VITE_FPJS_REGION
      }
    }>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </FpjsProvider>
  </React.StrictMode>,
)