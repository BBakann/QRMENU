import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './shared/components/ProtectedRoute/ProtectedRoute'
import './App.css'

// Lazy load components for better performance
const WelcomePage = lazy(() => import('./features/home').then(module => ({ default: module.WelcomePage })))
const MenuView = lazy(() => import('./features/menu').then(module => ({ default: module.MenuView })))
const AdminLogin = lazy(() => import('./features/auth').then(module => ({ default: module.AdminLogin })))
const AdminDashboard = lazy(() => import('./features/admin').then(module => ({ default: module.AdminDashboard })))

// Page transition variants - sadece opacity
const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 1 // Daha uzun transition
}

function AnimatedRoute({ children }) {
  return <div>{children}</div>
}

function App() {
  return (
    <div className="app">
      <Suspense fallback={
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      }>
          <Routes>
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
      </Suspense>
    </div>
  )
}

export default App
