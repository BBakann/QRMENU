import { useState, useEffect } from 'react'
import { X, Save, Loader, Star, Eye } from 'lucide-react'
import { API_BASE_URL, ImageUpload } from '../../../shared'
import './EditProductModal.css'

function EditProductModal({ product, isOpen, onClose, onUpdate }) {
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

  // Modal açıldığında ürün verilerini form'a doldur
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'food',
        popular: product.popular || false,
        available: product.available !== undefined ? product.available : true,
        image: product.image || ''
      })
      setError('')
    }
  }, [product, isOpen])

  // Kategorileri API'dan çek
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
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

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.price) {
      setError('İsim, açıklama ve fiyat alanları gereklidir!')
      return
    }

    if (formData.price <= 0) {
      setError('Fiyat 0\'dan büyük olmalıdır!')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Token artık cookie'den otomatik gönderilecek
      const response = await fetch(`${API_BASE_URL}/menu/${product._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      const data = await response.json()

      if (data.success) {
        onUpdate(data.data) // Parent'a güncellenmiş ürünü gönder (parent toast gösterecek)
        onClose()
      } else {
        setError(data.message || 'Güncelleme başarısız')
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Ürün Düzenle</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="edit-form" onSubmit={handleSubmit}>
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
            <label htmlFor="name">Ürün Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ürün adını girin"
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
              placeholder="Ürün açıklamasını girin"
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
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="loading-icon" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductModal 