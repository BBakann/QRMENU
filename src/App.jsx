import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './shared/components/ProtectedRoute/ProtectedRoute'
import './App.css'

// Lazy load components for better performance
const WelcomePage = lazy(() => import('./features/home').then(module => ({ default: module.WelcomePage })))
const MenuView = lazy(() => import('./features/menu').then(module => ({ default: module.MenuView })))
const AdminLogin = lazy(() => import('./features/auth').then(module => ({ default: module.AdminLogin })))
const AdminDashboard = lazy(() => import('./features/admin').then(module => ({ default: module.AdminDashboard })))

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 1,
    x: 0
  },
  in: {
    opacity: 1,
    scale: 1,
    x: 0
  },
  out: {
    opacity: 0,
    scale: 1,
    x: 0
  }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4 // daha kısa tut
}

function AnimatedRoute({ children }) {
  return <div>{children}</div>
}

function App() {
  const location = useLocation()
  
  return (
    <div className="app">
      <Suspense fallback={
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      }>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <AnimatedRoute>
                <WelcomePage />
              </AnimatedRoute>
            } />
            <Route path="/menu" element={
              <AnimatedRoute>
                <MenuView />
              </AnimatedRoute>
            } />
            <Route path="/admin" element={
              <AnimatedRoute>
                <AdminLogin />
              </AnimatedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AnimatedRoute>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              </AnimatedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}

export default App
