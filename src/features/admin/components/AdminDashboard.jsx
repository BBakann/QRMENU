import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, Plus, Edit3, Trash2, DollarSign, Package, TrendingUp, 
  Search, Filter, Eye, EyeOff, Star, Clock, User, Tag
} from 'lucide-react'
import EditProductModal from './EditProductModal'
import { Toast, useToast } from '../../../shared'
import './AdminDashboard.css'
import AddProductModal from './AddProductModal'
// import { API_BASE_URL } from '../../../shared' // Bu satırı kaldır!
// import { optimizeImageUrl } from '../../../shared/utils/imageOptimization'

function AdminDashboard() {
  const navigate = useNavigate()
  
  // API_BASE_URL'yi burada tanımla - Production için
  const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'
  
  console.log('🚀 AdminDashboard BAŞLADI!')
  console.log('🔍 AdminDashboard - NODE_ENV:', process.env.NODE_ENV)
  console.log('🔍 AdminDashboard - API_BASE_URL:', API_BASE_URL)
  
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const { toasts, removeToast, showSuccess, showError, showDelete } = useToast()

  const [editModal, setEditModal] = useState({
    isOpen: false,
    product: null
  })

  const [addModal, setAddModal] = useState({
    isOpen: false
  })

  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    description: ''
  })

  // Debug fonksiyonu ve çağrıları kaldırıldı

  const initializeData = async () => {
    try {
      console.log('🚀 initializeData BAŞLADI!')
      console.log('📥 fetchMenuItems çağrılıyor...')
      await fetchMenuItems()
      console.log('📥 fetchCategories çağrılıyor...')  
      await fetchCategories()
      console.log('✅ initializeData TAMAMLANDI!')
    } catch (err) {
      console.error('❌ Initialization error:', err)
      setError('Veri yükleme hatası: ' + err.message)
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    console.log('✨ useEffect ÇALIŞTI!')
    
    // Immediate function call yerine setTimeout ile test
    setTimeout(() => {
      console.log('⏰ setTimeout tetiklendi, initializeData çağrılıyor...')
      initializeData()
    }, 100)
  }, [])

  useEffect(() => {
    document.body.style.background = '#f8fafc';
    document.body.style.color = '#1e293b';
    return () => {
      document.body.style.background = '#0a0a0a';
      document.body.style.color = '#fff';
    };
  }, []);

  const fetchMenuItems = async () => {
    console.log('🔥 fetchMenuItems FONKSIYONU ÇAĞRILDI!')
    console.log('🔥 Current API_BASE_URL:', API_BASE_URL)
    try {
      setIsLoading(true)
      setError('') // Hata state'ini temizle
      
      const token = localStorage.getItem('adminToken')
      console.log('🔑 Token:', token ? 'VAR (' + token.substring(0,10) + '...)' : 'YOK')
      
      if (!token) {
        throw new Error('Admin token bulunamadı')
      }
      
      const fullUrl = `${API_BASE_URL}/menu/admin/all`
      console.log('📡 API çağrısı yapılıyor:', fullUrl)
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      console.log('📡 Response headers:', response.headers)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('❌ Response error text:', errorText)
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('📡 Response data:', data)
      
      if (data.success) {
        console.log('✅ Menu items set edildi:', data.data.length)
        setMenuItems(data.data)
      } else {
        throw new Error(data.message || 'Menü verileri yüklenemedi')
      }
    } catch (err) {
      console.error('❌ fetchMenuItems catch error:', err)
      console.error('❌ Error stack:', err.stack)
      setError('Menu Error: ' + err.message)
    } finally {
      console.log('🏁 fetchMenuItems finally - isLoading: false')
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    console.log('🔥 fetchCategories FONKSIYONU ÇAĞRILDI!')
    try {
      const token = localStorage.getItem('adminToken')
      console.log('🔑 Categories Token:', token ? 'VAR' : 'YOK')
      
      if (!token) {
        console.log('⚠️ Token yok, categories atlanıyor')
        return
      }
      
      console.log('📡 Categories API çağrısı:', `${API_BASE_URL}/categories/admin/all`)
      
      const response = await fetch(`${API_BASE_URL}/categories/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('📡 Categories Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Categories HTTP Error: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📡 Categories Response data:', data)
      
      if (data.success) {
        setCategories(data.data)
        console.log('✅ Kategoriler yüklendi:', data.data.length)
      } else {
        console.error('❌ Kategoriler yüklenemedi:', data.message)
        // Kategoriler yüklenmezse hata vermiyoruz, sadece log atıyoruz
      }
    } catch (err) {
      console.error('❌ Kategoriler yüklenirken hata:', err)
      // Kategoriler için hata set etmiyoruz, ana işleyiş devam etsin
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    
    if (!categoryForm.id || !categoryForm.name) {
      showError('ID ve isim gereklidir!')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        showSuccess('Kategori başarıyla eklendi!')
        fetchCategories()
        setCategoryForm({ id: '', name: '', description: '' })
        setShowCategoryForm(false)
      } else {
        showError(data.message)
      }
    } catch (err) {
      showError('Kategori eklenirken hata oluştu')
    }
  }

  const handleCategoryDelete = async (categoryId, categoryName) => {
    const confirmed = window.confirm(
      `"${categoryName}" kategorisini silmek istediğinize emin misiniz?\n\n⚠️ Bu işlem geri alınamaz ve kategori içindeki TÜM ÜRÜNLER de silinecektir.\n\nDevam etmek istiyor musunuz?`
    )
    
    if (!confirmed) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        showDelete(`${categoryName} kategorisi ${data.data.deletedProducts > 0 ? `ve ${data.data.deletedProducts} ürün` : ''} silindi`)
        fetchCategories()
        fetchMenuItems()
      } else {
        showError(data.message)
      }
    } catch (err) {
      showError('Kategori silinirken hata oluştu')
    }
  }

  const deleteMenuItem = async (id) => {
    const item = menuItems.find(item => item._id === id)
    if (!confirm(`"${item?.name}" ürünü silmek istediğinizden emin misiniz?`)) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setMenuItems(menuItems.filter(item => item._id !== id))
        showDelete(`"${item?.name}" başarıyla silindi!`)
      } else {
        showError('Silme işlemi başarısız oldu!')
      }
    } catch (err) {
      showError('Bağlantı hatası! Silme işlemi başarısız.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  const openEditModal = (product) => {
    setEditModal({ isOpen: true, product })
  }

  const closeEditModal = () => {
    setEditModal({ isOpen: false, product: null })
  }

  const handleProductUpdate = (updatedProduct) => {
    setMenuItems(menuItems.map(item => 
      item._id === updatedProduct._id ? updatedProduct : item
    ))
    showSuccess(`"${updatedProduct.name}" başarıyla güncellendi!`)
  }

  const openAddModal = () => {
    setAddModal({ isOpen: true })
  }

  const closeAddModal = () => {
    setAddModal({ isOpen: false })
  }

  const handleProductAdd = (newProduct) => {
    setMenuItems([newProduct, ...menuItems])
    showSuccess(`"${newProduct.name}" başarıyla eklendi!`)
  }

  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (a.popular && !b.popular) return -1
      if (!a.popular && b.popular) return 1
      return a.name.localeCompare(b.name, 'tr-TR')
    })

  const calculateStats = () => {
    const totalItems = menuItems.length
    const availableItems = menuItems.filter(item => item.available).length
    const totalValue = menuItems.reduce((sum, item) => sum + item.price, 0)
    const avgPrice = totalItems > 0 ? (totalValue / totalItems) : 0
    const popularItems = menuItems.filter(item => item.popular).length

    return { totalItems, availableItems, totalValue, avgPrice, popularItems }
  }

  const stats = calculateStats()
  // Error varsa göster
  if (error) {
    return (
      <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
        <h1 style={{ color: 'red' }}>HATA BULUNDU!</h1>
        <div style={{ 
          background: '#ffebee', 
          border: '1px solid #f44336', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Hata Detayları:</h3>
          <p><strong>Error:</strong> {error}</p>
          <p><strong>Loading:</strong> {isLoading ? 'YES' : 'NO'}</p>
          <p><strong>Items:</strong> {menuItems.length}</p>
          <p><strong>Categories:</strong> {categories.length}</p>
        </div>
        <button 
          onClick={() => {
            setError('')
            setIsLoading(true)
            fetchMenuItems()
            fetchCategories()
          }}
          style={{
            background: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🔄 Tekrar Dene
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#2196F3',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Sayfayı Yenile
        </button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard" style={{
      minHeight: '100vh',
      background: 'white',
      color: 'black',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Premium Header */}
      <header className="dashboard-header">
        <div className="header-gradient"></div>
        <div className="header-content">
          <div className="header-left">
            <div className="admin-avatar">
              <User size={24} />
            </div>
            <div className="admin-info">
              <h1 className="dashboard-title">QR Menu Admin</h1>
              <p className="dashboard-subtitle">Menü Yönetim Paneli</p>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="header-stats-mini">
              <div className="mini-stat">
                <Package size={14} />
                <span>{stats.totalItems}</span>
              </div>
              <div className="mini-stat">
                <DollarSign size={14} />
                <span>{stats.totalValue.toFixed(0)}₺</span>
              </div>
            </div>
            
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              aria-label="Çıkış yap"
              title="Çıkış yap"
            >
              <LogOut size={16} />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Premium Stats Cards */}
      <section className="dashboard-stats">
        <div className="stats-container">
          <div className="stat-card stat-card--primary">
            <div className="stat-background"></div>
            <div className="stat-icon">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalItems}</h3>
              <p className="stat-label">Toplam Ürün</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--success">
            <div className="stat-background"></div>
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalValue.toFixed(0)}₺</h3>
              <p className="stat-label">Toplam Değer</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--info">
            <div className="stat-background"></div>
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.avgPrice.toFixed(0)}₺</h3>
              <p className="stat-label">Ortalama Fiyat</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--warning">
            <div className="stat-background"></div>
            <div className="stat-icon">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.popularItems}</h3>
              <p className="stat-label">Popüler Ürün</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: `${(stats.popularItems / (stats.totalItems || 1)) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori Yönetimi */}
      <section className="category-management">
        <div className="category-header">
          <div className="category-title">
            <Tag size={20} />
            <h2>Kategori Yönetimi</h2>
            <span className="category-count">{categories.length} kategori</span>
          </div>
          <button 
            className="add-category-btn"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            aria-label="Kategori ekle"
            title="Kategori ekle"
          >
            <Plus size={16} />
            <span>Kategori Ekle</span>
          </button>
        </div>

        {/* Kategori Ekleme Formu */}
        {showCategoryForm && (
          <div className="category-form-container">
            <form onSubmit={handleCategorySubmit} className="category-form">
              <div className="form-header">
                <h3>Yeni Kategori Ekle</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Kategori ID *</label>
                  <input
                    type="text"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value})}
                    placeholder="Örn: beverages"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Kategori Adı *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="Örn: İçecekler"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Kategori açıklaması..."
                  rows="3"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCategoryForm(false)} 
                  className="btn-cancel"
                  aria-label="Kategori ekleme formunu iptal et"
                >
                  İptal
                </button>
                <button type="submit" className="btn-submit">
                  <Plus size={14} />
                  Kategori Ekle
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Kategoriler Listesi */}
        <div className="categories-list">
          {categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-info">
                    <h4>{category.name}</h4>
                    <span className="category-id">#{category.id}</span>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                  </div>
                  <div className="category-status">
                    <span className={`status ${category.active !== false ? 'active' : 'inactive'}`}>
                      {category.active !== false ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <div className="category-actions">
                    <button 
                      className="action-btn action-btn--delete"
                      onClick={() => handleCategoryDelete(category.id, category.name)}
                      aria-label={`${category.name} kategorisini sil`}
                      title={`${category.name} kategorisini sil`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-categories">
              <Tag size={40} />
              <p>Henüz kategori bulunmuyor. Mevcut kategoriler otomatik eklenecek!</p>
            </div>
          )}
        </div>
      </section>

      {/* Premium Controls */}
      <section className="dashboard-controls">
        <div className="controls-container">
          <div className="controls-left">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <Filter size={18} className="filter-icon" />
              <label htmlFor="category-filter" className="sr-only">Kategori seçin</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
                aria-label="Kategori filtrele"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories
                  .filter(cat => cat.active !== false)
                  .sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'))
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="controls-right">
            <button 
              className="add-btn" 
              onClick={openAddModal}
              aria-label="Yeni ürün ekle"
              title="Yeni ürün ekle"
            >
              <Plus size={18} />
              <span>Yeni Ürün</span>
            </button>
          </div>
        </div>
      </section>

      {/* Premium Content */}
      <section className="dashboard-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchMenuItems} className="retry-btn">
              Tekrar Dene
            </button>
          </div>
        ) : (
          <div className={`products-container`}>
            {filteredItems.length > 0 ? (
              <>
                <div className="content-header">
                  <h2 className="content-title">Ürün Listesi</h2>
                  <p className="content-subtitle">{filteredItems.length} ürün gösteriliyor</p>
                </div>

                <div className="products-grid">
                  {filteredItems.map((item, index) => (
                    <div 
                      key={item._id} 
                      className="product-card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="product-image">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          loading="lazy"
                          width="400"
                          height="300"
                        />
                        <div className="product-badges">
                          {item.popular && (
                            <span className="badge badge--popular">
                              <Star size={10} />
                              Popüler
                            </span>
                          )}
                          {!item.available && (
                            <span className="badge badge--unavailable">
                              <EyeOff size={10} />
                              Tükendi
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="product-info">
                        <div className="product-header">
                          <h4 className="product-name">{item.name}</h4>
                          <span className="product-price">{item.price}₺</span>
                        </div>
                        
                        <p className="product-description">{item.description}</p>
                        
                        <div className="product-meta">
                          <span className="product-category">
                            {categories.find(cat => cat.id === item.category)?.name || item.category}
                          </span>
                          <span className="product-date">
                            <Clock size={10} />
                            {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>

                        <div className="product-actions">
                          <button 
                            className="action-btn action-btn--edit"
                            onClick={() => openEditModal(item)}
                          >
                            <Edit3 size={14} />
                            Düzenle
                          </button>
                          <button 
                            className="action-btn action-btn--delete"
                            onClick={() => deleteMenuItem(item._id)}
                          >
                            <Trash2 size={14} />
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <Package size={48} className="no-results-icon" />
                <h3>Ürün bulunamadı</h3>
                <p>Arama kriterlerinizi değiştirin veya yeni ürün ekleyin</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add Modal */}
      <AddProductModal
        isOpen={addModal.isOpen}
        onClose={closeAddModal}
        onAdd={handleProductAdd}
      />

      {/* Edit Modal */}
      <EditProductModal
        product={editModal.product}
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        onUpdate={handleProductUpdate}
      />

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard