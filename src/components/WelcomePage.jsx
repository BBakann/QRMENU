import { useNavigate } from 'react-router-dom'
import { ChefHat, Clock, MapPin, ArrowRight } from 'lucide-react'
import './WelcomePage.css'

function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="welcome">
      <div className="welcome__hero">
        <div className="welcome__overlay"></div>
        <div className="welcome__content">
          <div className="welcome__logo">
            <ChefHat size={48} />
            <span className="welcome__logo-text">QR Menu Cafe</span>
          </div>
          
          <h1 className="welcome__title">
            Hoş Geldiniz
            <span className="welcome__subtitle">Lezzetli dünyamızı keşfedin</span>
          </h1>
          
          <p className="welcome__description">
            Taze kahveler, enfes lezzetler ve unutulmaz deneyimler için menümüzü inceleyin
          </p>
          
          <button 
            className="welcome__cta"
            onClick={() => navigate('/menu')}
          >
            <span>Menüyü Görüntüle</span>
            <ArrowRight size={20} />
          </button>
          
          <div className="welcome__info">
            <div className="welcome__info-item">
              <Clock size={18} />
              <span>08:00 - 22:00</span>
            </div>
            <div className="welcome__info-item">
              <MapPin size={18} />
              <span>Merkez Konumda</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="welcome__footer">
        <div className="welcome__footer-content">
          <p>QR Menu ile dijital deneyimin keyfini çıkarın</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage 