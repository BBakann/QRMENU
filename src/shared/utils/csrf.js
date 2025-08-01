// CSRF Token utility
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getCSRFToken = () => {
  let token = localStorage.getItem('csrfToken');
  if (!token) {
    token = generateCSRFToken();
    localStorage.setItem('csrfToken', token);
  }
  return token;
};

export const validateCSRFToken = (token) => {
  const storedToken = localStorage.getItem('csrfToken');
  return token === storedToken;
};

// API isteklerinde CSRF token ekle
export const addCSRFToken = (headers = {}) => {
  return {
    ...headers,
    'X-CSRF-Token': getCSRFToken()
  };
}; 