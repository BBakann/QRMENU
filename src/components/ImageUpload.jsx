import { useState, useRef } from 'react'
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react'
import { API_BASE_URL } from '../config/api.js'
import './ImageUpload.css'

const ImageUpload = ({ onImageUpload, currentImage = null, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (file) => {
    if (!file) return

    // File validation
    if (!file.type.startsWith('image/')) {
      alert('Lütfen sadece resim dosyası seçin')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır')
      return
    }

    setIsUploading(true)

    try {
      // Preview oluştur
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Backend'e upload
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        onImageUpload(result.data.url)
        console.log('✅ Resim yüklendi:', result.data.url)
      } else {
        throw new Error(result.message)
      }

    } catch (error) {
      console.error('❌ Upload hatası:', error)
      alert('Resim yüklenirken hata oluştu: ' + error.message)
      setPreview(currentImage) // Eski resmi geri getir
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFileChange(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeImage = () => {
    setPreview(null)
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="image-upload__input"
        id="image-upload-input"
      />

      {preview ? (
        <div className="image-upload__preview">
          <img src={preview} alt="Preview" className="image-upload__image" />
          
          <div className="image-upload__overlay">
            <button
              type="button"
              onClick={removeImage}
              className="image-upload__remove"
              disabled={isUploading}
            >
              <X size={20} />
            </button>

            <label
              htmlFor="image-upload-input"
              className="image-upload__change"
            >
              <Camera size={20} />
              <span>Değiştir</span>
            </label>
          </div>

          {isUploading && (
            <div className="image-upload__loading">
              <div className="image-upload__spinner"></div>
              <span>Yükleniyor...</span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`image-upload__drop-zone ${dragActive ? 'active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="image-upload__uploading">
              <div className="image-upload__spinner"></div>
              <span>Yükleniyor...</span>
            </div>
          ) : (
            <>
              <div className="image-upload__icon">
                <ImageIcon size={48} />
              </div>

              <div className="image-upload__content">
                <h3>Resim Yükle</h3>
                <p>Kameradan çek veya galeriden seç</p>
              </div>

              <div className="image-upload__buttons">
                <label
                  htmlFor="image-upload-input"
                  className="image-upload__button primary"
                >
                  <Camera size={20} />
                  <span>Kamera / Galeri</span>
                </label>

                <label
                  htmlFor="image-upload-input"
                  className="image-upload__button secondary"
                >
                  <Upload size={20} />
                  <span>Dosya Seç</span>
                </label>
              </div>

              <div className="image-upload__info">
                <small>Maksimum 10MB • JPG, PNG, WEBP</small>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUpload 