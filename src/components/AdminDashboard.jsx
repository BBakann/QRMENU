import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Package,
  Users,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sayfa yüklendiğinde çalışır
  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin') // Token yoksa login'e yönlendir
      return
    }
    
    // Menü verilerini yükle
    fetchMenuItems()
  }, [navigate])

  // Backend'den menü verilerini çek
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:3001/api/menu')
      const data = await response.json()
      
      if (data.success) {
        setMenuItems(data.data)
      } else {
        setError('Menü verileri yüklenemedi')
      }
    } catch (err) {
      setError('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  // Menü öğesi sil
  const deleteMenuItem = async (id) => {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Local state'i güncelle (yeniden fetch yapmadan)
        setMenuItems(menuItems.filter(item => item.id !== id))
      }
    } catch (err) {
      setError('Silme işlemi başarısız')
    }
  }

  // Çıkış yap
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  // Filtrelenmiş menü öğeleri
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Kategorileri al
  const categories = ['all', ...new Set(menuItems.map(item => item.category))]

  // İstatistikler
  const stats = {
    totalItems: menuItems.length,
    totalValue: menuItems.reduce((sum, item) => sum + item.price, 0),
    avgPrice: menuItems.length > 0 ? (menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2) : 0
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header__content">
          <div className="dashboard-header__left">
            <h1 className="dashboard-title">Admin Panel</h1>
            <p className="dashboard-subtitle">QR Menu Yönetimi</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Çıkış</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon stat-icon--primary">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalItems}</h3>
            <p className="stat-label">Toplam Ürün</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--success">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalValue}₺</h3>
            <p className="stat-label">Toplam Değer</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--info">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.avgPrice}₺</h3>
            <p className="stat-label">Ortalama Fiyat</p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="dashboard-controls">
        <div className="controls-left">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <Filter size={18} className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Tüm Kategoriler' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="add-btn">
          <Plus size={18} />
          <span>Yeni Ürün</span>
        </button>
      </section>

      {/* Menu Items Table */}
      <section className="dashboard-content">
        {isLoading ? (
          <div className="loading">Yükleniyor...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="menu-table">
            <div className="table-header">
              <div className="table-cell">Ürün</div>
              <div className="table-cell">Kategori</div>
              <div className="table-cell">Fiyat</div>
              <div className="table-cell">Durum</div>
              <div className="table-cell">İşlemler</div>
            </div>

            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="table-row">
                  <div className="table-cell">
                    <div className="product-info">
                      <h4 className="product-name">{item.name}</h4>
                      <p className="product-desc">{item.description}</p>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="category-badge">{item.category}</span>
                  </div>
                  <div className="table-cell">
                    <span className="price">{item.price}₺</span>
                  </div>
                  <div className="table-cell">
                    <span className={`status ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? 'Mevcut' : 'Tükendi'}
                    </span>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button className="action-btn action-btn--edit">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="action-btn action-btn--delete"
                        onClick={() => deleteMenuItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Hiç ürün bulunamadı</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard 