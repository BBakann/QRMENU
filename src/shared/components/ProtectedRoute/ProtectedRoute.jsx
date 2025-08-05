import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../shared'
import './ProtectedRoute.css'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        console.log('🔍 ProtectedRoute - Token:', token ? 'Var' : 'Yok')
        
        if (!token) {
          console.log('❌ Token yok, admin sayfasına yönlendiriliyor')
          navigate('/admin')
          return
        }

        console.log('🔍 ProtectedRoute - API URL:', `${API_BASE_URL}/auth/verify`)
        
        // Token'ı backend'de doğrula
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('🔍 ProtectedRoute - Response status:', response.status)
        const data = await response.json()
        console.log('🔍 ProtectedRoute - Response data:', data)

        if (data.success) {
          console.log('✅ Auth başarılı, dashboard yükleniyor')
          setIsAuthenticated(true)
        } else {
          console.log('❌ Auth başarısız, token siliniyor')
          localStorage.removeItem('adminToken')
          navigate('/admin')
        }
      } catch (error) {
        console.error('💥 Auth verification error:', error)
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