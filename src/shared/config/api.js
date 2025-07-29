const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  
  : 'http://localhost:3001/api'

export { API_BASE_URL }; 