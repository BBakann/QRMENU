// CSRF Token utility - BACKEND UYUMLU VERSİYON
import { API_BASE_URL } from '../config/api';

// Backend'den gerçek CSRF token al
export const getCSRFToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.csrfToken) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('csrfToken', data.csrfToken);
        return data.csrfToken;
      }
    }
    
    // Hata durumunda null döndür
    console.error('CSRF token alınamadı');
    return null;
    
  } catch (error) {
    console.error('CSRF token fetch error:', error);
    return null;
  }
};

// Mevcut token'ı al veya backend'den yeni token iste
export const getCurrentCSRFToken = async () => {
  // Önce localStorage'dan kontrol et
  let token = localStorage.getItem('csrfToken');
  
  // Token yoksa veya geçersizse backend'den al
  if (!token || !isValidToken(token)) {
    token = await getCSRFToken();
  }
  
  return token;
};

// Token formatını kontrol et (64 karakter hex)
const isValidToken = (token) => {
  return token && /^[a-f0-9]{64}$/i.test(token);
};

// API isteklerinde CSRF token ekle - ASYNC VERSION
export const addCSRFToken = async (headers = {}) => {
  const token = await getCurrentCSRFToken();
  
  if (token) {
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  } else {
    // Token alamıyorsak header ekleme
    console.warn('CSRF token bulunamadı, header eklenmedi');
    return headers;
  }
};

// Token'ı temizle (logout'ta kullan)
export const clearCSRFToken = () => {
  localStorage.removeItem('csrfToken');
};

// Deprecated functions (geriye uyumluluk için)
export const generateCSRFToken = () => {
  console.warn('generateCSRFToken deprecated, getCSRFToken kullanın');
  return null;
};

export const validateCSRFToken = () => {
  console.warn('validateCSRFToken deprecated, backend doğruluyor');
  return true;
}; 