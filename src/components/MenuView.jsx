import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone } from 'lucide-react'
import './MenuView.css'

function MenuView() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'Tümü', count: 15 },
    { id: 'hot-drinks', name: 'Sıcak İçecekler', count: 4 },
    { id: 'cold-drinks', name: 'Soğuk İçecekler', count: 3 },
    { id: 'food', name: 'Yemekler', count: 4 },
    { id: 'desserts', name: 'Tatlılar', count: 2 },
    { id: 'snacks', name: 'Atıştırmalık', count: 2 }
  ]

  const menuItems = [
    {
      id: 1,
      name: 'Türk Kahvesi',
      price: 28,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=400&fit=crop&crop=center',
      description: 'Özel harmanımızla hazırlanan geleneksel Türk kahvesi',
      category: 'hot-drinks',
      popular: true
    },
    {
      id: 2,
      name: 'Amerikan Kahvesi',
      price: 32,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop&crop=center',
      description: 'Single origin Ethiopia çekirdekleri ile hazırlanan',
      category: 'hot-drinks'
    },
    {
      id: 3,
      name: 'Kapuçino',
      price: 38,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&h=400&fit=crop&crop=center',
      description: 'Barista sanatı ile süslenmiş kremsi cappuccino',
      category: 'hot-drinks'
    },
    {
      id: 4,
      name: 'Espresso',
      price: 25,
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&h=400&fit=crop&crop=center',
      description: 'Geleneksel İtalyan espresso',
      category: 'hot-drinks'
    },
    {
      id: 5,
      name: 'Soğuk Kahve',
      price: 35,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop&crop=center',
      description: '16 saat soğuk demleme premium kahve',
      category: 'cold-drinks',
      popular: true
    },
    {
      id: 6,
      name: 'Buzlu Latte',
      price: 40,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&h=400&fit=crop&crop=center',
      description: 'Soğuk süt ve espresso buluşması',
      category: 'cold-drinks'
    },
    {
      id: 7,
      name: 'Taze Portakal Suyu',
      price: 25,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=400&fit=crop&crop=center',
      description: 'Taze sıkılmış portakal suyu',
      category: 'cold-drinks'
    },
    {
      id: 8,
      name: 'Cheeseburger',
      price: 65,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop&crop=center',
      description: 'Angus dana eti, kaşar peyniri, özel sos',
      category: 'food',
      popular: true
    },
    {
      id: 9,
      name: 'Margarita Pizza',
      price: 85,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop&crop=center',
      description: 'Taş fırında pişmiş, taze mozzarella ve fesleğen',
      category: 'food'
    },
    {
      id: 11,
      name: 'Sezar Salata',
      price: 55,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop&crop=center',
      description: 'Izgara tavuk, parmesan, kruton ve caesar sos',
      category: 'food'
    },
    {
      id: 12,
      name: 'Patates',
      price: 45,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop&crop=center',
      description: 'Altın sarısı çıtır patates kızartması',
      category: 'food'
    },
    {
      id: 13,
      name: 'Cheesecake',
      price: 48,
      image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&h=400&fit=crop&crop=center',
      description: 'New York usulü kremsi cheesecake',
      category: 'desserts',
      popular: true
    },
    {
      id: 14,
      name: 'Tiramisu',
      price: 52,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop&crop=center',
      description: 'Geleneksel İtalyan tarifi ile hazırlanmış',
      category: 'desserts'
    },
    {
      id: 15,
      name: 'Avokado Tost',
      price: 52,
      image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&h=400&fit=crop&crop=center',
      description: 'Sourdough ekmeği, taze avokado, haşlanmış yumurta',
      category: 'snacks',
      popular: true
    },
    {
      id: 16,
      name: 'Sandviç',
      price: 58,
      image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500&h=400&fit=crop&crop=center',
      description: 'Üç katlı sandviç, tavuk, bacon ve sebzeler',
      category: 'snacks'
    }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="menu-page">
      {/* Enhanced Hero */}
      <div className="hero">
        <div className="hero-background"></div>
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div className="hero-content">
          <div className="hero-badge">QR MENU CAFE</div>
          <h1 className="hero-title">QR Menu Cafe</h1>
          <p className="hero-subtitle">Taze lezzetler • Premium kalite • Özel deneyim</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">15</span>
              <span className="stat-label">Özel Lezzet</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Puan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Category Filter */}
      <div className="category-section">
        <div className="category-container">
          <div className="category-header">
            <h2 className="category-heading">Lezzet Kategorileri</h2>
            <p className="category-subheading">Size özel hazırlanmış koleksiyonlarımız</p>
          </div>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-content">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </div>
                <div className="category-glow"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Menu Grid */}
      <div className="menu-container">
        <div className="section-info">
          <div className="section-header">
            <h3 className="section-title">
              {selectedCategory === 'all' ? 'Tüm Koleksiyon' : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <p className="section-subtitle">Her biri özenle seçilmiş</p>
          </div>
          <div className="item-count">
            <span className="count-number">{filteredItems.length}</span>
            <span className="count-label">ürün</span>
          </div>
        </div>
        
        <div className="menu-grid">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="menu-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="item-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="image-overlay"></div>
                {item.popular && (
                  <div className="popular-tag">
                    <span className="popular-icon">✨</span>
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
              <div className="item-shine"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="footer">
        <div className="footer-background"></div>
        <div className="footer-content">
          <div className="footer-main">
            <h4 className="footer-title">QR Menu Cafe</h4>
            <div className="contact">
              <Phone size={18} />
              <span>+90 212 555 0123</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-text">Özenle hazırlanmış dijital deneyim</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuView 