// XSS koruması için basit sanitization
export const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Input validation
export const validateInput = (input, type = 'text') => {
  if (!input) return false;
  
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    
    case 'price':
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      return priceRegex.test(input) && parseFloat(input) >= 0;
    
    case 'category':
      const categoryRegex = /^[a-z0-9-]+$/;
      return categoryRegex.test(input) && input.length >= 2 && input.length <= 30;
    
    default:
      return input.trim().length > 0;
  }
};

// URL validation
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File validation
export const validateFile = (file) => {
  if (!file) return false;
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
}; 