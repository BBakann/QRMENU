import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message) => {
    addToast(message, 'success')
  }, [addToast])

  const showError = useCallback((message) => {
    addToast(message, 'error')
  }, [addToast])

  const showInfo = useCallback((message) => {
    addToast(message, 'info')
  }, [addToast])

  const showDelete = useCallback((message) => {
    addToast(message, 'delete')
  }, [addToast])

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showDelete
  }
} 