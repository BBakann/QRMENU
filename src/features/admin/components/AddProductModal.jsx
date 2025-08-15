import { useState, useEffect } from 'react'
import { X, Save, Loader, Star, Eye, Package } from 'lucide-react'
import { API_BASE_URL, ImageUpload } from '../../../shared'
// import { addCSRFToken } from '../../../shared/utils/csrf' // CSRF kaldırıldı
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
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Kategorileri yükle
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  // Kategorileri API'dan çek
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
        // Eğer kategori boşsa ve kategoriler varsa ilkini seç
        if (data.data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: data.data[0].id }))
        }
      }
    } catch (err) {
      console.error('Kategoriler yüklenirken hata:', err)
    }
  }

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
    } else if (formData.description.length < 5) {
      errors.push('Açıklama en az 5 karakter olmalıdır')
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
    
    console.log('🚀 ÜRÜN EKLEME SÜRECİ BAŞLADI')
    console.log('📋 Form Data:', formData)
    
    const validationErrors = validateForm()
    console.log('🔍 Frontend Validation Errors:', validationErrors)
    
    if (validationErrors.length > 0) {
      console.log('❌ Frontend validation hatası:', validationErrors.join(', '))
      setError(validationErrors.join(', '))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('📤 CSRF token atlayarak direkt istek gönderiyorum...')
      
      const requestBody = {
        ...formData,
        price: parseFloat(formData.price)
      }
      console.log('📤 Gönderilecek veri:', requestBody)
      console.log('🌐 API URL:', `${API_BASE_URL}/menu`)
      
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      const data = await response.json()
      console.log('📥 Response data:', data)

      if (data.success) {
        console.log('✅ Ürün başarıyla eklendi!')
        onAdd(data.data) // Parent component'e yeni ürünü gönder
        resetForm()
        onClose()
      } else {
        console.log('❌ Backend validation hatası:', data.message)
        console.log('❌ Validation errors:', data.errors)
        
        // Hataları detaylı göster
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error, index) => {
            console.log(`Hata ${index + 1}:`)
            console.log('- Field:', error.path || error.param)
            console.log('- Value:', error.value)
            console.log('- Message:', error.msg || error.message)
            console.log('- Location:', error.location)
            console.log('- Full Error:', error)
          })
        }
        
        setError(data.message || 'Ürün ekleme başarısız')
      }
    } catch (err) {
      console.log('❌ Network error:', err)
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

          {/* Ürün Görseli Upload */}
          <div className="form-group">
            <label>Ürün Görseli</label>
            <ImageUpload
              onImageUpload={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
              currentImage={formData.image}
            />
          </div>

          {/* Ürün Adı */}
          <div className="form-group">
            <label htmlFor="name">Ürün Adı * <span style={{color: '#6B7280', fontSize: '12px'}}>(2-100 karakter)</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Örn: Türk Kahvesi, Margarita Pizza, Cappuccino..."
              className="form-input"
              required
              maxLength={100}
            />
          </div>

          {/* Açıklama */}
          <div className="form-group">
            <label htmlFor="description">Açıklama * <span style={{color: '#6B7280', fontSize: '12px'}}>(5-500 karakter)</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ürününüzün detaylı açıklamasını yazın. En az 5 karakter gerekli. Örn: Geleneksel yöntemlerle hazırlanan özel karışımımız..."
              className="form-textarea"
              rows="3"
              required
              maxLength={500}
            />
          </div>

          {/* Fiyat ve Kategori */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Fiyat (₺) * <span style={{color: '#6B7280', fontSize: '12px'}}>(0-10.000₺)</span></label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ürün fiyatını girin (Örn: 25.50)"
                min="0"
                max="10000"
                step="0.01"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Kategori <span style={{color: '#6B7280', fontSize: '12px'}}>(Türkçe karakter destekli)</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                title="Ürününüzün kategorisini seçin. Türkçe karakterler ve boşluklar kullanabilirsiniz."
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
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