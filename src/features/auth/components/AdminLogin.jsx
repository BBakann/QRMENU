import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Lock, Eye, EyeOff } from 'lucide-react'
import { API_BASE_URL } from '../../../shared'
import { sanitizeHtml, validateInput } from '../../../shared/utils/sanitize'
import { addCSRFToken } from '../../../shared/utils/csrf'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Frontend validation
    if (!validateInput(formData.username, 'text')) {
      setError('Kullanıcı adı geçerli değil')
      setIsLoading(false)
      return
    }

    if (!validateInput(formData.password, 'text')) {
      setError('Şifre geçerli değil')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Cookie'leri gönder ve al
        headers: addCSRFToken({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        // Token artık httpOnly cookie olarak set ediliyor, manuel bir şey yapmamıza gerek yok
        navigate('/admin/dashboard')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
      </button>

      <div className="admin-login__container">
        <div className="admin-login__header">
          <div className="admin-login__logo">
            <User size={40} />
          </div>
          <h1 className="admin-login__title">Admin Girişi</h1>
          <p className="admin-login__subtitle">QR Menu yönetim paneline hoş geldiniz</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          {error && (
            <div className="admin-login__error" dangerouslySetInnerHTML={{ __html: sanitizeHtml(error) }}>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Şifre</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Şifrenizi girin"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-login__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="admin-login__footer">
          <p>Güvenli giriş sistemi</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin 