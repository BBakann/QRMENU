import { useNavigate } from 'react-router-dom'
import { ChefHat, ArrowRight, Clock, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import './WelcomePage.css'

function WelcomePage() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="welcome">
      <div className="welcome__hero">
        <div className={`welcome__content ${isVisible ? 'welcome__content--visible' : ''}`}>
          <div className="welcome__logo">
            <ChefHat size={24} className="welcome__logo-icon" />
            <span className="welcome__logo-text">QR Menu Cafe</span>
          </div>
          
          <h1 className="welcome__title">
            Hoş Geldiniz
            <span className="welcome__subtitle">Modern cafe deneyimi</span>
          </h1>
          
          <p className="welcome__description">
            Taze kahveler, enfes lezzetler ve kaliteli hizmet. Dijital menümüzle kolayca sipariş verin.
          </p>


          
          <button 
            className="welcome__cta"
            onClick={() => navigate('/menu')}
          >
            <span>Menüyü Görüntüle</span>
            <ArrowRight size={18} />
          </button>
        </div>


      </div>
      
      <div className="welcome__footer">
        <div className="welcome__info">
          <div className="welcome__info-item">
            <Clock size={16} />
            <span>08:00 - 22:00</span>
          </div>
          <div className="welcome__info-item">
            <MapPin size={16} />
            <span>Merkez Konumda</span>
          </div>
        </div>
        
        <div className="welcome__footer-features">
          <span>✨ Temassız Menü</span>
          <span>🚀 Hızlı Sipariş</span>
          <span>📱 Mobil Uyumlu</span>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage 