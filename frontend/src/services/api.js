import axios from 'axios'
export const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:5000'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gospelhub_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export function mediaUrl(path) { return path?.startsWith('http') ? path : `${MEDIA_URL}${path || ''}` }
export default api
