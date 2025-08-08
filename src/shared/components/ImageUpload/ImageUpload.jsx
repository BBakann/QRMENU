import { useState, useRef } from 'react'
import { Camera, Upload, X, Image as ImageIcon, FolderOpen } from 'lucide-react'
import { API_BASE_URL } from '../../../shared/config/api'
import './ImageUpload.css'

const ImageUpload = ({ onImageUpload, currentImage = null, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const [dragActive, setDragActive] = useState(false)
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

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

      // Token artık cookie'den otomatik gönderilecek
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
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

  const handleCameraChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFileChange(file)
  }

  const handleGalleryChange = (e) => {
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
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = ''
    }
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  const openGallery = () => {
    galleryInputRef.current?.click()
  }

  return (
    <div className={`image-upload ${className}`}>
      {/* Kamera için input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        className="image-upload__input"
        id="camera-input"
      />

      {/* Galeri için input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryChange}
        className="image-upload__input"
        id="gallery-input"
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

            <button
              type="button"
              onClick={openCamera}
              className="image-upload__change"
              disabled={isUploading}
            >
              <Camera size={20} />
              <span>Kamera</span>
            </button>

            <button
              type="button"
              onClick={openGallery}
              className="image-upload__change"
              disabled={isUploading}
            >
              <FolderOpen size={20} />
              <span>Galeri</span>
            </button>
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
                <p>Kameradan çek, galeriden seç veya dosya sürükle</p>
              </div>

              <div className="image-upload__buttons">
                <button
                  type="button"
                  onClick={openCamera}
                  className="image-upload__button primary"
                >
                  <Camera size={20} />
                  <span>Kamera</span>
                </button>

                <button
                  type="button"
                  onClick={openGallery}
                  className="image-upload__button secondary"
                >
                  <FolderOpen size={20} />
                  <span>Galeri</span>
                </button>

                <label
                  htmlFor="gallery-input"
                  className="image-upload__button tertiary"
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