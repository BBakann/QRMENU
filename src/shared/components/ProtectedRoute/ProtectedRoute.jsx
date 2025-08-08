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
        console.log('🔍 ProtectedRoute - Cookie-based auth kontrolü başlıyor')
        console.log('🔍 ProtectedRoute - API URL:', `${API_BASE_URL}/auth/verify`)
        
        // Token artık cookie'den otomatik gelecek
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          credentials: 'include' // Cookie'leri gönder
        })

        console.log('🔍 ProtectedRoute - Response status:', response.status)
        const data = await response.json()
        console.log('🔍 ProtectedRoute - Response data:', data)

        if (data.success) {
          console.log('✅ Auth başarılı, dashboard yükleniyor')
          setIsAuthenticated(true)
        } else {
          console.log('❌ Auth başarısız, admin sayfasına yönlendiriliyor')
          navigate('/admin')
        }
      } catch (error) {
        console.error('💥 Auth verification error:', error)
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