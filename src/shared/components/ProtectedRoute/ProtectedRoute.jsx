import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'
import './ProtectedRoute.css'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        
        if (!token) {
          navigate('/admin')
          return
        }

        // Token'ı backend'de doğrula
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminToken')
          navigate('/admin')
        }
      } catch (error) {
        console.error('Auth verification error:', error)
        localStorage.removeItem('adminToken')
        navigate('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [navigate])

  // Loading durumunda boş div göster
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Güvenlik kontrolü yapılıyor...</p>
        </div>
      </div>
    )
  }

  // Auth başarılıysa children'ı render et
  return isAuthenticated ? children : null
}

export default ProtectedRoute 