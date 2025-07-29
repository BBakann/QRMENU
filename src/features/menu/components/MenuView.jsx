import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Loader } from 'lucide-react'
import { API_BASE_URL } from '../../../shared'
import './MenuView.css'

function MenuView() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const menuSectionRef = useRef(null)

  // API'den menü ve kategori verilerini çek
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Paralel olarak menü ve kategorileri çek
      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/menu`),
        fetch(`${API_BASE_URL}/categories`)
      ])
      
      const menuData = await menuResponse.json()
      const categoriesData = await categoriesResponse.json()
      
      if (menuData.success) {
        setMenuItems(menuData.data)
      } else {
        setError('Menü yüklenemedi')
      }
      
      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }
      
    } catch (err) {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  // Kategorileri dinamik olarak oluştur (API'dan gelen kategoriler + "Tümü")
  const allCategories = [
    { 
      id: 'all', 
      name: 'Tümü', 
      count: menuItems.length,
      backgroundImage: menuItems.length > 0 ? menuItems[0].image : null
    },
    ...categories
      .sort((a, b) => a.name.localeCompare(b.name, 'tr-TR')) // Alfabetik sıralama
      .map(cat => {
        const categoryItems = menuItems.filter(item => item.category === cat.id)
        return {
          id: cat.id,
          name: cat.name,
          count: categoryItems.length,
          backgroundImage: categoryItems.length > 0 ? categoryItems[0].image : null
        }
      })
  ]

  // Kategori seçimi ve scroll
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    
    // Menü kısmına smooth scroll
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Filtrelenmiş ürünler
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="menu-page">
        <div className="loading-container">
          <Loader className="loading-spinner" size={40} />
          <p>Menü yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchData} className="retry-btn">
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-page">
      {/* Sade Hero Section */}
      <div className="hero">
        <div className="hero-background"></div>
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div className="hero-content">
          <div className="hero-badge">QR MENU CAFE</div>
          <h1 className="hero-title">Menümüz</h1>
          <p className="hero-subtitle">Lezzetli seçeneklerimizi keşfedin</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{menuItems.length}</span>
              <span className="stat-label">Ürün</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Puan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Category Filter */}
      <div className="category-section">
        <div className="category-container">
          <div className="category-header">
            <h2 className="category-heading">Kategoriler</h2>
          </div>
          <div className="category-filters">
            {allCategories.map((category) => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div 
                  className="category-background"
                  {...(category.backgroundImage && {
                    style: { backgroundImage: `url(${category.backgroundImage})` }
                  })}
                ></div>
                <div className="category-overlay"></div>
                <div className="category-content">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count} ürün</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sade Menu Grid */}
      <div className="menu-container" ref={menuSectionRef}>
        <div className="section-info">
          <div className="section-header">
            <h3 className="section-title">
              {selectedCategory === 'all' ? 'Tüm Menü' : allCategories.find(c => c.id === selectedCategory)?.name}
            </h3>
          </div>
          <div className="item-count">
            <span className="count-number">{filteredItems.length}</span>
            <span className="count-label">ürün bulundu</span>
          </div>
        </div>
        
        <div className="menu-grid">
          {filteredItems.map((item, index) => (
            <div 
              key={item._id} 
              className="menu-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="item-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="image-overlay"></div>
                {item.popular && (
                  <div className="popular-tag">
                    <span>✨</span>
                    <span>Popüler</span>
                  </div>
                )}
              </div>
              <div className="item-info">
                <div className="item-header">
                  <h4 className="item-name">{item.name}</h4>
                  <div className="item-price">
                    <span className="price-number">{item.price}</span>
                    <span className="price-currency">₺</span>
                  </div>
                </div>
                <p className="item-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sade Footer */}
      <div className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-section">
              <h4 className="footer-title">QR Menu Cafe</h4>
              <p className="footer-description">
                Lezzetli kahveler, taze yiyecekler ve samimi atmosfer. 
                Her anınızı özel kılmak için buradayız.
              </p>
            </div>

            <div className="footer-section">
              <h5 className="footer-subtitle">İletişim</h5>
              <div className="footer-contact">
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+90 xxx xxx xxxx</span>
                </div>
                <div className="contact-item">
                  <span>📧</span>
                  <span>info@qrmenucafe.com</span>
                </div>
                <div className="contact-item">
                  <span>📍</span>
                  <span>xxxxxx,xxxxx </span>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h5 className="footer-subtitle">Çalışma Saatleri</h5>
              <div className="footer-hours">
                <div className="hours-item">
                  <span>Pazartesi - Cuma</span>
                  <span>08:00 - 22:00</span>
                </div>
                <div className="hours-item">
                  <span>Cumartesi - Pazar</span>
                  <span>09:00 - 23:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-text">
                © 2024 QR Menu Cafe. Tüm hakları saklıdır.
              </p>
              <p className="footer-text">
                Ankara, Türkiye • www.qrmenucafe.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuView 