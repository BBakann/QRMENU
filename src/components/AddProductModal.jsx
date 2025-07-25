import { useState } from 'react'
import { X, Save, Loader, Star, Eye, Package } from 'lucide-react'
import './AddProductModal.css'

function AddProductModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food',
    popular: false,
    available: true,
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form input değişikliklerini handle et
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Form temizle
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'food',
      popular: false,
      available: true,
      image: ''
    })
    setError('')
  }

  // Modal kapandığında form'u temizle
  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Validation fonksiyonu ekle
  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) {
      errors.push('Ürün adı gereklidir')
    } else if (formData.name.length < 2) {
      errors.push('Ürün adı en az 2 karakter olmalıdır')
    }
    
    if (!formData.description.trim()) {
      errors.push('Açıklama gereklidir')
    } else if (formData.description.length < 10) {
      errors.push('Açıklama en az 10 karakter olmalıdır')
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.push('Geçerli bir fiyat giriniz')
    } else if (formData.price > 10000) {
      errors.push('Fiyat 10.000₺\'den fazla olamaz')
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      errors.push('Geçerli bir görsel URL\'si giriniz')
    }
    
    return errors
  }

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:3001/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      const data = await response.json()

      if (data.success) {
        onAdd(data.data) // Parent component'e yeni ürünü gönder
        resetForm()
        onClose()
      } else {
        setError(data.message || 'Ürün ekleme başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  // Modal kapalıysa render etme
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content add-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon">
              <Package size={24} />
            </div>
            <div>
              <h2 className="modal-title">Yeni Ürün Ekle</h2>
              <p className="modal-subtitle">Menüye yeni bir ürün ekleyin</p>
            </div>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Ürün Resmi Preview */}
          <div className="form-group">
            <label>Ürün Görseli</label>
            <div className="image-preview">
              <img 
                src={formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'} 
                alt="Preview" 
                className="preview-img"
              />
              <div className="image-placeholder">
                <Package size={32} />
                <span>Görsel URL ekleyin</span>
              </div>
            </div>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="form-input"
            />
          </div>

          {/* Ürün Adı */}
          <div className="form-group">
            <label htmlFor="name">Ürün Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: Türk Kahvesi, Margarita Pizza..."
              className="form-input"
              required
            />
          </div>

          {/* Açıklama */}
          <div className="form-group">
            <label htmlFor="description">Açıklama *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ürününüzün lezzetli açıklamasını yazın..."
              className="form-textarea"
              rows="3"
              required
            />
          </div>

          {/* Fiyat ve Kategori */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Fiyat (₺) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Kategori</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="hot-drinks">☕ Sıcak İçecekler</option>
                <option value="cold-drinks">🥤 Soğuk İçecekler</option>
                <option value="food">🍽️ Yemekler</option>
                <option value="desserts">🧁 Tatlılar</option>
                <option value="snacks">🥪 Atıştırmalık</option>
              </select>
            </div>
          </div>

          {/* Durumlar - Premium Toggle Design */}
          <div className="form-row--checkboxes">
            <h4 className="form-section-title">
              ⚙️ Ürün Durumu
            </h4>
            
            <div className="form-group">
              <label 
                className={`checkbox-label ${formData.popular ? 'checked' : ''}`}
                htmlFor="popular"
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="checkbox-label-icon checkbox-label-icon--popular">
                    <Star size={16} />
                  </div>
                  <div className="checkbox-label-text">
                    <span className="checkbox-label-title">Popüler Ürün</span>
                    <span className="checkbox-label-desc">Ana sayfada öne çıkarılır</span>
                  </div>
                </div>
                
                <input
                  type="checkbox"
                  id="popular"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="checkbox-custom"></span>
              </label>
            </div>

            <div className="form-group">
              <label 
                className={`checkbox-label ${formData.available ? 'checked' : ''}`}
                htmlFor="available"
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="checkbox-label-icon checkbox-label-icon--available">
                    <Eye size={16} />
                  </div>
                  <div className="checkbox-label-text">
                    <span className="checkbox-label-title">Satışta</span>
                    <span className="checkbox-label-desc">Müşterilerin görebileceği</span>
                  </div>
                </div>
                
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="checkbox-custom"></span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-save btn-add"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="loading-icon" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Ürün Ekle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal 