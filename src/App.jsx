import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import WelcomePage from './components/WelcomePage'
import MenuView from './components/MenuView'
import './App.css'

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 300,
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: -300,
    scale: 1.2
  }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.8
}

function AnimatedRoute({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ position: 'absolute', width: '100%' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  
  return (
    <div className="app">
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
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
