
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Convert uploaded media paths into complete backend URLs
export const mediaUrl = (path) => {
  if (!path) return '';

  // Keep complete URLs unchanged
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const serverOrigin = new URL(API_URL).origin;

  return `${serverOrigin}/${path.replace(/^\/+/, '')}`;
};

export default api;

