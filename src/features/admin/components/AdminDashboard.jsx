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
// import { addCSRFToken } from '../../../shared/utils/csrf' // CSRF kaldırıldı

function AdminDashboard() {
  const navigate = useNavigate()
  
  
  const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'
  
 
  
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
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
      // console.log('🚀 initializeData BAŞLADI!')
      // console.log('📥 fetchMenuItems çağrılıyor...')
      await fetchMenuItems()
      // console.log('📥 fetchCategories çağrılıyor...')  
      await fetchCategories()
      // console.log('✅ initializeData TAMAMLANDI!')
    } catch (err) {
      // console.error('❌ Initialization error:', err)
      setError('Veri yükleme hatası: ' + err.message)
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    // console.log('✨ useEffect ÇALIŞTI!')
    
    // Immediate function call yerine setTimeout ile test
    setTimeout(() => {
      // console.log('⏰ setTimeout tetiklendi, initializeData çağrılıyor...')
      initializeData()
    }, 100)
  }, [])

  // İlk kategoriyi otomatik seçme - manuel seçime bırak
  // useEffect kaldırıldı, kullanıcı manuel olarak kategori seçecek

  useEffect(() => {
    document.body.style.background = '#f8fafc';
    document.body.style.color = '#1e293b';
    return () => {
      document.body.style.background = '#0a0a0a';
      document.body.style.color = '#fff';
    };
  }, []);

  const fetchMenuItems = async () => {
    // console.log('🔥 fetchMenuItems FONKSIYONU ÇAĞRILDI!')
    // console.log('🔥 Current API_BASE_URL:', API_BASE_URL)
    try {
      setIsLoading(true)
      setError('') // Hata state'ini temizle
      
      const fullUrl = `${API_BASE_URL}/menu/admin/all`
      // console.log('📡 API çağrısı yapılıyor:', fullUrl)
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include', // Cookie auth
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // console.log('📡 Response status:', response.status)
      // console.log('📡 Response ok:', response.ok)
      // console.log('📡 Response headers:', response.headers)
      
      if (!response.ok) {
        const errorText = await response.text()
        // console.log('❌ Response error text:', errorText)
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText} - ${errorText}`)
      }
      
      const data = await response.json()
      // console.log('📡 Response data:', data)
      
      if (data.success) {
        // console.log('✅ Menu items set edildi:', data.data.length)
        setMenuItems(data.data)
      } else {
        throw new Error(data.message || 'Menü verileri yüklenemedi')
      }
    } catch (err) {
      // console.error('❌ fetchMenuItems catch error:', err)
      // console.error('❌ Error stack:', err.stack)
      setError('Menu Error: ' + err.message)
    } finally {
      // console.log('🏁 fetchMenuItems finally - isLoading: false')
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    // console.log('🔥 fetchCategories FONKSIYONU ÇAĞRILDI!')
    try {
      // console.log('📡 Categories API çağrısı:', `${API_BASE_URL}/categories/admin/all`)
      
      const response = await fetch(`${API_BASE_URL}/categories/admin/all`, {
        credentials: 'include' // Cookie auth
      })
      
      // console.log('📡 Categories Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Categories HTTP Error: ${response.status}`)
      }
      
      const data = await response.json()
      // console.log('📡 Categories Response data:', data)
      
      if (data.success) {
        setCategories(data.data)
        // console.log('✅ Kategoriler yüklendi:', data.data.length)
      } else {
        // console.error('❌ Kategoriler yüklenemedi:', data.message)
        // Kategoriler yüklenmezse hata vermiyoruz, sadece log atıyoruz
      }
    } catch (err) {
      // console.error('❌ Kategoriler yüklenirken hata:', err)
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
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
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
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
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
      const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
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

  // Belirli ürünleri sil (ID ile)
  const deleteProductsByNames = async (productNames) => {
    const productsToDelete = menuItems.filter(item => 
      productNames.includes(item.name)
    )
    
    if (productsToDelete.length === 0) {
      showError('Silinecek ürün bulunamadı!')
      return
    }
    
    const confirmMessage = `${productsToDelete.length} adet ürün silinecek:\n\n${productsToDelete.map(item => `• ${item.name} (ID: ${item._id})`).join('\n')}\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?`
    
    if (!confirm(confirmMessage)) return
    
    try {
      let deletedCount = 0
      const headers = await addCSRFToken()
      
      for (const item of productsToDelete) {
        console.log(`🗑️ Siliniyor: ${item.name} (ID: ${item._id})`)
        const response = await fetch(`${API_BASE_URL}/menu/${item._id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: headers
        })
        
        if (response.ok) {
          deletedCount++
          console.log(`✅ Silindi: ${item.name}`)
        } else {
          console.log(`❌ Silinemedi: ${item.name}`)
        }
      }
      
      // State'i güncelle
      setMenuItems(menuItems.filter(item => !productNames.includes(item.name)))
      showDelete(`${deletedCount} gereksiz ürün başarıyla silindi!`)
      
    } catch (err) {
      showError('Toplu silme işleminde hata oluştu!')
    }
  }

  // Pasif ürünleri toplu sil
  const deleteInactiveProducts = async () => {
    const inactiveItems = menuItems.filter(item => item.available === false)
    
    if (inactiveItems.length === 0) {
      showError('Silinecek pasif ürün bulunamadı!')
      return
    }
    
    const confirmMessage = `${inactiveItems.length} adet pasif ürün silinecek:\n\n${inactiveItems.map(item => `• ${item.name}`).join('\n')}\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?`
    
    if (!confirm(confirmMessage)) return
    
    try {
      let deletedCount = 0
      const headers = await addCSRFToken()
      
      for (const item of inactiveItems) {
        const response = await fetch(`${API_BASE_URL}/menu/${item._id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: headers
        })
        
        if (response.ok) {
          deletedCount++
        }
      }
      
      // State'i güncelle
      setMenuItems(menuItems.filter(item => item.available !== false))
      showDelete(`${deletedCount} pasif ürün başarıyla silindi!`)
      
    } catch (err) {
      showError('Toplu silme işleminde hata oluştu!')
    }
  }

  const handleLogout = async () => {
    try {
      // Backend'e logout isteği gönder
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      // console.error('Logout error:', error)
    } finally {
      // Tüm potansiyel token'ları temizle (güvenlik için)
      localStorage.removeItem('adminToken')
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('authToken')
      localStorage.removeItem('userToken')
      
      // CSRF token'ı da temizle
      clearCSRFToken()
      
      // Her durumda admin sayfasına yönlendir
      navigate('/admin')
    }
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

  const filteredItems = selectedCategory === '' ? [] : menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (a.popular && !b.popular) return -1
      if (!a.popular && b.popular) return 1
      return a.name.localeCompare(b.name, 'tr-TR')
    })

  const calculateStats = () => {
    const totalItems = menuItems.length
    const availableItems = menuItems.filter(item => item.available !== false).length
    const unavailableItems = menuItems.filter(item => item.available === false).length
    const totalValue = menuItems.reduce((sum, item) => sum + item.price, 0)
    const avgPrice = totalItems > 0 ? (totalValue / totalItems) : 0
    const popularItems = menuItems.filter(item => item.popular).length

    // Debug: Ürün sayılarını konsola yazdır
    console.log('🔍 ÜRÜN SAYISI DEBUG:')
    console.log('📊 Toplam ürün:', totalItems)
    console.log('✅ Aktif ürün:', availableItems)
    console.log('❌ Pasif ürün:', unavailableItems)
    console.log('⭐ Popüler ürün:', popularItems)
    console.log('💰 Toplam değer:', totalValue.toFixed(2) + '₺')
    console.log('📈 Ortalama fiyat:', avgPrice.toFixed(2) + '₺')
    
    // Ürünlerin detaylarını listele
    console.log('📝 ÜRÜN LİSTESİ:')
    menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ${item.price}₺ - ${item.available !== false ? '✅ Aktif' : '❌ Pasif'} - ${item.popular ? '⭐ Popüler' : '🔶 Normal'} (ID: ${item._id})`)
    })
    
    // Gereksiz ürünleri tespit et
    const fakeProducts = menuItems.filter(item => 
      item.name === 'asd' || (item.name === 'Çay' && item.price === 45)
    )
    
    if (fakeProducts.length > 0) {
      console.log('🚨 GEREKSİZ ÜRÜNLER TESPİT EDİLDİ:')
      fakeProducts.forEach(item => {
        console.log(`- ${item.name} (ID: ${item._id}) - Fiyat: ${item.price}₺`)
      })
      console.log('💡 Silmek için: deleteProductsByNames(["asd", "Çay"]) çalıştır')
      
      // Global'e ekle ki console'dan çağırabilelim
      window.deleteProductsByNames = deleteProductsByNames
    }
    
    // Pasif ürünleri ayrı listele
    const inactiveItems = menuItems.filter(item => item.available === false)
    if (inactiveItems.length > 0) {
      console.log('🗑️ PASİF ÜRÜNLER (SİLİNEBİLİR):')
      inactiveItems.forEach(item => {
        console.log(`- ${item.name} (ID: ${item._id})`)
      })
    }

    return { totalItems, availableItems, unavailableItems, totalValue, avgPrice, popularItems }
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

      {/* Kompakt Stats */}
      <section className="dashboard-stats">
        <div className="stats-compact">
          <div className="stat-item">
            <Package size={16} />
            <span className="stat-value">{stats.totalItems}</span>
            <span className="stat-name">Toplam</span>
          </div>
          <div className="stat-item" style={{ color: stats.availableItems > 0 ? '#10B981' : '#6B7280' }}>
            <Eye size={16} />
            <span className="stat-value">{stats.availableItems}</span>
            <span className="stat-name">Aktif</span>
          </div>
          <div className="stat-item" style={{ color: stats.unavailableItems > 0 ? '#F59E0B' : '#6B7280' }}>
            <EyeOff size={16} />
            <span className="stat-value">{stats.unavailableItems}</span>
            <span className="stat-name">Pasif</span>
            {stats.unavailableItems > 0 && (
              <button
                onClick={deleteInactiveProducts}
                className="clean-btn"
                title="Pasif ürünleri sil"
                style={{
                  marginLeft: '8px',
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                🗑️
              </button>
            )}
          </div>
          <div className="stat-item">
            <Star size={16} />
            <span className="stat-value">{stats.popularItems}</span>
            <span className="stat-name">Popüler</span>
          </div>
        </div>
      </section>

      {/* Kompakt Kategori Yönetimi */}
      <section className="category-section">
        <div className="section-header">
          <h3>Kategoriler ({categories.length})</h3>
          <button 
            className="toggle-btn"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            title={showCategoryForm ? "Formu kapat" : "Kategori ekle"}
          >
            <Plus size={16} style={{transform: showCategoryForm ? 'rotate(45deg)' : 'none'}} />
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
                  <label>Kategori ID * <span style={{color: '#6B7280', fontSize: '12px'}}>(2-30 karakter, küçük harf)</span></label>
                  <input
                    type="text"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({...categoryForm, id: e.target.value.toLowerCase()})}
                    placeholder="Örn: sicakiceckler, tatlilar, anayelemek"
                    required
                    maxLength={30}
                    pattern="[a-z0-9-]+"
                    title="Sadece küçük harf, rakam ve tire kullanın"
                  />
                </div>
                
                <div className="form-group">
                  <label>Kategori Adı * <span style={{color: '#6B7280', fontSize: '12px'}}>(2-50 karakter, Türkçe destekli)</span></label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="Örn: Sıcak İçecekler, Tatlılar, Ana Yemekler"
                    required
                    maxLength={50}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Açıklama <span style={{color: '#6B7280', fontSize: '12px'}}>(maksimum 200 karakter, opsiyonel)</span></label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Bu kategorideki ürünler hakkında kısa açıklama yazabilirsiniz..."
                  rows="3"
                  maxLength={200}
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

        {/* Kompakt Kategoriler */}
        <div className="categories-compact">
          {categories.length > 0 ? (
            <div className="category-pills">
              {categories.map((category) => (
                <div key={category.id} className="category-pill">
                  <span className="pill-name">{category.name}</span>
                  <button 
                    className="pill-delete"
                    onClick={() => handleCategoryDelete(category.id, category.name)}
                    title={`${category.name} sil`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <span>Kategori yok</span>
            </div>
          )}
        </div>
      </section>

      {/* Kompakt Controls */}
      <section className="dashboard-controls">
        <div className="controls-grid">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`filter-select ${selectedCategory ? 'active' : ''}`}
          >
            <option value="">Kategori Seç</option>
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

          <button 
            className="add-product-btn" 
            onClick={openAddModal}
            title="Yeni ürün ekle"
          >
            <Plus size={16} />
            <span>Ekle</span>
          </button>
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
