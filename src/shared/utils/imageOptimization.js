// Image optimization utilities
export const optimizeImageUrl = (url, width = 800, height = 600, format = 'webp') => {
  if (!url) return url;
  
  // Cloudinary URL'lerini optimize et
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const publicId = url.split('/upload/')[1];
    
    return `${baseUrl}c_fill,w_${width},h_${height},f_${format},q_auto/${publicId}`;
  }
  
  return url;
};

// Lazy loading için intersection observer
export const createImageObserver = (callback) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }
  return null;
};

// Image preloading
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}; 